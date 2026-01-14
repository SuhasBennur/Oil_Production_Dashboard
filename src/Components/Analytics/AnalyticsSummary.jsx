export default function AnalyticsSummary({ analytics }) {
  return (
    <>
      <p>Highest Flow Rate: {analytics.max_flow}</p>
      <p>Average Pressure: {analytics.avg_pressure}</p>
      <p>Average Temperature: {analytics.avg_temperature}</p>
    </>
  );
}