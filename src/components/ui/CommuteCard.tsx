import type { Condition } from "../../types/api";
import StatusBadge from "../StatusBadge";

interface CommuteCardProps {
  origin: string;
  destination: string;
  normalTime: number;
  predictedTime: number;
  trafficStatus: Condition;
  pollutionStatus: Condition;
  aqi: number;
  recommendedDeparture?: string;
  onFindBetterRoute?: () => void;
}

export default function CommuteCard({
  origin,
  destination,
  normalTime,
  predictedTime,
  trafficStatus,
  pollutionStatus,
  aqi,
  recommendedDeparture,
  onFindBetterRoute,
}: CommuteCardProps) {
  const timeChange = predictedTime - normalTime;
  const timeChangePercent = Math.round((timeChange / normalTime) * 100);

  return (
    <article className="commute-card">
      <div className="commute-header">
        <h3 className="commute-title">Your commute</h3>
      </div>
      <div className="commute-route">
        <span>🏠</span>
        <span>{origin}</span>
        <span>→</span>
        <span>💼</span>
        <span>{destination}</span>
      </div>
      <div className="commute-stats">
        <div className="commute-stat">
          <div className="commute-stat-label">Normal travel time</div>
          <div className="commute-stat-value">{normalTime} min</div>
        </div>
        <div className="commute-stat">
          <div className="commute-stat-label">Predicted today</div>
          <div className="commute-stat-value">{predictedTime} min</div>
          <div className={`commute-stat-change ${timeChange > 0 ? "up" : "down"}`}>
            {timeChange > 0 ? "↑" : "↓"} {Math.abs(timeChangePercent)}%
          </div>
        </div>
        <div className="commute-stat">
          <div className="commute-stat-label">Traffic</div>
          <StatusBadge value={trafficStatus} />
        </div>
        <div className="commute-stat">
          <div className="commute-stat-label">Pollution</div>
          <StatusBadge value={pollutionStatus} />
        </div>
        <div className="commute-stat">
          <div className="commute-stat-label">AQI</div>
          <div className="commute-stat-value">{aqi}</div>
        </div>
        {recommendedDeparture && (
          <div className="commute-stat">
            <div className="commute-stat-label">Recommended departure</div>
            <div className="commute-stat-value">{recommendedDeparture}</div>
          </div>
        )}
      </div>
      {onFindBetterRoute && (
        <button className="button secondary" onClick={onFindBetterRoute}>
          Find Better Route
        </button>
      )}
    </article>
  );
}
