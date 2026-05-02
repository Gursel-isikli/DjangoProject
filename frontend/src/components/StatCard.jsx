export default function StatCard({
  title,
  value,
  icon,
  color = "primary",
}) {
  return (
    <div className="card border-0 shadow-sm h-100 rounded-4">

      <div className="card-body d-flex justify-content-between align-items-center">

        <div>
          <p className="text-muted mb-2 small fw-semibold">
            {title}
          </p>

          <h4 className="fw-bold mb-0">
            {value}
          </h4>

          <small className={`text-${color}`}>
            Live Daten
          </small>
        </div>

        <div
          className={`bg-${color} bg-opacity-10 text-${color} rounded-4 d-flex align-items-center justify-content-center`}
          style={{
            width: "58px",
            height: "58px",
            fontSize: "22px",
          }}
        >
          <i className={icon}></i>
        </div>

      </div>

    </div>
  );
}