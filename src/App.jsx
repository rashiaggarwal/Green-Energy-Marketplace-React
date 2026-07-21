import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CreditActionsPage from "./pages/CreditActionsPage";
import MarketplacePage from "./pages/MarketplacePage";

import Layout from "./components/Layout";
import GlobalLoader from "./components/GlobalLoader";

import {
  loaderStore,
} from "./utils/loaderStore";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import MySalesPage from "./pages/MySalesPage";

export default function App() {

  const [
    globalLoading,
    setGlobalLoading,
  ] = useState(false);

  useEffect(() => {

    console.log(
      "Registering loader subscription"
    );

    const unsubscribe =
      loaderStore.subscribe(
        (value) => {

          console.log(
            "LOADER STATE",
            value
          );

          setGlobalLoading(
            value
          );
        }
      );

    return unsubscribe;

  }, []);

  
console.log("APP RENDERED");

  useEffect(() => {

    console.log("EFFECT RUNNING");

    const unsubscribe =
      loaderStore.subscribe(
        (value) => {
          console.log(
            "LOADER STATE",
            value
          );

          setGlobalLoading(value);
        }
      );

    return unsubscribe;
  }, []);


  return (
    <>
      {globalLoading && (
        <GlobalLoader />
      )}

      <Routes>

        <Route
          path="/"
          element={
            <LoginPage />
          }
        />

        <Route
          element={<Layout />}
        >

          <Route
            path="/dashboard"
            element={
              <DashboardPage />
            }
          />

          <Route
            path="/credits"
            element={
              <CreditActionsPage />
            }
          />

          <Route
            path="/marketplace"
            element={
              <MarketplacePage />
            }
          />

          <Route
            path="/sales"
            element={<MySalesPage />}
          />
          <Route
            path="/analytics"
            element={
              <AnalyticsDashboard />
            }
          />

        </Route>

        <Route
          path="*"
          element={
            <Navigate to="/" />
          }
        />

      </Routes>
    </>
  );
}