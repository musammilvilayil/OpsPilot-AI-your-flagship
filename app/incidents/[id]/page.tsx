import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { getIncident } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function IncidentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const incident = await getIncident(id);
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main"><div className="container">
        <Link href="/dashboard" className="muted">← Back to incidents</Link>
        <header className="header-row" style={{ marginTop: 24 }}>
          <div><div className="eyebrow">{incident.repository.fullName}</div><h1 style={{ fontSize: 42 }}>{incident.title}</h1><p className="muted">{incident.summary}</p></div>
          <span className={`badge ${incident.severity.toLowerCase()}`}>● {incident.severity}</span>
        </header>
        <section className="detail-grid">
          <div style={{ display: "grid", gap: 18 }}>
            <article className="card detail-card"><div className="eyebrow">Root-cause analysis</div><h2 style={{ marginTop: 12 }}>{incident.rootCause}</h2><p className="muted" style={{ lineHeight: 1.7 }}>{incident.suggestedFix}</p><div className="progress"><span style={{ width: `${Math.round(incident.confidence * 100)}%` }} /></div><p className="muted" style={{ margin: "8px 0 0", fontSize: 12 }}>{Math.round(incident.confidence * 100)}% confidence based on available evidence</p></article>
            <article className="card detail-card"><h2>Evidence</h2><p className="muted">Every recommendation remains linked to the source log line that triggered it.</p>{incident.evidence.map((item) => <div className="evidence" key={item.id}>{item.lineNumber ? `L${item.lineNumber}  ` : ""}{item.line}</div>)}</article>
            <article className="card detail-card"><h2>Resolution plan</h2><div className="action-list">{incident.actions.map((action, index) => <div className="action-item" key={action.id}><div className="check">{action.completed ? "✓" : index + 1}</div><div><strong>{action.label}</strong><div className="muted" style={{fontSize:12,marginTop:4}}>{action.completed ? "Completed and recorded" : "Awaiting developer approval"}</div></div></div>)}</div></article>
          </div>
          <aside style={{ display: "grid", gap: 18, alignContent: "start" }}>
            <article className="card detail-card"><h2>Incident metadata</h2><div className="meta-list"><div className="meta-row"><span>Status</span><strong>{incident.status}</strong></div><div className="meta-row"><span>Workflow</span><strong>{incident.workflowName ?? "Unknown"}</strong></div><div className="meta-row"><span>Branch</span><strong>{incident.branch ?? "Unknown"}</strong></div><div className="meta-row"><span>Commit</span><strong>{incident.commitSha ?? "Unknown"}</strong></div><div className="meta-row"><span>Category</span><strong>{incident.category.replaceAll("_", " ")}</strong></div></div></article>
            <article className="card detail-card"><div className="eyebrow">Safety control</div><h2 style={{ marginTop: 12 }}>Human approval required</h2><p className="muted" style={{ lineHeight: 1.65, fontSize: 13 }}>OpsPilot can draft a workflow rerun, issue or pull request, but it never executes a code-changing action without approval.</p><button className="button" style={{ width: "100%" }}>Approve next action</button></article>
          </aside>
        </section>
      </div></main>
    </div>
  );
}
