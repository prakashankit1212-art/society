import { useLocation, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import Icon from "../components/Icon";
import { getSocietyOverview } from "../data/store";
import "./SocietyPages.css";

const roleLabel = (role) => role === "admin" ? "Administrator" : role === "president" ? "Society President" : "Resident";

function SocietyPageHeader({ eyebrow, title, description }) {
  return <div className="page-head society-page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div></div>;
}

export function SocietyDetails({ role = "resident" }) {
  const society = getSocietyOverview();
  const navigate = useNavigate();
  const backPath = role === "resident" ? "/resident/dashboard" : role === "admin" ? "/admin/profile" : "/president/dashboard";

  return <AppShell role={role} active="society">
    <button className="back-link" type="button" onClick={() => navigate(backPath)}><Icon name="back" size={15}/> Back</button>
    <SocietyPageHeader eyebrow="Current society" title={society.name} description="Society information and community contacts." />
    <section className="society-summary-grid" aria-label="Society summary">
      <article className="surface society-info-card"><span className="society-info-icon"><Icon name="building" size={16}/></span><span className="society-info-label">Blocks</span><strong>{society.blockCount}</strong></article>
      <article className="surface society-info-card"><span className="society-info-icon"><Icon name="users" size={16}/></span><span className="society-info-label">Residents</span><strong>{society.residentCount}</strong></article>
      <article className="surface society-info-card"><span className="society-info-icon"><Icon name="userPlus" size={16}/></span><span className="society-info-label">Staff</span><strong>{society.staffCount}</strong></article>
    </section>

    <div className="society-information-grid">
      <section className="surface society-information-section">
        <div className="eyebrow">Society profile</div>
        <h2>Basic information</h2>
        <dl className="society-details-list">
          <div><dt>Society name</dt><dd>{society.name}</dd></div>
          <div><dt>Location</dt><dd>{society.city}, {society.state}</dd></div>
          <div><dt>Address</dt><dd>{society.address}</dd></div>
          <div><dt>Your role</dt><dd>{roleLabel(role)}</dd></div>
        </dl>
      </section>
      <section className="surface society-information-section">
        <div className="eyebrow">Contact</div>
        <h2>Society office</h2>
        <div className="society-contact-list">
          <a href={`tel:${society.phone}`}><Icon name="user" size={15}/><span><small>Phone</small><strong>{society.phone}</strong></span></a>
          <a href={`mailto:${society.email}`}><Icon name="message" size={15}/><span><small>Email</small><strong>{society.email}</strong></span></a>
        </div>
      </section>
    </div>
    <button className="text-link society-inline-link" type="button" onClick={() => navigate(`${role === "resident" ? "/resident" : role === "admin" ? "/admin" : "/president"}/blocks`)}>View blocks <Icon name="arrow" size={14}/></button>
  </AppShell>;
}

export function SocietyBlocks({ role = "resident" }) {
  const society = getSocietyOverview();
  const navigate = useNavigate();
  const basePath = role === "resident" ? "/resident" : role === "admin" ? "/admin" : "/president";

  return <AppShell role={role} active="society">
    <button className="back-link" type="button" onClick={() => navigate(`${basePath}/society`)}><Icon name="back" size={15}/> Back to society</button>
    <SocietyPageHeader eyebrow={society.name} title="Blocks" description="Resident and registered flat counts across the society." />
    <div className="society-block-grid">
      {society.blocks.map((block) => <article className="surface society-block-card" key={block.name}>
        <div className="society-block-top"><span className="society-block-mark"><Icon name="building" size={17}/></span><span className="society-block-label">Block</span></div>
        <h2>{block.name}</h2>
        <div className="society-block-stats"><div><strong>{block.flatCount}</strong><span>Flats on record</span></div><div><strong>{block.residentCount}</strong><span>Residents</span></div></div>
      </article>)}
    </div>
  </AppShell>;
}

export function SocietySettings() {
  const location = useLocation();
  const role = new URLSearchParams(location.search).get("role") === "admin" ? "admin" : "president";
  const society = getSocietyOverview();
  const navigate = useNavigate();
  const basePath = role === "admin" ? "/admin" : "/president";

  return <AppShell role={role} active="society">
    <button className="back-link" type="button" onClick={() => navigate(`${basePath}/society`)}><Icon name="back" size={15}/> Back to society</button>
    <SocietyPageHeader eyebrow="Management" title="Society settings" description="Review the details currently used for this society." />
    <section className="surface society-information-section society-settings-panel">
      <div className="eyebrow">Society profile</div>
      <h2>Contact and location</h2>
      <dl className="society-details-list">
        <div><dt>Society name</dt><dd>{society.name}</dd></div>
        <div><dt>Address</dt><dd>{society.address}</dd></div>
        <div><dt>Contact phone</dt><dd>{society.phone}</dd></div>
        <div><dt>Contact email</dt><dd>{society.email}</dd></div>
      </dl>
      <button className="btn btn-secondary" type="button" onClick={() => navigate(`${basePath}/society`)}>View society details</button>
    </section>
  </AppShell>;
}