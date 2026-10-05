import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PredictionResult from "../../components/PredictionResult";
import { alertService } from "../../services/services";
import type { Alert, Prediction } from "../../types/api";
export default function AlertDetails(){const {id}=useParams();const [alert,setAlert]=useState<Alert>();const [error,setError]=useState("");useEffect(()=>{if(id)alertService.get(id).then(setAlert).catch(()=>setError("This alert could not be found."));},[id]);if(error)return <p className="error">{error}</p>;if(!alert)return <p className="muted">Loading alert details…</p>;const prediction:Prediction={location:alert.area,traffic_status:alert.traffic_status,pollution_status:alert.pollution_status,severity:alert.severity,confidence:alert.confidence,prediction_time:alert.prediction_time,main_factors:alert.main_factors,feature_contributions:alert.feature_contributions,explanation:alert.explanation};return <><Link className="back" to="/authority/alerts">← Back to alerts</Link><PredictionResult prediction={prediction}/></>;}
