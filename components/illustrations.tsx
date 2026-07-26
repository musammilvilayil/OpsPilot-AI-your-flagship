export function PipelineIllustration() {
  return (
    <div className="pipeline-illustration" aria-label="Animated incident analysis pipeline">
      <svg viewBox="0 0 720 520" role="img" aria-labelledby="pipeline-title pipeline-desc">
        <title id="pipeline-title">OpsPilot incident analysis pipeline</title>
        <desc id="pipeline-desc">A failed workflow moves through secure ingestion, evidence analysis and a developer-approved resolution plan.</desc>
        <defs>
          <linearGradient id="flow-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#73b7ff" />
            <stop offset="1" stopColor="#65e6c4" />
          </linearGradient>
          <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect className="illustration-panel" x="18" y="18" width="684" height="484" rx="40" />
        <circle className="orbit orbit-one" cx="360" cy="260" r="178" />
        <circle className="orbit orbit-two" cx="360" cy="260" r="116" />
        <path className="flow-path" d="M142 154 C250 112 250 210 354 210 C465 210 453 120 574 150" />
        <path className="flow-path flow-path-two" d="M146 366 C250 406 250 302 354 302 C465 302 464 398 578 362" />
        <g className="pipeline-node node-one">
          <rect x="74" y="102" width="150" height="105" rx="24" />
          <circle cx="107" cy="135" r="12" className="node-dot danger" />
          <text x="130" y="141" className="node-label">Workflow failed</text>
          <text x="102" y="174" className="node-small">GitHub Actions</text>
        </g>
        <g className="pipeline-node node-two" filter="url(#soft-glow)">
          <rect x="276" y="196" width="170" height="130" rx="30" />
          <circle cx="361" cy="245" r="26" className="ai-core" />
          <path d="M348 245h26M361 232v26" className="ai-mark" />
          <text x="318" y="300" className="node-label">Evidence engine</text>
        </g>
        <g className="pipeline-node node-three">
          <rect x="500" y="98" width="148" height="112" rx="24" />
          <circle cx="535" cy="136" r="12" className="node-dot success" />
          <text x="559" y="142" className="node-label">Root cause</text>
          <text x="528" y="178" className="node-small">93% confidence</text>
        </g>
        <g className="pipeline-node node-four">
          <rect x="495" y="316" width="158" height="112" rx="24" />
          <path d="M529 362l12 12 26-31" className="approval-mark" />
          <text x="578" y="354" className="node-label">Approval</text>
          <text x="578" y="383" className="node-small">Human controlled</text>
        </g>
        <g className="pipeline-node node-five">
          <rect x="72" y="314" width="158" height="112" rx="24" />
          <path d="M105 351h92M105 374h72M105 397h48" className="log-lines" />
          <text x="105" y="337" className="node-small">Exact evidence</text>
        </g>
        <circle className="flow-particle particle-one" cx="142" cy="154" r="7" />
        <circle className="flow-particle particle-two" cx="146" cy="366" r="7" />
      </svg>
      <div className="floating-status status-a"><span /> Secure webhook verified</div>
      <div className="floating-status status-b"><span /> Fix plan generated</div>
    </div>
  );
}

export function HealthySystemIllustration() {
  return (
    <svg className="healthy-illustration" viewBox="0 0 380 250" role="img" aria-label="Healthy services connected to OpsPilot">
      <defs>
        <linearGradient id="health-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#76b8ff" /><stop offset="1" stopColor="#65e6c4" />
        </linearGradient>
      </defs>
      <circle cx="190" cy="125" r="68" className="health-halo" />
      <circle cx="190" cy="125" r="48" fill="url(#health-gradient)" className="health-core" />
      <path d="M168 126l15 15 31-38" className="health-check" />
      <path d="M122 78L78 52M258 78l44-26M122 173l-44 26M258 173l44 26" className="health-links" />
      <g className="service-bubble bubble-a"><circle cx="62" cy="43" r="25" /><text x="62" y="48">GH</text></g>
      <g className="service-bubble bubble-b"><circle cx="318" cy="43" r="25" /><text x="318" y="48">DB</text></g>
      <g className="service-bubble bubble-c"><circle cx="62" cy="207" r="25" /><text x="62" y="212">AI</text></g>
      <g className="service-bubble bubble-d"><circle cx="318" cy="207" r="25" /><text x="318" y="212">API</text></g>
    </svg>
  );
}

export function EmptyStateIllustration() {
  return (
    <svg className="empty-illustration" viewBox="0 0 360 220" role="img" aria-label="No incidents detected">
      <rect x="88" y="42" width="184" height="136" rx="30" className="empty-window" />
      <path d="M117 82h126M117 112h80M117 142h102" className="empty-lines" />
      <circle cx="272" cy="57" r="30" className="empty-orb" />
      <path d="M258 58l10 10 20-25" className="empty-check" />
      <path d="M53 171c32-36 50-31 78-5M228 175c32-43 54-38 80-6" className="empty-wave" />
    </svg>
  );
}
