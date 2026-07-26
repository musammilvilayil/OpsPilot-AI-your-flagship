import type { CSSProperties } from "react";
import Link from "next/link";
import { ApprovalButton, Reveal } from "@/components/animated-ui";
import { Sidebar } from "@/components/sidebar";
import { getIncident } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

const categoryFiles: Record<string, string[]> = {
  ENVIRONMENT_CONFIGURATION: [".github/workflows/deploy.yml", ".env.example", "src/config/environment.ts"],
  DATABASE: ["prisma/schema.prisma", ".github/workflows/ci.yml", "lib/db.ts"],
  BUILD: ["tsconfig.json", "app/dashboard/page.tsx", "lib/types.ts"],
  DEPENDENCY: ["package.json", "package-lock.json", "Dockerfile"],
  AUTHENTICATION: ["lib/auth.ts", "middleware.ts", "app/api/auth/route.ts"],
  DEPLOYMENT: ["render.yaml", "Dockerfile", "app/api/health/route.ts"],
  TEST: ["tests/", "vitest.config.ts", ".github/workflows/ci.yml"]
};

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function IncidentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const incident = await getIncident(id);
  const confidence = Math.round(incident.confidence * 100);
  const files = categoryFiles[String(incident.category)] ?? [".github/workflows/*.yml", "README.md", "application logs"];
  const completed = incident.actions.filter((action) => action.completed).length;
  const detected = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(incident.detectedAt));

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main incident-main">
        <div className="incident-glow" aria-hidden="true" />
        <div className="container incident-container">
          <div className="incident-breadcrumbs"><Link href="/dashboard">Operations centre</Link><span>/</span><span>Incident investigation</span></div>

          <header className="incident-hero">
            <div className="incident-hero-copy">
              <div className="incident-context-line"><span className="repo-avatar">{incident.repository.fullName.split("/").pop()?.slice(0, 2).toUpperCase()}</span><span>{incident.repository.fullName}</span><i /><span>{incident.workflowName ?? "Workflow"}</span></div>
              <h1>{incident.title}</h1>
              <p>{incident.summary}</p>
              <div className="incident-hero-badges"><span className={`badge ${incident.severity.toLowerCase()}`}>● {incident.severity} severity</span><span className={`badge ${incident.status.toLowerCase()}`}>{incident.status}</span><span className="badge neutral">Detected {detected}</span></div>
            </div>
            <div className="incident-hero-actions"><button className="button secondary" type="button">Share report ↗</button><button className="button" type="button">Create GitHub issue →</button></div>
          </header>

          <section className="investigation-status" aria-label="Investigation progress">
            <div className="investigation-step complete"><span>✓</span><div><b>Signal received</b><small>Webhook verified</small></div></div>
            <i />
            <div className="investigation-step complete"><span>✓</span><div><b>Evidence analysed</b><small>{incident.evidence.length} source line{incident.evidence.length === 1 ? "" : "s"}</small></div></div>
            <i />
            <div className="investigation-step active"><span>3</span><div><b>Plan awaiting approval</b><small>{completed}/{incident.actions.length} steps complete</small></div></div>
            <i />
            <div className="investigation-step"><span>4</span><div><b>Verify recovery</b><small>Rerun workflow</small></div></div>
          </section>

          <section className="investigation-grid">
            <div className="investigation-content">
              <Reveal className="card root-cause-card">
                <div className="root-cause-layout">
                  <div className="root-cause-copy">
                    <div className="eyebrow">Root-cause analysis</div>
                    <h2>{incident.rootCause}</h2>
                    <p>{incident.suggestedFix}</p>
                    <div className="analysis-tags"><span>Evidence linked</span><span>Deterministic fallback</span><span>Human reviewed</span></div>
                  </div>
                  <div className="confidence-visual">
                    <div className="confidence-ring" style={{ "--confidence-angle": `${confidence * 3.6}deg` } as CSSProperties}><div><strong>{confidence}%</strong><span>confidence</span></div></div>
                    <small>Based on available workflow evidence</small>
                  </div>
                </div>
              </Reveal>

              <Reveal className="card evidence-panel" delay={80}>
                <div className="panel-heading"><div><div className="eyebrow">Traceable evidence</div><h2>Why OpsPilot reached this conclusion</h2></div><span className="panel-count">{incident.evidence.length} finding{incident.evidence.length === 1 ? "" : "s"}</span></div>
                <p className="panel-description">Recommendations stay connected to the source line that triggered them, so engineers can verify the diagnosis rather than trust a black box.</p>
                <div className="evidence-list">
                  {incident.evidence.map((item, index) => (
                    <div className="evidence-card" key={item.id}>
                      <div className="evidence-index">{String(index + 1).padStart(2, "0")}</div>
                      <div className="evidence-body"><div className="evidence-meta"><span>{item.source}</span><b>{item.lineNumber ? `Line ${item.lineNumber}` : "Captured signal"}</b></div><code>{item.line}</code><div className="evidence-explanation"><span>↳</span> This line directly matches the {label(String(incident.category)).toLowerCase()} failure pattern.</div></div>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal className="card resolution-panel" delay={120}>
                <div className="panel-heading"><div><div className="eyebrow">Developer-controlled recovery</div><h2>Resolution plan</h2></div><span className="completion-badge">{completed}/{incident.actions.length} complete</span></div>
                <div className="resolution-timeline">
                  {incident.actions.map((action, index) => (
                    <div className={`resolution-step ${action.completed ? "complete" : index === completed ? "current" : ""}`} key={action.id}>
                      <div className="resolution-marker">{action.completed ? "✓" : index + 1}</div>
                      <div className="resolution-line" />
                      <div className="resolution-copy"><div className="resolution-title"><strong>{action.label}</strong>{index === completed && !action.completed ? <span>Next action</span> : null}</div><p>{action.completed ? "Completed, recorded and included in the incident audit trail." : "Requires developer confirmation before OpsPilot proceeds."}</p></div>
                      <button className="icon-action" type="button" aria-label={`Review ${action.label}`}>↗</button>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal className="card files-panel" delay={160}>
                <div className="panel-heading"><div><div className="eyebrow">Investigation scope</div><h2>Files to inspect</h2></div><span className="badge investigating">Suggested</span></div>
                <div className="files-list">{files.map((file, index) => <div className="file-row" key={file}><span className="file-icon">{index === 0 ? "YML" : file.endsWith(".ts") || file.endsWith(".tsx") ? "TS" : file.endsWith(".json") ? "{}" : "FILE"}</span><code>{file}</code><span>{index === 0 ? "Highest relevance" : "Supporting context"}</span><button type="button">Open ↗</button></div>)}</div>
              </Reveal>
            </div>

            <aside className="investigation-sidebar">
              <Reveal className="card sticky-card">
                <div className="eyebrow">Incident metadata</div>
                <h2>Investigation context</h2>
                <div className="meta-list premium-meta">
                  <div className="meta-row"><span>Status</span><strong className={`status-text ${incident.status.toLowerCase()}`}>{incident.status}</strong></div>
                  <div className="meta-row"><span>Workflow</span><strong>{incident.workflowName ?? "Unknown"}</strong></div>
                  <div className="meta-row"><span>Branch</span><strong>{incident.branch ?? "Unknown"}</strong></div>
                  <div className="meta-row"><span>Commit</span><strong><code>{incident.commitSha ?? "Unknown"}</code></strong></div>
                  <div className="meta-row"><span>Category</span><strong>{label(String(incident.category))}</strong></div>
                  <div className="meta-row"><span>Evidence</span><strong>{incident.evidence.length} verified line{incident.evidence.length === 1 ? "" : "s"}</strong></div>
                </div>
                <div className="metadata-divider" />
                <div className="owner-row"><span className="owner-avatar">MM</span><div><small>Incident owner</small><strong>Muhammad Musammil</strong></div><button type="button">Change</button></div>
              </Reveal>

              <Reveal className="card safety-card" delay={90}>
                <div className="safety-illustration"><span className="shield-shape">✓</span><i /><i /></div>
                <div className="eyebrow">Safety control active</div>
                <h2>Human approval required</h2>
                <p>OpsPilot can draft a workflow rerun, issue or pull request, but it never executes code-changing actions without approval.</p>
                <ApprovalButton />
                <small className="demo-note">Demo interaction only—no GitHub action will execute.</small>
              </Reveal>

              <Reveal className="card audit-card" delay={130}>
                <div className="panel-heading compact-heading"><div><div className="eyebrow">Audit trail</div><h2>Latest activity</h2></div></div>
                <div className="audit-list"><div><span className="audit-dot" /><p><b>Analysis completed</b><small>Evidence engine · just now</small></p></div><div><span className="audit-dot" /><p><b>Incident created</b><small>GitHub webhook · 1 min earlier</small></p></div><div><span className="audit-dot muted-dot" /><p><b>Workflow failed</b><small>{incident.workflowName ?? "CI workflow"}</small></p></div></div>
              </Reveal>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
}
