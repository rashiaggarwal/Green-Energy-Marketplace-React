import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";

import "./styles/globals.css";

import "./styles/layout/layout.css";
import "./styles/layout/sidebar.css";
import "./styles/layout/topbar.css";

import "./styles/auth/login.css";

import "./styles/chatbot/chatbot.css";

import "./styles/dashboard/dashboard.css";
import "./styles/dashboard/statcard.css";

import "./styles/pages/credits.css";
import "./styles/pages/marketplace.css";

import "./styles/pages/audit.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);