function DetectionStats({ framesProcessed, issuesDetected, avgConfidence, gpuUsage = 0, processingTime = 0 }) {
    const stats = [
        {
            title: "Frames Processed",
            value: framesProcessed.toLocaleString(),
            sub: `${processingTime}s total processing time`,
            subClass: "trend-up",
            iconClass: "blue",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="2" />
                    <path d="M7 12h10M7 8h6M7 16h8" />
                </svg>
            ),
        },
        {
            title: "Issues Detected",
            value: issuesDetected.toString(),
            sub: "Ready for review",
            iconClass: "red",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            ),
        },
        {
            title: "Avg Confidence",
            value: `${(avgConfidence * 100).toFixed(1)}%`,
            iconClass: "green",
            progress: avgConfidence * 100,
            progressClass: "green",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
            ),
        },
        {
            title: "Simulated GPU Usage",
            value: `${gpuUsage}%`,
            detail: "Virtual RTX 4080",
            iconClass: "purple",
            progress: gpuUsage,
            progressClass: "purple",
            detailText: "VRAM: 8.2GB / 24GB",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <rect x="9" y="9" width="6" height="6" />
                    <line x1="9" y1="1" x2="9" y2="4" />
                    <line x1="15" y1="1" x2="15" y2="4" />
                    <line x1="9" y1="20" x2="9" y2="23" />
                    <line x1="15" y1="20" x2="15" y2="23" />
                    <line x1="20" y1="9" x2="23" y2="9" />
                    <line x1="20" y1="14" x2="23" y2="14" />
                    <line x1="1" y1="9" x2="4" y2="9" />
                    <line x1="1" y1="14" x2="4" y2="14" />
                </svg>
            ),
        },
    ];

    return (
        <div className="detection-stats-row">
            {stats.map((s, i) => (
                <div className="stat-card" key={i}>
                    <div className="stat-card-header">
                        <span className="stat-card-title">{s.title}</span>
                        <div className={`stat-card-icon ${s.iconClass}`}>{s.icon}</div>
                    </div>
                    <div className="stat-card-value">{s.value}</div>
                    {s.sub && <div className={`stat-card-sub ${s.subClass || ""}`}>{s.sub}</div>}
                    {s.detail && <div className="stat-card-sub">{s.detail}</div>}
                    {s.progress !== undefined && (
                        <div className="stat-card-progress">
                            <div className={`stat-card-progress-fill ${s.progressClass}`} style={{ width: `${s.progress}%` }} />
                        </div>
                    )}
                    {s.detailText && <div className="stat-card-detail">{s.detailText}</div>}
                </div>
            ))}
        </div>
    );
}

export default DetectionStats;
