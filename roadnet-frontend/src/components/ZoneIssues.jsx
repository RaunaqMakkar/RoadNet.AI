function ZoneIssues({ total }) {
    const zones = [
        { name: "North District", pct: 0.27 },
        { name: "South District", pct: 0.16 },
        { name: "East District", pct: 0.32 },
        { name: "West District", pct: 0.14 },
        { name: "Central Plaza", pct: 0.11 },
    ];

    const maxCount = Math.max(...zones.map((z) => Math.round(total * z.pct)), 1);

    return (
        <div className="a-panel">
            <div className="a-panel-header"><h3>Zone-wise Issues</h3></div>
            {zones.map((z) => {
                const count = Math.round(total * z.pct);
                const barPct = (count / maxCount) * 100;
                return (
                    <div className="zone-bar-item" key={z.name}>
                        <div className="zone-bar-header">
                            <span className="zone-bar-name">{z.name}</span>
                            <span className="zone-bar-count">{count} Issues</span>
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
