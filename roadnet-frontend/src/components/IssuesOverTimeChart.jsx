import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts";

function IssuesOverTimeChart({ tickets, total }) {
    // Group tickets by type to build actual distribution over time
    const typeGroups = {};
    (tickets || []).forEach((t) => {
        const type = (t.type || "unknown").replace(/_/g, " ");
        typeGroups[type] = (typeGroups[type] || 0) + 1;
    });

    // Build weekly-like data from actual ticket IDs (split into 8 buckets)
    const sorted = [...(tickets || [])].sort((a, b) =>
        (a.ticket_id || "").localeCompare(b.ticket_id || "")
    );
    const chunkSize = Math.max(Math.ceil(sorted.length / 8), 1);
    const data = [];
    for (let i = 0; i < 8; i++) {
        const chunk = sorted.slice(i * chunkSize, (i + 1) * chunkSize);
        const avgRps = chunk.length > 0
            ? +(chunk.reduce((s, t) => s + (t.rps_score || 0), 0) / chunk.length).toFixed(1)
            : 0;
        data.push({
            week: `W${i + 1}`,
            current: chunk.length,
            rps: avgRps,
        });
    }

    return (
        <div className="a-panel">
            <div className="a-panel-header">
                <h3>Issues Distribution Over Time</h3>
                <div className="chart-legend">
                    <div className="chart-legend-item">
                        <span className="chart-legend-dot" style={{ background: "#2563eb" }} />
                        Ticket Count
                    </div>
                    <div className="chart-legend-item">
                        <span className="chart-legend-dot" style={{ background: "#22c55e" }} />
                        Avg RPS
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
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                    <Area type="monotone" dataKey="current" stroke="none" fill="url(#blueGrad)" />
                    <Line type="monotone" dataKey="rps" stroke="#22c55e" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="current" stroke="#2563eb" strokeWidth={2.5} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default IssuesOverTimeChart;
