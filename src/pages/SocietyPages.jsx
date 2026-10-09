import { useLocation, useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import Icon from "../components/Icon";
import { createBlock, createSociety, getBlocksBySociety, getComplaints, getCurrentSocietyId, getResidents, getSocieties, getSocietyOverview, getStaff, setCurrentSocietyId } from "../data/store";
import { useState } from "react";
import "./SocietyPages.css";

const roleLabel = (role) => role === "admin" ? "Administrator" : role === "president" ? "Society President" : "Resident";
const blockDisplayName = (name) => /^block\s/i.test(name) ? name : `Block ${name}`;

function SocietyPageHeader({ eyebrow, title, description, actions }) {
  return <div className="page-head society-page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{actions && <div className="page-head-actions">{actions}</div>}</div>;
}

function SocietyBlockRow({ block, onClick }) {
  const Row = onClick ? "button" : "div";
  return <Row {...(onClick ? { type: "button", onClick } : {})} className="society-block-list-item">
    <span className="society-block-list-name"><span className="society-block-mark"><Icon name="building" size={16}/></span><strong>{blockDisplayName(block.name)}</strong></span>
    <span className="society-block-row-stat"><strong>{Number(block.totalFlats || block.flatCount || 0)}</strong> flats</span>
    <span className="society-block-row-stat"><strong>{Number(block.occupiedFlats || block.residentCount || 0)}</strong> occupied</span>
    <span className={`society-block-status ${block.status === "Inactive" ? "inactive" : "active"}`}>{block.status || "Active"}</span>
    <Icon className="society-block-list-chevron" name="chevron" size={16}/>
  </Row>;
}

export function SocietyDetails({ role = "resident" }) {
  const society = getSocietyOverview();
  const navigate = useNavigate();
  const backPath = role === "resident" ? "/resident/dashboard" : role === "admin" ? "/admin/profile" : "/president/dashboard";
  const blockCards = society.blocks || [];
  const addBlock = () => navigate("/admin/blocks/new", { state: { societyId: society.id, returnTo: "/admin/society" } });

  const actions = role === "admin" ? (
    <button className="btn btn-primary" type="button" onClick={() => navigate("/admin/society/new")}><Icon name="plus" size={14}/> Add new society</button>
  ) : null;

  return <AppShell role={role} active={role === "admin" ? "society" : "society"}>
    <button className="back-link" type="button" onClick={() => navigate(backPath)}><Icon name="back" size={15}/> Back</button>
    <SocietyPageHeader eyebrow="Parent society" title={society.name} description={`${society.location || society.city || "Location"}${society.state ? `, ${society.state}` : ""}`} actions={actions} />
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
          <div><dt>Society logo</dt><dd className="society-logo-detail"><span className="society-logo-mark"><Icon name="leaf" size={16}/></span>{society.name}</dd></div>
          <div><dt>Society name</dt><dd>{society.name}</dd></div>
          <div><dt>Location</dt><dd>{society.location || society.city || ""}{society.state ? `, ${society.state}` : ""}</dd></div>
          <div><dt>Address</dt><dd>{society.address}</dd></div>
          <div><dt>Registration / society ID</dt><dd>{society.registrationId}</dd></div>
          <div><dt>Status</dt><dd>{society.status || "Active"}</dd></div>
          <div><dt>Your role</dt><dd>{roleLabel(role)}</dd></div>
        </dl>
      </section>
      <section className="surface society-information-section">
        <div className="eyebrow">Contact</div>
        <h2>Society office</h2>
        <div className="society-contact-list">
          <a href={`tel:${society.phone || ""}`}><Icon name="user" size={15}/><span><small>Phone</small><strong>{society.phone || "Not provided"}</strong></span></a>
          <a href={`mailto:${society.email || ""}`}><Icon name="message" size={15}/><span><small>Email</small><strong>{society.email || "Not provided"}</strong></span></a>
        </div>
      </section>
    </div>

    {role === "admin" && <>
      <div className="society-block-section-header">
        <div><h2>Blocks</h2><p>Manage the blocks within {society.name}.</p></div>
        <button className="btn btn-primary btn-small" type="button" onClick={addBlock}><Icon name="plus" size={14}/> Add block</button>
      </div>
      <div className="society-block-list" aria-label={`Blocks in ${society.name}`}>
        {blockCards.length ? blockCards.map((block) => <SocietyBlockRow key={block.id || block.name} block={block} onClick={() => navigate(`/admin/blocks/${encodeURIComponent(block.id || block.name)}`)}/>) : <div className="society-block-empty">
          <div><strong>No blocks yet</strong><p>Create the first block in {society.name} using Add block above.</p></div>
        </div>}
      </div>
    </>}

    {!role || role !== "admin" ? <button className="text-link society-inline-link" type="button" onClick={() => navigate(`${role === "resident" ? "/resident" : role === "admin" ? "/admin" : "/president"}/blocks`)}>View blocks <Icon name="arrow" size={14}/></button> : null}
  </AppShell>;
}

export function SocietyBlocks({ role = "resident" }) {
  const society = getSocietyOverview();
  const navigate = useNavigate();
  const basePath = role === "resident" ? "/resident" : role === "admin" ? "/admin" : "/president";
  const blocks = getBlocksBySociety(society.id || getCurrentSocietyId());

  const handleAddBlock = () => {
    if (role === "admin") {
      navigate("/admin/blocks/new", { state: { societyId: society.id, returnTo: "/admin/society" } });
      return;
    }
    navigate(`${basePath}/blocks/new`);
  };

  return <AppShell role={role} active={role === "admin" ? "blocks" : "society"}>
    <button className="back-link" type="button" onClick={() => navigate(`${basePath}/society`)}><Icon name="back" size={15}/> Back to society</button>
    <SocietyPageHeader eyebrow={society.name} title="Blocks" description={`Manage the blocks within ${society.name}.`} actions={role === "admin" ? <button className="btn btn-primary" type="button" onClick={handleAddBlock}><Icon name="plus" size={14}/> Add block</button> : null} />
    <div className="society-block-list" aria-label={`Blocks in ${society.name}`}>
      {blocks.length ? blocks.map((block) => <SocietyBlockRow key={block.id || block.name} block={block} onClick={role === "admin" ? () => navigate(`/admin/blocks/${encodeURIComponent(block.id || block.name)}`) : null}/>) : <div className="society-block-empty"><div><strong>No blocks yet</strong><p>Add a block under {society.name} using the Add block action above.</p></div></div>}
    </div>
  </AppShell>;
}

export function SocietyBlockDetails() {
  const { id = "" } = useParams();
  const society = getSocietyOverview();
  const navigate = useNavigate();
  const block = (society.blocks || []).find((item) => String(item.id || item.name) === id);
  const blockCode = block?.name.replace(/^block\s+/i, "").trim();
  const isInBlock = (value) => value === block?.name || value === blockCode;
  const residents = block ? getResidents(society.id).filter((resident) => isInBlock(resident.block)) : [];
  const complaints = block ? getComplaints(society.id).filter((complaint) => isInBlock(complaint.block)) : [];
  const staff = block ? getStaff(society.id) : [];
  const totalFlats = Number(block?.totalFlats || block?.flatCount || 0);
  const occupiedFlats = Number(block?.occupiedFlats || block?.residentCount || 0);

  return <AppShell role="admin" active="blocks">
    <button className="back-link" type="button" onClick={() => navigate("/admin/society")}><Icon name="back" size={15}/> Back to society</button>
    {block ? <>
      <SocietyPageHeader eyebrow={society.name} title={blockDisplayName(block.name)} description="Block details and occupancy information." />
      <section className="surface society-block-detail-panel">
        <div className="society-block-detail-heading"><span className="society-block-mark"><Icon name="building" size={17}/></span><span className={`society-block-status ${block.status === "Inactive" ? "inactive" : "active"}`}>{block.status || "Active"}</span></div>
        <div className="society-block-detail-grid">
          <div><small>Total flats</small><strong>{totalFlats}</strong></div>
          <div><small>Occupied flats</small><strong>{occupiedFlats}</strong></div>
          <div><small>Manager</small><strong>{block.manager || "Not assigned"}</strong></div>
          <div><small>Contact</small><strong>{block.contact || "Not provided"}</strong></div>
        </div>
      </section>
      <section className="society-block-detail-metrics" aria-label="Block overview">
        <article><span>Flats</span><strong>{totalFlats}</strong></article>
        <article><span>Occupied</span><strong>{occupiedFlats}</strong></article>
        <article><span>Vacant</span><strong>{Math.max(0, totalFlats - occupiedFlats)}</strong></article>
      </section>
      <div className="society-block-management-grid">
        <section className="surface society-block-management-section">
          <div className="society-block-management-heading"><div><h2>Residents</h2><p>{residents.length} in this block</p></div><Icon name="users" size={17}/></div>
          {residents.length ? <div className="society-block-detail-list">{residents.map((resident) => <div className="society-block-detail-list-row" key={resident.id}><span><strong>{resident.name}</strong><small>Flat {resident.flat}</small></span><span className={`society-block-resident-status ${resident.status === "Inactive" ? "inactive" : "active"}`}>{resident.status || "Active"}</span></div>)}</div> : <p className="society-block-detail-empty">No residents recorded in this block yet.</p>}
        </section>
        <section className="surface society-block-management-section">
          <div className="society-block-management-heading"><div><h2>Staff</h2><p>Society staff directory · {staff.length} members</p></div><Icon name="userPlus" size={17}/></div>
          {staff.length ? <div className="society-block-detail-list">{staff.slice(0, 4).map((member) => <div className="society-block-detail-list-row" key={member.id}><span><strong>{member.name}</strong><small>{member.role}</small></span><span className={`society-block-resident-status ${member.status === "Active" ? "active" : "inactive"}`}>{member.status || "Active"}</span></div>)}</div> : <p className="society-block-detail-empty">No society staff records yet.</p>}
        </section>
        <section className="surface society-block-management-section society-block-complaints-section">
          <div className="society-block-management-heading"><div><h2>Complaints</h2><p>{complaints.length} linked to this block</p></div><Icon name="clipboard" size={17}/></div>
          {complaints.length ? <div className="society-block-detail-list">{complaints.slice(0, 4).map((complaint) => <div className="society-block-detail-list-row" key={complaint.id}><span><strong>{complaint.title}</strong><small>{complaint.id} · Flat {complaint.flat || "—"}</small></span><span className="society-block-complaint-status">{complaint.status}</span></div>)}</div> : <p className="society-block-detail-empty">No complaints recorded for this block.</p>}
        </section>
      </div>
    </> : <div className="surface empty-state"><strong>Block not found</strong><p>This block may have been removed from {society.name}.</p></div>}
  </AppShell>;
}

export function SocietyCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", location: "", address: "", phone: "", email: "", registrationId: "", logo: "", status: "Active" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [usingDemoDetails, setUsingDemoDetails] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
    setError("");
  };

  const fillDemoDetails = () => {
    setForm({
      name: "Sunrise Residency",
      location: "Raigarh, Chhattisgarh",
      address: "Ring Road, Raigarh, Chhattisgarh",
      phone: "+91 90000 20001",
      email: "admin@sunriseresidency.com",
      registrationId: "SR-2026-001",
      logo: "Sunrise",
      status: "Active"
    });
    setFieldErrors({});
    setError("");
    setUsingDemoDetails(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedName = form.name.trim();
    const trimmedLocation = form.location.trim();
    const trimmedAddress = form.address.trim();
    const trimmedEmail = form.email.trim();
    const trimmedPhone = form.phone.trim();

    const nextFieldErrors = {};
    if (!trimmedName) nextFieldErrors.name = "Society name is required.";
    if (!trimmedLocation) nextFieldErrors.location = "Location is required.";
    if (!trimmedAddress) nextFieldErrors.address = "Full address is required.";
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) nextFieldErrors.email = "Enter a valid email address.";
    if (trimmedPhone && !/^[+()\d\s-]{7,20}$/.test(trimmedPhone)) nextFieldErrors.phone = "Enter a valid phone number.";
    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => window.requestAnimationFrame(resolve));
      const society = createSociety({
        name: trimmedName,
        location: trimmedLocation,
        address: trimmedAddress,
        phone: trimmedPhone,
        email: trimmedEmail,
        registrationId: form.registrationId.trim(),
        logo: form.logo.trim(),
        status: form.status,
        blockNames: usingDemoDetails ? ["Block A", "Block B", "Block C"] : [],
        demoStats: usingDemoDetails ? { blockCount: 3, residentCount: 48, staffCount: 8 } : null
      });
      setCurrentSocietyId(society.id);
      if (usingDemoDetails) {
        [20, 20, 20].forEach((totalFlats, index) => createBlock({
          societyId: society.id,
          name: `Block ${String.fromCharCode(65 + index)}`,
          totalFlats,
          occupiedFlats: 16,
          status: "Active"
        }));
      }
      setSuccess(`${trimmedName} has been added to your societies.`);
      window.dispatchEvent(new CustomEvent("societyconnect:update", { detail: { key: "societyconnect.societies" } }));
      window.setTimeout(() => navigate("/admin/society"), 1100);
    } catch (submitError) {
      setError(submitError.message || "Unable to create society.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <AppShell role="admin" active="society">
    <button className="back-link" type="button" onClick={() => navigate("/admin/society")}><Icon name="back" size={15}/> Back to society</button>
    <div className="page-head society-page-head society-create-page-head"><div><div className="eyebrow">Administration</div><h1>Add new society</h1><p>Create a new parent society and assign blocks under it.</p></div></div>
    <section className="society-form-shell">
      {success && <div className="society-create-success" role="status"><span><Icon name="check" size={15}/></span><div><strong>Society created successfully</strong><p>{success}</p></div></div>}
      <form className="society-create-form" onSubmit={handleSubmit} noValidate>
        <div className="society-create-form-head"><div className="eyebrow">Society details</div>{![form.name, form.location, form.address, form.phone, form.email, form.registrationId, form.logo].some((value) => value.trim()) && <button className="society-demo-fill" type="button" onClick={fillDemoDetails}>Use demo details <Icon name="arrow" size={14}/></button>}</div>
        <div className="society-create-fields">
          <label className="society-create-field"><span>Society name <b>*</b></span><input name="name" value={form.name} onChange={handleChange} placeholder="Society name" autoComplete="organization" aria-required="true" aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? "society-name-error" : undefined}/>{fieldErrors.name && <small id="society-name-error" className="society-field-error">{fieldErrors.name}</small>}</label>
          <label className="society-create-field"><span>Location / City <b>*</b></span><input name="location" value={form.location} onChange={handleChange} placeholder="City, State" autoComplete="address-level2" aria-required="true" aria-invalid={Boolean(fieldErrors.location)} aria-describedby={fieldErrors.location ? "society-location-error" : undefined}/>{fieldErrors.location && <small id="society-location-error" className="society-field-error">{fieldErrors.location}</small>}</label>
          <label className="society-create-field society-create-full"><span>Full address <b>*</b></span><input name="address" value={form.address} onChange={handleChange} placeholder="Street, area, city" autoComplete="street-address" aria-required="true" aria-invalid={Boolean(fieldErrors.address)} aria-describedby={fieldErrors.address ? "society-address-error" : undefined}/>{fieldErrors.address && <small id="society-address-error" className="society-field-error">{fieldErrors.address}</small>}</label>
          <label className="society-create-field"><span>Registration / Society ID</span><input name="registrationId" value={form.registrationId} onChange={handleChange} placeholder="Optional registration ID" /></label>
          <div className="society-create-section-label society-create-full">Contact</div>
          <label className="society-create-field"><span>Phone number</span><input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 90000 00000" autoComplete="tel" aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? "society-phone-error" : undefined}/>{fieldErrors.phone && <small id="society-phone-error" className="society-field-error">{fieldErrors.phone}</small>}</label>
          <label className="society-create-field"><span>Email</span><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="admin@society.com" autoComplete="email" aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "society-email-error" : undefined}/>{fieldErrors.email && <small id="society-email-error" className="society-field-error">{fieldErrors.email}</small>}</label>
          <div className="society-create-section-label society-create-full">Branding</div>
          <label className="society-create-field"><span>Society logo</span><input name="logo" value={form.logo} onChange={handleChange} placeholder="Logo name or URL" /></label>
          <div className="society-create-section-label society-create-full">Status</div>
          <label className="society-create-field"><span>Society status</span><select name="status" value={form.status} onChange={handleChange}><option value="Active">Active</option><option value="Inactive">Inactive</option></select></label>
        </div>
        {error && <p className="society-create-submit-error" role="alert">{error}</p>}
        <div className="society-create-actions">
          <button className="btn btn-secondary" type="button" onClick={() => navigate("/admin/society")}>Cancel</button>
          <button className="btn btn-primary" type="submit" disabled={isSubmitting || Boolean(success)}>{isSubmitting ? "Creating society..." : "Create society"}</button>
        </div>
      </form>
    </section>
  </AppShell>;
}

