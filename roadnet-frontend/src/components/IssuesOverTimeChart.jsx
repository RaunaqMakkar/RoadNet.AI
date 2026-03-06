import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts";

function generateWeeklyData(total) {
    const base = Math.max(Math.floor(total / 8), 10);
    const curve = [0.6, 0.7, 0.85, 1.1, 1.3, 1.0, 0.9, 0.75];
    const prevCurve = [0.5, 0.55, 0.7, 0.8, 0.9, 0.85, 0.75, 0.65];
    return curve.map((m, i) => ({
        week: `W${i + 1}`,
        current: Math.round(base * m),
        previous: Math.round(base * prevCurve[i]),
    }));
}

function IssuesOverTimeChart({ total }) {
    const data = generateWeeklyData(total);

    return (
        <div className="a-panel">
            <div className="a-panel-header">
                <h3>Issues Detected Over Time</h3>
                <div className="chart-legend">
                    <div className="chart-legend-item">
                        <span className="chart-legend-dot" style={{ background: "#2563eb" }} />
                        Current
                    </div>
                    <div className="chart-legend-item">
                        <span className="chart-legend-dot" style={{ background: "#cbd5e1" }} />
                        Previous
                    </div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
                <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.15} />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                    />
                    <Area type="monotone" dataKey="current" stroke="none" fill="url(#blueGrad)" />
                    <Line type="monotone" dataKey="previous" stroke="#cbd5e1" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="current" stroke="#2563eb" strokeWidth={2.5} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default IssuesOverTimeChart;
