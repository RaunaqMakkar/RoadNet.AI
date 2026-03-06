function DepartmentWorkload() {
    const depts = [
        { name: "Maintenance", pct: "82%", status: "High Demand", color: "red" },
        { name: "Civil Works", pct: "45%", status: "Optimized", color: "green" },
        { name: "Surveying", pct: "12%", status: "Idle Capacity", color: "blue" },
        { name: "Public Safety", pct: "68%", status: "Near Capacity", color: "orange" },
    ];

    return (
        <div className="a-panel">
            <div className="a-panel-header"><h3>Department Workload</h3></div>
            <div className="dept-grid">
                {depts.map((d) => (
                    <div className="dept-card" key={d.name}>
                        <div className="dept-card-name">{d.name}</div>
                        <div className="dept-card-pct">{d.pct}</div>
                        <div className={`dept-card-status ${d.color}`}>{d.status}</div>
                    </div>
                ))}
            </div>
            <button className="btn-deep-dive">View Deep Dive</button>
        </div>
    );
}

export default DepartmentWorkload;
