import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = {
    Critical: "#ef4444",
    High: "#f97316",
    Normal: "#3b82f6",
    Moderate: "#eab308",
    Low: "#22c55e",
};

function formatCount(n) {
    if (n >= 1000) return (n / 1000).toFixed(1) + "k";
    return String(n);
}

function PriorityChart({ breakdown, total }) {
    const data = Object.entries(breakdown || {}).map(([name, value]) => ({
        name,
        value,
    }));

    if (data.length === 0) {
        return (
            <div className="panel-body">
                <div className="loading-spinner">No data</div>
            </div>
        );
    }

    const totalCount = total || data.reduce((s, d) => s + d.value, 0);

    return (
        <div className="priority-chart-wrapper">
            <div className="priority-chart-center">
                <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={62}
                            outerRadius={90}
                            paddingAngle={3}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[entry.name] || "#94a3b8"}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="priority-chart-label">
                    <span className="count">{formatCount(totalCount)}</span>
                    <span className="subtitle">TICKETS</span>
                </div>
            </div>

            <div className="priority-legend">
                {data.map((d) => {
                    const pct = totalCount > 0 ? Math.round((d.value / totalCount) * 100) : 0;
                    return (
                        <div className="priority-legend-item" key={d.name}>
                            <span
                                className="priority-legend-dot"
                                style={{ background: COLORS[d.name] || "#94a3b8" }}
                            />
                            {d.name} ({pct}%)
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PriorityChart;
