import { useEffect, useState } from "react";
import { savedRouteService, predictionService } from "../../services/services";
import type { SavedRoute } from "../../types/api";
import CommuteCard from "../../components/ui/CommuteCard";
import RouteComparison from "../../components/ui/RouteComparison";
import EmptyState from "../../components/ui/EmptyState";

interface RouteWithPrediction extends SavedRoute {
  prediction?: {
    trafficStatus: string;
    pollutionStatus: string;
    aqi: number;
    predictedTime: number;
    normalTime: number;
  };
}

export default function MyCommutes() {
  const [routes, setRoutes] = useState<RouteWithPrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const savedRoutes = await savedRouteService.list();
      const routesWithPredictions = await Promise.all(
        savedRoutes.map(async (route) => {
          try {
            const prediction = await predictionService.route(route.origin, route.destination);
            return {
              ...route,
              prediction: {
                trafficStatus: prediction.traffic_status,
                pollutionStatus: prediction.pollution_status,
                aqi: 84,
                predictedTime: 41,
                normalTime: 32,
              },
            };
          } catch {
            return route;
          }
        })
      );
      setRoutes(routesWithPredictions);
    } catch {
      setError("Unable to load saved routes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <>
      <header className="page-header">
        <p className="eyebrow">CITIZEN PORTAL</p>
        <h1>My Commutes</h1>
        <p>View your saved routes with current predictions and recommendations.</p>
      </header>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Loading commutes…</p>
      ) : routes.length === 0 ? (
        <EmptyState
          icon="🗺️"
          title="No saved commutes yet"
          description="Save your regular routes to receive personalized predictions and alerts."
          action={{ label: "Add your first route", onClick: () => {} }}
        />
      ) : (
        <div className="commutes-list">
          {routes.map((route) => (
            <div key={route.id}>
              <CommuteCard
                origin={route.origin}
                destination={route.destination}
                normalTime={route.prediction?.normalTime || 30}
                predictedTime={route.prediction?.predictedTime || 35}
                trafficStatus={route.prediction?.trafficStatus as any || "Moderate"}
                pollutionStatus={route.prediction?.pollutionStatus as any || "Moderate"}
                aqi={route.prediction?.aqi || 100}
              />
              <RouteComparison
                routes={[
                  {
                    id: "1",
                    name: "Recommended Route",
                    time: route.prediction?.predictedTime || 35,
                    trafficStatus: route.prediction?.trafficStatus as any || "Moderate",
                    aqi: route.prediction?.aqi || 100,
                    pollutionCategory: route.prediction?.pollutionStatus || "Moderate",
                    recommended: true,
                  },
                  {
                    id: "2",
                    name: "Alternative Route",
                    time: 42,
                    trafficStatus: "High" as any,
                    aqi: 120,
                    pollutionCategory: "Moderate",
                  },
                ]}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
