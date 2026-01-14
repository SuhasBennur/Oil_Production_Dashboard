import { useRef, useState, useMemo } from "react";
import axios from "axios";
import { useEffect } from "react";
import Dashboard from "./Pages/Dashboard.jsx";
import useAnalytics from "./hooks/useAnalytics";
import useWebSocket from "./hooks/useWebSocket";

const WS_URL = "ws://localhost:8000/ws/oil";
const API_HISTORY = "http://localhost:8000/api/history";

export default function App() {
  const [live, setLive] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [wellFilter, setWellFilter] = useState("");
  const [points, setPoints] = useState([]);
  const [latest, setLatest] = useState(null);
  const [activeTab, setActiveTab] = useState("live");

  const tableRef = useRef(null);

  // WebSocket connection using custom hook
  useWebSocket(WS_URL, (msg) => {
    if (live) {
      setLatest(msg);
      setPoints((prev) => {
        const next = [...prev, msg];
        return next.slice(-5000); // keep last 5000 points
      });
    }
  });

  // Load initial history
  useEffect(() => {
    axios.get(API_HISTORY, { params: { limit: 1000 } })
      .then((res) => setPoints(res.data))
      .catch((e) => console.error(e));
  }, []);

  // Auto-scroll table
  useEffect(() => {
    if (!autoScroll || !tableRef.current) return;
    tableRef.current.scrollTop = tableRef.current.scrollHeight;
  }, [points, autoScroll]);

  // Analytics via custom hook
  const analytics = useAnalytics();

  // Derived metrics
  const metrics = useMemo(() => {
    const last = latest || points.at(-1);
    if (!last) return { flow_rate: "-", pressure: "-", temperature: "-", well_id: "-" };
    return {
      flow_rate: last.flow_rate,
      pressure: last.pressure,
      temperature: last.temperature,
      well_id: last.well_id,
    };
  }, [latest, points]);

  const filtered = useMemo(() => {
    if (!wellFilter) return points;
    return points.filter((p) => p.well_id === wellFilter);
  }, [points, wellFilter]);

  const wellIds = useMemo(() => {
    const set = new Set(points.map((p) => p.well_id));
    return Array.from(set).sort();
  }, [points]);

  const toggleLive = () => setLive((v) => !v);
  const toggleAutoScroll = () => setAutoScroll((v) => !v);

  return (
    <Dashboard
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      live={live}
      toggleLive={toggleLive}
      wellFilter={wellFilter}
      setWellFilter={setWellFilter}
      wellIds={wellIds}
      metrics={metrics}
      filtered={filtered}
      autoScroll={autoScroll}
      toggleAutoScroll={toggleAutoScroll}
      tableRef={tableRef}
      analytics={analytics}
    />
  );
}