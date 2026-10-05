import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import MapControls, { type LayerState } from "./MapControls";
import MapLegend from "./MapLegend";
import PollutionLayer from "./PollutionLayer";
import TrafficLayer from "./TrafficLayer";
import AlertLayer from "./AlertLayer";
import type { MapLocation, MapViewport } from "../../types/api";
function ViewportController({viewport}: {
    viewport: MapViewport
}
) {
    const map=useMap();useEffect(()=>{
        map.setView(
            [
                viewport.latitude,viewport.longitude
            ],viewport.zoom);
        },
        [
            map,viewport
        ]
    );
    return null
}
export default function UrbanMap(
    {
        locations, viewport, onSelect}: {
            locations: MapLocation[]; 
            viewport: MapViewport; 
            onSelect: (location: MapLocation) => void
        }
    ) 
    {
        const [layers,setLayers]=useState<LayerState>(
            {
                traffic:true,pollution:true,alerts:true
            }
        );
        return <section className="urban-map" aria-label="Urban intelligence map">
            <MapContainer center={
                [
                    viewport.latitude,viewport.longitude
                ]
            } zoom={viewport.zoom} scrollWheelZoom className="leaflet-map">
            <ViewportController viewport={viewport}/>
            <TileLayer attribution="© OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            {
                layers.pollution && <PollutionLayer locations={locations} onSelect={onSelect}/>
            } 
            {
                layers.traffic && <TrafficLayer locations={locations} onSelect={onSelect}/>
            }
            {layers.alerts && <AlertLayer locations={locations.filter((location) => location.alert_id !== null)} onSelect={onSelect}/>} 
            </MapContainer>
            <MapControls layers={layers} onChange={setLayers}/>
            <MapLegend/>
            </section>
            }
