const COMPLAINTS_KEY = "societyconnect.complaints";
const FEEDBACK_KEY = "societyconnect.feedback";
const NOTIFICATIONS_KEY = "societyconnect.notifications";
const STAFF_KEY = "societyconnect.staff";
const RESIDENTS_KEY = "societyconnect.residents";
const NOTICES_KEY = "societyconnect.notices";

const seedComplaints = [
  { id:"CMP001", title:"Water leakage in Block B", category:"Maintenance", date:"10 Aug 2026", status:"In Progress", priority:"High", block:"B", flat:"204", resident:"Archana", residentId:"R001", assignedStaffId:"ST001", description:"There is continuous water leakage near the bathroom area in Block B. The leakage has increased since yesterday and water is collecting on the floor.", attachments:["bathroom-leak.jpg","leakage-floor.jpg"], createdAt:"10 Aug 2026 · 10:30 AM", timeline:[{label:"Submitted",time:"10 Aug 2026 · 10:30 AM",note:"Your complaint was successfully submitted."},{label:"Reviewed",time:"10 Aug 2026 · 12:15 PM",note:"Society President reviewed your complaint."},{label:"Work started",time:"11 Aug 2026 · 09:00 AM",note:"Maintenance team has started working on the issue."}], response:"We have received your complaint. The maintenance team has started work and will update you once it is resolved." },
  { id:"CMP002", title:"Parking area lights", category:"Electricity", date:"08 Aug 2026", status:"Resolved", priority:"Medium", block:"A", flat:"102", resident:"Rahul", residentId:"R002", assignedStaffId:"ST002", description:"Two parking area lights were not working during the evening hours.", attachments:[], createdAt:"08 Aug 2026 · 08:20 PM", timeline:[{label:"Submitted",time:"08 Aug 2026 · 08:20 PM",note:"Your complaint was successfully submitted."},{label:"Reviewed",time:"09 Aug 2026 · 09:10 AM",note:"The issue was assigned to the electrical team."},{label:"Work started",time:"09 Aug 2026 · 11:30 AM",note:"Replacement work started."},{label:"Resolved",time:"09 Aug 2026 · 04:15 PM",note:"Both lights are working again."}], response:"The faulty lights have been replaced and the parking area has been checked." },
  { id:"CMP003", title:"Lift not working properly", category:"Maintenance", date:"06 Aug 2026", status:"Under Review", priority:"Medium", block:"B", flat:"204", resident:"Archana", residentId:"R001", assignedStaffId:"ST001", description:"The lift makes a loud sound between the second and third floors.", attachments:[], createdAt:"06 Aug 2026 · 07:35 PM", timeline:[{label:"Submitted",time:"06 Aug 2026 · 07:35 PM",note:"Your complaint was successfully submitted."},{label:"Reviewed",time:"07 Aug 2026 · 10:05 AM",note:"The maintenance team is checking the lift."}], response:"The issue has been shared with the lift service team for inspection." },
  { id:"CMP004", title:"Cleaning required near Block A", category:"Cleanliness", date:"04 Aug 2026", status:"Resolved", priority:"Low", block:"A", flat:"102", resident:"Rahul", residentId:"R002", assignedStaffId:"ST003", description:"The common area near Block A needed additional cleaning.", attachments:[], createdAt:"04 Aug 2026 · 08:00 AM", timeline:[{label:"Submitted",time:"04 Aug 2026 · 08:00 AM",note:"Your complaint was successfully submitted."},{label:"Resolved",time:"04 Aug 2026 · 01:20 PM",note:"Cleaning staff completed the request."}], response:"The common area has been cleaned and checked." }
];
const seedNotifications = [
  {id:"N001",title:"Complaint update",body:"Your water leakage complaint is now in progress.",time:"Today · 9:00 AM",unread:true,type:"complaint",complaintId:"CMP001"},
  {id:"N002",title:"Society notice",body:"Water supply maintenance is scheduled for tomorrow, 10 AM–2 PM.",time:"Yesterday · 6:30 PM",unread:true,type:"notice"},
  {id:"N003",title:"Complaint resolved",body:"Parking area lights complaint has been marked resolved.",time:"08 Aug · 4:15 PM",unread:false,type:"success",complaintId:"CMP002"}
];
const seedStaff = [
  {id:"ST001",name:"Ramesh Kumar",role:"Maintenance Lead",specialty:"Maintenance",phone:"+91 90000 11001",status:"Active",joined:"12 Jan 2025",avatar:"RK"},
  {id:"ST002",name:"Vikram Shah",role:"Electrician",specialty:"Electricity",phone:"+91 90000 11002",status:"Active",joined:"06 Mar 2025",avatar:"VS"},
  {id:"ST003",name:"Meena Patel",role:"Housekeeping",specialty:"Cleanliness",phone:"+91 90000 11003",status:"Active",joined:"18 Feb 2025",avatar:"MP"},
  {id:"ST004",name:"Arjun Singh",role:"Security Supervisor",specialty:"Security",phone:"+91 90000 11004",status:"On Leave",joined:"22 Apr 2025",avatar:"AS"}
];
const seedResidents = [
  {id:"R001",name:"Archana Sharma",flat:"B-204",block:"B",phone:"+91 98765 10001",email:"archana@example.com",status:"Active",joined:"14 Jun 2024"},
  {id:"R002",name:"Rahul Verma",flat:"A-102",block:"A",phone:"+91 98765 10002",email:"rahul@example.com",status:"Active",joined:"20 Jul 2024"},
  {id:"R003",name:"Sneha Gupta",flat:"C-305",block:"C",phone:"+91 98765 10003",email:"sneha@example.com",status:"Active",joined:"11 Aug 2024"},
  {id:"R004",name:"Aman Jain",flat:"A-208",block:"A",phone:"+91 98765 10004",email:"aman@example.com",status:"Active",joined:"03 Sep 2024"},
  {id:"R005",name:"Priya Mehta",flat:"B-108",block:"B",phone:"+91 98765 10005",email:"priya@example.com",status:"Active",joined:"29 Sep 2024"},
  {id:"R006",name:"Mehul Soni",flat:"C-204",block:"C",phone:"+91 98765 10006",email:"mehul@example.com",status:"Inactive",joined:"17 Nov 2024"},
  {id:"R007",name:"Kavya Rao",flat:"C-118",block:"C",phone:"+91 98765 10007",email:"kavya@example.com",status:"Active",joined:"08 Dec 2024"}
];

