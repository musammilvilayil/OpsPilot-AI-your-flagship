"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenuButton } from "@/components/animated-ui";

function NavIcon({ name }: { name: "overview" | "incidents" | "repositories" | "runbooks" }) {
  if (name === "overview") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>;
  if (name === "incidents") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2.8 19h18.4L12 3Z"/><path d="M12 9v4M12 17h.01"/></svg>;
  if (name === "repositories") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20M8 7h8M8 11h6"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>;
}

const items = [
  { label: "Overview", href: "/dashboard", icon: "overview" as const },
  { label: "Incidents", href: "/dashboard#incidents", icon: "incidents" as const },
  { label: "Repositories", href: "/dashboard#repositories", icon: "repositories" as const },
  { label: "Runbooks", href: "/dashboard#runbooks", icon: "runbooks" as const }
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-topline">
          <Link href="/" className="brand"><span className="brand-mark"><span className="brand-pulse" />OP</span><span>OpsPilot <b>AI</b></span></Link>
          <MobileMenuButton />
        </div>
        <div className="workspace-switcher"><span className="workspace-avatar">MM</span><div><small>Workspace</small><strong>Musammil Dev</strong></div><span className="workspace-chevron">⌄</span></div>
        <nav className="nav" aria-label="Primary navigation">
          <div className="nav-label">Monitor</div>
          {items.map((item) => {
            const active = item.label === "Overview" ? pathname === "/dashboard" : item.label === "Incidents" ? pathname.startsWith("/incidents") : false;
            return <Link className={active ? "active" : ""} href={item.href} key={item.label}><span className="nav-icon"><NavIcon name={item.icon} /></span><span>{item.label}</span>{item.label === "Incidents" ? <b className="nav-count">2</b> : null}</Link>;
          })}
          <div className="nav-label secondary-label">Manage</div>
          <a href="https://github.com/musammilvilayil/OpsPilot-AI-your-flagship/settings/hooks" target="_blank" rel="noreferrer"><span className="nav-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.13.38.34.72.6 1 .3.28.68.42 1.1.4h.09v4h-.09c-.42-.02-.8.12-1.1.4-.26.28-.47.62-.6 1.2Z"/></svg></span><span>Integrations</span><span className="external-arrow">↗</span></a>
        </nav>
        <div className="sidebar-card system-card">
          <div className="system-card-head"><div className="system-orb"><i /><i /></div><span className="badge resolved"><span className="live-dot" /> Healthy</span></div>
          <p>All analysers online</p>
          <div className="system-stat"><span>Evidence engine</span><strong>87 ms</strong></div>
          <div className="system-stat"><span>Webhook listener</span><strong>Active</strong></div>
          <div className="system-progress"><i /></div>
          <small>Safe deterministic fallback enabled</small>
        </div>
        <div className="sidebar-profile"><span className="profile-avatar">MM</span><div><strong>Muhammad Musammil</strong><small>Developer workspace</small></div><span>•••</span></div>
      </div>
    </aside>
  );
}
