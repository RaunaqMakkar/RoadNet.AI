const LEGEND_ITEMS = [
    { label: "Critical (P1)", color: "#ef4444" },
    { label: "High (P2)", color: "#f97316" },
    { label: "Medium (P3)", color: "#eab308" },
    { label: "Low (P4)", color: "#22c55e" },
];

function MapLegend() {
    return (
        <div className="map-legend">
            <div className="map-legend-title">Priority Legend</div>
            {LEGEND_ITEMS.map((item) => (
                <div className="map-legend-item" key={item.label}>
                    <span className="map-legend-dot" style={{ background: item.color }} />
                    {item.label}
                </div>
            ))}
        </div>
    );
}

export default MapLegend;
