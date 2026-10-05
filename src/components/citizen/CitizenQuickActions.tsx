import { createContext, useContext, useState, type FormEvent, type ReactNode } from "react";
import { predictionService } from "../../services/services";
import type { Prediction } from "../../types/api";

type ActiveAction = "condition" | "route" | null;
type CitizenQueryContextValue = { result: Prediction | undefined; error: string; activeAction: ActiveAction; setActiveAction: (action: ActiveAction) => void; location: string; setLocation: (value: string) => void; datetime: string; setDatetime: (value: string) => void; origin: string; setOrigin: (value: string) => void; destination: string; setDestination: (value: string) => void; loading: boolean; checkCondition: () => void; checkRoute: () => void };
const CitizenQueryContext = createContext<CitizenQueryContextValue | undefined>(undefined);

export function CitizenQueryProvider({ children }: { children: ReactNode }) {
  const [activeAction, setActiveAction] = useState<ActiveAction>(null); const [location, setLocation] = useState(""); const [datetime, setDatetime] = useState(""); const [origin, setOrigin] = useState(""); const [destination, setDestination] = useState(""); const [result, setResult] = useState<Prediction>(); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const execute = async (request: () => Promise<Prediction>) => { setError(""); setLoading(true); try { setResult(await request()); } catch { setError("We could not reach the prediction service. Ensure the FastAPI server is running."); } finally { setLoading(false); } };
  const checkCondition = () => { if (location.trim()) void execute(() => predictionService.location(location, datetime)); };
  const checkRoute = () => { if (origin.trim() && destination.trim()) void execute(() => predictionService.route(origin, destination, datetime)); };
  return <CitizenQueryContext.Provider value={{ result, error, activeAction, setActiveAction, location, setLocation, datetime, setDatetime, origin, setOrigin, destination, setDestination, loading, checkCondition, checkRoute }}>{children}</CitizenQueryContext.Provider>;
}

// This hook is intentionally colocated with its provider so the Citizen-only
// action state is not exposed to the Authority portal.
// eslint-disable-next-line react-refresh/only-export-components
export function useCitizenQueries() { const context = useContext(CitizenQueryContext); if (!context) throw new Error("Citizen queries must be used inside CitizenQueryProvider"); return context; }

export default function CitizenQuickActions() {
  const query = useCitizenQueries(); const toggle = (action: Exclude<ActiveAction, null>) => query.setActiveAction(query.activeAction === action ? null : action);
  return <section className="citizen-quick-actions"><p className="sidebar-section-title">Quick actions</p><button type="button" className={`sidebar-action ${query.activeAction === "condition" ? "active" : ""}`} onClick={() => toggle("condition")}>Quick condition check</button><button type="button" className={`sidebar-action ${query.activeAction === "route" ? "active" : ""}`} onClick={() => toggle("route")}>Route query</button>{query.activeAction === "condition" && <form className="sidebar-action-form" onSubmit={(event: FormEvent) => { event.preventDefault(); query.checkCondition(); }}><label>Location<input required value={query.location} onChange={event => query.setLocation(event.target.value)} placeholder="e.g. Rajagiriya" /></label><label>Date and time <em>optional</em><input type="datetime-local" value={query.datetime} onChange={event => query.setDatetime(event.target.value)} /></label><button disabled={query.loading}>{query.loading ? "Checking…" : "Check conditions"}</button></form>}{query.activeAction === "route" && <form className="sidebar-action-form" onSubmit={(event: FormEvent) => { event.preventDefault(); query.checkRoute(); }}><label>From<input required value={query.origin} onChange={event => query.setOrigin(event.target.value)} placeholder="Origin" /></label><label>To<input required value={query.destination} onChange={event => query.setDestination(event.target.value)} placeholder="Destination" /></label><label>Date and time <em>optional</em><input type="datetime-local" value={query.datetime} onChange={event => query.setDatetime(event.target.value)} /></label><button disabled={query.loading}>{query.loading ? "Checking…" : "Check route"}</button></form>}</section>;
}
