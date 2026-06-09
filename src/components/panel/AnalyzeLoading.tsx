import { useUIStore } from '../../stores/useUIStore';

export function AnalyzeLoading() {
  const isAnalyzing = useUIStore((s) => s.isAnalyzing);
  const progress = useUIStore((s) => s.analyzeProgress);

  if (!isAnalyzing) return null;

  return (
    <div className="analyze-loading">
      <p className="analyze-loading-label">AI 辨識中…</p>
      <div className="analyze-loading-bar">
        <div className="analyze-loading-fill" style={{ width: `${progress}%` }} />
      </div>
      <span className="analyze-loading-percent">{progress}%</span>
    </div>
  );
}
