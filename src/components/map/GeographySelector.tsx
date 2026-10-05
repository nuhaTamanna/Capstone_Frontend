import { useEffect, useMemo, useState } from "react";
import type { GeographyOption } from "../../types/api";

export interface GeographicScope { continent: string; country: string; state: string; locality: string }

const emptyScope: GeographicScope = { continent: "Asia", country: "India", state: "", locality: "" };
const unique = (items: string[]) => [...new Set(items)];

export default function GeographySelector({ options, onChange }: { options: GeographyOption[]; onChange: (scope: GeographicScope) => void }) {
  const [scope, setScope] = useState<GeographicScope>(emptyScope);
  const states = useMemo(() => unique(options.filter((option) => option.country === "India").map((option) => option.state)), [options]);
  const localities = useMemo(() => unique(options.filter((option) => option.country === "India" && option.state === scope.state).map((option) => option.locality)), [options, scope.state]);

  useEffect(() => {
    if (scope.state || scope.locality) onChange(scope);
  }, [onChange, scope]);

  return <div className="geography-selector" aria-label="India map location selector"><div className="geography-context"><span>Country</span><strong>India</strong></div><label>State / Union Territory<select value={scope.state} onChange={(event) => setScope({ ...emptyScope, state: event.target.value })}><option value="">Select State / Union Territory</option>{states.map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label>City / Town / Locality<select value={scope.locality} disabled={!scope.state} onChange={(event) => setScope({ ...scope, locality: event.target.value })}><option value="">Select City / Town / Locality</option>{localities.map((value) => <option key={value} value={value}>{value}</option>)}</select></label></div>;
}
