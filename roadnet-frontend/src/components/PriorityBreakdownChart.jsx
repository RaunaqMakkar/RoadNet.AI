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

function PriorityBreakdownChart({ breakdown, total }) {
    const data = Object.entries(breakdown || {}).map(([name, value]) => ({ name, value }));
    const totalCount = total || data.reduce((s, d) => s + d.value, 0);

    if (data.length === 0) {
        return (
            <div className="a-panel">
                <div className="a-panel-header"><h3>Priority Breakdown</h3></div>
                <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>No data</div>
            </div>
        );
    }

    return (
        <div className="a-panel">
            <div className="a-panel-header"><h3>Priority Breakdown</h3></div>
            <div className="priority-breakdown-wrapper">
                <div className="priority-donut-center">
                    <ResponsiveContainer width={180} height={180}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {data.map((entry, i) => (
                                    <Cell key={i} fill={COLORS[entry.name] || "#94a3b8"} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="priority-donut-label">
                        <span className="val">{formatCount(totalCount)}</span>
                        <span className="sub">TOTAL</span>
                    </div>
                </div>

                <div className="priority-legend-rows">
                    {data.map((d) => {
                        const pct = totalCount > 0 ? Math.round((d.value / totalCount) * 100) : 0;
                        return (
                            <div className="priority-legend-row" key={d.name}>
                                <div className="priority-legend-left">
                                    <span className="chart-legend-dot" style={{ width: 8, height: 8, borderRadius: "50%", display: "inline-block", background: COLORS[d.name] || "#94a3b8" }} />
                                    {d.name}
                                </div>
                                <span className="priority-legend-pct">{pct}%</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default PriorityBreakdownChart;
