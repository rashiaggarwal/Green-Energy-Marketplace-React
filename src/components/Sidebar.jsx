import { NavLink, useNavigate } from "react-router-dom";
import { apiClient } from "../services/apiClient";

export default function Sidebar() {
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "SELLER";

  const logout = async () => {
    try {

      await apiClient.logoutUser();

    } catch (error) {

      console.error(
        "Logout failed:",
        error
      );

    } finally {

      localStorage.clear();

      navigate(
        "/",
        {
          replace: true,
        }
      );
    }
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">⚡</div>

        <div>
          <h1>Green Energy Marketplace</h1>
          <p>Peer-to-Peer Renewable Energy Trading</p>
        </div>
      </div>

      <nav className="nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          🏠 Dashboard
        </NavLink>

        {role === "SELLER" && (
          <NavLink
            to="/credits"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            ⚡ Credit Actions
          </NavLink>
        )}

        {role !== "SELLER" && (
          <NavLink
            to="/marketplace"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            🛒 Marketplace
          </NavLink>
        )}

        {role === "SELLER" && (
          <NavLink
            to="/sales"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            💰 My Sales
          </NavLink>
        )}
        
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          📜 Analytics
        </NavLink>

      </nav>

      <button
        className="logout-btn"
        onClick={logout}
      >
        Logout
      </button>
    </aside>
  );
}