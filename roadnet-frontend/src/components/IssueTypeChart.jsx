const BAR_COLORS = ["blue", "orange", "green", "yellow"];

function IssueTypeChart({ typeBreakdown }) {
    const entries = Object.entries(typeBreakdown || {});

    if (entries.length === 0) {
        return (
            <div className="panel-body">
                <div className="loading-spinner">No data</div>
            </div>
        );
    }

    const maxVal = Math.max(...entries.map(([, v]) => v), 1);

    return (
        <div className="panel-body">
            {entries.map(([label, count], i) => {
                const pct = (count / maxVal) * 100;
                const displayLabel = label.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
                return (
                    <div className="issue-bar-row" key={label}>
                        <span className="issue-bar-label">{displayLabel}</span>
                        <div className="issue-bar-track">
                            <div
                                className={`issue-bar-fill ${BAR_COLORS[i % BAR_COLORS.length]}`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <span className="issue-bar-count">{count}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default IssueTypeChart;
