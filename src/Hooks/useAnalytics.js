import { useEffect, useState } from "react";
import axios from "axios";

const API_ANALYTICS = "http://localhost:8000/api/analytics";

export default function useAnalytics(intervalMs = 5000) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = () => {
      axios.get(API_ANALYTICS)
        .then(res => setAnalytics(res.data))
        .catch(e => console.error(e));
    };
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return analytics;
}