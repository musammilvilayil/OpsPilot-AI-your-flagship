import Link from "next/link";
import { Reveal } from "@/components/animated-ui";
import { PipelineIllustration } from "@/components/illustrations";

const features = [
  { icon: "⌁", title: "Evidence-first analysis", copy: "Every diagnosis points back to the exact log line, workflow signal and repository context that supports it." },
  { icon: "◎", title: "Confidence, not certainty", copy: "OpsPilot scores available evidence and safely reports when the data is too weak for a reliable conclusion." },
  { icon: "↗", title: "Actionable recovery plans", copy: "Turn a failed build into ordered steps, files to inspect and a developer-controlled rerun or pull request." },
  { icon: "⌘", title: "Production architecture", copy: "Secure webhooks, PostgreSQL history, queue-ready processing and a separate FastAPI analysis service." }
];

const workflow = [
  ["01", "Capture", "A signed GitHub workflow event enters the incident pipeline."],
  ["02", "Correlate", "Logs, commit metadata and workflow context are joined."],
  ["03", "Explain", "The analyser produces a root cause, confidence and evidence."],
  ["04", "Resolve", "A human reviews the plan before any corrective action." ]
];

export default function HomePage() {
  return (
    <main className="landing-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <nav className="landing-nav">
        <Link href="/" className="brand" aria-label="OpsPilot AI home">
          <span className="brand-mark"><span className="brand-pulse" />OP</span>
          <span>OpsPilot <b>AI</b></span>
        </Link>
        <div className="landing-links">
          <a href="#capabilities">Capabilities</a>
          <a href="#workflow">Workflow</a>
          <a href="#architecture">Architecture</a>
        </div>
        <Link className="button compact" href="/dashboard">Open live product <span>↗</span></Link>
      </nav>

      <section className="landing-hero">
        <Reveal className="hero-copy-block">
          <div className="status-pill"><span className="live-dot" /> Live incident intelligence</div>
          <h1>Turn failed deployments into <span className="gradient-text">verified answers.</span></h1>
          <p className="hero-copy">OpsPilot AI transforms noisy CI/CD failures into evidence-backed root causes, confidence scores and safe recovery plans—without letting AI make unchecked code changes.</p>
          <div className="hero-actions">
            <Link className="button large" href="/dashboard">Explore the operations centre <span>→</span></Link>
            <a className="button secondary large" href="https://github.com/musammilvilayil/OpsPilot-AI-your-flagship" target="_blank" rel="noreferrer">View source code</a>
          </div>
          <div className="hero-proof" aria-label="Product principles">
            <div><strong>HMAC</strong><span>verified ingestion</span></div>
            <div><strong>3 layers</strong><span>of evidence context</span></div>
            <div><strong>0</strong><span>autonomous code changes</span></div>
          </div>
        </Reveal>
        <Reveal className="hero-visual" delay={140}><PipelineIllustration /></Reveal>
      </section>

      <section className="logo-strip" aria-label="Supported engineering workflow">
        <span>GITHUB ACTIONS</span><i /> <span>NEXT.JS</span><i /> <span>FASTAPI</span><i /> <span>POSTGRESQL</span><i /> <span>DOCKER</span>
      </section>

      <section className="landing-section" id="capabilities">
        <Reveal className="section-intro">
          <div className="eyebrow">Built for trustworthy incident response</div>
          <h2>AI that shows its work.</h2>
          <p>Most troubleshooting assistants produce a confident paragraph. OpsPilot builds a traceable investigation that engineers can review, challenge and act on.</p>
        </Reveal>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <Reveal className="feature-card" delay={index * 80} key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
              <span className="feature-link">Product capability <b>↗</b></span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="landing-section workflow-section" id="workflow">
        <Reveal className="workflow-heading">
          <div className="eyebrow">One continuous investigation</div>
          <h2>From failure signal to approved fix.</h2>
        </Reveal>
        <div className="workflow-rail">
          {workflow.map(([number, title, copy], index) => (
            <Reveal className="workflow-step" delay={index * 90} key={number}>
              <span className="workflow-number">{number}</span>
              <div className="workflow-dot" />
              <h3>{title}</h3>
              <p>{copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="landing-section architecture-section" id="architecture">
        <Reveal className="architecture-copy">
          <div className="eyebrow">Portfolio project, production mindset</div>
          <h2>A real distributed system—not a chatbot wrapper.</h2>
          <p>The hosted demo uses synchronous analysis to remain free, while the repository includes Redis and BullMQ for production background processing.</p>
          <ul className="check-list">
            <li><span>✓</span> Idempotent webhook delivery processing</li>
            <li><span>✓</span> PostgreSQL incident and evidence history</li>
            <li><span>✓</span> FastAPI structured analysis service</li>
            <li><span>✓</span> Deterministic fallback when AI is unavailable</li>
          </ul>
        </Reveal>
        <Reveal className="architecture-diagram" delay={120}>
          <div className="architecture-node source"><small>Source</small><strong>GitHub Actions</strong><span>workflow_run</span></div>
          <div className="architecture-arrow"><i /><b>signed event</b></div>
          <div className="architecture-node core"><small>Platform</small><strong>OpsPilot Web</strong><span>Next.js + Prisma</span></div>
          <div className="architecture-split"><i /><i /></div>
          <div className="architecture-bottom">
            <div className="architecture-node"><small>Intelligence</small><strong>FastAPI</strong><span>evidence engine</span></div>
            <div className="architecture-node"><small>History</small><strong>PostgreSQL</strong><span>incidents + actions</span></div>
          </div>
        </Reveal>
      </section>

      <Reveal className="landing-cta">
        <div><div className="eyebrow">See the full investigation experience</div><h2>Open a live incident in seconds.</h2><p>The deployed portfolio demo includes realistic Cloudinary, database and TypeScript failure scenarios.</p></div>
        <Link className="button large" href="/dashboard">Launch OpsPilot AI <span>→</span></Link>
      </Reveal>

      <footer className="landing-footer">
        <Link href="/" className="brand"><span className="brand-mark small">OP</span><span>OpsPilot AI</span></Link>
        <p>Evidence-backed DevOps intelligence by Muhammad Musammil.</p>
        <a href="https://github.com/musammilvilayil/OpsPilot-AI-your-flagship" target="_blank" rel="noreferrer">GitHub ↗</a>
      </footer>
    </main>
  );
}
