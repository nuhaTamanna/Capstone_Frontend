import type { FeatureContribution } from "../../types/api";

interface AIExplanationProps {
  title: string;
  factors: FeatureContribution[];
  mainFactor: string;
}

export default function AIExplanation({ title, factors, mainFactor }: AIExplanationProps) {
  const maxValue = Math.max(...factors.map((f) => f.contribution));

  return (
    <article className="ai-explanation">
      <div className="explanation-header">
        <span>🤖</span>
        <h3>{title}</h3>
      </div>
      <div className="explanation-factors">
        {factors.map((factor, index) => (
          <div key={index} className="explanation-factor">
            <span className="explanation-factor-label">{factor.feature}</span>
            <div className="explanation-factor-bar">
              <div
                className="explanation-factor-fill"
                style={{ width: `${(factor.contribution / maxValue) * 100}%` }}
              />
            </div>
            <span className="explanation-factor-value">{Math.round(factor.contribution * 100)}%</span>
          </div>
        ))}
      </div>
      <div className="explanation-main">
        <div className="explanation-main-label">Main contributing factor</div>
        <div className="explanation-main-value">{mainFactor}</div>
      </div>
    </article>
  );
}
