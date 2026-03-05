function MapModeToggle({ mode, onChange }) {
    const modes = ["Standard", "Cluster", "Heatmap"];

    return (
        <div className="map-mode-toggle">
            {modes.map((m) => (
                <button
                    key={m}
                    className={`map-mode-btn${mode === m ? " active" : ""}`}
                    onClick={() => onChange(m)}
                >
                    {m}
                </button>
            ))}
        </div>
    );
}

export default MapModeToggle;
