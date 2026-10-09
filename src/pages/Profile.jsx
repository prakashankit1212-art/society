import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import Icon from "../components/Icon";
import adminModules from "../data/adminModules";
import { getAccountActivity, getSocietyOverview, getUserProfile, hashUserPassword, recordAccountActivity, saveUserProfile, verifyUserPassword } from "../data/store";
import "./Profile.css";
import "./ProfileEnhancements.css";

function initials(name = "User") {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(value) {
  if (!value) return "Not recorded yet";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function getDeviceName() {
  const agent = navigator.userAgent;
  const browser = /Edg\//.test(agent) ? "Microsoft Edge" : /Chrome\//.test(agent) ? "Chrome" : /Firefox\//.test(agent) ? "Firefox" : /Safari\//.test(agent) ? "Safari" : "Browser";
  const operatingSystem = /Windows/.test(agent) ? "Windows" : /Mac OS/.test(agent) ? "macOS" : /Android/.test(agent) ? "Android" : /iPhone|iPad/.test(agent) ? "iOS" : /Linux/.test(agent) ? "Linux" : "Unknown device";
  return `${browser} · ${operatingSystem}`;
}

const notificationOptions = [
  ["complaintUpdates", "Complaint updates", "Status changes to complaints"],
  ["societyNotices", "Society notices", "New notices from management"],
  ["staffAssignments", "Staff assignment updates", "Changes to staff assignments"],
  ["whatsapp", "WhatsApp notifications", "Preference only; WhatsApp delivery is not connected"],
  ["email", "Email notifications", "Preference only; outbound email is not connected"],
  ["browser", "Browser notifications", "Uses this browser's notification permission"]
];

export default function Profile({ role = "resident" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const fileRef = useRef(null);
  const [profile, setProfile] = useState(() => getUserProfile(role));
  const [draft, setDraft] = useState(() => getUserProfile(role));
  const [activity, setActivity] = useState(() => getAccountActivity(role));
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [securityView, setSecurityView] = useState("");
  const [confirmAction, setConfirmAction] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const isPresident = role === "president";
  const isAdmin = role === "admin";
  const requestedSection = location.pathname.split("/").filter(Boolean).at(-1);
  const activeAdminPage = adminModules.find((page) => page.key === requestedSection) || adminModules[0];
  const roleLabel = isPresident ? "Society President" : isAdmin ? "Administrator" : "Resident";
  const society = getSocietyOverview();
  const browserPermission = typeof Notification === "undefined" ? "unsupported" : Notification.permission;

  useEffect(() => {
    const refresh = () => {
      const next = getUserProfile(role);
      setProfile(next);
      if (!editMode) setDraft(next);
      setActivity(getAccountActivity(role));
    };
    window.addEventListener("societyconnect:update", refresh);
    return () => window.removeEventListener("societyconnect:update", refresh);
  }, [role, editMode]);

  const avatarText = useMemo(() => initials(draft.name || profile.name), [draft.name, profile.name]);

  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));

  const showSaved = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  const choosePhoto = () => fileRef.current?.click();

  const onPhotoSelected = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormMessage("Choose an image file to use as your profile photo.");
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      setFormMessage("Choose an image smaller than 1.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      update("photo", reader.result);
      if (!editMode) {
        const next = saveUserProfile(role, { photo: reader.result });
        setProfile(next);
        setDraft(next);
        recordAccountActivity(role, { title: "Updated profile photo" });
        showSaved();
      }
      setFormMessage("");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const save = () => {
    if (!draft.name.trim() || !draft.email.trim() || !draft.phone.trim()) {
      setFormMessage("Name, email, and phone are required.");
      return;
    }
    const next = saveUserProfile(role, { name: draft.name.trim(), email: draft.email.trim(), phone: draft.phone.trim(), photo: draft.photo || "", timezone: draft.timezone, language: draft.language, notifications: Boolean(draft.notifications) });
    recordAccountActivity(role, { title: "Updated profile information" });
    setProfile(next);
    setDraft(next);
    setEditMode(false);
    setFormMessage("");
    showSaved();
  };

  const cancel = () => {
    setDraft(profile);
    setEditMode(false);
    setFormMessage("");
  };

  const changePassword = async (event) => {
    event.preventDefault();
    if (passwords.next.length < 8) {
      setFormMessage("Use at least 8 characters for your new password.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setFormMessage("The new password and confirmation do not match.");
      return;
    }
    if (profile.passwordHash && !(await verifyUserPassword(role, passwords.current))) {
      setFormMessage("The current password is not correct.");
      return;
    }
    const passwordHash = await hashUserPassword(passwords.next);
    const passwordChangedAt = new Date().toISOString();
    const next = saveUserProfile(role, { passwordHash, passwordChangedAt });
    setProfile(next);
    setDraft(next);
    recordAccountActivity(role, { title: "Changed account password" });
    setPasswords({ current: "", next: "", confirm: "" });
    setSecurityOpen(false);
    setFormMessage("Your password was updated for this browser-based demo account.");
    showSaved();
  };

  const updateNotification = (key, checked) => {
    const nextPreferences = { ...profile.notificationPreferences, [key]: checked };
    const next = saveUserProfile(role, { notificationPreferences: nextPreferences, notifications: Object.values(nextPreferences).some(Boolean) });
    setProfile(next);
    setDraft(next);
    recordAccountActivity(role, { title: `Updated ${notificationOptions.find(([option]) => option === key)?.[1] || "notification"} preference` });
    showSaved();
  };

  const toggleTwoFactor = (enabled) => {
    const next = saveUserProfile(role, { twoFactorEnabled: enabled });
    setProfile(next);
    setDraft(next);
    recordAccountActivity(role, { title: `${enabled ? "Enabled" : "Disabled"} two-factor preference` });
    setFormMessage("This demo stores your preference only; an authenticator or verification service is not connected.");
  };

  const enableBrowserNotifications = async () => {
    if (typeof Notification === "undefined") {
      setFormMessage("Browser notifications are not supported in this browser.");
      return;
    }
    const permission = await Notification.requestPermission();
    const enabled = permission === "granted";
    updateNotification("browser", enabled);
    setFormMessage(enabled ? "Browser permission is enabled on this device." : "Browser notification permission was not granted.");
  };

  const handleConfirmedAction = () => {
    if (confirmAction === "signout") {
      localStorage.removeItem(`societyconnect.session.${role}`);
      recordAccountActivity(role, { title: "Signed out from this browser" });
      setConfirmAction("");
      navigate("/");
      return;
    }
    if (confirmAction === "delete") {
      setConfirmAction("");
      setFormMessage("Permanent account deletion needs a server-managed account. No account data was deleted.");
    }
  };

  return (
    <AppShell role={role} active={isAdmin ? activeAdminPage.key : "profile"}>
      <div className={`profile-page ${isAdmin ? "profile-admin-page" : ""}`}>
        {!isAdmin && <button className="back-link" type="button" onClick={() => navigate(isPresident ? "/president/dashboard" : "/resident/dashboard")}>
          <Icon name="arrowLeft" size={15} /> Back to dashboard
        </button>}

        <div className="page-head profile-head">
          <div>
            <div className="eyebrow">Account</div>
            <h1>{isAdmin ? activeAdminPage.title : "Profile"}</h1>
            <p>{isAdmin ? activeAdminPage.description : "Manage your account, security, and society preferences."}</p>
          </div>
          {saved && <span className="profile-saved"><Icon name="check" size={13} /> Changes saved</span>}
        </div>

        <div className="profile-layout" data-active-section={isAdmin ? activeAdminPage.key : undefined}>
          <section className={`surface profile-hero-card ${isAdmin ? "profile-admin-hero" : ""}`} data-profile-section="profile" data-profile-active={!isAdmin || activeAdminPage.key === "profile"}>
            <div className="profile-avatar-wrap">
              {draft.photo ? <img src={draft.photo} alt={draft.name} className="profile-avatar-image" /> : <div className="profile-avatar">{avatarText}</div>}
              <button className="avatar-edit" type="button" onClick={choosePhoto} aria-label="Change profile photo"><Icon name="camera" size={14} /></button>
              <input ref={fileRef} className="sr-only" type="file" accept="image/*" onChange={onPhotoSelected} />
            </div>
            <div className="profile-hero-copy">
              <span className="profile-role">{roleLabel}</span>
              <h2>{draft.name}</h2>
              <p>{isAdmin ? society.name : isPresident ? draft.society : `${draft.block} • Flat ${draft.flat}`}</p>
              <div className="profile-admin-meta"><span className="profile-status"><i /> Active</span>{isAdmin && <span>Admin ID: {draft.accountId || "ADM-001"}</span>}<span>Last active: {formatDate(draft.lastActiveAt || draft.lastLoginAt)}</span><span>Last login: {formatDate(draft.lastLoginAt)}</span></div>
            </div>
            <div className="profile-hero-actions">
              <button className="btn btn-secondary" type="button" onClick={() => editMode ? cancel() : setEditMode(true)}><Icon name="edit" size={14} /> {editMode ? "Cancel editing" : "Edit profile"}</button>
              <button className="text-link profile-photo-link" type="button" onClick={choosePhoto}><Icon name="camera" size={14} /> Change photo</button>
            </div>
          </section>

          <section className="surface profile-section" data-profile-section="profile" data-profile-active={!isAdmin || activeAdminPage.key === "profile"}>
            <div className="profile-section-head"><div><h2>Personal information</h2><p>Keep your contact details and preferences up to date.</p></div>{editMode && <span className="profile-editing-label">Editing</span>}</div>
            <div className="profile-form-grid">
              <label className="profile-field"><span>Full name</span><input autoComplete="name" value={draft.name} disabled={!editMode} onChange={(e) => update("name", e.target.value)} /></label>
              <label className="profile-field"><span>Email address</span><input type="email" autoComplete="email" value={draft.email} disabled={!editMode} onChange={(e) => update("email", e.target.value)} /></label>
              <label className="profile-field"><span>Phone number</span><input type="tel" autoComplete="tel" value={draft.phone} disabled={!editMode} onChange={(e) => update("phone", e.target.value)} /></label>
              {isPresident || isAdmin ? (
                <label className="profile-field"><span>Role</span><input value={draft.role} disabled /></label>
              ) : (
                <label className="profile-field"><span>Resident ID</span><input value={draft.id} disabled /></label>
              )}
              <label className="profile-field"><span>Time zone</span><select value={draft.timezone || "Asia/Kolkata"} disabled={!editMode} onChange={(e) => update("timezone", e.target.value)}><option value="Asia/Kolkata">India Standard Time (UTC+05:30)</option><option value="UTC">UTC</option><option value="Europe/London">London</option><option value="America/New_York">New York</option></select></label>
              <label className="profile-field"><span>Preferred language</span><select value={draft.language || "English"} disabled={!editMode} onChange={(e) => update("language", e.target.value)}><option>English</option><option>Hindi</option></select></label>
            </div>
          </section>

          {!isAdmin && <section className="surface profile-section profile-clay-section">
            <div className="profile-section-head"><div><h2>{isPresident || isAdmin ? "Society information" : "Residence information"}</h2><p>{isPresident ? "Your society leadership account context." : isAdmin ? "Your administration account context." : "Details linked to your resident account."}</p></div></div>
            <div className="profile-detail-grid">
              {isAdmin ? <>
                <div className="society-logo-cell"><span className="society-mark"><Icon name="leaf" size={17} /></span><span>Society logo</span><strong>Greenview Residency</strong></div>
                <div><span>Society name</span><strong>{society.name}</strong></div>
                <div><span>Address</span><strong>{society.address}</strong></div>
                <div><span>Contact number</span><strong>{society.phone}</strong></div>
                <div><span>Registration / society ID</span><strong>{society.registrationId}</strong></div>
                <div><span>Number of blocks</span><strong>{society.blockCount}</strong></div>
                <div><span>Number of residents</span><strong>{society.residentCount}</strong></div>
                <div><span>Number of staff</span><strong>{society.staffCount}</strong></div>
              </> : isPresident ? <>
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
          </section>}

          {isAdmin ? <>
            {activeAdminPage.key === "administration" && <section className="surface profile-section profile-frosted-section">
              <div className="profile-section-head"><div><h2>Administration</h2><p>Access and responsibility for this society.</p></div><span className="profile-admin-badge"><Icon name="shield" size={13} /> Administrator</span></div>
              <div className="admin-info-grid">
                <div><span>Role</span><strong>Administrator</strong></div>
                <div><span>Permissions</span><strong>Full society access</strong></div>
                <div><span>Managed society</span><strong>{society.name}</strong></div>
                <div><span>Managed blocks</span><strong>{society.blocks.map((block) => block.name).join(" · ")}</strong></div>
                <div><span>Staff members</span><strong>{society.staffCount}</strong></div>
              </div>
            </section>}

            {activeAdminPage.key === "notifications" && <section className="surface profile-section profile-frosted-section">
              <div className="profile-section-head"><div><h2>Notification preferences</h2><p>Choose the updates you want to receive.</p></div></div>
              <div className="notification-preference-list">{notificationOptions.map(([key, label, description]) => <label className="notification-preference" key={key}>
                <span className="notification-preference-copy"><strong>{label}</strong><small>{description}</small></span>
                <input type="checkbox" role="switch" checked={Boolean(profile.notificationPreferences?.[key])} onChange={(event) => updateNotification(key, event.target.checked)} aria-label={label} />
              </label>)}</div>
            </section>}
          </> : <section className="surface profile-section">
            <div className="profile-section-head"><div><h2>Preferences</h2><p>Choose how SocietyConnect keeps you informed.</p></div></div>
            <label className={`preference-row ${editMode ? "clickable" : ""}`}>
              <span className="preference-icon"><Icon name="bell" size={15} /></span>
              <span><strong>Notifications</strong><small>Receive updates about complaints and society notices.</small></span>
              <input type="checkbox" checked={Boolean(draft.notifications)} disabled={!editMode} onChange={(e) => update("notifications", e.target.checked)} />
            </label>
          </section>}

          {(!isAdmin || activeAdminPage.key === "security") && <section className={`surface profile-section security-section ${isAdmin ? "profile-frosted-section" : ""}`}>
            <div className="profile-section-head"><div><h2>Security</h2><p>Protect access to your SocietyConnect account.</p></div></div>
            <button className="security-row" type="button" onClick={() => setSecurityOpen((open) => !open)}>
              <span className="preference-icon"><Icon name="lock" size={15} /></span>
              <span><strong>Password</strong><small>{profile.passwordChangedAt ? `Last changed ${formatDate(profile.passwordChangedAt)}` : "No password has been changed in this demo"}</small></span>
              <span className="security-action">Change</span>
              <Icon name="chevron" size={16} />
            </button>
            {securityOpen && <form className="password-form" onSubmit={changePassword}>
              {profile.passwordHash && <label className="profile-field"><span>Current password</span><input type="password" autoComplete="current-password" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} placeholder="Enter current password" required /></label>}
              <label className="profile-field"><span>New password</span><input type="password" autoComplete="new-password" value={passwords.next} onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))} placeholder="At least 8 characters" required /></label>
              <label className="profile-field"><span>Confirm password</span><input type="password" autoComplete="new-password" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} placeholder="Repeat new password" required /></label>
              <div className="password-actions"><button className="btn btn-secondary" type="button" onClick={() => setSecurityOpen(false)}>Cancel</button><button className="btn btn-primary" type="submit">Update password</button></div>
            </form>}
            {isAdmin && <>
              <label className="security-row security-toggle-row">
                <span className="preference-icon"><Icon name="shield" size={15} /></span>
                <span><strong>Two-factor authentication</strong><small>{profile.twoFactorEnabled ? "Preference enabled; verification service is not connected" : "Add an extra sign-in step when MFA is configured"}</small></span>
                <input type="checkbox" role="switch" checked={Boolean(profile.twoFactorEnabled)} onChange={(event) => toggleTwoFactor(event.target.checked)} aria-label="Two-factor authentication preference" />
              </label>
              <button className="security-row" type="button" onClick={() => setSecurityView("sessions")}>
                <span className="preference-icon"><Icon name="users" size={15} /></span>
                <span><strong>Login activity</strong><small>{profile.lastLoginAt ? "1 login recorded in this browser" : "No login recorded in this browser yet"}</small></span>
                <span className="security-action">View</span><Icon name="chevron" size={16} />
              </button>
              <button className="security-row" type="button" onClick={() => setSecurityView("devices")}>
                <span className="preference-icon"><Icon name="building" size={15} /></span>
                <span><strong>Active devices</strong><small>{getDeviceName()} · this browser</small></span>
                <span className="security-action">View</span><Icon name="chevron" size={16} />
              </button>
            </>}
          </section>}

          {isAdmin && <>
            {activeAdminPage.key === "activity" && <section className="surface profile-section">
              <div className="profile-section-head"><div><h2>Account activity</h2><p>Recent changes recorded by this browser.</p></div></div>
              {activity.length ? <div className="account-activity-list">{activity.slice(0, 5).map((item) => <article className="account-activity-item" key={item.id}><span className="activity-dot"/><div><strong>{item.title}</strong>{item.detail && <small>{item.detail}</small>}</div><time dateTime={item.at}>{formatDate(item.at)}</time></article>)}</div> : <p className="profile-empty-state">No account activity has been recorded yet. Profile and security changes will appear here.</p>}
            </section>}

            {activeAdminPage.key === "services" && <section className="surface profile-section">
              <div className="profile-section-head"><div><h2>Connected services</h2><p>Connection status for this browser-based demo.</p></div></div>
              <div className="connected-service-list">
                <div className="connected-service"><span className="service-icon whatsapp-mark">W</span><span><strong>WhatsApp</strong><small>{profile.phone || "No phone number saved"}</small></span><b className="service-unavailable">Not connected</b></div>
                <div className="connected-service"><span className="service-icon"><Icon name="mail" size={16}/></span><span><strong>Email</strong><small>{profile.email}</small></span><b className="service-unavailable">Delivery not configured</b></div>
                <div className="connected-service"><span className="service-icon"><Icon name="bell" size={16}/></span><span><strong>Browser notifications</strong><small>{browserPermission === "unsupported" ? "Not supported" : `Permission: ${browserPermission}`}</small></span>{browserPermission === "default" ? <button className="text-link" type="button" onClick={enableBrowserNotifications}>Enable</button> : <b className={browserPermission === "granted" ? "service-connected" : "service-unavailable"}>{browserPermission === "granted" ? "Enabled" : browserPermission === "denied" ? "Blocked" : "Unavailable"}</b>}</div>
              </div>
            </section>}

            {activeAdminPage.key === "account" && <section className="surface profile-section danger-section">
              <div className="profile-section-head"><div><h2>Account</h2><p>Actions that affect access to your local account.</p></div></div>
              <button className="danger-action-row" type="button" onClick={() => setConfirmAction("signout")}><span><strong>Sign out from all devices</strong><small>Only this browser can be signed out in the current demo.</small></span><Icon name="arrow" size={16}/></button>
              <button className="danger-action-row delete-action" type="button" onClick={() => setConfirmAction("delete")}><span><strong>Delete account</strong><small>Permanent account deletion requires a server-managed account.</small></span><Icon name="arrow" size={16}/></button>
            </section>}
          </>}
        </div>

        {formMessage && <p className="profile-feedback" role="status">{formMessage}</p>}
        {editMode && <div className="profile-footer-actions"><button className="btn btn-secondary" type="button" onClick={cancel}>Cancel</button><button className="btn btn-primary" type="button" onClick={save}><Icon name="check" size={14} /> Save changes</button></div>}

        {(securityView || confirmAction) && <div className="profile-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { setSecurityView(""); setConfirmAction(""); } }}>
          <section className="profile-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-dialog-title">
            <button className="profile-dialog-close" type="button" aria-label="Close dialog" onClick={() => { setSecurityView(""); setConfirmAction(""); }}>×</button>
            {securityView && <>
              <span className="profile-dialog-icon"><Icon name={securityView === "sessions" ? "clock" : "building"} size={20}/></span>
              <h2 id="profile-dialog-title">{securityView === "sessions" ? "Login activity" : "Active devices"}</h2>
              <p className="profile-dialog-description">This demo records activity only in the current browser. It cannot inspect or revoke sessions on other devices.</p>
              <div className="device-detail"><strong>{getDeviceName()}</strong><span>{securityView === "sessions" ? `Last sign-in: ${formatDate(profile.lastLoginAt)}` : "Current browser · SocietyConnect"}</span><span>Last active: {formatDate(profile.lastActiveAt)}</span></div>
              <button className="btn btn-secondary profile-dialog-done" type="button" onClick={() => setSecurityView("")}>Done</button>
            </>}
            {confirmAction && <>
              <span className={`profile-dialog-icon ${confirmAction === "delete" ? "danger-dialog-icon" : ""}`}><Icon name={confirmAction === "delete" ? "trash" : "logout"} size={20}/></span>
              <h2 id="profile-dialog-title">{confirmAction === "delete" ? "Delete account?" : "Sign out from all devices?"}</h2>
              <p className="profile-dialog-description">{confirmAction === "delete" ? "This app has no account server. Permanent deletion is unavailable, and confirming will not delete account data." : "Only the saved session on this browser can be ended. Other devices cannot be reached without a server-managed sign-in service."}</p>
              <div className="profile-dialog-actions"><button className="btn btn-secondary" type="button" onClick={() => setConfirmAction("")}>Cancel</button><button className={`btn ${confirmAction === "delete" ? "btn-danger" : "btn-primary"}`} type="button" onClick={handleConfirmedAction}>{confirmAction === "delete" ? "Understood" : "Sign out here"}</button></div>
            </>}
          </section>
        </div>}
      </div>
    </AppShell>
  );
}
