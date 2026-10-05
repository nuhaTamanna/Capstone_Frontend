import { useState } from "react";
import type { Condition } from "../../types/api";
import StatusBadge from "../StatusBadge";

interface RouteOption {
  id: string;
  name: string;
  time: number;
  trafficStatus: Condition;
  aqi: number;
  pollutionCategory: string;
  recommended?: boolean;
}

interface RouteComparisonProps {
  routes: RouteOption[];
  onSelectRoute?: (routeId: string) => void;
}

export default function RouteComparison({ routes, onSelectRoute }: RouteComparisonProps) {
  const [optimization, setOptimization] = useState<"balanced" | "fastest" | "lowest-traffic" | "lowest-pollution">("balanced");

  return (
    <article className="route-comparison">
      <div className="route-comparison-header">
        <h3>Route Options</h3>
      </div>
      <div className="route-optimization">
        <label className="route-optimization-option">
          <input
            type="radio"
            name="optimization"
            checked={optimization === "balanced"}
            onChange={() => setOptimization("balanced")}
          />
          Balanced
        </label>
        <label className="route-optimization-option">
          <input
            type="radio"
            name="optimization"
            checked={optimization === "fastest"}
            onChange={() => setOptimization("fastest")}
          />
          Fastest
        </label>
        <label className="route-optimization-option">
          <input
            type="radio"
            name="optimization"
            checked={optimization === "lowest-traffic"}
            onChange={() => setOptimization("lowest-traffic")}
          />
          Lowest traffic
        </label>
        <label className="route-optimization-option">
          <input
            type="radio"
            name="optimization"
            checked={optimization === "lowest-pollution"}
            onChange={() => setOptimization("lowest-pollution")}
          />
          Lowest pollution
        </label>
      </div>
      <table className="route-table">
        <thead>
          <tr>
            <th>Route</th>
            <th>Time</th>
            <th>Traffic</th>
            <th>AQI</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id} className={route.recommended ? "recommended" : ""}>
              <td>
                {route.recommended && <span className="route-badge recommended">Recommended</span>}
                {route.name}
              </td>
              <td>{route.time} min</td>
              <td>
                <StatusBadge value={route.trafficStatus} />
              </td>
              <td>{route.aqi}</td>
              <td>
                {onSelectRoute && (
                  <button
                    className="button primary"
                    onClick={() => onSelectRoute(route.id)}
                    disabled={!route.recommended}
                  >
                    {route.recommended ? "Select Route" : "View"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {routes.find((r) => r.recommended) && (
        <div className="commute-recommendation">
          <div className="commute-recommendation-label">Recommended route</div>
          <div className="commute-recommendation-value">
            {routes.find((r) => r.recommended)?.name} offers the best balance of time, traffic, and air quality for your preferences.
          </div>
        </div>
      )}
    </article>
  );
}