export const SOCIETY_INFO = { name:"Greenview Residency", city:"Raigarh", state:"Chhattisgarh", address:"Greenview Residency, Raigarh, Chhattisgarh", phone:"+91 90000 10000", email:"president@greenview.example.com", blockNames:["A","B","C"] };

const PROFILE_KEYS = { resident: "societyconnect.profile.resident", president: "societyconnect.profile.president", admin: "societyconnect.profile.admin" };
const seedProfiles = {
  resident: { id:"R001", name:"Archana Sharma", email:"archana@example.com", phone:"+91 98765 10001", role:"Resident", society:"Greenview Residency", block:"B", flat:"204", joined:"14 Jun 2024", notifications:true, photo:"" },
  president: { id:"P001", name:"Society President", email:"president@greenview.example.com", phone:"+91 90000 10000", role:"President", society:"Greenview Residency", address:"Greenview Residency, Raigarh", joined:"12 Jan 2024", notifications:true, photo:"" },
  admin: { id:"A001", name:"Society Administrator", email:"admin@greenview.example.com", phone:"+91 90000 10001", role:"Administrator", society:"Greenview Residency", address:"Greenview Residency, Raigarh", joined:"12 Jan 2024", notifications:true, photo:"" }
};

const seedNotices = [
  {id:"NT001",title:"Water supply maintenance",category:"Maintenance",body:"Water supply will be unavailable in Block B tomorrow from 10 AM to 2 PM.",date:"25 Sep 2026",time:"10:00 AM",status:"Published",audience:"All residents"},
  {id:"NT002",title:"Security gate system update",category:"Security",body:"The new entry system will begin on 1 October. Residents will receive access instructions shortly.",date:"23 Sep 2026",time:"05:30 PM",status:"Published",audience:"All residents"},
  {id:"NT003",title:"Monthly maintenance inspection",category:"Maintenance",body:"Routine lift and electrical inspections will take place across Blocks A, B and C this weekend.",date:"22 Sep 2026",time:"09:15 AM",status:"Published",audience:"All residents"}
];
function read(key,fallback){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new CustomEvent("societyconnect:update",{detail:{key}}));if(typeof BroadcastChannel!=="undefined"){try{const channel=new BroadcastChannel("societyconnect");channel.postMessage({key});channel.close()}catch{}}}catch{}}
function makeId(prefix,items){return `${prefix}${String(items.length+1).padStart(3,"0")}`}
export function getComplaints(){return read(COMPLAINTS_KEY,seedComplaints)}
export function saveComplaints(complaints){write(COMPLAINTS_KEY,complaints)}
export function getComplaint(id){return getComplaints().find(c=>c.id===id)}
export function updateComplaint(id,patch){const updated=getComplaints().map(c=>c.id===id?{...c,...patch}:c);saveComplaints(updated);return updated.find(c=>c.id===id)}
export function createComplaint(payload){const complaints=getComplaints(), id=makeId("CMP",complaints), now=new Date();const date=now.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});const time=now.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});const complaint={...payload,id,date,createdAt:`${date} · ${time}`,status:"Under Review",timeline:[{label:"Submitted",time:`${date} · ${time}`,note:"Your complaint was successfully submitted."}],response:"Your complaint has been received and is waiting for society management review."};saveComplaints([complaint,...complaints]);createNotification({title:"Complaint submitted",body:`${complaint.title} was submitted successfully and is under review.`,time:"Just now",type:"complaint",complaintId:id});return complaint}
export function assignComplaint(id,staffId){const staff=getStaff().find(s=>s.id===staffId);const complaint=getComplaint(id);if(!complaint)return null;const updated=updateComplaint(id,{assignedStaffId:staffId,assignedStaffName:staff?.name||"Unassigned"});createNotification({title:"Complaint assigned",body:`${complaint.title} has been assigned to ${staff?.name||"a staff member"}.`,time:"Just now",type:"complaint",complaintId:id});return updated}
export function getFeedback(){return read(FEEDBACK_KEY,[])}
export function saveFeedback(entry){write(FEEDBACK_KEY,[{...entry,id:`FB${Date.now()}`,submittedAt:new Date().toISOString()},...getFeedback()])}
export function getNotifications(){const stored=read(NOTIFICATIONS_KEY,null);if(stored)return stored;write(NOTIFICATIONS_KEY,seedNotifications);return seedNotifications}
export function createNotification(notification){write(NOTIFICATIONS_KEY,[{id:`N${Date.now()}`,unread:true,...notification},...getNotifications()])}
export function markAllNotificationsRead(){write(NOTIFICATIONS_KEY,getNotifications().map(item=>({...item,unread:false})))}
export function markNotificationRead(id){write(NOTIFICATIONS_KEY,getNotifications().map(item=>item.id===id?{...item,unread:false}:item))}

