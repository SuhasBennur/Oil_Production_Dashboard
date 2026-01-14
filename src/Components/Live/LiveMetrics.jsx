export default function LiveMetrics({ metrics }) {
  return (
    <div className="row" style={{ marginTop: 12 }}>
      <div className="card"><div>Well</div><div style={{ fontSize: 24, fontWeight: "bold" }}>{metrics.well_id}</div></div>
      <div className="card"><div>Flow rate (bbl/d)</div><div style={{ fontSize: 24, fontWeight: "bold" }}>{metrics.flow_rate}</div></div>
      <div className="card"><div>Pressure (psi)</div><div style={{ fontSize: 24, fontWeight: "bold" }}>{metrics.pressure}</div></div>
      <div className="card"><div>Temperature (°C)</div><div style={{ fontSize: 24, fontWeight: "bold" }}>{metrics.temperature}</div></div>
    </div>
  );
}