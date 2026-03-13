function DetectionSummary({ typeCounts, total }) {
    const types = [
        { key: "pothole", label: "POTHOLES" },
        { key: "road_crack", label: "CRACKS" },
        { key: "manhole", label: "MANHOLES" },
    ];

    // Also count open_manhole towards manholes display
    const getCombinedCount = (key) => {
        if (key === "manhole") {
            return (typeCounts["manhole"] || 0) + (typeCounts["open_manhole"] || 0);
        }
        return typeCounts[key] || 0;
    };

    return (
        <div className="insp-card">
            <div className="summary-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                Detection Summary
            </div>

            <div className="summary-cards">
                {types.map((t) => {
                    const count = getCombinedCount(t.key);
                    const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
                    return (
                        <div className="summary-type-card" key={t.key}>
                            <div className="summary-type-card-header">
                                <span>{t.label}</span>
                                <span className={`summary-type-count ${t.key}`}>{count}</span>
                            </div>
                            <div className="summary-progress">
                                <div
                                    className={`summary-progress-fill ${t.key}`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <span className="summary-type-pct">{pct}% of total issues</span>
                        </div>
                    );
                })}
            </div>

            <div className="summary-footer">
                <div className="summary-footer-stat">
                    <label>TOTAL FINDINGS</label>
                    <span>{total} Road Assets</span>
                </div>
                <div className="summary-footer-stat">
                    <label>REVIEW PROGRESS</label>
                    <span>0 / {total} Reviewed</span>
                </div>
                <a className="summary-export-link" href="#" onClick={(e) => e.preventDefault()}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Export Summary Report
                </a>
            </div>
        </div>
    );
}

export default DetectionSummary;
