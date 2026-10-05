import type { Condition } from "../types/api";
export default function StatusBadge({value}: {value: Condition}) { return <span className={`badge ${value.toLowerCase()}`}>{value}</span>; }
