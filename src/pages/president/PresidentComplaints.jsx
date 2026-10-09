import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppShell from "../../components/AppShell";
import Icon from "../../components/Icon";
import { getComplaints, getStaff } from "../../data/store";

export default function PresidentComplaints(){
  const navigate=useNavigate();
  const location=useLocation();
  const params=new URLSearchParams(location.search);
  const initialMonth=params.get("month")||"";
  const [query,setQuery]=useState(params.get("search")||"");
  const [status,setStatus]=useState(params.get("status")||"All Status");
  const [priority,setPriority]=useState(params.get("priority")||"All Priority");
  const [category,setCategory]=useState(params.get("category")||"All Categories");
  const [assigned,setAssigned]=useState(params.get("assigned")||"All Assignees");
  const [month] = useState(initialMonth);
  const [complaints,setComplaints]=useState(()=>getComplaints());
  const staff=getStaff();
  useEffect(()=>{const refresh=()=>setComplaints(getComplaints());window.addEventListener("societyconnect:update",refresh);return()=>window.removeEventListener("societyconnect:update",refresh)},[]);
  const filtered=useMemo(()=>complaints.filter(c => {
    const createdValue=c.createdAt||c.date||"";
    const createdDate=new Date(String(createdValue).replace(" · "," "));
    const monthKey=createdDate && !Number.isNaN(createdDate.getTime()) ? `${createdDate.getFullYear()}-${String(createdDate.getMonth()+1).padStart(2,"0")}` : "";
    const monthMatch=!month || monthKey===month;
    const assignedMatch=assigned==="unassigned" ? !c.assignedStaffId : (assigned==="All Assignees"||c.assignedStaffId===assigned);
    return monthMatch && (status==="All Status"||c.status===status) && (priority==="All Priority"||c.priority===priority) && (category==="All Categories"||c.category===category) && assignedMatch && (`${c.title} ${c.resident||""} ${c.flat||""} ${c.id}`.toLowerCase().includes(query.toLowerCase()));
  }),[complaints,status,priority,category,assigned,query,month]);
  const st=s=>s==="Resolved"?"status-resolved":s==="In Progress"?"status-progress":"status-pending"; const pr=p=>p==="High"?"status-high":p==="Medium"?"status-medium":"status-low";
  return <AppShell role="president" active="complaints">
    <div className="page-head"><div><button className="back-link" onClick={()=>navigate("/president/dashboard")}><Icon name="back" size={15}/> Back to dashboard</button><div className="eyebrow">Management queue</div><h1>Resident complaints</h1><p>Review, prioritize, assign, and update complaints submitted by residents.</p></div><div className="summary-mini"><span>Total complaints</span><strong>{complaints.length}</strong></div></div>
    <div className="filters-bar president-filter-bar"><div className="filter-wrap"><Icon name="search" size={16} className="search-icon"/><input className="input" placeholder="Search complaints, residents, or ID..." value={query} onChange={e=>setQuery(e.target.value)}/></div><select className="select" value={status} onChange={e=>setStatus(e.target.value)}><option>All Status</option><option>Under Review</option><option>In Progress</option><option>Resolved</option></select><select className="select" value={category} onChange={e=>setCategory(e.target.value)}><option>All Categories</option><option>Maintenance</option><option>Security</option><option>Electricity</option><option>Cleanliness</option><option>Parking</option></select><select className="select" value={assigned} onChange={e=>setAssigned(e.target.value)}><option value="All Assignees">All Assignees</option><option value="unassigned">Unassigned</option>{staff.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
    <div className="complaint-filter-chips"><button className={`filter-chip ${priority==="All Priority"?"active":""}`} onClick={()=>setPriority("All Priority")}>All priority</button>{["High","Medium","Low"].map(p=><button key={p} className={`filter-chip ${priority===p?"active":""}`} onClick={()=>setPriority(p)}>{p}</button>)}<span className="filter-result-count">{filtered.length} result{filtered.length===1?"":"s"}</span></div>
    <div className="surface table-surface"><div className="table-head president-complaints-head"><span>Complaint</span><span>Resident</span><span>Category</span><span>Assigned</span><span>Priority</span><span>Status</span><span>Date</span><span>Action</span></div>{filtered.map(c=>{const person=staff.find(s=>s.id===c.assignedStaffId);return <div className="table-row president-complaints-row" key={c.id}><div><div className="table-title">{c.title}</div><div className="table-sub">{c.id}</div></div><div>{c.resident||"Resident"}<div className="table-sub">{c.flat?`Block ${c.block}, Flat ${c.flat}`:""}</div></div><div>{c.category}</div><div><span className={person?"assigned-person":"unassigned-person"}>{person?.name||"Unassigned"}</span></div><div><span className={`status ${pr(c.priority)}`}>{c.priority}</span></div><div><span className={`status ${st(c.status)}`}>{c.status}</span></div><div>{c.date}</div><div className="table-action"><button className="btn btn-primary" style={{minHeight:32,padding:"0 11px"}} onClick={()=>navigate(`/president/complaints/${c.id}`)}>Review</button></div></div>})}{!filtered.length&&<div className="empty-state"><strong>No complaints match these filters</strong><p>Try a different search or clear one of the filters.</p></div>}<div className="table-pagination"><span>Showing {filtered.length} of {complaints.length}</span></div></div>
  </AppShell>
}
