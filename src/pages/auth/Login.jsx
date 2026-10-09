import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/Icon";
import { getCurrentSocietyId, getSocieties, getUserProfile, recordAccountActivity, saveUserProfile, setCurrentSocietyId as saveCurrentSocietyId, verifyUserPassword } from "../../data/store";
import heroImage from "../../assets/hero.png";
import "./Login.css";

function Login() {
  const [role, setRole] = useState("resident");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [societyOpen, setSocietyOpen] = useState(false);
  const [societies, setSocieties] = useState(() => getSocieties());
  const [currentSocietyId, setCurrentSocietyId] = useState(() => getCurrentSocietyId());
  const societyRef = useRef(null);
  const navigate = useNavigate();
  const currentSociety = societies.find((society) => society.id === currentSocietyId) || societies[0];

  useEffect(() => {
    const refreshSocieties = () => {
      setSocieties(getSocieties());
      setCurrentSocietyId(getCurrentSocietyId());
    };
    window.addEventListener("societyconnect:update", refreshSocieties);
    return () => window.removeEventListener("societyconnect:update", refreshSocieties);
  }, []);

  useEffect(() => {
    if (!societyOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!societyRef.current?.contains(event.target)) setSocietyOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSocietyOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [societyOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    const account = getUserProfile(role);
    if (account.passwordHash && (email !== account.email.toLowerCase() || !(await verifyUserPassword(role, password)))) {
      setNotice("Email or password is incorrect for this demo account.");
      return;
    }
    const now = new Date().toISOString();
    saveUserProfile(role, { lastLoginAt: now, lastActiveAt: now });
    recordAccountActivity(role, { title: "Signed in", detail: `${currentSociety.name} · Current browser` });
    try {
      localStorage.setItem(`societyconnect.session.${role}`, JSON.stringify({ role, email, societyId: currentSociety.id, signedInAt: now }));
    } catch {
      setNotice("Browser storage is unavailable; continuing without a saved session.");
    }
    if (role === "resident") navigate("/resident/dashboard");
    else if (role === "president") navigate("/president/dashboard");
    else navigate("/admin/profile");
  };

  return (
    <main className="login-page-v2">
      <section className="login-visual">
        <img className="login-building-image" src={heroImage} alt="Green residential community" />
        <div className="login-visual-content">
          <a className="login-brand" href="/" aria-label="SocietyConnect home"><Icon name="leaf" size={27} /> <span>SocietyConnect</span></a>
          <div className="login-visual-copy">
            <span className="login-visual-kicker">{currentSociety.name.toUpperCase()}</span>
            <h1>A better <span>community</span> starts here.</h1>
            <p>Manage complaints, stay informed<br className="login-desktop-break" /> and build a stronger, happier society.</p>
            <div className="login-feature-list" aria-label="SocietyConnect services">
              <article className="login-feature"><span className="login-feature-icon"><Icon name="megaphone" size={23} /></span><strong>Complaints</strong><span>Raise and track<br />issues easily</span></article>
              <article className="login-feature"><span className="login-feature-icon notices"><Icon name="clipboard" size={23} /></span><strong>Notices</strong><span>Stay updated<br />with society news</span></article>
              <article className="login-feature"><span className="login-feature-icon community"><Icon name="users" size={23} /></span><strong>Community</strong><span>A more connected<br />neighbourhood</span></article>
            </div>
          </div>
          <div className="login-community-mark"><Icon name="leaf" size={25}/><span><strong>{currentSociety.name}</strong><small>{[currentSociety.city,currentSociety.state].filter(Boolean).join(", ")}</small></span></div>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-society-wrap" ref={societyRef}>
          <button className="login-society-button" type="button" aria-label={`Current society: ${currentSociety.name}`} aria-haspopup="menu" aria-expanded={societyOpen} onClick={() => setSocietyOpen((open) => !open)}>
            <Icon name="building" size={21}/><span>{currentSociety.name}</span><Icon name="chevronDown" size={16} className={societyOpen ? "rotated" : ""}/>
          </button>
          {societyOpen&&<div className="login-society-popover" role="menu" aria-label="Choose society"><strong>Choose society</strong><div className="login-society-options">{societies.map((society)=><button key={society.id} type="button" role="menuitemradio" aria-checked={society.id===currentSociety.id} className={`login-society-option ${society.id===currentSociety.id?"selected":""}`} onClick={()=>{saveCurrentSocietyId(society.id);setCurrentSocietyId(society.id);setSocietyOpen(false)}}><span className="login-society-option-mark"><Icon name="building" size={15}/></span><span className="login-society-option-copy"><strong>{society.name}</strong><small>{[society.city,society.state].filter(Boolean).join(", ")||"Society"}</small></span>{society.id===currentSociety.id&&<Icon name="check" size={15}/>}</button>)}</div></div>}
        </div>
        <div className="login-card-v2">
          <div className="login-header-v2">
            <span className="eyebrow">Welcome back</span>
            <h2>Sign in to your<br/>society account</h2>
            <p>Access your dashboard, raise complaints, view notices<br className="login-desktop-break"/> and stay connected with your community.</p>
          </div>

          <form onSubmit={handleLogin} className="login-form-v2">
            <div className="login-field">
              <label htmlFor="login-email">Email address</label>
              <div className="login-input-wrap"><Icon name="mail" size={19}/><input id="login-email" name="email" type="email" placeholder="name@example.com" autoComplete="username" required /></div>
            </div>
            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <div className="login-input-wrap"><Icon name="lock" size={19}/><input id="login-password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password" required /><button className="login-password-toggle" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)}><Icon name={showPassword ? "eyeOff" : "eye"} size={18}/></button></div>
              <button className="login-forgot" type="button" onClick={() => setNotice("Password recovery is not enabled in this demo. Please contact society management.")}>Forgot password?</button>
            </div>
            <fieldset className="login-role-field"><legend>Continue as</legend><div className="login-role-options">
              <button type="button" className={`login-role-option ${role === "resident" ? "selected" : ""}`} aria-pressed={role === "resident"} onClick={() => setRole("resident")}><Icon name="users" size={18}/><span>Resident</span></button>
              <button type="button" className={`login-role-option ${role === "president" ? "selected" : ""}`} aria-pressed={role === "president"} onClick={() => setRole("president")}><Icon name="shield" size={18}/><span>Society President</span></button>
              <button type="button" className={`login-role-option ${role === "admin" ? "selected" : ""}`} aria-pressed={role === "admin"} onClick={() => setRole("admin")}><Icon name="settings" size={18}/><span>Admin</span></button>
            </div></fieldset>
            {notice&&<p className="login-notice" role="status">{notice}</p>}
            <button className="btn btn-primary login-submit" type="submit">Sign in <Icon name="arrow" size={16} /></button>
          </form>

          <div className="login-divider"><span>or</span></div>
          <button className="login-google-button" type="button" onClick={() => setNotice("Google sign-in is not configured for this demo. Use your email and password.")}><span className="login-google-mark" aria-hidden="true">G</span>Continue with Google</button>
          <p className="login-footer-note"><Icon name="lock" size={14}/> Secure access to your society portal.</p>
        </div>
      </section>
    </main>
  );
}

export default Login;
