import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function AdminBreadcrumbs({ items }) {
  return (
    <nav className="admin-breadcrumbs">
      <Link to="/" className="admin-breadcrumb-link">Dashboard</Link>
      {items.map((item, i) => (
        <span key={i} className="admin-breadcrumb-item">
          <ChevronRight size={12} />
          {item.href ? (
            <Link to={item.href} className="admin-breadcrumb-link">{item.label}</Link>
          ) : (
            <span className="admin-breadcrumb-current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
