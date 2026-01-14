export default function LiveControls({ live, toggleLive, wellFilter, setWellFilter, wellIds }) {
  return (
    <div className="row" style={{ marginTop: 12 }}>
      <button className="btn" onClick={toggleLive}>{live ? "Pause" : "Resume"} Live</button>
      <select className="input" value={wellFilter} onChange={(e) => setWellFilter(e.target.value)}>
        <option value="">All Wells</option>
        {wellIds.map((id) => (
          <option key={id} value={id}>{id}</option>
        ))}
      </select>
    </div>
  );
}