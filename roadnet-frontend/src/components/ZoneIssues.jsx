function ZoneIssues({ zoneBreakdown }) {
    const zones = Object.entries(zoneBreakdown || {})
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    const maxCount = zones.length > 0 ? Math.max(...zones.map((z) => z.count)) : 1;

    if (zones.length === 0) {
        return (
            <div className="a-panel">
                <div className="a-panel-header"><h3>Zone-wise Issues</h3></div>
                <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>No zone data</div>
            </div>
        );
    }

    return (
        <div className="a-panel">
            <div className="a-panel-header"><h3>Zone-wise Issues</h3></div>
            {zones.map((z) => {
                const barPct = (z.count / maxCount) * 100;
                return (
                    <div className="zone-bar-item" key={z.name}>
                        <div className="zone-bar-header">
                            <span className="zone-bar-name">{z.name}</span>
                            <span className="zone-bar-count">{z.count} Issues</span>
                        </div>
                        <div className="zone-bar-track">
                            <div className="zone-bar-fill" style={{ width: `${barPct}%` }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ZoneIssues;
