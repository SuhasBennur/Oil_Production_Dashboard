import LiveControls from "../components/Live/LiveControls";
import LiveMetrics from "../components/Live/LiveMetrics";
import LiveChart from "../components/Live/LiveChart";
import HistoryTable from "../components/History/HistoryTable";
import AnalyticsSummary from "../components/Analytics/AnalyticsSummary";
import AnalyticsChart from "../components/Analytics/AnalyticsChart";
import Tabs from "../components/Tabs/Tabs";
import TabPanel from "../components/Tabs/TabPanel";

export default function Dashboard({
  activeTab, setActiveTab,
  live, toggleLive,
  wellFilter, setWellFilter, wellIds,
  metrics, filtered,
  autoScroll, toggleAutoScroll, tableRef,
  analytics
}) {
  // Define tab items once
  const tabItems = [
    { value: "live", label: "Live Data" },
    { value: "history", label: "Historical Data" },
    { value: "analytics", label: "Analytics" },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h1>Oil Production Dashboard</h1>

      {/* Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabItems} />

      {/* Live Tab */}
      <TabPanel value="live" activeTab={activeTab}>
        <LiveControls
          live={live}
          toggleLive={toggleLive}
          wellFilter={wellFilter}
          setWellFilter={setWellFilter}
          wellIds={wellIds}
        />
        <LiveMetrics metrics={metrics} />
        <LiveChart data={filtered} />
      </TabPanel>

      {/* History Tab */}
      <TabPanel value="history" activeTab={activeTab}>
        <HistoryTable
          filtered={filtered}
          autoScroll={autoScroll}
          toggleAutoScroll={toggleAutoScroll}
          tableRef={tableRef}
          wellFilter={wellFilter}
          setWellFilter={setWellFilter}
          wellIds={wellIds}
        />
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value="analytics" activeTab={activeTab}>
        {analytics && (
          <div className="card" style={{ marginTop: 12 }}>
            <h3>Analytics</h3>
            <AnalyticsSummary analytics={analytics} />
            <AnalyticsChart byWell={analytics.by_well} />
          </div>
        )}
      </TabPanel>
    </div>
  );
}