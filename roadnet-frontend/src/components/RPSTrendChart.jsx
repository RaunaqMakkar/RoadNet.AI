import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

function RPSTrendChart({ avgRps }) {
    const [quarter, setQuarter] = useState("Q1");

    const base = avgRps || 7;
    const data = [
        { month: "JAN", value: +(base * 0.75).toFixed(1) },
        { month: "FEB", value: +(base * 0.82).toFixed(1) },
        { month: "MAR", value: +(base * 1.0).toFixed(1) },
        { month: "APR", value: +(base * 0.88).toFixed(1) },
        { month: "MAY", value: +(base * 0.70).toFixed(1) },
    ];

    const maxVal = Math.max(...data.map((d) => d.value));

    return (
        <div className="a-panel">
            <div className="a-panel-header">
                <h3>RPS Trend Analysis</h3>
                <div className="rps-toggle">
                    <button className={quarter === "Q1" ? "active" : ""} onClick={() => setQuarter("Q1")}>Q1</button>
                    <button className={quarter === "Q2" ? "active" : ""} onClick={() => setQuarter("Q2")}>Q2</button>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
                        {data.map((entry, i) => (
                            <Cell key={i} fill={entry.value === maxVal ? "#1d4ed8" : "#93c5fd"} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default RPSTrendChart;
