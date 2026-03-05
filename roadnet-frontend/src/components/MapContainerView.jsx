import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";

const PRIORITY_COLORS = {
    Critical: "#ef4444",
    High: "#f97316",
    Medium: "#eab308",
    Moderate: "#eab308",
    Low: "#22c55e",
};

function LocateControl() {
    const map = useMap();
    return (
        <div className="map-right-controls">
            <button className="map-ctrl-btn" title="Locate" onClick={() => map.locate({ setView: true, maxZoom: 14 })}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><line x1="1.05" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="22.95" y2="12" /><line x1="12" y1="1.05" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="22.95" /></svg>
            </button>
            <div className="map-ctrl-divider" />
            <button className="map-ctrl-btn" title="Zoom In" onClick={() => map.zoomIn()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
            <div className="map-ctrl-divider" />
            <button className="map-ctrl-btn" title="Zoom Out" onClick={() => map.zoomOut()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
            <div className="map-ctrl-divider" />
            <button className="map-ctrl-btn" title="Layers">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
            </button>
        </div>
    );
}

function MapContainerView({ features }) {
    return (
        <MapContainer
            center={[28.6139, 77.2090]}
            zoom={12}
            scrollWheelZoom={true}
            zoomControl={false}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <LocateControl />
            {features.map((f, i) => {
                const [lng, lat] = f.geometry.coordinates;
                const props = f.properties || {};
                const priority = props.priority || "Low";
                const color = PRIORITY_COLORS[priority] || "#22c55e";
                return (
                    <CircleMarker
                        key={i}
                        center={[lat, lng]}
                        radius={9}
                        fillColor={color}
                        color={color}
                        weight={2}
                        opacity={0.9}
                        fillOpacity={0.55}
                    >
                        <Popup>
                            <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                                <strong>{props.ticket_id || "—"}</strong><br />
                                <b>Type:</b> {(props.type || "").replace(/_/g, " ")}<br />
                                <b>Priority:</b> {priority}<br />
                                <b>Zone:</b> {props.zone || "—"}<br />
                                <b>Dept:</b> {props.assigned_department || "—"}<br />
                                <b>RPS:</b> {props.rps_score ?? "—"}<br />
                                <b>Time:</b> {props.video_timestamp_seconds != null ? `${props.video_timestamp_seconds}s` : "—"}
                            </div>
                        </Popup>
                    </CircleMarker>
                );
            })}
        </MapContainer>
    );
}

export default MapContainerView;
