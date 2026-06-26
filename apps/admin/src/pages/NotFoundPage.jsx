import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="eyebrow">404</span>
        <h1>Page not found</h1>
        <p>The page you requested does not exist in this admin panel.</p>
        <Link className="button button-primary" to="/">Go to dashboard</Link>
      </div>
    </div>
  );
}
