import { Sidebar } from "@/components/sidebar";

export default function DashboardLoading() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <div className="container">
          <div className="skeleton skeleton-line large" />
          <div className="skeleton skeleton-line" style={{ width: "42%" }} />
          <div className="loading-grid">
            {Array.from({ length: 4 }).map((_, index) => <div className="skeleton skeleton-card" key={index} />)}
          </div>
          <div className="dashboard-grid"><div className="skeleton loading-panel" /><div className="skeleton loading-panel" /></div>
        </div>
      </main>
    </div>
  );
}
