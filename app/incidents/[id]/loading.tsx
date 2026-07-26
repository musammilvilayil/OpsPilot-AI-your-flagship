import { Sidebar } from "@/components/sidebar";

export default function IncidentLoading() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <div className="container">
          <div className="skeleton skeleton-line" style={{ width: "180px" }} />
          <div className="skeleton skeleton-line large" style={{ marginTop: "34px", width: "70%" }} />
          <div className="skeleton skeleton-line" style={{ width: "58%" }} />
          <div className="investigation-grid" style={{ marginTop: "42px" }}>
            <div className="investigation-content"><div className="skeleton loading-panel" /><div className="skeleton loading-panel" /></div>
            <aside className="investigation-sidebar"><div className="skeleton loading-panel" /></aside>
          </div>
        </div>
      </main>
    </div>
  );
}
