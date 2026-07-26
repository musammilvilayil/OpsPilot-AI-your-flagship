import Link from "next/link";
import { EmptyStateIllustration } from "@/components/illustrations";

export default function NotFound() {
  return (
    <main className="not-found-shell">
      <section className="card not-found-card">
        <EmptyStateIllustration />
        <div className="eyebrow">Signal not found</div>
        <h1>This incident left no trace.</h1>
        <p>The requested page does not exist or the incident has been removed from the active workspace.</p>
        <Link className="button" href="/dashboard">Return to operations centre →</Link>
      </section>
    </main>
  );
}
