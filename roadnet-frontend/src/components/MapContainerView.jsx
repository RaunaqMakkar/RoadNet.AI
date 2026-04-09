import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

const PRIORITY_COLORS = {
    Critical: "#ef4444",
    High: "#f97316",
    Medium: "#eab308",
    Moderate: "#eab308",
    Low: "#22c55e",
};

/* Fixes map disappearing on mobile resize */
function ResizeHandler() {
    const map = useMap();
    useEffect(() => {
        const handleResize = () => {
            setTimeout(() => map.invalidateSize(), 100);
        };
        window.addEventListener("resize", handleResize);
        // Also invalidate on initial mount
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, [map]);
    return null;
}

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

/* ============================================
   Cluster Layer — groups nearby markers
   ============================================ */
function ClusterLayer({ features }) {
    const map = useMap();

    useEffect(() => {
        // Create a simple grouping approach using Leaflet layer groups
        // We'll group markers that are in the same grid cell
        const groups = {};
        const gridSize = 0.01; // ~1km grid cells

        features.forEach((f) => {
            const [lng, lat] = f.geometry.coordinates;
            const cellKey = `${Math.floor(lat / gridSize)},${Math.floor(lng / gridSize)}`;
            if (!groups[cellKey]) groups[cellKey] = [];
            groups[cellKey].push(f);
        });

        const layerGroup = L.layerGroup();

        Object.values(groups).forEach((group) => {
            if (group.length === 1) {
                // Single marker — render normally
                const f = group[0];
                const [lng, lat] = f.geometry.coordinates;
                const priority = f.properties?.priority || "Low";
                const color = PRIORITY_COLORS[priority] || "#22c55e";
                const marker = L.circleMarker([lat, lng], {
                    radius: 9,
                    fillColor: color,
                    color: color,
                    weight: 2,
                    opacity: 0.9,
                    fillOpacity: 0.55,
                });
                marker.bindPopup(makePopup(f));
                layerGroup.addLayer(marker);
            } else {
                // Cluster — compute center and show count
                let sumLat = 0, sumLng = 0;
                group.forEach((f) => {
                    const [lng, lat] = f.geometry.coordinates;
                    sumLat += lat;
                    sumLng += lng;
                });
                const cLat = sumLat / group.length;
                const cLng = sumLng / group.length;
                const size = Math.min(24 + group.length * 2, 50);

                const clusterIcon = L.divIcon({
                    html: `<div style="
                        width:${size}px;height:${size}px;
                        background:rgba(37,99,235,0.85);
                        border:3px solid rgba(37,99,235,0.4);
                        border-radius:50%;
                        display:flex;align-items:center;justify-content:center;
                        color:white;font-weight:700;font-size:${size > 36 ? 14 : 12}px;
                        font-family:Inter,system-ui,sans-serif;
                        box-shadow:0 2px 8px rgba(37,99,235,0.4);
                    ">${group.length}</div>`,
                    className: "",
                    iconSize: [size, size],
                    iconAnchor: [size / 2, size / 2],
                });

                const marker = L.marker([cLat, cLng], { icon: clusterIcon });
                marker.bindPopup(`<strong>${group.length} issues</strong> in this area`);
                layerGroup.addLayer(marker);
            }
        });

        layerGroup.addTo(map);
        return () => { map.removeLayer(layerGroup); };
    }, [features, map]);

    return null;
}

/* ============================================
   Heatmap Layer — uses canvas circle overlays
   ============================================ */
function HeatmapLayer({ features }) {
    const map = useMap();

    useEffect(() => {
        const layerGroup = L.layerGroup();

        // Larger, semi-transparent circles to create heatmap look
        features.forEach((f) => {
            const [lng, lat] = f.geometry.coordinates;
            const priority = f.properties?.priority || "Low";
            const color = PRIORITY_COLORS[priority] || "#22c55e";
            const rps = f.properties?.rps_score || 50;
            const intensity = Math.min(rps / 100, 1);

            // Large glow circle
            const glow = L.circleMarker([lat, lng], {
                radius: 30 + intensity * 20,
                fillColor: color,
                color: "transparent",
                weight: 0,
                fillOpacity: 0.15 + intensity * 0.1,
            });
            layerGroup.addLayer(glow);

            // Medium ring
            const mid = L.circleMarker([lat, lng], {
                radius: 15 + intensity * 10,
                fillColor: color,
                color: "transparent",
                weight: 0,
                fillOpacity: 0.25 + intensity * 0.15,
            });
            layerGroup.addLayer(mid);

            // Core dot
            const core = L.circleMarker([lat, lng], {
                radius: 6,
                fillColor: color,
                color: color,
                weight: 1,
                fillOpacity: 0.8,
            });
            core.bindPopup(makePopup(f));
            layerGroup.addLayer(core);
        });

        layerGroup.addTo(map);
        return () => { map.removeLayer(layerGroup); };
    }, [features, map]);

    return null;
}

function makePopup(f) {
    const props = f.properties || {};
    const priority = props.priority || "Low";
    return `<div style="font-size:12px;line-height:1.6">
        <strong>${props.ticket_id || "—"}</strong><br/>
        <b>Type:</b> ${(props.type || "").replace(/_/g, " ")}<br/>
        <b>Priority:</b> ${priority}<br/>
        <b>Zone:</b> ${props.zone || "—"}<br/>
        <b>Dept:</b> ${props.assigned_department || "—"}<br/>
        <b>RPS:</b> ${props.rps_score ?? "—"}<br/>
        <b>Time:</b> ${props.video_timestamp_seconds != null ? `${props.video_timestamp_seconds}s` : "—"}
    </div>`;
}

function MapContainerView({ features, mode }) {
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
            <ResizeHandler />

            {/* Standard mode — individual colored circle markers */}
            {mode === "Standard" && features.map((f, i) => {
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

            {/* Cluster mode — groups nearby markers into numbered clusters */}
            {mode === "Cluster" && <ClusterLayer features={features} />}

            {/* Heatmap mode — radial glow overlays for intensity visualization */}
            {mode === "Heatmap" && <HeatmapLayer features={features} />}
        </MapContainer>
    );
}

export default MapContainerView;
