import type { Condition } from "../../types/api";
import StatusBadge from "../StatusBadge";

interface StatusCardProps {
  title: string;
  status: Condition;
  value?: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function StatusCard({ title, status, value, subtitle, icon }: StatusCardProps) {
  return (
    <article className={`status-card status-${status.toLowerCase()}`}>
      {icon && <div className="status-icon">{icon}</div>}
      <div className="status-content">
        <span className="status-title">{title}</span>
        {value !== undefined && <div className="status-value">{value}</div>}
        <StatusBadge value={status} />
        {subtitle && <span className="status-subtitle">{subtitle}</span>}
      </div>
    </article>
  );
}
