import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function AnalyticsChart({ byWell }) {
  const data = Object.entries(byWell).map(([well, total]) => ({ well, total }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="well" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#10b981" name="Total Flow" />
      </BarChart>
    </ResponsiveContainer>
  );
}