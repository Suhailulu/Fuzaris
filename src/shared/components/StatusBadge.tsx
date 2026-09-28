// StatusBadge — renders a styled badge for any status value
export default function StatusBadge({ status, type }) {
  const key = (type || status || '').toLowerCase().replace(/[\s_]/g, '-');
  return (
    <span className={`badge badge-${key}`}>
      <span className="badge-dot" />
      {status || type}
    </span>
  );
}
