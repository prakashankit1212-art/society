import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../components/AppShell";
import Icon from "../../components/Icon";
import { getComplaints, getStaff, getResidents, getNotices } from "../../data/store";
import "./Phase2.css";

const STATUS_KEYS = ["Resolved", "In Progress", "Under Review"];
const CATEGORY_OPTIONS = ["All Categories", "Maintenance", "Security", "Electricity", "Cleanliness", "Parking"];
const BLOCK_OPTIONS = ["All Blocks", "A", "B", "C"];
const PERIOD_OPTIONS = [
  { value: "3m", label: "Last 3 months" },
  { value: "6m", label: "Last 6 months" },
  { value: "12m", label: "Last 12 months" },
  { value: "year", label: "This year" },
  { value: "custom", label: "Custom range" },
];

function parseDate(value) {
  if (!value) return null;
  const normalized = String(value).replace(" · ", " ");
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(date) {
  return date.toLocaleDateString("en-US", { month: "short" });
}

function buildMonthBuckets(start, end) {
  const buckets = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const last = new Date(end.getFullYear(), end.getMonth(), 1);
  while (cursor <= last) {
    buckets.push({
      key: monthKey(cursor),
      label: monthLabel(cursor),
      total: 0,
      statuses: { Resolved: 0, "In Progress": 0, "Under Review": 0 },
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return buckets;
}

function buildResolutionData(complaints) {
  return complaints
    .map((complaint) => {
      if (complaint.status !== "Resolved") return null;
      const submitted = parseDate(complaint.timeline?.[0]?.time || complaint.createdAt);
      const resolvedStep = complaint.timeline?.find((step) => step.label === "Resolved");
      const resolved = parseDate(resolvedStep?.time || complaint.resolvedAt);
      if (!submitted || !resolved) return null;
      return Math.max(0.1, (resolved - submitted) / 86400000);
    })
    .filter(Boolean);
}

function getPeriodRange(period, customStart, customEnd) {
  const now = new Date();
  const today = endOfDay(now);
  if (period === "custom") {
    const start = customStart ? startOfDay(new Date(`${customStart}T00:00:00`)) : new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const end = customEnd ? endOfDay(new Date(`${customEnd}T00:00:00`)) : today;
    return start <= end ? { start, end } : { start: endOfDay(new Date(end)), end: startOfDay(new Date(start)) };
  }
  if (period === "year") return { start: new Date(now.getFullYear(), 0, 1), end: today };
  const months = period === "12m" ? 11 : period === "6m" ? 5 : 2;
  return { start: new Date(now.getFullYear(), now.getMonth() - months, 1), end: today };
}

function formatRange(start, end) {
  const sameYear = start.getFullYear() === end.getFullYear();
  const startText = start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: sameYear ? undefined : "numeric" });
  const endText = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${startText} – ${endText}`;
}

export default function PresidentAnalytics() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState(() => getComplaints());
  const [staff, setStaff] = useState(() => getStaff());
  const [residents, setResidents] = useState(() => getResidents());
  const [notices, setNotices] = useState(() => getNotices());
  const [period, setPeriod] = useState("6m");
  const [category, setCategory] = useState("All Categories");
  const [block, setBlock] = useState("All Blocks");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  useEffect(() => {
    const refresh = () => {
      setComplaints(getComplaints());
      setStaff(getStaff());
      setResidents(getResidents());
      setNotices(getNotices());
    };
    window.addEventListener("societyconnect:update", refresh);
    return () => window.removeEventListener("societyconnect:update", refresh);
  }, []);

  const range = useMemo(() => getPeriodRange(period, customStart, customEnd), [period, customStart, customEnd]);

  const periodComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const date = parseDate(complaint.createdAt || complaint.date);
      if (!date || date < range.start || date > range.end) return false;
      if (category !== "All Categories" && complaint.category !== category) return false;
      if (block !== "All Blocks" && complaint.block !== block) return false;
      return true;
    });
  }, [complaints, range, category, block]);

  const previousRange = useMemo(() => {
    const duration = range.end.getTime() - range.start.getTime();
    return {
      start: new Date(range.start.getTime() - duration),
      end: new Date(range.start.getTime() - 1),
    };
  }, [range]);

  const previousPeriodTotal = useMemo(() => complaints.filter((complaint) => {
    const date = parseDate(complaint.createdAt || complaint.date);
    if (!date || date < previousRange.start || date > previousRange.end) return false;
    if (category !== "All Categories" && complaint.category !== category) return false;
    if (block !== "All Blocks" && complaint.block !== block) return false;
    return true;
  }).length, [complaints, previousRange, category, block]);

  const periodDelta = previousPeriodTotal > 0
    ? Math.round(((periodComplaints.length - previousPeriodTotal) / previousPeriodTotal) * 100)
    : (periodComplaints.length > 0 ? null : 0);

  const analytics = useMemo(() => {
    const source = periodComplaints;
    const total = source.length;
    const resolved = source.filter((c) => c.status === "Resolved").length;
    const active = source.filter((c) => c.status !== "Resolved").length;
    const categories = {};
    source.forEach((c) => { categories[c.category] = (categories[c.category] || 0) + 1; });
    const statuses = {};
    source.forEach((c) => { statuses[c.status] = (statuses[c.status] || 0) + 1; });
    return { total, resolved, active, categories, statuses };
  }, [periodComplaints]);

  const monthlyTrend = useMemo(() => {
    const buckets = buildMonthBuckets(range.start, range.end);
    periodComplaints.forEach((complaint) => {
      const date = parseDate(complaint.createdAt || complaint.date);
      if (!date) return;
      const bucket = buckets.find((item) => item.key === monthKey(date));
      if (!bucket) return;
      bucket.total += 1;
      if (bucket.statuses[complaint.status] !== undefined) bucket.statuses[complaint.status] += 1;
    });
    return buckets.slice(-12);
  }, [periodComplaints, range]);

  const resolutionValues = useMemo(() => buildResolutionData(periodComplaints), [periodComplaints]);
  const avgResolution = resolutionValues.length
    ? resolutionValues.reduce((sum, value) => sum + value, 0) / resolutionValues.length
    : 0;

  const maxMonth = Math.max(1, ...monthlyTrend.map((item) => item.total));
  const averageMonth = monthlyTrend.length ? monthlyTrend.reduce((sum, item) => sum + item.total, 0) / monthlyTrend.length : 0;
  const peakMonth = monthlyTrend.reduce((best, item) => item.total > best.total ? item : best, monthlyTrend[0] || { total: 0, label: "—" });

  const staffRows = useMemo(
    () => staff
      .map((member) => ({
        ...member,
        total: periodComplaints.filter((item) => item.assignedStaffId === member.id).length,
        open: periodComplaints.filter((item) => item.assignedStaffId === member.id && item.status !== "Resolved").length,
      }))
      .sort((a, b) => b.open - a.open || b.total - a.total),
    [staff, periodComplaints]
  );

  const priorityRows = ["High", "Medium", "Low"].map((priority) => ({
    label: priority,
    value: periodComplaints.filter((item) => item.priority === priority).length,
  }));
  const blockRows = ["A", "B", "C"].map((blockName) => ({
    label: `Block ${blockName}`,
    value: periodComplaints.filter((item) => item.block === blockName).length,
  }));
  const maxBlock = Math.max(1, ...blockRows.map((row) => row.value));
  const highPriorityOpen = periodComplaints.filter((item) => item.priority === "High" && item.status !== "Resolved").length;
  const unassigned = periodComplaints.filter((item) => !item.assignedStaffId).length;
  const publishedNotices = notices.filter((item) => item.status === "Published").length;
  const activeResidents = residents.filter((item) => item.status === "Active").length;
  const resolutionRate = analytics.total ? Math.round((analytics.resolved / analytics.total) * 100) : 0;
  const residentReach = residents.length
    ? Math.round((new Set(periodComplaints.map((c) => c.residentId).filter(Boolean)).size / residents.length) * 100)
    : 0;

  const openComplaintsForFilter = (query = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
    });
    navigate(`/president/complaints${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handlePeriodChange = (value) => {
    setPeriod(value);
    if (value !== "custom") {
      setCustomStart("");
      setCustomEnd("");
    }
  };

  const selectedRangeLabel = formatRange(range.start, range.end);

  return (
    <AppShell role="president" active="analytics">
      <div className="page-head analytics-hero">
        <div>
          <div className="eyebrow">Society intelligence</div>
          <h1>Analytics</h1>
          <p>Understand what is happening across complaints, residents, staff, and society operations.</p>
        </div>
        <div className="analytics-hero-side">
          <div className="analytics-period"><Icon name="calendar" size={13}/> {selectedRangeLabel}</div>
          <button className="btn btn-secondary" onClick={() => navigate("/president/complaints")}><Icon name="clipboard" size={14}/> View complaints</button>
        </div>
      </div>

      <section className="analytics-control-bar surface">
        <div className="analytics-control-group">
          <label>Period</label>
          <select className="select" value={period} onChange={(e) => handlePeriodChange(e.target.value)}>
            {PERIOD_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
        <div className="analytics-control-group">
          <label>Category</label>
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div className="analytics-control-group">
          <label>Block</label>
          <select className="select" value={block} onChange={(e) => setBlock(e.target.value)}>
            {BLOCK_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        {period === "custom" && <>
          <div className="analytics-control-group"><label>From</label><input className="input" type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} /></div>
          <div className="analytics-control-group"><label>To</label><input className="input" type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} /></div>
        </>}
        <div className="analytics-control-result"><strong>{analytics.total}</strong><span>complaints in view</span></div>
      </section>

      <section className="analytics-kpi-grid">
        <div className="analytics-kpi primary"><span className="analytics-kpi-label">Total complaints</span><strong>{analytics.total}</strong><small>{selectedRangeLabel}</small><span className={`analytics-kpi-trend ${periodDelta !== null && periodDelta > 0 ? "warning" : "positive"}`}>{periodDelta === null ? "No previous-period data" : `${periodDelta >= 0 ? "+" : ""}${periodDelta}% vs previous period`}</span></div>
        <div className="analytics-kpi"><span className="analytics-kpi-label">Resolution rate</span><strong>{resolutionRate}%</strong><small>{analytics.resolved} resolved of {analytics.total}</small><span className={`analytics-kpi-trend ${resolutionRate >= 90 ? "positive" : "warning"}`}>Target: 90%</span></div>
        <div className="analytics-kpi"><span className="analytics-kpi-label">Avg. resolution</span><strong>{avgResolution.toFixed(1)}<em> days</em></strong><small>Based on resolved requests in view</small><span className="analytics-kpi-trend">Faster is better</span></div>
        <div className="analytics-kpi"><span className="analytics-kpi-label">Open work</span><strong>{analytics.active}</strong><small>Needs team attention</small><span className={`analytics-kpi-trend ${highPriorityOpen ? "warning" : "positive"}`}>{highPriorityOpen ? `${highPriorityOpen} high priority` : "No urgent open items"}</span></div>
      </section>

      <div className="analytics-grid analytics-grid-v2">
        <section className="surface analytics-card trend-card">
          <div className="analytics-card-head">
            <div><div className="eyebrow">Demand</div><h2>Complaint volume</h2><p>Monthly submissions across the selected view</p></div>
            <span className="analytics-inline-stat"><strong>{analytics.total}</strong> total</span>
          </div>
          <div className="trend-legend"><span><i className="legend-dot resolved"/>Resolved</span><span><i className="legend-dot progress"/>In progress</span><span><i className="legend-dot review"/>Under review</span></div>
          <div className="trend-chart" aria-label="Complaint volume by month">
            <div className="trend-y-labels"><span>{maxMonth}</span><span>{Math.ceil(maxMonth / 2)}</span><span>0</span></div>
            <div className="trend-columns" style={{ "--trend-count": monthlyTrend.length }}>
              <div className="trend-average-line" style={{ bottom: `${averageMonth ? (averageMonth / maxMonth) * 100 : 0}%` }}><span>Avg {averageMonth.toFixed(1)}</span></div>
              {monthlyTrend.map((item) => {
                const height = item.total === 0 ? 0 : Math.max(5, (item.total / maxMonth) * 100);
                const target = { month: item.key, category, block };
                return (
                  <button
                    type="button"
                    className={`trend-column trend-column-button ${item.key === peakMonth.key && item.total > 0 ? "peak" : ""}`}
                    key={item.key}
                    onClick={() => openComplaintsForFilter(target)}
                    title={`${item.label}: ${item.total} complaint${item.total === 1 ? "" : "s"} · ${item.statuses.Resolved} resolved · ${item.statuses["In Progress"]} in progress · ${item.statuses["Under Review"]} under review`}
                  >
                    <div className="trend-bar-wrap">
                      {item.total > 0 && <div className="trend-bar-stack" style={{ height: `${height}%` }}>
                        {STATUS_KEYS.map((statusKey) => {
                          const value = item.statuses[statusKey] || 0;
                          return value > 0 ? <span key={statusKey} className={`trend-segment ${statusKey === "Resolved" ? "resolved" : statusKey === "In Progress" ? "progress" : "review"}`} style={{ height: `${(value / item.total) * 100}%` }} /> : null;
                        })}
                        <span className="trend-total-label">{item.total}</span>
                        <span className="trend-tooltip"><strong>{item.label} 2026</strong><small>{item.total} total complaints</small><small>{item.statuses.Resolved} resolved · {item.statuses["In Progress"]} active · {item.statuses["Under Review"]} review</small></span>
                      </div>}
                    </div>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="trend-footer">
            <div><strong>{peakMonth.total}</strong><span>{peakMonth.label} peak</span></div>
            <div><strong>{averageMonth.toFixed(1)}</strong><span>monthly average</span></div>
            <button className="text-link" onClick={() => openComplaintsForFilter({ category: category !== "All Categories" ? category : "", block: block !== "All Blocks" ? block : "" })}>View filtered complaints →</button>
          </div>
        </section>

        <section className="surface analytics-card insight-card">
          <div className="eyebrow">Management signal</div>
          <h2>What needs attention?</h2>
          <div className="insight-list">
            <button onClick={() => openComplaintsForFilter({ priority: "High", category: category !== "All Categories" ? category : "", block: block !== "All Blocks" ? block : "" })} className={`insight-row ${highPriorityOpen ? "attention" : ""}`}><span className="insight-icon amber"><Icon name="alert" size={15}/></span><span><strong>{highPriorityOpen} high-priority open</strong><small>{highPriorityOpen ? "Review urgent requests first." : "No urgent requests in the queue."}</small></span><Icon name="chevron" size={15}/></button>
            <button onClick={() => openComplaintsForFilter({ assigned: "unassigned" })} className={`insight-row ${unassigned ? "attention" : ""}`}><span className="insight-icon blue"><Icon name="users" size={15}/></span><span><strong>{unassigned} unassigned complaint{unassigned === 1 ? "" : "s"}</strong><small>{unassigned ? "Assign work before the queue grows." : "Every complaint has an owner."}</small></span><Icon name="chevron" size={15}/></button>
            <button onClick={() => navigate("/president/staff")} className="insight-row"><span className="insight-icon green"><Icon name="wrench" size={15}/></span><span><strong>{staff.filter((s) => s.status === "Active").length} active staff</strong><small>{staffRows.filter((s) => s.open >= 2).length} team members carrying 2+ open items.</small></span><Icon name="chevron" size={15}/></button>
          </div>
          <div className="insight-callout"><span>Peak demand</span><strong>{peakMonth.total ? `${peakMonth.label}: ${peakMonth.total} complaints` : "No complaints"}</strong><small>{category !== "All Categories" || block !== "All Blocks" ? "Based on the selected filters." : "Based on all complaint activity in the selected period."}</small></div>
        </section>

        <section className="surface analytics-card full">
          <div className="analytics-card-head"><div><div className="eyebrow">Work queue</div><h2>Status distribution</h2><p>Where complaints currently sit in the workflow</p></div><span className="analytics-inline-stat"><strong>{resolutionRate}%</strong> resolved</span></div>
          <div className="status-overview"><div className="status-donut" style={{ background: `conic-gradient(var(--green) 0 ${resolutionRate}%, var(--amber) ${resolutionRate}% ${resolutionRate + (analytics.total ? ((analytics.statuses["In Progress"] || 0) / analytics.total) * 100 : 0)}%, #d9dfda ${resolutionRate + (analytics.total ? ((analytics.statuses["In Progress"] || 0) / analytics.total) * 100 : 0)}% 100%)` }}><div><strong>{analytics.total}</strong><span>requests</span></div></div><div className="status-metrics"><div><span className="status-dot green"/><strong>{analytics.statuses.Resolved || 0}</strong><small>Resolved</small></div><div><span className="status-dot amber"/><strong>{analytics.statuses["In Progress"] || 0}</strong><small>In progress</small></div><div><span className="status-dot gray"/><strong>{analytics.statuses["Under Review"] || 0}</strong><small>Under review</small></div><div><span className="status-dot red"/><strong>{highPriorityOpen}</strong><small>Urgent open</small></div></div></div>
        </section>

        <section className="surface analytics-card">
          <div className="analytics-card-head"><div><div className="eyebrow">Patterns</div><h2>Requests by category</h2><p>Which services generate the most work</p></div></div>
          <div className="horizontal-bars">{Object.entries(analytics.categories).sort((a, b) => b[1] - a[1]).map(([categoryName, value]) => <button type="button" className="horizontal-bar-row horizontal-bar-button" key={categoryName} onClick={() => setCategory(categoryName)}><div><span>{categoryName}</span><strong>{value}</strong></div><div className="horizontal-track"><span style={{ width: `${(value / Math.max(1, ...Object.values(analytics.categories))) * 100}%` }}/></div></button>)}</div>
          {!Object.keys(analytics.categories).length && <div className="chart-empty">No category activity in this view.</div>}
        </section>

        <section className="surface analytics-card">
          <div className="analytics-card-head"><div><div className="eyebrow">Priority</div><h2>Where risk is concentrated</h2><p>Current queue by urgency</p></div></div>
          <div className="priority-stack">{priorityRows.map((row) => <div className="priority-row" key={row.label}><span className={`priority-mark ${row.label.toLowerCase()}`}/><div><span>{row.label} priority</span><strong>{row.value}</strong></div><div className="priority-track"><span style={{ width: `${(row.value / Math.max(1, analytics.total)) * 100}%` }}/></div></div>)}</div>
        </section>

        <section className="surface analytics-card">
          <div className="analytics-card-head"><div><div className="eyebrow">Residents</div><h2>Complaint activity by block</h2><p>Where requests are coming from</p></div></div>
          <div className="block-list">{blockRows.map((row) => <button type="button" className="block-row block-row-button" key={row.label} onClick={() => setBlock(row.label.replace("Block ", ""))}><span>{row.label}</span><div className="block-track"><span style={{ width: `${(row.value / maxBlock) * 100}%` }}/></div><strong>{row.value}</strong></button>)}</div>
        </section>

        <section className="surface analytics-card">
          <div className="analytics-card-head"><div><div className="eyebrow">Service cadence</div><h2>When requests arrive</h2><p>Submission pattern by day</p></div></div>
          <div className="weekday-grid">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, index) => {
            const value = periodComplaints.reduce((count, complaint) => {
              const date = parseDate(complaint.createdAt || complaint.date);
              if (!date) return count;
              return count + (((date.getDay() + 6) % 7) === index ? 1 : 0);
            }, 0);
            const maxDay = Math.max(1, ...[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => periodComplaints.reduce((count, complaint) => { const date = parseDate(complaint.createdAt || complaint.date); if (!date) return count; return count + (((date.getDay() + 6) % 7) === dayIndex ? 1 : 0); }, 0)));
            return <div key={label} className="weekday-col"><div className="weekday-bar-wrap"><span style={{ height: `${value === 0 ? 0 : Math.max(5, (value / maxDay) * 100)}%` }}>{value > 0 ? value : ""}</span></div><small>{label}</small></div>;
          })}</div>
        </section>

        <section className="surface analytics-card full">
          <div className="analytics-card-head"><div><div className="eyebrow">Team capacity</div><h2>Staff workload</h2><p>Open items and total assignments across the maintenance team</p></div><button className="text-link" onClick={() => navigate("/president/staff")}>Manage staff</button></div>
          <div className="workload-list">{staffRows.map((member) => <button key={member.id} className="workload-row-v2" onClick={() => navigate("/president/staff")}><div className="avatar staff-avatar">{member.avatar}</div><div className="workload-copy"><strong>{member.name}</strong><span>{member.specialty} · {member.status}</span></div><div className="workload-bar"><div className="bar-track"><div className="bar-fill" style={{ width: `${Math.min(100, member.total * 22)}%` }}/></div></div><div className="workload-number"><strong>{member.open}</strong><span>open · {member.total} total</span></div><Icon name="chevron" size={15}/></button>)}</div>
        </section>

        <section className="surface analytics-card full advanced-analytics-card">
          <div className="analytics-card-head"><div><div className="eyebrow">Advanced analytics</div><h2>Operational intelligence</h2><p>Turn raw activity into signals you can act on.</p></div><button className="btn btn-secondary" onClick={() => window.print()}><Icon name="chart" size={14}/> Export view</button></div>
          <div className="advanced-insights-grid">
            <div className="advanced-insight"><span className="advanced-label">Open workload ratio</span><strong>{analytics.total ? Math.round((analytics.active / analytics.total) * 100) : 0}%</strong><div className="advanced-meter"><span style={{ width: `${analytics.total ? Math.round((analytics.active / analytics.total) * 100) : 0}%` }}/></div><small>{analytics.active} active of {analytics.total} total complaints</small></div>
            <div className="advanced-insight"><span className="advanced-label">Assignment coverage</span><strong>{analytics.total ? Math.round(((analytics.total - unassigned) / analytics.total) * 100) : 0}%</strong><div className="advanced-meter"><span style={{ width: `${analytics.total ? Math.round(((analytics.total - unassigned) / analytics.total) * 100) : 0}%` }}/></div><small>{analytics.total - unassigned} complaints currently owned by staff</small></div>
            <div className="advanced-insight"><span className="advanced-label">High-priority exposure</span><strong>{analytics.total ? Math.round((highPriorityOpen / analytics.total) * 100) : 0}%</strong><div className="advanced-meter warning"><span style={{ width: `${analytics.total ? Math.round((highPriorityOpen / analytics.total) * 100) : 0}%` }}/></div><small>{highPriorityOpen} unresolved high-priority requests</small></div>
            <div className="advanced-insight"><span className="advanced-label">Resident reach</span><strong>{residentReach}%</strong><div className="advanced-meter blue"><span style={{ width: `${residentReach}%` }}/></div><small>Residents who have raised at least one request in view</small></div>
          </div>
          <div className="insight-summary"><div><span className="insight-summary-icon"><Icon name="alert" size={15}/></span><div><strong>Recommended focus</strong><p>{highPriorityOpen ? `Review ${highPriorityOpen} high-priority request${highPriorityOpen > 1 ? "s" : ""} before routine work.` : unassigned ? `Assign ${unassigned} unowned request${unassigned > 1 ? "s" : ""} to keep the queue accountable.` : `The queue is fully assigned. Focus on reducing resolution time.`}</p></div></div><button className="text-link" onClick={() => navigate(highPriorityOpen ? "/president/complaints" : "/president/staff")}>Take action →</button></div>
        </section>

        <section className="surface analytics-card full operations-strip">
          <div className="operations-item"><span className="metric-icon"><Icon name="users" size={15}/></span><div><small>Active residents</small><strong>{activeResidents}</strong></div></div>
          <div className="operations-item"><span className="metric-icon"><Icon name="megaphone" size={15}/></span><div><small>Published notices</small><strong>{publishedNotices}</strong></div></div>
          <div className="operations-item"><span className="metric-icon"><Icon name="clipboard" size={15}/></span><div><small>High priority total</small><strong>{periodComplaints.filter((c) => c.priority === "High").length}</strong></div></div>
          <div className="operations-item"><span className="metric-icon"><Icon name="calendar" size={15}/></span><div><small>Peak request month</small><strong>{peakMonth.label}</strong></div></div>
        </section>
      </div>
    </AppShell>
  );
}
