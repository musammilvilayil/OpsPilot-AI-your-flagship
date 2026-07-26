import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <Link href="/dashboard" className="brand"><span className="brand-mark">OP</span><span>OpsPilot AI</span></Link>
        <nav className="nav" aria-label="Primary navigation">
          <Link className="active" href="/dashboard">Overview</Link>
          <Link href="/dashboard#incidents">Incidents</Link>
          <Link href="/dashboard#repositories">Repositories</Link>
          <Link href="/dashboard#runbooks">Runbooks</Link>
        </nav>
        <div className="sidebar-card">
          <div className="eyebrow">System status</div>
          <p style={{ margin: "10px 0 7px", fontWeight: 800 }}>All analysers online</p>
          <p className="muted" style={{ margin: 0, fontSize: 12, lineHeight: 1.55 }}>Deterministic evidence engine is active. LLM analysis automatically falls back safely.</p>
        </div>
      </div>
    </aside>
  );
}
