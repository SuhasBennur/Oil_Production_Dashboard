import { useEffect, useRef } from "react";

export default function useWebSocket(url, onMessage, onClose) {
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (evt) => {
      if (onMessage) onMessage(JSON.parse(evt.data));
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      if (onClose) onClose();
    };

    return () => ws.close();
  }, [url, onMessage, onClose]);

  return wsRef;
}