import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function LiveChart({ data }) {
  return (
    <div className="card" style={{ marginTop: 12, height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.slice(-1000)}>
          <XAxis dataKey="timestamp" hide />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="flow_rate" stroke="#2563eb" dot={false} name="Flow rate" />
          <Line type="monotone" dataKey="pressure" stroke="#ef4444" dot={false} name="Pressure" />
          <Line type="monotone" dataKey="temperature" stroke="#10b981" dot={false} name="Temperature" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}