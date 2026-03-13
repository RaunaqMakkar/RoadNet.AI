import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import API from "../services/api";

const COLORS = { Critical: "#ef4444", High: "#f97316", Medium: "#eab308", Low: "#22c55e" };

function IncidentMapPreview() {
    const [features, setFeatures] = useState([]);

    useEffect(() => {
        API.get("/map/geojson")
            .then((res) => setFeatures(res.data.features || []))
            .catch(() => setFeatures([]));
    }, []);

    return (
        <>
            <div className="incident-map-title">Live Incident Map</div>
            <div className="incident-map-container">
                <MapContainer
                    center={[28.6139, 77.2090]}
                    zoom={11}
                    scrollWheelZoom={false}
                    zoomControl={true}
                    dragging={false}
                    style={{ height: "180px", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        attribution="&copy; CARTO"
                    />
                    {features.map((f, i) => {
                        const [lng, lat] = f.geometry.coordinates;
                        const color = COLORS[f.properties?.priority] || "#22c55e";
                        return (
                            <CircleMarker
                                key={i}
                                center={[lat, lng]}
                                radius={5}
                                fillColor={color}
                                color={color}
                                weight={1}
                                fillOpacity={0.7}
                            />
                        );
                    })}
                </MapContainer>
            </div>
        </>
    );
}

export default IncidentMapPreview;
