import Link from "next/link";

export default function HomePage() {
  return (
    <main className="hero">
      <div className="hero-inner">
        <nav className="hero-nav">
          <div className="brand"><span className="brand-mark">OP</span><span>OpsPilot AI</span></div>
          <Link className="button secondary" href="/dashboard">Open live demo</Link>
        </nav>
        <section className="hero-grid">
          <div>
            <div className="eyebrow">AI incident intelligence for modern teams</div>
            <h1>Fix failed deployments with evidence, not guesses.</h1>
            <p className="hero-copy">OpsPilot converts noisy GitHub Actions and deployment failures into a verified root cause, exact evidence lines, files to inspect and an approval-based recovery plan.</p>
            <div className="hero-actions"><Link className="button" href="/dashboard">Explore dashboard →</Link><a className="button secondary" href="#architecture">View architecture</a></div>
          </div>
          <div className="card terminal" aria-label="Incident analysis preview">
            <div className="terminal-top"><span className="dot"/><span className="dot"/><span className="dot"/></div>
            <pre>{`$ workflow: Production Deploy\n$ repository: musammilvilayil/Megham\n\n`}<span className="accent">ROOT CAUSE FOUND · 93% confidence</span>{`\nMissing CLOUDINARY_API_SECRET\n\nEvidence\n  line 118  Error: Must supply api_secret\n\nFiles to inspect\n  .github/workflows/deploy.yml\n  src/config/cloudinary.ts\n\nAction requires human approval ✓`}</pre>
          </div>
        </section>
      </div>
    </main>
  );
}
