export default function HistoryTable({ filtered, autoScroll, toggleAutoScroll, tableRef, wellFilter, setWellFilter, wellIds }) {
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Historical data</h3>
        <select className="input" value={wellFilter} onChange={(e) => setWellFilter(e.target.value)}>
          <option value="">All Wells</option>
          {wellIds.map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <button style={{ blockSize: 24, marginBottom: 4 }} className="btn secondary" onClick={toggleAutoScroll}>
            {autoScroll ? "Disable" : "Enable"} Auto-Scroll
          </button>
          <small>Scroll to view older records</small>
        </div>
      </div>
      <div ref={tableRef} style={{ maxHeight: 300, overflowY: "auto", marginTop: 8 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Timestamp (UTC)</th>
              <th>Well</th>
              <th>Flow rate</th>
              <th>Pressure</th>
              <th>Temperature</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => (
              <tr key={`${p.timestamp}-${idx}`}>
                <td>{p.timestamp}</td>
                <td>{p.well_id}</td>
                <td>{p.flow_rate}</td>
                <td>{p.pressure}</td>
                <td>{p.temperature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}