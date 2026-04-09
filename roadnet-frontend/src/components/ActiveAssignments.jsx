import { useState } from "react";

const DEPT_BADGE_MAP = {
    "Public Works Department": { label: "Public Works", cls: "maintenance" },
    "Road Maintenance": { label: "Maintenance", cls: "maintenance" },
    "Pavement Inspection": { label: "Pavement", cls: "traffic" },
    "Transport": { label: "Traffic", cls: "traffic" },
    "Traffic": { label: "Traffic", cls: "traffic" },
    "Utilities": { label: "Utilities", cls: "citizens" },
    "Safety": { label: "Safety", cls: "maintenance" },
};

function getBadge(dept) {
    if (!dept) return { label: "Unassigned", cls: "citizens" };
    for (const [k, v] of Object.entries(DEPT_BADGE_MAP)) {
        if (dept.toLowerCase().includes(k.toLowerCase())) return v;
    }
    return { label: dept.length > 16 ? dept.slice(0, 14) + "…" : dept, cls: "citizens" };
}

function getTypeDesc(ticket) {
    const type = (ticket.type || "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const zone = ticket.zone || "";
    return `${type}${zone ? " – " + zone : ""}`;
}

const PAGE_SIZE = 10;

function ActiveAssignments({ tickets }) {
    const [page, setPage] = useState(0);
    const [sortBy, setSortBy] = useState("priority");

    const priorityOrder = { Critical: 0, High: 1, Medium: 2, Moderate: 2, Normal: 3, Low: 4 };

    const sorted = [...(tickets || [])].sort((a, b) => {
        if (sortBy === "priority") {
            return (priorityOrder[a.priority] ?? 5) - (priorityOrder[b.priority] ?? 5);
        }
        if (sortBy === "rps") {
            return (b.rps_score || 0) - (a.rps_score || 0);
        }
        return (a.ticket_id || "").localeCompare(b.ticket_id || "");
    });

    const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
    const visible = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    const startIdx = page * PAGE_SIZE + 1;
    const endIdx = Math.min((page + 1) * PAGE_SIZE, sorted.length);

    return (
        <div className="d-panel">
            <div className="d-panel-header">
                <h3>Active Assignments</h3>
                <div className="sort-control">
                    Sort by:
                    <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(0); }}>
                        <option value="priority">Priority</option>
                        <option value="rps">RPS Score</option>
                        <option value="id">Ticket ID</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
            <table className="assignments-table">
                <thead>
                    <tr>
                        <th>TICKET ID</th>
                        <th>DEPARTMENT</th>
                        <th>STATUS</th>
                        <th>RPS SCORE</th>
                    </tr>
                </thead>
                <tbody>
                    {visible.map((t, i) => {
                        const badge = getBadge(t.assigned_department);
                        const priorityClass = (t.priority || "normal").toLowerCase();
                        const rps = t.rps_score || 0;
                        const rpsClass = rps > 75 ? "high" : rps > 50 ? "medium" : "low";
                        return (
                            <tr key={t.ticket_id || i}>
                                <td>
                                    <div className="assign-ticket-id">#{t.ticket_id}</div>
                                    <div className="assign-ticket-desc">{getTypeDesc(t)}</div>
                                </td>
                                <td><span className={`dept-badge ${badge.cls}`}>{badge.label}</span></td>
                                <td>
                                    <div className="status-cell">
                                        <span className={`status-dot ${priorityClass}`} />
                                        {t.priority}
                                    </div>
                                </td>
                                <td>
                                    <span className={`rps-score-badge ${rpsClass}`}>{rps.toFixed ? rps.toFixed(1) : rps}</span>
                                </td>
                            </tr>
                        );
                    })}
                    {visible.length === 0 && (
                        <tr><td colSpan={4} style={{ textAlign: "center", padding: 30, color: "#94a3b8" }}>No assignments</td></tr>
                    )}
                </tbody>
            </table>
            </div>

            <div className="assignments-footer">
                <span className="assignments-count">
                    {sorted.length > 0
                        ? `Showing ${startIdx}–${endIdx} of ${sorted.length} tickets`
                        : "No tickets"
                    }
                </span>
                <div className="assignments-nav">
                    <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>‹</button>
                    <span className="assignments-page-num">{page + 1} / {Math.max(totalPages, 1)}</span>
                    <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}>›</button>
                </div>
            </div>
        </div>
    );
}

export default ActiveAssignments;
