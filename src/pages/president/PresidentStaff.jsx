import { useMemo, useState } from "react";
import AppShell from "../../components/AppShell";
import Icon from "../../components/Icon";
import { getComplaints, getStaff, createStaff, toggleStaffStatus } from "../../data/store";
import "./Phase2.css";

export default function PresidentStaff(){
  const [staff,setStaff]=useState(()=>getStaff());
  const [query,setQuery]=useState("");
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({name:"",role:"",specialty:"Maintenance",phone:""});
  const complaints=getComplaints();
  const filtered=useMemo(()=>staff.filter(s=>`${s.name} ${s.role} ${s.specialty}`.toLowerCase().includes(query.toLowerCase())),[staff,query]);
  const workload=id=>complaints.filter(c=>c.assignedStaffId===id && c.status!=="Resolved").length;
  const submit=e=>{e.preventDefault();if(!form.name.trim()||!form.role.trim())return;createStaff({...form,status:"Active"});setStaff(getStaff());setForm({name:"",role:"",specialty:"Maintenance",phone:""});setShowForm(false)};
  return <AppShell role="president" active="staff">
    <div className="page-head"><div><div className="eyebrow">People operations</div><h1>Staff management</h1><p>Manage the society team and see who is currently handling resident requests.</p></div><button className="btn btn-primary" onClick={()=>setShowForm(v=>!v)}><Icon name="plus" size={15}/> Add staff member</button></div>
    <section className="phase2-toolbar"><div className="filter-search"><Icon name="search" size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search staff, role, specialty..."/></div><div className="phase2-toolbar-stat"><span>Team members</span><strong>{staff.length}</strong></div></section>
    {showForm&&<form className="surface phase2-form" onSubmit={submit}><div className="section-header"><div><h2>Add staff member</h2><p>Add a person who can be assigned to resident requests.</p></div></div><div className="phase2-form-grid"><label><span>Name</span><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name"/></label><label><span>Role</span><input className="input" value={form.role} onChange={e=>setForm({...form,role:e.target.value})} placeholder="e.g. Maintenance Lead"/></label><label><span>Specialty</span><select className="select" value={form.specialty} onChange={e=>setForm({...form,specialty:e.target.value})}><option>Maintenance</option><option>Electricity</option><option>Cleanliness</option><option>Security</option><option>Plumbing</option></select></label><label><span>Phone</span><input className="input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone number"/></label></div><div className="form-footer"><button type="button" className="btn btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button><button className="btn btn-primary">Add member</button></div></form>}
    <div className="staff-grid">{filtered.map(member=><article className="surface staff-card" key={member.id}><div className="staff-card-top"><div className="avatar staff-avatar">{member.avatar}</div><div className="staff-title"><strong>{member.name}</strong><span>{member.role}</span></div><span className={`status ${member.status==="Active"?"status-resolved":"status-pending"}`}>{member.status}</span></div><div className="staff-meta-grid"><div><span>Specialty</span><strong>{member.specialty}</strong></div><div><span>Open workload</span><strong>{workload(member.id)}</strong></div><div><span>Phone</span><strong>{member.phone}</strong></div></div><div className="staff-card-footer"><span>Joined {member.joined}</span><button className="text-link" onClick={()=>{toggleStaffStatus(member.id);setStaff(getStaff())}}>{member.status==="Active"?"Mark on leave":"Mark active"}</button></div></article>)}</div>
    {!filtered.length&&<div className="surface empty-state"><strong>No staff members found</strong><p>Try another search or add a new team member.</p></div>}
  </AppShell>
}
