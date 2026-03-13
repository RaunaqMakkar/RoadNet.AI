function MapFilters({ filters, onChange, onApply, onClear, markerCount }) {
    const update = (key, val) => onChange({ ...filters, [key]: val });

    const togglePriority = (p) => {
        const current = new Set(filters.priorities);
        if (current.has(p)) current.delete(p);
        else current.add(p);
        onChange({ ...filters, priorities: current });
    };

    return (
        <div className="mapview-filters">
            {/* Header */}
            <div className="filter-header">
                <h2>Filters</h2>
                <button className="filter-clear" onClick={onClear}>Clear All</button>
            </div>

            <div className="filter-body">
                {/* Priority */}
                <div className="filter-section">
                    <div className="filter-section-label">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        Priority
                    </div>
                    <div className="filter-checkbox-grid">
                        {["Critical", "High", "Moderate", "Low"].map((p) => {
                            const checked = filters.priorities.has(p);
                            return (
                                <label key={p} className={`filter-checkbox${checked ? " checked" : ""}`}>
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => togglePriority(p)}
                                    />
                                    {p}
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Issue Type */}
                <div className="filter-section">
                    <div className="filter-section-label">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                        Issue Type
                    </div>
                    <select
                        className="filter-select"
                        value={filters.issueType}
                        onChange={(e) => update("issueType", e.target.value)}
                    >
                        <option value="">All Issues</option>
                        <option value="pothole">Pothole</option>
                        <option value="road_crack">Road Crack</option>
                        <option value="manhole">Manhole</option>
                        <option value="open_manhole">Open Manhole</option>
                    </select>
                </div>

                {/* Zone */}
                <div className="filter-section">
                    <div className="filter-section-label">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
                        Zone
                    </div>
                    <select
                        className="filter-select"
                        value={filters.zone}
                        onChange={(e) => update("zone", e.target.value)}
                    >
                        <option value="">All Zones</option>
                        <option value="Ward 1">Ward 1</option>
                        <option value="Ward 2">Ward 2</option>
                        <option value="Ward 3">Ward 3</option>
                    </select>
                </div>

                {/* Assigned Dept */}
                <div className="filter-section">
                    <div className="filter-section-label">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        Assigned Dept
                    </div>
                    <select
                        className="filter-select"
                        value={filters.department}
                        onChange={(e) => update("department", e.target.value)}
                    >
                        <option value="">All Departments</option>
                        <option value="Public Works Department">Public Works</option>
                        <option value="Transport">Transport</option>
                        <option value="Utilities">Utilities</option>
                    </select>
                </div>

                {/* Verified Only */}
                <div className="filter-section">
                    <div className="filter-toggle-row">
                        <div className="filter-toggle-info">
                            <span className="filter-toggle-label">Verified Only</span>
                            <span className="filter-toggle-sub">AI-confirmed assets only</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={filters.verifiedOnly}
                                onChange={(e) => update("verifiedOnly", e.target.checked)}
                            />
                            <span className="toggle-slider" />
                        </label>
                    </div>
                </div>

                {/* Date Range */}
                <div className="filter-section">
                    <div className="filter-section-label">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        Date Range
                    </div>
                    <div className="filter-date-group">
                        <input
                            type="date"
                            className="filter-date-input"
                            value={filters.dateFrom}
                            onChange={(e) => update("dateFrom", e.target.value)}
                        />
                        <input
                            type="date"
                            className="filter-date-input"
                            value={filters.dateTo}
                            onChange={(e) => update("dateTo", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="filter-footer">
                <button className="filter-apply-btn" onClick={onApply}>
                    Apply Geo-Intelligence
                </button>
                <div className="filter-marker-count">
                    Showing {markerCount.toLocaleString()} active geo-markers based on current view.
                </div>
            </div>
        </div>
    );
}

export default MapFilters;
