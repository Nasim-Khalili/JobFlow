export default function ProgressBar({ value }: { value: number }) {
  const progress = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-wrap" aria-label={`${progress}% complete`}>
      <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      <strong>{progress}%</strong>
    </div>
  );
}
