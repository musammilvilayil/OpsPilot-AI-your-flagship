import Link from "next/link";
import { AnimatedNumber, Reveal } from "@/components/animated-ui";
import { HealthySystemIllustration } from "@/components/illustrations";
import { Sidebar } from "@/components/sidebar";
import { getDashboardData } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

const activityBars = [28, 42, 35, 56, 48, 72, 51, 63, 82, 68, 94, 76, 88, 62, 71, 54, 66, 46, 58, 38, 44, 30, 36, 24];

function relativeTime(date: Date) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h ago`;
  return `${Math.round(minutes / 1440)}d ago`;
}

function categoryLabel(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function DashboardPage() {
  const incidents = await getDashboardData();
  const active = incidents.filter((item) => item.status === "OPEN" || item.status === "INVESTIGATING").length;
  const critical = incidents.filter((item) => item.severity === "CRITICAL").length;
  const resolved = incidents.filter((item) => item.status === "RESOLVED").length;
  const confidence = incidents.length ? Math.round(incidents.reduce((sum, item) => sum + item.confidence, 0) / incidents.length * 100) : 0;
  const repositoryNames = Array.from(new Set(incidents.map((item) => item.repository.fullName)));
  const completionRate = incidents.length ? Math.round(resolved / incidents.length * 100) : 0;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main dashboard-main">
        <div className="dashboard-glow" aria-hidden="true" />
        <div className="container dashboard-container">
          <header className="dashboard-header">
            <div>
              <div className="dashboard-kicker"><span className="live-dot" /> Operations centre · live demo</div>
              <h1>Good systems fail.<br /><span className="gradient-text">Great teams learn faster.</span></h1>
              <p className="muted dashboard-subtitle">A unified view of incident evidence, analysis confidence and recovery progress across connected engineering projects.</p>
            </div>
            <div className="header-actions">
              <a className="button secondary" href="https://github.com/musammilvilayil/OpsPilot-AI-your-flagship" target="_blank" rel="noreferrer">View repository ↗</a>
              <Link className="button" href="/incidents/demo-cloudinary-secret">Open demo incident →</Link>
            </div>
          </header>

          <section className="metric-grid" aria-label="Incident metrics">
            <Reveal className="metric-card premium-metric">
              <div className="metric-top"><span className="metric-icon active-icon">⌁</span><span className="metric-trend up">+2 this hour</span></div>
              <div className="metric-label">Active incidents</div>
              <div className="metric-value"><AnimatedNumber value={active} /></div>
              <div className="metric-foot"><span className="tiny-pulse" /> Needs engineering attention</div>
            </Reveal>
            <Reveal className="metric-card premium-metric" delay={70}>
              <div className="metric-top"><span className="metric-icon critical-icon">!</span><span className="metric-trend">auto-prioritised</span></div>
              <div className="metric-label">Critical failures</div>
              <div className="metric-value"><AnimatedNumber value={critical} /></div>
              <div className="metric-foot warning-text">Escalated by severity rules</div>
            </Reveal>
            <Reveal className="metric-card premium-metric" delay={140}>
              <div className="metric-top"><span className="metric-icon resolved-icon">✓</span><span className="metric-trend up">{completionRate}% closure</span></div>
              <div className="metric-label">Resolved incidents</div>
              <div className="metric-value"><AnimatedNumber value={resolved} /></div>
              <div className="metric-foot">Verified recovery steps</div>
            </Reveal>
            <Reveal className="metric-card premium-metric" delay={210}>
              <div className="metric-top"><span className="metric-icon confidence-icon">◎</span><span className="metric-trend">evidence weighted</span></div>
              <div className="metric-label">Average confidence</div>
              <div className="metric-value"><AnimatedNumber value={confidence} suffix="%" /></div>
              <div className="progress premium-progress"><span style={{ width: `${confidence}%` }} /></div>
            </Reveal>
          </section>

          <section className="dashboard-grid">
            <Reveal className="card activity-card">
              <div className="panel-heading">
                <div><div className="eyebrow">24-hour signal volume</div><h2>Incident activity</h2></div>
                <div className="segmented-control"><button className="active" type="button">24h</button><button type="button">7d</button><button type="button">30d</button></div>
              </div>
              <div className="activity-summary"><strong>{incidents.length * 6 + 18}</strong><span>workflow events analysed</span><em>↗ 18% from previous period</em></div>
              <div className="activity-chart" role="img" aria-label="Illustrative incident activity over twenty four hours">
                {activityBars.map((height, index) => <span key={`${height}-${index}`} style={{ height: `${height}%`, animationDelay: `${index * 24}ms` }} />)}
              </div>
              <div className="chart-axis"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>Now</span></div>
            </Reveal>

            <Reveal className="card health-card" delay={90}>
              <div className="panel-heading"><div><div className="eyebrow">Platform health</div><h2>All systems operational</h2></div><span className="badge resolved"><span className="live-dot" /> Live</span></div>
              <HealthySystemIllustration />
              <div className="health-list">
                <div><span className="service-status online" /><b>Webhook ingestion</b><small>24 ms</small></div>
                <div><span className="service-status online" /><b>Evidence analyser</b><small>87 ms</small></div>
                <div><span className="service-status online" /><b>PostgreSQL</b><small>12 ms</small></div>
              </div>
            </Reveal>
          </section>

          <section className="card incidents-panel" id="incidents">
            <div className="panel-heading incidents-heading">
              <div><div className="eyebrow">Prioritised by severity and recency</div><h2>Recent incidents</h2></div>
              <div className="incident-filters"><button className="active" type="button">All {incidents.length}</button><button type="button">Open {active}</button><button type="button">Resolved {resolved}</button></div>
            </div>
            <div className="incident-list">
              {incidents.map((incident, index) => (
                <Reveal className="incident-row" delay={index * 65} key={incident.id}>
                  <div className={`severity-rail ${incident.severity.toLowerCase()}`} />
                  <div className="incident-primary">
                    <div className="incident-context"><span>{incident.workflowName ?? "Workflow"}</span><i /> <span>{relativeTime(incident.detectedAt)}</span></div>
                    <Link href={`/incidents/${incident.id}`} className="incident-title-link">{incident.title}</Link>
                    <div className="incident-summary">{incident.summary}</div>
                  </div>
                  <div className="incident-repository"><span className="repo-avatar">{incident.repository.fullName.split("/").pop()?.slice(0, 2).toUpperCase()}</span><div><small>Repository</small><b>{incident.repository.fullName}</b></div></div>
                  <div className="incident-classification"><span className={`badge ${incident.severity.toLowerCase()}`}>● {incident.severity}</span><span className={`badge ${incident.status.toLowerCase()}`}>{incident.status}</span></div>
                  <div className="incident-confidence"><strong>{Math.round(incident.confidence * 100)}%</strong><span>confidence</span><div className="mini-confidence"><i style={{ width: `${Math.round(incident.confidence * 100)}%` }} /></div></div>
                  <Link className="round-link" href={`/incidents/${incident.id}`} aria-label={`Open ${incident.title}`}>→</Link>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="dashboard-grid lower-grid">
            <Reveal className="card repositories-card" id="repositories">
              <div className="panel-heading"><div><div className="eyebrow">Connected coverage</div><h2>Repository health</h2></div><span className="panel-count">{repositoryNames.length} connected</span></div>
              <div className="repository-list">
                {repositoryNames.map((repository, index) => {
                  const count = incidents.filter((item) => item.repository.fullName === repository).length;
                  return <div className="repository-row" key={repository}><span className="repo-avatar large">{repository.split("/").pop()?.slice(0, 2).toUpperCase()}</span><div><b>{repository}</b><small>main · webhook verified</small></div><span className="repository-count">{count} incident{count === 1 ? "" : "s"}</span><span className="service-status online" /></div>;
                })}
              </div>
            </Reveal>

            <Reveal className="card intelligence-card" id="runbooks" delay={90}>
              <div className="panel-heading"><div><div className="eyebrow">Analysis coverage</div><h2>Failure intelligence</h2></div><span className="badge investigating">AI + rules</span></div>
              <div className="intelligence-orbit">
                <div className="orbit-centre"><strong>{confidence}%</strong><span>evidence quality</span></div>
                <span className="orbit-chip chip-one">Build</span><span className="orbit-chip chip-two">Database</span><span className="orbit-chip chip-three">Secrets</span><span className="orbit-chip chip-four">Deploy</span>
              </div>
              <p className="muted intelligence-copy">Deterministic classifiers keep the product useful when the AI service is unavailable, while low-evidence cases are clearly marked for manual investigation.</p>
            </Reveal>
          </section>
        </div>
      </main>
    </div>
  );
}
