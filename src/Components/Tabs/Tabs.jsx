export default function Tabs({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="tabs" style={{ marginTop: 12 }}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setActiveTab(tab.value)}
          className={activeTab === tab.value ? "btn active" : "btn"}
          style={{ marginRight: 8 }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}