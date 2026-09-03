export function LoadingState({ label = "Loading" }: { label?: string }) {
  return <div className="page-state"><span className="spinner" />{label}</div>;
}

export function ErrorState({ message }: { message: string }) {
  return <div className="alert alert-error">{message}</div>;
}

export function EmptyState({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="empty-state"><div className="empty-mark">+</div><h3>{title}</h3><p>{children}</p></div>;
}
