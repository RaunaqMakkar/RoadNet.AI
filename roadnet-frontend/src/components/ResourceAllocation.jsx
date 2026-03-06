function ResourceAllocation({ tickets }) {
    const total = (tickets || []).length;
    const openCount = (tickets || []).filter((t) => (t.status || "").toLowerCase() !== "closed").length;

    return (
        <>
            <div className="resource-stat">
                <div className="resource-stat-icon blue">👥</div>
                <div className="resource-stat-content">
                    <div className="resource-stat-label">Field Units</div>
                    <div className="resource-stat-value">{openCount || 124} Active</div>
                </div>
                <span className="resource-stat-extra green">+5.2%</span>
            </div>
            <div className="resource-stat">
                <div className="resource-stat-icon orange">⚡</div>
                <div className="resource-stat-content">
                    <div className="resource-stat-label">Avg Resolution</div>
                    <div className="resource-stat-value">4.2 Hours</div>
                </div>
                <span className="resource-stat-extra muted">Target: 4h</span>
            </div>
        </>
    );
}

export default ResourceAllocation;
