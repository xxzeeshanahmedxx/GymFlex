export function LoadingScreen({ label = 'Loading admin...' }) {
  return (
    <div className="loading-screen">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}
