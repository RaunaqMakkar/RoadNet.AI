function PredictiveInsights() {
    const insights = [
        {
            title: "Likely Pothole Formation",
            desc: "85% confidence score for Oak Street intersection based on recent rainfall and traffic patterns.",
            badge: "High Priority",
            badgeClass: "high",
        },
        {
            title: "Maintenance Optimization",
            desc: "Consolidating tickets 842 and 845 could save 15% in travel and labor costs in West Zone.",
            badge: "Operational Saving",
            badgeClass: "saving",
        },
        {
            title: "Anomaly Detected",
            desc: "Unusual spike in reporting for East District. Correlation found with recent water main works.",
            badge: "Data Alert",
            badgeClass: "alert",
        },
    ];

    return (
        <div className="predictive-section">
            <div className="predictive-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                </svg>
                Predictive AI Insights
            </div>
            <div className="predictive-cards">
                {insights.map((ins, i) => (
                    <div className="predictive-card" key={i}>
                        <h4>{ins.title}</h4>
                        <p>{ins.desc}</p>
                        <span className={`predictive-badge ${ins.badgeClass}`}>{ins.badge}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PredictiveInsights;