export function BlockCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const societies = getSocieties();
  const requestedSocietyId = location.state?.societyId;
  const currentSocietyId = societies.some((item) => item.id === requestedSocietyId) ? requestedSocietyId : getCurrentSocietyId();
  const currentSociety = societies.find((item) => item.id === currentSocietyId) || getSocietyOverview();
  const returnTo = location.state?.returnTo || "/admin/society";
  const [form, setForm] = useState({
    societyId: currentSocietyId,
    name: "",
    totalFlats: "",
    occupiedFlats: "",
    contact: "",
    manager: "",
    status: "Active"
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const nextFieldErrors = {};
    if (!form.name.trim()) nextFieldErrors.name = "Block name is required.";
    if (!form.societyId) nextFieldErrors.societyId = "Select a society.";
    if (!form.totalFlats || Number(form.totalFlats) < 1) nextFieldErrors.totalFlats = "Enter at least 1 flat.";
    if (Number(form.occupiedFlats) < 0) nextFieldErrors.occupiedFlats = "Occupied flats must be zero or more.";
    if (form.contact.trim() && !/^[+()\d\s-]{7,20}$/.test(form.contact.trim())) nextFieldErrors.contact = "Enter a valid contact number.";
    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => window.requestAnimationFrame(resolve));
      const block = createBlock({
        societyId: form.societyId,
        name: form.name.trim(),
        totalFlats: Number(form.totalFlats),
        occupiedFlats: Number(form.occupiedFlats || 0),
        contact: form.contact.trim(),
        manager: form.manager.trim(),
        status: form.status
      });
      setCurrentSocietyId(form.societyId);
      setSuccess(`Block ${block.name} created successfully.`);
      window.setTimeout(() => navigate(returnTo), 900);
    } catch (submitError) {
      setError(submitError.message || "Unable to create block.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <AppShell role="admin" active="blocks">
    <button className="back-link" type="button" onClick={() => navigate(returnTo)}><Icon name="back" size={15}/> Back to society</button>
    <div className="page-head society-page-head"><div><div className="eyebrow">Management</div><h1>Add new block</h1><p>Create a block within the current society.</p></div></div>
    <section className="society-form-shell">
      {success && <div className="society-create-success" role="status"><span><Icon name="check" size={15}/></span><div><strong>Block created successfully</strong><p>{success}</p></div></div>}
      <form className="society-create-form" onSubmit={handleSubmit} noValidate>
        <div className="society-create-form-head"><div className="eyebrow">Block details</div></div>
        <div className="society-create-fields">
          <label className="society-create-field"><span>Block name <b>*</b></span><input name="name" value={form.name} onChange={handleChange} placeholder="Block A" aria-required="true" aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? "block-name-error" : undefined}/>{fieldErrors.name && <small id="block-name-error" className="society-field-error">{fieldErrors.name}</small>}</label>
          <div className="society-create-context"><span className="society-block-mark"><Icon name="building" size={16}/></span><div><small>Creating block within</small><strong>{currentSociety.name}</strong></div></div>
          <div className="society-create-section-label society-create-full">Occupancy</div>
          <label className="society-create-field"><span>Total flats <b>*</b></span><input name="totalFlats" type="number" min="1" value={form.totalFlats} onChange={handleChange} placeholder="48" aria-required="true" aria-invalid={Boolean(fieldErrors.totalFlats)} aria-describedby={fieldErrors.totalFlats ? "block-flats-error" : undefined}/>{fieldErrors.totalFlats && <small id="block-flats-error" className="society-field-error">{fieldErrors.totalFlats}</small>}</label>
          <label className="society-create-field"><span>Occupied flats</span><input name="occupiedFlats" type="number" min="0" value={form.occupiedFlats} onChange={handleChange} placeholder="32" aria-invalid={Boolean(fieldErrors.occupiedFlats)} aria-describedby={fieldErrors.occupiedFlats ? "block-occupied-error" : undefined}/>{fieldErrors.occupiedFlats && <small id="block-occupied-error" className="society-field-error">{fieldErrors.occupiedFlats}</small>}</label>
          <div className="society-create-section-label society-create-full">Contact</div>
          <label className="society-create-field"><span>Block contact number</span><input name="contact" type="tel" value={form.contact} onChange={handleChange} placeholder="+91 90000 00000" aria-invalid={Boolean(fieldErrors.contact)} aria-describedby={fieldErrors.contact ? "block-contact-error" : undefined}/>{fieldErrors.contact && <small id="block-contact-error" className="society-field-error">{fieldErrors.contact}</small>}</label>
          <label className="society-create-field"><span>Block manager</span><input name="manager" value={form.manager} onChange={handleChange} placeholder="Manager name" /></label>
          <div className="society-create-section-label society-create-full">Status</div>
          <label className="society-create-field"><span>Block status</span><select name="status" value={form.status} onChange={handleChange}><option value="Active">Active</option><option value="Inactive">Inactive</option></select></label>
        </div>
        {error && <p className="society-create-submit-error" role="alert">{error}</p>}
        <div className="society-create-actions">
          <button className="btn btn-secondary" type="button" onClick={() => navigate(returnTo)}>Cancel</button>
          <button className="btn btn-primary" type="submit" disabled={isSubmitting || Boolean(success)}>{isSubmitting ? "Creating block..." : "Create block"}</button>
        </div>
      </form>
    </section>
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