import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiClient } from "../services/apiClient";

export default function CreditActionsPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "SELLER";
  const navigate = useNavigate();

  // redirect admin users away from credit actions
  useEffect(() => {
    if (role === "ADMIN") {
      navigate("/dashboard");
    }
  }, [role, navigate]);

  const [form, setForm] = useState({
    energy_kwh: "",
    price_per_kwh: "",
    energy_source: "SOLAR",
    title: "",
    description: "",
    location: "",
    expires_at: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get("edit");

    if (editId) {
      // fetch listing and populate form; allow editing title, description, price, location and expiry
      (async () => {
        try {
          setLoading(true);
          const data = await apiClient.getListing(editId);

          setForm((s) => ({
            ...s,
            energy_kwh: data.energy_kwh ?? s.energy_kwh,
            price_per_kwh: data.price_per_kwh ?? s.price_per_kwh,
            energy_source: data.energy_source ?? s.energy_source,
            title: data.title ?? s.title,
            description: data.description ?? s.description,
            location: data.location ?? s.location,
            expires_at: data.expires_at ? new Date(data.expires_at).toISOString().slice(0,16) : s.expires_at,
          }));

          setIsEdit(true);
          setEditingId(editId);
        } catch (err) {
          setMessage({ type: "error", text: err.message || String(err) });
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isEdit) {
      // allow updating title, description, price, location and expiry
      if (!form.title || !form.description || !form.location || !form.expires_at) {
        setMessage({ type: "error", text: "Title, description, location and expiry are required" });
        return;
      }
    } else {
      // simple validation: all fields mandatory
      for (const key of Object.keys(form)) {
        if (!form[key]) {
          setMessage({ type: "error", text: "Please fill all fields" });
          return;
        }
      }
    }

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const seller_id = user?.id;

    if (!seller_id) {
      setMessage({ type: "error", text: "Logged in user not found" });
      return;
    }

    try {
      setLoading(true);

      if (isEdit && editingId) {
        // allow updating title, description, price_per_kwh, location and expires_at
        const payload = {
          title: form.title,
          description: form.description,
          price_per_kwh: Number(form.price_per_kwh),
          location: form.location,
          expires_at: new Date(form.expires_at).toISOString(),
        };

        await apiClient.updateListing(editingId, payload);

        setMessage({ type: "success", text: "Listing updated successfully" });
        // navigate back to credits page without query
        navigate("/credits");
        return;
      }

      const payload = {
        energy_kwh: Number(form.energy_kwh),
        price_per_kwh: Number(form.price_per_kwh),
        energy_source: form.energy_source,
        title: form.title,
        description: form.description,
        location: form.location,
        expires_at: new Date(form.expires_at).toISOString(),
        seller_id,
      };

      await apiClient.createListing(payload);

      setMessage({ type: "success", text: "Listing created successfully" });
      setForm({
        energy_kwh: "",
        price_per_kwh: "",
        energy_source: "SOLAR",
        title: "",
        description: "",
        location: "",
        expires_at: "",
      });
    } catch (err) {
      setMessage({ type: "error", text: err.message || String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <div className="page-title">
        <h2>{isEdit ? "Edit Credit Listing" : "Create Credit Listing"}</h2>
        <p>{isEdit ? "Edit title and description for the listing." : "Fill all fields to create a credit listing."}</p>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="field-grid">
          <div>
            <label>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Short title"
              required
            />
          </div>

          <div>
            <label>Energy (kWh)</label>
            <input
              name="energy_kwh"
              type="number"
              min="0"
              value={form.energy_kwh}
              onChange={handleChange}
              disabled={isEdit}
              placeholder="100"
              required
            />
          </div>

          <div>
            <label>Price per kWh</label>
            <input
              name="price_per_kwh"
              type="number"
              min="0"
              step="0.01"
              value={form.price_per_kwh}
              onChange={handleChange}
              placeholder="1.00"
              required
            />
          </div>

          <div>
            <label>Energy Source</label>
            <select
              name="energy_source"
              value={form.energy_source}
              onChange={handleChange}
              required
              disabled={isEdit}
            >
              <option value="SOLAR">Solar</option>
              <option value="WIND">Wind</option>
              <option value="HYDRO">Hydro</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the credit"
              required
              rows={4}
              style={{ width: "100%", resize: "vertical" }}
            />
          </div>

          <div>
            <label>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City, State"
              required
            />
          </div>

          <div>
            <label>Expires At</label>
            <input
              name="expires_at"
              type="datetime-local"
              value={form.expires_at}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="btn-row">
          <button className="btn green" type="submit" disabled={loading}>
            {loading ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Listing")}
          </button>
        </div>

        {message && (
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: message.type === "error" ? "#fee2e2" : "#ecfdf5",
                color: message.type === "error" ? "#991b1b" : "#065f46",
              }}
            >
              {message.text}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}