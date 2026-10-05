import type { Condition } from "../../types/api";

interface TimelinePoint {
  label: string;
  value: number;
  status: Condition;
}

interface PredictionTimelineProps {
  title: string;
  data: TimelinePoint[];
}

export default function PredictionTimeline({ title, data }: PredictionTimelineProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <article className="prediction-timeline">
      <div className="timeline-header">
        <h3>{title}</h3>
      </div>
      <div className="timeline-bars">
        {data.map((point, index) => (
          <div
            key={index}
            className={`timeline-bar ${point.status.toLowerCase()}`}
            style={{ flex: 1 }}
          >
            <div
              className="timeline-bar-fill"
              style={{ height: `${(point.value / maxValue) * 100}%` }}
            />
            <span className="timeline-value">{point.value}</span>
          </div>
        ))}
      </div>
      <div className="timeline-labels" style={{ display: "flex", gap: "8px" }}>
        {data.map((point, index) => (
          <div key={index} className="timeline-label" style={{ flex: 1 }}>
            {point.label}
          </div>
        ))}
      </div>
    </article>
  );
}
