import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { createSociety, getNotifications, getSocieties, getSocietyOverview, getUserProfile, markAllNotificationsRead, markNotificationRead, setCurrentSocietyId } from "../data/store";
import adminModules from "../data/adminModules";
const residentNav=[{key:"overview",label:"Overview",icon:"home",to:"/resident/dashboard"},{key:"complaints",label:"My Complaints",icon:"clipboard",to:"/resident/complaints"},{key:"feedback",label:"Feedback",icon:"message",to:"/resident/feedback"}];
const presidentNav=[{key:"overview",label:"Overview",icon:"home",to:"/president/dashboard"},{key:"complaints",label:"Complaints",icon:"clipboard",to:"/president/complaints"},{key:"staff",label:"Staff",icon:"userPlus",to:"/president/staff"},{key:"residents",label:"Residents",icon:"users",to:"/president/residents"},{key:"notices",label:"Notices",icon:"megaphone",to:"/president/notices"},{key:"analytics",label:"Analytics",icon:"chart",to:"/president/analytics"}];
export default function AppShell({role="resident",active="overview",children,section=""}){
  const navigate=useNavigate(); const [mobileOpen,setMobileOpen]=useState(false); const [notificationOpen,setNotificationOpen]=useState(false); const [societyMenuOpen,setSocietyMenuOpen]=useState(false); const [addSocietyOpen,setAddSocietyOpen]=useState(false); const [societyError,setSocietyError]=useState(""); const [societyForm,setSocietyForm]=useState({name:"",city:"",state:"",address:"",phone:"",email:"",registrationId:"",blocks:"A"}); const [societies,setSocieties]=useState(()=>getSocieties()); const [notifications,setNotifications]=useState(()=>getNotifications()); const [societyOverview,setSocietyOverview]=useState(()=>getSocietyOverview()); const [search,setSearch]=useState(""); const societyContextRef=useRef(null); const societyButtonRef=useRef(null);
  const isPresident=role==="president", isAdmin=role==="admin", isResident=role==="resident", nav=isPresident?presidentNav:isAdmin?adminModules:residentNav; const [profile,setProfile]=useState(()=>getUserProfile(role)); const person=isPresident?{initial:(profile.name||"P").split(" ").map(v=>v[0]).slice(0,2).join(""),name:profile.name,meta:"Society President"}:isAdmin?{initial:(profile.name||"A").split(" ").map(v=>v[0]).slice(0,2).join(""),name:profile.name,meta:"Administrator"}:{initial:(profile.name||"A").split(" ").map(v=>v[0]).slice(0,2).join(""),name:profile.name,meta:`Block ${profile.block} • Flat ${profile.flat}`};
  const [installPrompt,setInstallPrompt]=useState(null);
  const unreadCount=useMemo(()=>notifications.filter(i=>i.unread).length,[notifications]);
  useEffect(()=>{
    const refresh=()=>{setNotifications(getNotifications());setProfile(getUserProfile(role));setSocietyOverview(getSocietyOverview());setSocieties(getSocieties());};
    const onStorage=e=>{if(["societyconnect.notifications","societyconnect.societies","societyconnect.activeSociety"].includes(e.key))refresh()};
    let channel;
    try{if(typeof BroadcastChannel!=="undefined"){channel=new BroadcastChannel("societyconnect");channel.onmessage=refresh}}catch{ /* BroadcastChannel is optional in this environment. */ }
    window.addEventListener("societyconnect:update",refresh);
    window.addEventListener("storage",onStorage);
    const onInstall=e=>{e.preventDefault();setInstallPrompt(e)};
    window.addEventListener("beforeinstallprompt",onInstall);
    return()=>{window.removeEventListener("societyconnect:update",refresh);window.removeEventListener("storage",onStorage);window.removeEventListener("beforeinstallprompt",onInstall);channel?.close?.()}
  },[role]);
  useEffect(()=>{
    if(!societyMenuOpen)return undefined;
    const closeOnOutsideClick=event=>{if(!societyContextRef.current?.contains(event.target))setSocietyMenuOpen(false)};
    const closeOnEscape=event=>{if(event.key==="Escape"){setSocietyMenuOpen(false);societyButtonRef.current?.focus()}};
    document.addEventListener("pointerdown",closeOnOutsideClick);
    document.addEventListener("keydown",closeOnEscape);
    return()=>{document.removeEventListener("pointerdown",closeOnOutsideClick);document.removeEventListener("keydown",closeOnEscape)};
  },[societyMenuOpen]);
  const installApp=async()=>{if(!installPrompt)return;await installPrompt.prompt();setInstallPrompt(null)};
  const handleSearchSubmit=e=>{e.preventDefault();if(!search.trim()||isPresident)return;navigate(`/resident/complaints?search=${encodeURIComponent(search.trim())}`)};
  const openNotification=item=>{markNotificationRead(item.id);setNotifications(getNotifications());setNotificationOpen(false);if(item.complaintId){navigate(`${isPresident?"/president/complaints/":"/resident/complaints/"}${item.complaintId}`)}};
  const societyBase=isAdmin?"/admin":isPresident?"/president":"/resident";
  const navigateFromSocietyMenu=path=>{setSocietyMenuOpen(false);navigate(path)};
  const switchSociety=societyId=>{if(setCurrentSocietyId(societyId)){setSocietyMenuOpen(false);window.location.reload()}};
  const addSocietyRoute=()=>{setSocietyMenuOpen(false);navigate("/admin/society/new")};
  const submitSociety=event=>{
    event.preventDefault();
    try{
      const blockNames=[...new Set(societyForm.blocks.split(",").map(name=>name.trim()).filter(Boolean))];
      if(!blockNames.length){setSocietyError("Add at least one block name.");return}
      createSociety({...societyForm,blockNames});
      setSocietyMenuOpen(false);
      setAddSocietyOpen(false);
      window.location.reload();
    }catch(error){setSocietyError(error.message||"Unable to add this society.")}
  };
  return <div className={`app-shell ${isPresident?"is-president":""}`}>
    <div className={`mobile-overlay ${mobileOpen?"show":""}`} onClick={()=>setMobileOpen(false)}/>
    <aside className={`app-sidebar ${mobileOpen?"open":""}`}>
      <div className="sidebar-brand"><div className="brand-mark"><Icon name="leaf" size={22}/></div><div><div className="brand-name">SocietyConnect</div><div className="brand-subtitle">{societyOverview.name}</div></div></div>
      <div className="sidebar-section-label">{isPresident?"MANAGEMENT":isAdmin?"ADMINISTRATION":"HOME"}</div>
      <nav className="sidebar-nav" aria-label={isAdmin?"Administration modules":"Primary navigation"}>{nav.map(item=><a key={item.key} href={item.to} className={active===item.key?"active":""} aria-current={active===item.key?"page":undefined} onClick={event=>{event.preventDefault();setMobileOpen(false);navigate(item.to)}}><Icon name={item.icon} size={17}/><span>{item.label}</span></a>)}
        {!isAdmin&&<button className={`sidebar-link muted ${active==="profile"?"active": ""}`} type="button" onClick={()=>{setMobileOpen(false);navigate(isPresident?"/president/profile":"/resident/profile")}}><Icon name="user" size={17}/><span>Profile</span></button>}
      </nav>
      <div className="sidebar-spacer"/><div className="sidebar-account">{profile.photo?<img className="avatar avatar-sm sidebar-account-photo" src={profile.photo} alt={`${person.name} profile`}/>:<div className="avatar avatar-sm">{person.initial}</div>}<div className="account-copy"><strong>{person.name}</strong><span>{person.meta}</span></div></div>
      <button className="sidebar-logout" onClick={()=>{try{localStorage.removeItem(`societyconnect.session.${role}`)}catch{ /* Browser storage may be unavailable. */ }navigate("/")}}><Icon name="logout" size={17}/><span>Sign out</span></button>
    </aside>
    <main className="app-main"><header className="topbar"><button className="mobile-menu" onClick={()=>setMobileOpen(true)} aria-label="Open navigation"><Icon name="menu" size={21}/></button>
      {!isAdmin&&<form className="topbar-search" onSubmit={handleSearchSubmit}><Icon name="search" size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} aria-label="Search" placeholder={isPresident?"Search complaints, residents...":"Search your complaints..."}/></form>}
      <div className="topbar-actions">{installPrompt&&<button className="install-button" onClick={installApp}><Icon name="download" size={15}/> Install app</button>}<div className="notification-wrap"><button className={`icon-button notification ${notificationOpen?"active":""}`} aria-label="Notifications" onClick={()=>setNotificationOpen(o=>!o)}><Icon name="bell" size={18}/>{unreadCount>0&&<span className="notification-dot"/>}</button>
        {notificationOpen&&<div className="notification-panel"><div className="notification-head"><div><strong>Notifications</strong><span>{unreadCount?`${unreadCount} unread`:"You're all caught up"}</span></div>{unreadCount>0&&<button onClick={()=>{markAllNotificationsRead();setNotifications(getNotifications())}}>Mark all read</button>}</div><div className="notification-list">{notifications.slice(0,6).map(item=><button type="button" key={item.id} className={`notification-item ${item.unread?"unread":""}`} onClick={()=>openNotification(item)}><span className={`notification-icon ${item.type||"notice"}`}><Icon name={item.type==="success"?"check":item.type==="complaint"?"clipboard":"building"} size={15}/></span><span className="notification-copy"><strong>{item.title}</strong><span>{item.body}</span><small>{item.time}</small></span>{item.unread&&<i/>}</button>)}</div></div>}
      </div><div className="society-context" ref={societyContextRef}>
        <button ref={societyButtonRef} className={`society-switcher ${societyMenuOpen?"menu-open":""}`} type="button" aria-label={`Current society: ${societyOverview.name}`} aria-haspopup="menu" aria-expanded={societyMenuOpen} aria-controls="society-context-menu" onClick={()=>setSocietyMenuOpen(open=>!open)}>
          <Icon name="building" size={17}/><span>{societyOverview.name}</span><Icon name="chevronDown" size={14} className={`switch-chevron ${societyMenuOpen?"open":""}`}/>
        </button>
        {societyMenuOpen&&<div className="society-menu" id="society-context-menu" role="menu" aria-label="Current society">
          <div className="society-menu-heading">PARENT SOCIETY</div>
          <div className="society-menu-identity"><strong>{societyOverview.name}</strong><span>{societyOverview.city}, {societyOverview.state}</span></div>
          <div className="society-menu-stats"><div><strong>{societyOverview.blockCount}</strong><span>Blocks</span></div><div><strong>{societyOverview.residentCount}</strong><span>Residents</span></div><div><strong>{societyOverview.staffCount}</strong><span>Staff</span></div></div>
          <div className="society-menu-societies"><span className="society-menu-list-label">SWITCH SOCIETY</span>{societies.map(society=><button key={society.id} type="button" role="menuitemradio" aria-checked={society.id===societyOverview.id} className={society.id===societyOverview.id?"selected":""} onClick={()=>switchSociety(society.id)}><span className="society-option-mark"><Icon name="building" size={14}/></span><span className="society-option-copy"><strong>{society.name}</strong><small>{[society.city,society.state].filter(Boolean).join(", ")||"Society"}</small></span>{society.id===societyOverview.id&&<Icon name="check" size={15}/>}</button>)}</div>
          <div className="society-menu-links">
            <button type="button" role="menuitem" onClick={()=>navigateFromSocietyMenu(`${societyBase}/society`)}>Society parent details <Icon name="arrow" size={14}/></button>
            <button type="button" role="menuitem" onClick={()=>navigateFromSocietyMenu(`${societyBase}/blocks`)}>Blocks <Icon name="arrow" size={14}/></button>
            <button type="button" role="menuitem" onClick={()=>navigateFromSocietyMenu(isResident?"/resident/society":isAdmin?"/president/society/settings?role=admin":"/president/society/settings")}>{isResident?"Society information":"Society settings"} <Icon name="arrow" size={14}/></button>
          </div>
          {isAdmin&&<div className="society-menu-switch"><button type="button" onClick={addSocietyRoute}><Icon name="plus" size={14}/> Add new society</button></div>}
        </div>}
      </div></div></header>
      <div className={`page-container ${section}`}>{children}</div>
    </main>
    {addSocietyOpen&&<div className="society-dialog-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setAddSocietyOpen(false)}}><section className="society-dialog" role="dialog" aria-modal="true" aria-labelledby="add-society-title"><button className="society-dialog-close" type="button" aria-label="Close add society dialog" onClick={()=>setAddSocietyOpen(false)}>×</button><div className="eyebrow">Administration</div><h2 id="add-society-title">Add new society</h2><p>Create a new parent society workspace. Each block can be added under it and you can switch between societies anytime.</p><form onSubmit={submitSociety}>
      <label><span>Society name</span><input autoFocus required value={societyForm.name} onChange={event=>setSocietyForm({...societyForm,name:event.target.value})} placeholder="e.g. Lakeview Apartments"/></label>
      <div className="society-form-row"><label><span>City</span><input required value={societyForm.city} onChange={event=>setSocietyForm({...societyForm,city:event.target.value})}/></label><label><span>State</span><input required value={societyForm.state} onChange={event=>setSocietyForm({...societyForm,state:event.target.value})}/></label></div>
      <label><span>Address</span><input required value={societyForm.address} onChange={event=>setSocietyForm({...societyForm,address:event.target.value})}/></label>
      <div className="society-form-row"><label><span>Contact number</span><input type="tel" value={societyForm.phone} onChange={event=>setSocietyForm({...societyForm,phone:event.target.value})}/></label><label><span>Contact email</span><input type="email" value={societyForm.email} onChange={event=>setSocietyForm({...societyForm,email:event.target.value})}/></label></div>
      <div className="society-form-row"><label><span>Registration ID</span><input value={societyForm.registrationId} onChange={event=>setSocietyForm({...societyForm,registrationId:event.target.value})}/></label><label><span>Blocks (comma-separated)</span><input required value={societyForm.blocks} onChange={event=>setSocietyForm({...societyForm,blocks:event.target.value})} placeholder="A, B, C"/></label></div>
      {societyError&&<p className="society-form-error" role="alert">{societyError}</p>}
      <div className="society-dialog-actions"><button className="btn btn-secondary" type="button" onClick={()=>setAddSocietyOpen(false)}>Cancel</button><button className="btn btn-primary" type="submit"><Icon name="plus" size={14}/> Add society</button></div>
    </form></section></div>}
  </div>
}
