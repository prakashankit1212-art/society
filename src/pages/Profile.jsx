import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import Icon from "../components/Icon";
import { getUserProfile, saveUserProfile } from "../data/store";
import "./Profile.css";

function initials(name = "User") {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Profile({ role = "resident" }) {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [profile, setProfile] = useState(() => getUserProfile(role));
  const [draft, setDraft] = useState(() => getUserProfile(role));
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const isPresident = role === "president";
  const isAdmin = role === "admin";
  const roleLabel = isPresident ? "Society President" : isAdmin ? "Administrator" : "Resident";

  useEffect(() => {
    const refresh = () => {
      const next = getUserProfile(role);
      setProfile(next);
      if (!editMode) setDraft(next);
    };
    window.addEventListener("societyconnect:update", refresh);
    return () => window.removeEventListener("societyconnect:update", refresh);
  }, [role, editMode]);

  const avatarText = useMemo(() => initials(draft.name || profile.name), [draft.name, profile.name]);

  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));

  const choosePhoto = () => fileRef.current?.click();

  const onPhotoSelected = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 1.5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => update("photo", reader.result);
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const save = () => {
    const next = saveUserProfile(role, {
      name: draft.name.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      photo: draft.photo || "",
      notifications: Boolean(draft.notifications),
    });
    setProfile(next);
    setDraft(next);
    setEditMode(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  const cancel = () => {
    setDraft(profile);
    setEditMode(false);
  };

  const changePassword = (event) => {
    event.preventDefault();
    if (!passwords.next || passwords.next !== passwords.confirm || passwords.next.length < 6) return;
    saveUserProfile(role, { passwordChangedAt: new Date().toISOString() });
    setPasswords({ current: "", next: "", confirm: "" });
    setSecurityOpen(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  return (
    <AppShell role={role} active="profile">
      <div className="profile-page">
        {!isAdmin && <button className="back-link" type="button" onClick={() => navigate(isPresident ? "/president/dashboard" : "/resident/dashboard")}>
          <Icon name="arrowLeft" size={15} /> Back to dashboard
        </button>}

        <div className="page-head profile-head">
          <div>
            <div className="eyebrow">Account</div>
            <h1>Profile</h1>
            <p>Manage your personal information and account preferences.</p>
          </div>
          {saved && <span className="profile-saved"><Icon name="check" size={13} /> Changes saved</span>}
        </div>

        <div className="profile-layout">
          <section className="surface profile-hero-card">
            <div className="profile-avatar-wrap">
              {draft.photo ? <img src={draft.photo} alt={draft.name} className="profile-avatar-image" /> : <div className="profile-avatar">{avatarText}</div>}
              {editMode && <button className="avatar-edit" type="button" onClick={choosePhoto} aria-label="Change profile photo"><Icon name="camera" size={14} /></button>}
              <input ref={fileRef} className="sr-only" type="file" accept="image/*" onChange={onPhotoSelected} />
            </div>
            <div className="profile-hero-copy">
              <span className="profile-role">{roleLabel}</span>
              <h2>{draft.name}</h2>
              <p>{isPresident || isAdmin ? draft.society : `${draft.block} • Flat ${draft.flat}`}</p>
              <span className="profile-status"><i /> Active account</span>
              {editMode && <button className="text-link profile-photo-link" type="button" onClick={choosePhoto}>{draft.photo ? "Change photo" : "Add profile photo"}</button>}
            </div>
            {!editMode && <button className="btn btn-secondary profile-edit-btn" type="button" onClick={() => setEditMode(true)}><Icon name="edit" size={14} /> Edit profile</button>}
          </section>

          <section className="surface profile-section">
            <div className="profile-section-head"><div><h2>Personal information</h2><p>Keep your contact details up to date.</p></div></div>
            <div className="profile-form-grid">
              <label className="profile-field"><span>Full name</span><input value={draft.name} disabled={!editMode} onChange={(e) => update("name", e.target.value)} /></label>
              <label className="profile-field"><span>Email address</span><input type="email" value={draft.email} disabled={!editMode} onChange={(e) => update("email", e.target.value)} /></label>
              <label className="profile-field"><span>Phone number</span><input value={draft.phone} disabled={!editMode} onChange={(e) => update("phone", e.target.value)} /></label>
              {isPresident || isAdmin ? (
                <label className="profile-field"><span>Role</span><input value={draft.role} disabled /></label>
              ) : (
                <label className="profile-field"><span>Resident ID</span><input value={draft.id} disabled /></label>
              )}
            </div>
          </section>

          <section className="surface profile-section">
            <div className="profile-section-head"><div><h2>{isPresident || isAdmin ? "Society information" : "Residence information"}</h2><p>{isPresident ? "Your society leadership account context." : isAdmin ? "Your administration account context." : "Details linked to your resident account."}</p></div></div>
            <div className="profile-detail-grid">
              {isPresident || isAdmin ? <>
                <div><span>Society</span><strong>{draft.society}</strong></div>
                <div><span>Address</span><strong>{draft.address}</strong></div>
                <div><span>Member since</span><strong>{draft.joined}</strong></div>
              </> : <>
                <div><span>Society</span><strong>{draft.society}</strong></div>
                <div><span>Block</span><strong>{draft.block}</strong></div>
                <div><span>Flat</span><strong>{draft.flat}</strong></div>
                <div><span>Member since</span><strong>{draft.joined}</strong></div>
              </>}
            </div>
          </section>

          <section className="surface profile-section">
            <div className="profile-section-head"><div><h2>Preferences</h2><p>Choose how SocietyConnect keeps you informed.</p></div></div>
            <label className={`preference-row ${editMode ? "clickable" : ""}`}>
              <span className="preference-icon"><Icon name="bell" size={15} /></span>
              <span><strong>Notifications</strong><small>Receive updates about complaints and society notices.</small></span>
              <input type="checkbox" checked={Boolean(draft.notifications)} disabled={!editMode} onChange={(e) => update("notifications", e.target.checked)} />
            </label>
          </section>

          <section className="surface profile-section security-section">
            <div className="profile-section-head"><div><h2>Security</h2><p>Protect access to your SocietyConnect account.</p></div></div>
            <button className="security-row" type="button" onClick={() => setSecurityOpen((open) => !open)}>
              <span className="preference-icon"><Icon name="lock" size={15} /></span>
              <span><strong>Change password</strong><small>Use a strong password with at least 6 characters.</small></span>
              <Icon name="chevron" size={16} />
            </button>
            {securityOpen && <form className="password-form" onSubmit={changePassword}>
              <label className="profile-field"><span>Current password</span><input type="password" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} placeholder="Enter current password" /></label>
              <label className="profile-field"><span>New password</span><input type="password" value={passwords.next} onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))} placeholder="At least 6 characters" /></label>
              <label className="profile-field"><span>Confirm password</span><input type="password" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} placeholder="Repeat new password" /></label>
              <div className="password-actions"><button className="btn btn-secondary" type="button" onClick={() => setSecurityOpen(false)}>Cancel</button><button className="btn btn-primary" type="submit">Update password</button></div>
            </form>}
          </section>
        </div>

        {editMode && <div className="profile-footer-actions"><button className="btn btn-secondary" type="button" onClick={cancel}>Cancel</button><button className="btn btn-primary" type="button" onClick={save}><Icon name="check" size={14} /> Save changes</button></div>}
      </div>
    </AppShell>
  );
}