export function getStaff(){return read(STAFF_KEY,seedStaff)}
export function saveStaff(items){write(STAFF_KEY,items)}
export function createStaff(payload){const items=getStaff();const item={...payload,id:makeId("ST",items),joined:payload.joined||new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),avatar:payload.name.split(" ").map(v=>v[0]).slice(0,2).join("").toUpperCase()};saveStaff([...items,item]);createNotification({title:"New staff member added",body:`${item.name} was added to the society team.`,time:"Just now",type:"notice"});return item}
export function toggleStaffStatus(id){const items=getStaff().map(item=>item.id===id?{...item,status:item.status==="Active"?"On Leave":"Active"}:item);saveStaff(items);return items.find(item=>item.id===id)}

export function getResidents(){return read(RESIDENTS_KEY,seedResidents)}
export function getSocietyOverview(){
  const residents=getResidents();
  const staff=getStaff();
  const blocks=SOCIETY_INFO.blockNames.map(name=>{
    const blockResidents=residents.filter(item=>item.block===name);
    return {name,flatCount:new Set(blockResidents.map(item=>item.flat).filter(Boolean)).size,residentCount:blockResidents.length};
  });
  return {...SOCIETY_INFO,blockCount:blocks.length,residentCount:residents.length,staffCount:staff.length,blocks};
}
export function saveResidents(items){write(RESIDENTS_KEY,items)}
export function createResident(payload){const items=getResidents();const item={...payload,id:makeId("R",items),joined:payload.joined||new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),status:payload.status||"Active"};saveResidents([...items,item]);createNotification({title:"Resident added",body:`${item.name} has been added to the resident directory.`,time:"Just now",type:"notice"});return item}
export function toggleResidentStatus(id){const items=getResidents().map(item=>item.id===id?{...item,status:item.status==="Active"?"Inactive":"Active"}:item);saveResidents(items);return items.find(item=>item.id===id)}

