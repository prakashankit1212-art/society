import { useNavigate } from "react-router-dom";
import AppShell from "../../components/AppShell";
import Icon from "../../components/Icon";
import { getComplaints, getNotices } from "../../data/store";

function ResidentDashboard() {
  const navigate = useNavigate();
  const complaints = getComplaints();
  const openCount = complaints.filter((item) => item.status !== "Resolved").length;
  const progressCount = complaints.filter((item) => item.status === "In Progress").length;
  const resolvedCount = complaints.filter((item) => item.status === "Resolved").length;
  const recent = complaints.slice(0, 3);
  const notices = getNotices().filter((item) => item.status === "Published").slice(0, 3);
  const statusClass = (value) => value === "Resolved" ? "status-resolved" : value === "In Progress" ? "status-progress" : "status-review";
  return (
    <AppShell role="resident" active="overview">
      <div className="hero-row">
        <div className="greeting">
          <div className="eyebrow">Tuesday, 25 September 2026</div>
          <h1>Good morning, Archana</h1>
          <p>Block B · Flat 204</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/resident/complaints/new")}><Icon name="plus" size={15} /> Report an issue</button>
      </div>

      <section className="metric-grid">
        <div className="metric-card"><div className="metric-top"><span className="metric-label">Open complaints</span><span className="metric-icon"><Icon name="clipboard" size={16}/></span></div><div className="metric-value">{String(openCount).padStart(2, "0")}</div><span className="metric-note">Need attention</span></div>
        <div className="metric-card"><div className="metric-top"><span className="metric-label">In progress</span><span className="metric-icon"><Icon name="wrench" size={16}/></span></div><div className="metric-value">{String(progressCount).padStart(2, "0")}</div><span className="metric-note">Being handled</span></div>
        <div className="metric-card"><div className="metric-top"><span className="metric-label">Resolved</span><span className="metric-icon"><Icon name="check" size={16}/></span></div><div className="metric-value">{String(resolvedCount).padStart(2, "0")}</div><span className="metric-note">This month</span></div>
      </section>

      <section className="attention-card">
        <div className="attention-copy"><span className="attention-icon"><Icon name="droplet" size={16}/></span><div><h2>Water supply maintenance</h2><p>Water supply will be unavailable in Block B tomorrow from 10 AM to 2 PM.</p></div></div>
        <button className="btn btn-ghost">View notice <Icon name="arrow" size={15}/></button>
      </section>

      <div className="activity-grid">
        <section className="section-block">
          <div className="section-header"><div><h2>Recent complaints</h2><p>Track your latest requests</p></div><button className="text-link" onClick={() => navigate("/resident/complaints")}>View all</button></div>
          <div className="list-surface">
            {recent.map((complaint) => <div className="list-row" key={complaint.id} onClick={() => navigate(`/resident/complaints/${complaint.id}`)}><div className="list-main"><div className="list-title">{complaint.title}</div><div className="list-meta">{complaint.category} · {complaint.date}</div></div><div className="row-actions"><span className={`status ${statusClass(complaint.status)}`}>{complaint.status}</span><Icon name="chevron" size={17} className="row-chevron" /></div></div>)}
          </div>
        </section>

        <section className="section-block">
          <div className="section-header"><div><h2>Society updates</h2><p>Useful notices from management</p></div><button className="text-link">View all</button></div>
          <div className="update-list">
            {notices.map((notice) => <div className="update-item" key={notice.id}><span className="update-icon"><Icon name={notice.category === "Security" ? "shield" : "building"} size={15}/></span><div className="update-copy"><strong>{notice.title}</strong><span>{notice.body}</span></div></div>)}
            {!notices.length && <div className="empty-state" style={{padding:"24px 12px"}}><strong>No notices yet</strong><p>Society updates will appear here.</p></div>}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
export default ResidentDashboard;
