import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CreditActionsPage from "./pages/CreditActionsPage";
import MarketplacePage from "./pages/MarketplacePage";

import Layout from "./components/Layout";

import AuditTrailPage from "./pages/AuditTrailPage"

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<LoginPage />}
      />

      <Route
        element={<Layout />}
      >
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/credits"
          element={<CreditActionsPage />}
        />

        <Route
          path="/marketplace"
          element={<MarketplacePage />}
        />

        <Route
          path="/audit"
          element={<AuditTrailPage />}
        />
      </Route>
      
      <Route
        path="*"
        element={
          <Navigate to="/" />
        }
      />
    </Routes>
  );
}