export function getNotices(){return read(NOTICES_KEY,seedNotices)}
export function saveNotices(items){write(NOTICES_KEY,items)}
export function createNotice(payload){const items=getNotices();const now=new Date();const item={...payload,id:makeId("NT",items),date:payload.date||now.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),time:payload.time||now.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}),status:payload.status||"Published",audience:payload.audience||"All residents"};saveNotices([item,...items]);if(item.status==="Published")createNotification({title:"New society notice",body:item.title,time:"Just now",type:"notice"});return item}
export function deleteNotice(id){saveNotices(getNotices().filter(item=>item.id!==id))}
export function toggleNoticeStatus(id){const items=getNotices().map(item=>item.id===id?{...item,status:item.status==="Published"?"Draft":"Published"}:item);saveNotices(items);return items.find(item=>item.id===id)}

export function getAnalytics(){
  const complaints=getComplaints();
  const total=complaints.length; const resolved=complaints.filter(c=>c.status==="Resolved").length; const active=complaints.filter(c=>c.status!=="Resolved").length;
  const categories=complaints.reduce((acc,c)=>(acc[c.category]=(acc[c.category]||0)+1,acc),{});
  const statuses=complaints.reduce((acc,c)=>(acc[c.status]=(acc[c.status]||0)+1,acc),{});
  const assignments=complaints.filter(c=>c.assignedStaffId).reduce((acc,c)=>(acc[c.assignedStaffId]=(acc[c.assignedStaffId]||0)+1,acc),{});
  const avgResolution=resolved?Math.max(1,Math.round((resolved*2.6)+(total-resolved)*1.4)):0;
  return {total,resolved,active,categories,statuses,assignments,avgResolution};
}

export function getResidentById(id){return getResidents().find(item=>item.id===id)}
export function getWhatsAppUrl(phone,message=""){const digits=String(phone||"").replace(/\D/g,"");const normalized=digits.startsWith("91")?digits:(digits.length===10?`91${digits}`:digits);return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`}

export function getUserProfile(role="resident"){return read(PROFILE_KEYS[role]||PROFILE_KEYS.resident,seedProfiles[role]||seedProfiles.resident)}
export function saveUserProfile(role="resident",patch={}){
  const key=PROFILE_KEYS[role]||PROFILE_KEYS.resident;
  const current=getUserProfile(role);
  const next={...current,...patch};
  write(key,next);
  if(role==="resident"){
    const residents=getResidents();
    const index=residents.findIndex(item=>item.id===next.id);
    if(index>=0){const updated={...residents[index],name:next.name,email:next.email,phone:next.phone};residents[index]=updated;saveResidents(residents)}
  }
  return next;
}
