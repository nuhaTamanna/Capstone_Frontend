export type Condition = "Low" | "Moderate" | "High" | "Critical";
export type AlertStatus = "New" | "Acknowledged";
export interface FeatureContribution { feature: string; contribution: number }
export interface Prediction { location: string; traffic_status: Condition; pollution_status: Condition; severity: Condition; confidence: number; prediction_time: string; main_factors: string[]; feature_contributions: FeatureContribution[]; explanation: string; route_summary?: string | null }
export interface SavedRoute { id: number; name: string; origin: string; destination: string }
export interface Alert { id: number; area: string; prediction: string; severity: Condition; prediction_time: string; confidence: number; main_factors: string[]; status: AlertStatus; traffic_status: Condition; pollution_status: Condition; feature_contributions: FeatureContribution[]; explanation: string }
export interface AuthorityDashboard { monitored_areas: number; active_alerts: number; high_severity_areas: number; critical_areas: number; areas: Array<{name: string; traffic_status: Condition; pollution_status: Condition; severity: Condition}>; recent_alerts: Alert[] }
export interface MapLocation { location_id: string; name: string; latitude: number; longitude: number; traffic_level: Condition; average_speed: number; aqi: number; pollution_category: "Good" | "Moderate" | "Unhealthy for sensitive groups" | "Unhealthy"; alert_id: number | null; updated_at: string }
export interface MapStatus { overall_traffic: Condition; average_aqi: number; active_alerts: number; critical_areas: number }
export interface TrendPoint { label: string; value: number }
export interface IntelligenceSummary { prediction: string; confidence: number; primary_factor: string }
export interface MapViewport { latitude: number; longitude: number; zoom: number }
export interface GeographyOption { continent: string; country: string; state: string; locality: string; viewport: MapViewport }
export interface MapOverview { status: MapStatus; locations: MapLocation[]; traffic_trend: TrendPoint[]; pollution_trend: TrendPoint[]; prediction_summary: IntelligenceSummary; explainability_summary: IntelligenceSummary; viewport: MapViewport }
