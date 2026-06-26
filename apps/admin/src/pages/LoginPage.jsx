import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { user, login, loading } = useAuth();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!loading && user) {
    return <Navigate to="/products" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(password);
    } catch (submitError) {
      setError(submitError.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page app-auth-page">
      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />
      <div className="store-auth-card app-auth-card">
        <div className="app-auth-mark" aria-hidden="true" />
        <div className="store-auth-header">
          <span className="page-kicker">Secure access</span>
          <h1>Admin Panel</h1>
          <p>Manage products, orders, images, and store settings.</p>
        </div>

        <form className="store-form" onSubmit={handleSubmit}>
          <label>
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required />
          </label>
          {error ? <div className="store-error-box">{error}</div> : null}
          <button className="store-primary-button" type="submit" disabled={submitting}>
            <LockKeyhole size={16} />
            {submitting ? 'Signing in...' : 'Open Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}
