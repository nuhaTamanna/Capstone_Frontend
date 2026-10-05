import { Circle } from "react-leaflet";
import type { MapLocation } from "../../types/api";
const colorForAqi = (aqi: number) => aqi >= 150 ? "#bd3340" : aqi >= 120 ? "#d75a28" : aqi >= 100 ? "#bd8420" : "#398b69";
export default function PollutionLayer({locations, onSelect}: {locations: MapLocation[]; onSelect: (location: MapLocation) => void}) {return <>{locations.map(location => <Circle key={`${location.location_id}-aqi`} center={[location.latitude, location.longitude]} radius={450} pathOptions={{color: colorForAqi(location.aqi), fillColor: colorForAqi(location.aqi), fillOpacity: .12, weight: 1}} eventHandlers={{click: () => onSelect(location)}}/>)}</>}
