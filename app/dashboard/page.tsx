import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { getDashboardData } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

function relativeTime(date: Date) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.round(minutes / 60)}h ago`;
}

export default async function DashboardPage() {
  const incidents = await getDashboardData();
  const open = incidents.filter((item) => item.status === "OPEN" || item.status === "INVESTIGATING").length;
  const critical = incidents.filter((item) => item.severity === "CRITICAL").length;
  const resolved = incidents.filter((item) => item.status === "RESOLVED").length;
  const confidence = Math.round(incidents.reduce((sum, item) => sum + item.confidence, 0) / incidents.length * 100);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <div className="container">
          <header className="header-row">
            <div><div className="eyebrow">Live operations centre</div><h1>Incident overview</h1><p className="muted">Evidence-backed detection across connected repositories and deployments.</p></div>
            <a className="button" href="https://github.com/musammilvilayil/OpsPilot-AI-your-flagship">Connect GitHub</a>
          </header>
          <section className="metrics" aria-label="Incident metrics">
            <div className="card metric"><div className="metric-label">Active incidents</div><div className="metric-value">{open}</div><div className="metric-foot">Requires attention</div></div>
            <div className="card metric"><div className="metric-label">Critical failures</div><div className="metric-value">{critical}</div><div className="metric-foot">Escalated automatically</div></div>
            <div className="card metric"><div className="metric-label">Resolved today</div><div className="metric-value">{resolved}</div><div className="metric-foot">Verified reruns</div></div>
            <div className="card metric"><div className="metric-label">Avg. confidence</div><div className="metric-value">{confidence}%</div><div className="progress"><span style={{ width: `${confidence}%` }} /></div></div>
          </section>
          <section className="card section-card" id="incidents">
            <div className="section-head"><div><h2>Recent incidents</h2><div className="muted" style={{fontSize:12,marginTop:5}}>Prioritised by severity and recency</div></div><span className="badge resolved">● webhook listener active</span></div>
            <div className="table-wrap"><table><thead><tr><th>Incident</th><th>Repository</th><th>Severity</th><th>Status</th><th>Confidence</th><th>Detected</th></tr></thead><tbody>
              {incidents.map((incident) => (
                <tr key={incident.id}>
                  <td><Link href={`/incidents/${incident.id}`}><div className="incident-title">{incident.title}</div><div className="incident-sub">{incident.category.replaceAll("_", " ")}</div></Link></td>
                  <td>{incident.repository.fullName}</td>
                  <td><span className={`badge ${incident.severity.toLowerCase()}`}>● {incident.severity}</span></td>
                  <td><span className={`badge ${incident.status.toLowerCase()}`}>{incident.status}</span></td>
                  <td>{Math.round(incident.confidence * 100)}%</td><td className="muted">{relativeTime(incident.detectedAt)}</td>
                </tr>
              ))}
            </tbody></table></div>
          </section>
        </div>
      </main>
    </div>
  );
}
