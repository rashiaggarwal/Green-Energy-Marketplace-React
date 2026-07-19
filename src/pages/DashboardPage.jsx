import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../services/apiClient";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

// track in-flight listing fetches (module-level so it survives StrictMode remounts)
const ongoingFetches = new Set();

export default function DashboardPage() {
  const user = JSON.parse(
    sessionStorage.getItem("user") || "{}"
  );

  const navigate = useNavigate();

  const role = user?.role || "SELLER";

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // buyer purchases
  const [purchases, setPurchases] = useState([]);
  const [purchasesLoading, setPurchasesLoading] = useState(false);
  const [purchasesHasMore, setPurchasesHasMore] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalListing, setModalListing] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [toast, setToast] = useState(null);
  const limit = 12;
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);
  const listingsRef = useRef(0);
  const purchasesLoadingRef = useRef(purchasesLoading);
  const purchasesHasMoreRef = useRef(purchasesHasMore);
  const purchasesRef = useRef(0);
  const [verifiedIds, setVerifiedIds] = useState({});
  const [filters, setFilters] = useState({
    energySource: "",
    status: "",
  });
  const [auditModalOpen, setAuditModalOpen] =
  useState(false);

  const [selectedAudit, setSelectedAudit] =
  useState(null);

  const [auditLoading, setAuditLoading] =
  useState(false);

  useEffect(() => {

  if (role !== "SELLER") return;

  setListings([]);

  listingsRef.current = 0;

  setHasMore(true);

  fetchListings(0);

}, [
  filters.energySource,
  filters.status,
]);

  async function fetchListings(skip = 0) {
    if (loading) return;
    // avoid duplicate requests for the same skip (handles StrictMode double-invoke)
    if (ongoingFetches.has(skip)) return;
    if (role !== "SELLER") return;

    ongoingFetches.add(skip);
    setLoading(true);
    loadingRef.current = true;

    try {
      const res =
        await apiClient.getMyListings(
          skip,
          limit,
          filters.energySource,
          filters.status
        );

      if (Array.isArray(res)) {
        setListings((prev) => {
          const newList = [...prev, ...res];
          listingsRef.current = newList.length;
          return newList;
        });
        const more = res.length === limit;
        setHasMore(more);
        hasMoreRef.current = more;
      }
    } catch (err) {
      console.error("Failed to load listings", err);
    } finally {
      ongoingFetches.delete(skip);
      setLoading(false);
      loadingRef.current = false;
    }
  }
  // fetch purchases for buyers
  async function fetchPurchases(skip = 0) {
    if (purchasesLoading) return;
    if (ongoingFetches.has(`purchases:${skip}`)) return;
    if (role !== "BUYER") return;

    ongoingFetches.add(`purchases:${skip}`);
    setPurchasesLoading(true);
    purchasesLoadingRef.current = true;

    try {
      const res = await apiClient.getMyPurchases(skip, limit);

      if (Array.isArray(res)) {
        setPurchases((prev) => {
          const newList = [...prev, ...res];
          purchasesRef.current = newList.length;
          return newList;
        });
        const more = res.length === limit;
        setPurchasesHasMore(more);
        purchasesHasMoreRef.current = more;
      }
    } catch (err) {
      console.error("Failed to load purchases", err);
    } finally {
      ongoingFetches.delete(`purchases:${skip}`);
      setPurchasesLoading(false);
      purchasesLoadingRef.current = false;
    }
  }

  // initial load when role changes
  useEffect(() => {
    // reset refs when role changes
    listingsRef.current = 0;
    hasMoreRef.current = true;
    loadingRef.current = false;
    purchasesRef.current = 0;
    purchasesHasMoreRef.current = true;
    purchasesLoadingRef.current = false;

    if (role === "SELLER") {
      setListings([]);
      fetchListings(0);
    } else if (role === "BUYER") {
      setPurchases([]);
      fetchPurchases(0);
    }
  }, [role]);

