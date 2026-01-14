export default function TabPanel({ value, activeTab, children }) {
  if (value !== activeTab) return null;
  return <div style={{ marginTop: 12 }}>{children}</div>;
}