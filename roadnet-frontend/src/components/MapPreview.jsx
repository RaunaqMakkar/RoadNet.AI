import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import API from "../services/api";

const PRIORITY_COLORS = {
    Critical: "#ef4444",
    High: "#f97316",
    Moderate: "#eab308",
    Low: "#22c55e",
};

function MapPreview() {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/map/geojson")
            .then((res) => {
                setFeatures(res.data.features || []);
            })
            .catch(() => setFeatures([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner" />
                Loading map...
            </div>
        );
    }

    return (
        <div className="map-container">
            <MapContainer
                center={[28.6139, 77.2090]}
                zoom={12}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                {features.map((f, i) => {
                    const [lng, lat] = f.geometry.coordinates;
                    const priority = f.properties?.priority || "Low";
                    const color = PRIORITY_COLORS[priority] || "#3b82f6";
                    return (
                        <CircleMarker
                            key={i}
                            center={[lat, lng]}
                            radius={8}
                            fillColor={color}
                            color={color}
                            weight={2}
                            opacity={0.9}
                            fillOpacity={0.6}
                        >
                            <Popup>
                                <strong>{f.properties?.ticket_id}</strong><br />
                                Type: {f.properties?.type}<br />
                                Priority: {priority}
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>
        </div>
    );
}

export default MapPreview;
