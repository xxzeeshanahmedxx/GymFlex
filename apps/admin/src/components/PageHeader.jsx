export function PageHeader({ title, description, actions }) {
  return (
    <header className="page-header app-page-header">
      <div className="page-header-copy">
        <span className="page-kicker">Workspace</span>
        <h1 className="page-title">{title}</h1>
        {description ? <p className="page-subtitle">{description}</p> : null}
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </header>
  );
}
