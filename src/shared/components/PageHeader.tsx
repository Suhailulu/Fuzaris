import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// PageHeader — consistent header with breadcrumb for every page
export default function PageHeader({ breadcrumbs, title, subtitle, actions }) {
  return (
    <div className="page-header animate-fade-in">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="page-breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {i > 0 && <ChevronRight size={12} className="page-breadcrumb-sep" />}
              {crumb.to ? (
                <Link to={crumb.to}>{crumb.label}</Link>
              ) : (
                <span className="page-breadcrumb-current">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      )}
      <div className="page-header-top">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="flex-gap-sm">{actions}</div>}
      </div>
    </div>
  );
}
