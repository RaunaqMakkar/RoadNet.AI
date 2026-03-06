function TicketStats({ total, data }) {
    const criticalCount = data.filter((t) => t.priority === "Critical").length;
    const verifiedCount = data.filter((t) => t.is_verified).length;
    const verifiedRate = total > 0 ? ((verifiedCount / Math.min(total, data.length)) * 100).toFixed(1) : "0.0";

    return (
        <div className="tickets-stats">
            <div className="ticket-stat-card">
                <div className="ticket-stat-title">TOTAL OPEN TICKETS</div>
                <div className="ticket-stat-value">{total.toLocaleString()}</div>
            </div>
            <div className="ticket-stat-card">
                <div className="ticket-stat-title">CRITICAL RPS ISSUES</div>
                <div className="ticket-stat-value red">{criticalCount}</div>
            </div>
            <div className="ticket-stat-card">
                <div className="ticket-stat-title">AVG. RESOLUTION TIME</div>
                <div className="ticket-stat-value">4.2 Days</div>
            </div>
            <div className="ticket-stat-card">
                <div className="ticket-stat-title">AI VERIFIED RATE</div>
                <div className="ticket-stat-value green">{verifiedRate}%</div>
            </div>
        </div>
    );
}

export default TicketStats;
