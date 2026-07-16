import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Chatbot from "./Chatbot";

export default function Layout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-pane">
        <Topbar />

        <section className="content-area">
          <Outlet />
        </section>
      </main>

      <Chatbot />
    </div>
  );
}