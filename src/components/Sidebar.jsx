import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "SELLER";

  const logout = () => {
    localStorage.clear();
    navigate("/");
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
          🏠 Home
        </NavLink>

        {role !== "ADMIN" && (
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

        
        {/* <NavLink
          to="/audit"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          📜 Audit Trail
        </NavLink> */}

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