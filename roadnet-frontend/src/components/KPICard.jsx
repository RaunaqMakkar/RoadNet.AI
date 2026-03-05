function KPICard({ icon, iconColor, title, value, trend, trendDir, isText }) {
    return (
        <div className="kpi-card">
            <div className="kpi-card-top">
                <div className={`kpi-icon ${iconColor}`}>
                    {icon}
                </div>
                {trend !== undefined && trend !== null && (
                    <span className={`kpi-trend ${trendDir === "up" ? "up" : "down"}`}>
                        {trendDir === "up" ? "↑" : "↓"}{trend}
                    </span>
                )}
            </div>
            <div className="kpi-title">{title}</div>
            <div className={`kpi-value${isText ? " text-val" : ""}`}>{value}</div>
        </div>
    );
}

export default KPICard;