function getSourceClass(src) {
  const s = (src || "").toLowerCase();

  switch (s) {
    case "solar":
      return "solar";

    case "wind":
      return "wind";

    case "hydro":
      return "hydro";

    case "biomass":
      return "biomass";

    case "geothermal":
      return "geothermal";

    case "tidal":
      return "tidal";

    default:
      return "other";
  }
}

  // attach scroll listener once; use refs to read latest state
  useEffect(() => {
    function onScroll() {
      // avoid triggering either fetch while its loading or when no more data
      if (role === "SELLER") {
        if (loadingRef.current || !hasMoreRef.current) return;

        if (
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300
        ) {
          fetchListings(listingsRef.current);
        }
        return;
      }

      if (role === "BUYER") {
        if (purchasesLoadingRef.current || !purchasesHasMoreRef.current) return;

        if (
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300
        ) {
          fetchPurchases(purchasesRef.current);
        }
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCancel = async (listing) => {
    setModalListing(listing);
    setModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!modalListing) return;
    setConfirming(true);
    try {
      await apiClient.cancelListing(modalListing);
      setToast({ type: "success", message: "Listing cancelled." });
      setModalOpen(false);
      setListings([]);
      fetchListings(0);
    } catch (err) {
      setToast({ type: "error", message: "Cancel failed." });
    } finally {
      setConfirming(false);
    }
  };

  const handleViewAudit =
  async (listingId) => {

    try {

      setAuditLoading(true);

      const audit =
        await apiClient.getListingAuditTrace(
          listingId
        );

      setSelectedAudit(audit);

      setAuditModalOpen(true);

    } catch {

      setToast({
        type: "error",
        message:
          "Unable to load audit trail.",
      });

    } finally {

      setAuditLoading(false);

    }

};


  const handleVerify =
  async (listing) => {

    try {

      await apiClient.verifyListing(
        listing.id
      );

      setVerifiedIds(
        (prev) => ({
          ...prev,
          [listing.id]:
            true,
        })
      );

      setToast({
        type: "success",
        message:
          "Credit validated successfully.",
      });

    } catch (error) {

      setToast({
        type: "error",
        message:
          error.message ||
          "Validation failed.",
      });

    }

};

  return (
    <>
      <div className="page-title">
        <h2>Dashboard</h2>

        <p>
          Logged-in user wallet information,
          summary and all owned credits.
        </p>
      </div>

      {/* HERO */}

      <div className="hero">
        <div>
          <p>Logged in user</p>

          <h2>{user.full_name || "Rashi Aggarwal"}</h2>

          <p>
            Email: {user.email || "rashi.agg@example.com"}
            • Role: {role}
            • Location: {user.location || "Noida, India"}
          </p>
        </div>

        <div className="hero-wallet">
    <small>Wallet Address</small>

      <p>
        {user.wallet_address ||
          "Not Available"}
      </p>

        <p
          style={{
            color:
              user.verificationStatus ===
              "Verified"
                ? "#86efac"
                : "#fca5a5",

            marginTop: "10px",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          Status:{" "}
          {user.verificationStatus ||
            "UnVerified"}
        </p>

  <p
    style={{
      marginTop: "8px",
      fontSize: "13px",
      color: "#e5e7eb",
    }}
  >
    Balance:{" "}
    <strong>
      {user.balance ?? 0}
    </strong>
  </p>
</div>
      </div>

      {/* STATS */}

      {/* <div className="grid-4">

        <div className="stat-card">
          <div>
            <p>Total Credits</p>
            <h3>350</h3>
          </div>

          <div className="stat-icon">⚡</div>
        </div>

        <div className="stat-card">
          <div>
            <p>Credits Listed</p>

            <h3>100</h3>
          </div>

          <div className="stat-icon">📌</div>
        </div>

        <div className="stat-card">
          <div>
            <p>Credits Bought</p>

            <h3>22</h3>
          </div>

          <div className="stat-icon">✅</div>
        </div>

        <div className="stat-card">
          <div>
            <p>Credits Sold</p>

            <h3>55</h3>
          </div>

          <div className="stat-icon">🛒</div>
        </div>

      </div> */}

      {/* MY CREDITS (seller only) */}
      {role === "SELLER" && (
        <div className="card" style={{ marginTop: "24px" }}>
          <h2>⚡ My Credits</h2>
          <div
  style={{
    display: "flex",
    gap: 12,
    marginTop: 20,
  }}
>

  <select
    value={
      filters.energySource
    }
    onChange={(e) =>
      setFilters((prev) => ({
        ...prev,
        energySource:
          e.target.value,
      }))
    }
  >
    <option value="">
      All Sources
    </option>

    <option value="SOLAR">
      Solar
    </option>

    <option value="WIND">
      Wind
    </option>

    <option value="HYDRO">
      Hydro
    </option>

    <option value="BIOMASS">
      Biomass
    </option>

    <option value="GEOTHERMAL">
      Geothermal
    </option>

    <option value="TIDAL">
      Tidal
    </option>

  </select>

  <select
    value={
      filters.status
    }
    onChange={(e) =>
      setFilters((prev) => ({
        ...prev,
        status:
          e.target.value,
      }))
    }
  >
    <option value="">
      All Status
    </option>

    <option value="ACTIVE">
      Active
    </option>

    <option value="SOLD">
      Sold
    </option>

    <option value="CANCELLED">
      Cancelled
    </option>

    <option value="EXPIRED">
      Expired
    </option>
  </select>

</div>

          <div className="market-grid">
            {listings.length === 0 && !loading ? (
              <p>No credits found.</p>
            ) : (
              listings.map((l) => (
                <div key={l.id} className="marketplace-audit-card">
                    <div className={`marketplace-badge ${getSourceClass(l.energy_source)}`}>
                        {(l.energy_source || "").replace(/_/g, " ")}
                    </div>
                    <div
                        className="marketplace-verify"
                      >
                        {(l.verified && !l.is_tampered) ? (

                          <div
                            className="verified-badge"
                          >
                            ✅ Verified
                          </div>

                        ) : (

                          <div
                            className="tampered-badge"
                          >
                            Tampered
                          </div>
                        )}
                      </div>
                    <div className="card-info">
                      <div class="title">
                        <h3>{l.title || "Untitled"}</h3>
                      </div>

                  <div className="marketplace-info">
                    <p>
                      <strong>Qty:</strong> {l.energy_kwh} kWh
                    </p>

                    <p>
                      <strong>Location:</strong> {l.location}
                    </p>

                    <p>
                      <strong>Status:</strong> {l.status}
                    </p>

                    <p>
                      <strong>Total Price:</strong> {l.total_price}
                    </p>
                  </div>
                    </div>

                  <div className="marketplace-actions">
                    <button
                      className="audit-btn"
                      onClick={() =>
                        handleViewAudit(l.id)
                      }
                    >
                      View Audit
                    </button>

                    {/* {l.status !== 'CANCELLED' && <button
                      className="audit-btn"
                      onClick={() => navigate(`/credits?edit=${l.id}`)}
                      style={{ marginLeft: 8 }}
                    >
                      Edit
                    </button>} */}

                    {l.status !== 'CANCELLED' && <button
                      className="audit-btn"
                      onClick={() => handleCancel(l)}
                      style={{ marginLeft: 8 }}
                    >
                      Cancel
                    </button>}

                  </div>
                </div>
              ))
            )}

            {loading && <p>Loading...</p>}
          </div>
        </div>
      )}
      {/* MY PURCHASES (buyer only) */}
      {role === "BUYER" && (
        <div className="card" style={{ marginTop: "24px" }}>
          <h2>⚡ My Purchases</h2>

          <div className="market-grid">
            {purchases.length === 0 && !purchasesLoading ? (
              <p>No purchases found.</p>
            ) : (
              purchases.map((p) => (
                <div key={p.id} className="marketplace-audit-card">
                  <div
                    className={`marketplace-badge ${getSourceClass(
                      p.energy_source
                    )}`}
                  >
                    {(p.energy_source || "OTHER")
                      .replace(/_/g, " ")}
                  </div>
                  <h3>EC-{p.energy_kwh}-{p.listing_id?.slice(0, 8)}</h3>

                  <div className="marketplace-info">
                    <p>
                      <strong>Qty:</strong> {p.energy_kwh} kWh
                    </p>

                    <p>
                      <strong>Seller:</strong> {p.seller_id}
                    </p>

                    <p>
                      <strong>Status:</strong> {p.status}
                    </p>

                    <p>
                      <strong>Total Price:</strong> {p.total_price}
                    </p>

                    <p>
                      <strong>Purchased At:</strong>{' '}
                      {p.created_at ? new Date(p.created_at).toLocaleString() : '-'}
                    </p>
                  </div>

                  {/* <div className="marketplace-actions">
                    <button
                      className="audit-btn"
                      onClick={() => navigate(`/marketplace/${p.listing_id}`)}
                    >
                      View Listing
                    </button>
                  </div> */}
                  <button
                      className="audit-btn"
                      onClick={() =>
                        handleViewAudit(l.id)
                      }
                    >
                      View Audit
                    </button>
                </div>
              ))
            )}

            {purchasesLoading && <p>Loading...</p>}
          </div>
        </div>
      )}
          <ConfirmModal
            open={modalOpen}
            title="Cancel Listing"
            message={modalListing ? `Do you want to cancel the listing "${modalListing.title}"? This action cannot be undone.` : "Do you want to cancel this listing?"}
            onConfirm={confirmCancel}
            onCancel={() => setModalOpen(false)}
            confirming={confirming}
          />

          <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}