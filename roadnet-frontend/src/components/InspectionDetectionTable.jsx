function InspectionDetectionTable({ detections }) {
    if (!detections || detections.length === 0) return null;

    return (
        <div className="detection-table-section">
            <h2>All Detected Issues</h2>
            <table className="detection-table">
                <thead>
                    <tr>
                        <th>TIMESTAMP</th>
                        <th>ISSUE TYPE</th>
                        <th>CONFIDENCE</th>
                        <th>SEVERITY</th>
                        <th>FRAME ID</th>
                        <th>SUGGESTED ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {detections.map((det, i) => (
                        <tr key={i}>
                            <td>{det.timestamp}</td>
                            <td>
                                <div className="det-type-cell">
                                    <span className={`det-type-dot ${det.issue_type}`} />
                                    {det.issue_type.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
                                </div>
                            </td>
                            <td className="det-conf">{(det.confidence * 100).toFixed(1)}%</td>
                            <td>
                                <span className={`severity-tag ${det.severity.toLowerCase()}`}>
                                    {det.severity}
                                </span>
                            </td>
                            <td className="det-frame-id">{det.frame_id}</td>
                            <td>{det.suggested_action}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default InspectionDetectionTable;
