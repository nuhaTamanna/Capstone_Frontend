import { CircleMarker, Popup } from "react-leaflet";
import type { MapLocation } from "../../types/api";

export default function AlertLayer({ locations, onSelect }: { locations: MapLocation[]; onSelect: (location: MapLocation) => void }) {
  return <>{locations.map((location) => <CircleMarker key={`${location.location_id}-alert`} center={[location.latitude, location.longitude]} radius={7} pathOptions={{ color: "#6e3aa6", fillColor: "#ffffff", fillOpacity: 1, weight: 3 }} eventHandlers={{ click: () => onSelect(location) }}><Popup><b>{location.name}</b><br />Predictive alert #{location.alert_id}</Popup></CircleMarker>)}</>;
}
