const COMPLAINTS_KEY = "societyconnect.complaints";
const FEEDBACK_KEY = "societyconnect.feedback";
const NOTIFICATIONS_KEY = "societyconnect.notifications";
const STAFF_KEY = "societyconnect.staff";
const RESIDENTS_KEY = "societyconnect.residents";
const NOTICES_KEY = "societyconnect.notices";
const SOCIETIES_KEY = "societyconnect.societies";
const BLOCKS_KEY = "societyconnect.blocks";
const ACTIVE_SOCIETY_KEY = "societyconnect.activeSociety";

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

export const SOCIETY_INFO = { id:"SOC001", name:"Greenview Residency", location:"Raigarh", city:"Raigarh", state:"Chhattisgarh", address:"Greenview Residency, Raigarh, Chhattisgarh", phone:"+91 90000 10000", email:"president@greenview.example.com", registrationId:"Not provided", logo:"", status:"Active", createdAt:new Date().toISOString(), blockNames:["A","B","C"] };
const DEFAULT_SOCIETY_ID = "SOC001";
const seedSocieties = [{ ...SOCIETY_INFO }];
const seedBlocks = [];

const PROFILE_KEYS = { resident: "societyconnect.profile.resident", president: "societyconnect.profile.president", admin: "societyconnect.profile.admin" };
const ACCOUNT_ACTIVITY_KEYS = { resident: "societyconnect.activity.resident", president: "societyconnect.activity.president", admin: "societyconnect.activity.admin" };
const defaultNotificationPreferences = { complaintUpdates:true, societyNotices:true, staffAssignments:true, whatsapp:false, email:true, browser:false };
const seedProfiles = {
  resident: { id:"R001", accountId:"R001", name:"Archana Sharma", email:"archana@example.com", phone:"+91 98765 10001", role:"Resident", society:"Greenview Residency", block:"B", flat:"204", joined:"14 Jun 2024", notifications:true, notificationPreferences:{...defaultNotificationPreferences}, timezone:"Asia/Kolkata", language:"English", twoFactorEnabled:false, photo:"" },
  president: { id:"P001", accountId:"P001", name:"Society President", email:"president@greenview.example.com", phone:"+91 90000 10000", role:"President", society:"Greenview Residency", address:"Greenview Residency, Raigarh", joined:"12 Jan 2024", notifications:true, notificationPreferences:{...defaultNotificationPreferences}, timezone:"Asia/Kolkata", language:"English", twoFactorEnabled:false, photo:"" },
  admin: { id:"A001", accountId:"ADM-001", name:"Society Administrator", email:"admin@greenview.example.com", phone:"+91 90000 10001", role:"Administrator", society:"Greenview Residency", address:"Greenview Residency, Raigarh", joined:"12 Jan 2024", notifications:true, notificationPreferences:{...defaultNotificationPreferences}, timezone:"Asia/Kolkata", language:"English", twoFactorEnabled:false, photo:"" }
};

const seedNotices = [
  {id:"NT001",title:"Water supply maintenance",category:"Maintenance",body:"Water supply will be unavailable in Block B tomorrow from 10 AM to 2 PM.",date:"25 Sep 2026",time:"10:00 AM",status:"Published",audience:"All residents"},
  {id:"NT002",title:"Security gate system update",category:"Security",body:"The new entry system will begin on 1 October. Residents will receive access instructions shortly.",date:"23 Sep 2026",time:"05:30 PM",status:"Published",audience:"All residents"},
  {id:"NT003",title:"Monthly maintenance inspection",category:"Maintenance",body:"Routine lift and electrical inspections will take place across Blocks A, B and C this weekend.",date:"22 Sep 2026",time:"09:15 AM",status:"Published",audience:"All residents"}
];
function read(key,fallback){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new CustomEvent("societyconnect:update",{detail:{key}}));if(typeof BroadcastChannel!=="undefined"){try{const channel=new BroadcastChannel("societyconnect");channel.postMessage({key});channel.close()}catch{ /* BroadcastChannel is optional for this update. */ }}}catch{ /* Storage may be unavailable in some browsers. */ }}
function makeId(prefix,items){return `${prefix}${String(items.length+1).padStart(3,"0")}`}
function getSocietyRecords(key,fallback,societyId=getCurrentSocietyId()){
  const stored=read(key,null);
  const records=stored===null?(societyId===DEFAULT_SOCIETY_ID?fallback:[]):stored;
  return records.filter(item=>(item.societyId||DEFAULT_SOCIETY_ID)===societyId);
}
function saveSocietyRecords(key,items,fallback,societyId=getCurrentSocietyId()){
  const records=read(key,null)||fallback;
  const otherSocieties=records.filter(item=>(item.societyId||DEFAULT_SOCIETY_ID)!==societyId);
  write(key,[...otherSocieties,...items.map(item=>({...item,societyId}))]);
}
export function getSocieties(){
  const societies=read(SOCIETIES_KEY,null);
  if(Array.isArray(societies)&&societies.length){
    return societies.map((society) => ({
      id: society.id || `SOC${Date.now()}`,
      name: String(society.name || "").trim(),
      location: String(society.location || society.city || "").trim(),
      city: String(society.city || society.location || "").trim(),
      state: String(society.state || "").trim(),
      address: String(society.address || "").trim(),
      phone: String(society.phone || "").trim(),
      email: String(society.email || "").trim(),
      registrationId: String(society.registrationId || "").trim() || "Not provided",
      logo: String(society.logo || "").trim(),
      status: ["Active", "Inactive"].includes(society.status) ? society.status : "Active",
      demoStats: society.demoStats ? {
        blockCount: Number(society.demoStats.blockCount) || 0,
        residentCount: Number(society.demoStats.residentCount) || 0,
        staffCount: Number(society.demoStats.staffCount) || 0
      } : null,
      createdAt: society.createdAt || new Date().toISOString(),
      blockNames: Array.isArray(society.blockNames) ? [...new Set(society.blockNames.map((value) => String(value).trim()).filter(Boolean))] : []
    }));
  }
  write(SOCIETIES_KEY,seedSocieties);
  return seedSocieties;
}
export function getSociety(id){
  return getSocieties().find((society) => society.id === id) || null;
}
export function getCurrentSocietyId(){
  const societies=getSocieties();
  const selected=read(ACTIVE_SOCIETY_KEY,DEFAULT_SOCIETY_ID);
  return societies.some(item=>item.id===selected)?selected:societies[0].id;
}
export function setCurrentSocietyId(societyId){
  if(!getSocieties().some(item=>item.id===societyId))return false;
  write(ACTIVE_SOCIETY_KEY,societyId);
  return true;
}
export function createSociety(payload){
  const name=String(payload?.name||"").trim();
  const location=String(payload?.location || payload?.city || "").trim();
  const address=String(payload?.address||"").trim();
  const phone=String(payload?.phone||"").trim();
  const email=String(payload?.email||"").trim();
  const registrationId=String(payload?.registrationId||"").trim() || "Not provided";
  const logo=String(payload?.logo||"").trim();
  const status=["Active","Inactive"].includes(payload?.status)?payload.status:"Active";

  if(!name)throw new Error("Society name is required.");
  if(!location)throw new Error("Location is required.");
  if(!address)throw new Error("Address is required.");
  if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error("Please enter a valid email address.");
  if(phone && !/^[+()\d\s-]{7,20}$/.test(phone))throw new Error("Please enter a valid phone number.");

  const societies=getSocieties();
  if(societies.some(item=>item.name.trim().toLowerCase()===name.toLowerCase()))throw new Error("A society with this name already exists.");

  const society={
    id: payload?.id || `SOC${Date.now()}`,
    name,
    location,
    city: location,
    state: String(payload?.state || "").trim(),
    address,
    phone,
    email,
    registrationId,
    logo,
    status,
    demoStats: payload?.demoStats ? {
      blockCount: Number(payload.demoStats.blockCount) || 0,
      residentCount: Number(payload.demoStats.residentCount) || 0,
      staffCount: Number(payload.demoStats.staffCount) || 0
    } : null,
    createdAt: payload?.createdAt || new Date().toISOString(),
    blockNames:Array.isArray(payload?.blockNames)?[...new Set(payload.blockNames.map(value=>String(value).trim()).filter(Boolean))]:[]
  };
  write(SOCIETIES_KEY,[...societies,society]);
  setCurrentSocietyId(society.id);
  recordAccountActivity("admin",{title:"Added society",detail:society.name});
  return society;
}
export function updateSociety(id,data){
  const societies=getSocieties();
  const index=societies.findIndex(item=>item.id===id);
  if(index===-1)throw new Error("Society not found.");
  const current=societies[index];
  const next={...current,...data};
  next.location=String(next.location || next.city || current.location || "").trim();
  next.city=String(next.city || next.location || current.city || "").trim();
  next.state=String(next.state || current.state || "").trim();
  next.address=String(next.address || current.address || "").trim();
  next.phone=String(next.phone || current.phone || "").trim();
  next.email=String(next.email || current.email || "").trim();
  next.registrationId=String(next.registrationId || current.registrationId || "").trim() || "Not provided";
  next.logo=String(next.logo || current.logo || "").trim();
  next.status=["Active","Inactive"].includes(next.status)?next.status:current.status;
  if(!next.name)throw new Error("Society name is required.");
  if(!next.location)throw new Error("Location is required.");
  if(!next.address)throw new Error("Address is required.");
  if(next.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email))throw new Error("Please enter a valid email address.");
  if(next.phone && !/^[+()\d\s-]{7,20}$/.test(next.phone))throw new Error("Please enter a valid phone number.");

  societies[index]=next;
  write(SOCIETIES_KEY,societies);
  return next;
}
export function addBlockToSociety(blockName,societyId=getCurrentSocietyId()){
  const name=String(blockName||"").trim();
  if(!name)throw new Error("Block name is required.");
  const societies=getSocieties();
  const selectedSociety=societies.find(item=>item.id===societyId);
  if(!selectedSociety)throw new Error("Society not found.");
  const currentBlocks=Array.isArray(selectedSociety.blockNames)?selectedSociety.blockNames:[];
  if(currentBlocks.some(item=>item.toLowerCase()===name.toLowerCase()))throw new Error("This block already exists in the selected society.");
  const updatedSocieties=societies.map(item=>item.id===societyId?{...item,blockNames:[...currentBlocks,name]}:item);
  write(SOCIETIES_KEY,updatedSocieties);
  recordAccountActivity("admin",{title:"Added block",detail:`${name} added to ${selectedSociety.name}`});
  return updatedSocieties.find(item=>item.id===societyId);
}
export function getBlocks(){
  const blocks=read(BLOCKS_KEY,null);
  if(Array.isArray(blocks))return blocks;
  write(BLOCKS_KEY,seedBlocks);
  return seedBlocks;
}
export function getBlocksBySociety(societyId=getCurrentSocietyId()){
  return getBlocks().filter((block) => block.societyId === societyId);
}
export function getBlock(id){
  return getBlocks().find((block) => block.id === id) || null;
}
export function createBlock(data){
  const societyId=String(data?.societyId || getCurrentSocietyId()).trim();
  const name=String(data?.name || "").trim();
  const totalFlats=Number(data?.totalFlats)
  const occupiedFlats=Number(data?.occupiedFlats || 0);
  const contact=String(data?.contact || "").trim();
  const manager=String(data?.manager || "").trim();
  const status=["Active","Inactive"].includes(data?.status)?data.status:"Active";

  if(!getSocieties().some((society) => society.id === societyId))throw new Error("Please select a valid society.");
  if(!name)throw new Error("Block name is required.");
  if(!Number.isFinite(totalFlats) || totalFlats < 1)throw new Error("Total flats must be a valid number greater than zero.");
  if(!Number.isFinite(occupiedFlats) || occupiedFlats < 0)throw new Error("Occupied flats must be zero or more.");
  if(contact && !/^[+()\d\s-]{7,20}$/.test(contact))throw new Error("Please enter a valid block contact number.");

  const block={
    id: data?.id || `BLK${Date.now()}`,
    societyId,
    name,
    totalFlats: Math.round(totalFlats),
    occupiedFlats: Math.round(occupiedFlats),
    contact,
    manager,
    status,
    createdAt: data?.createdAt || new Date().toISOString()
  };

  const blocks=getBlocks();
  if(blocks.some((item) => item.societyId === societyId && item.name.trim().toLowerCase() === name.toLowerCase()))throw new Error("This block already exists in the selected society.");

  write(BLOCKS_KEY,[block,...blocks]);
  const society=getSociety(societyId);
  if(society){
    const blockNames = Array.isArray(society.blockNames) ? [...new Set([...society.blockNames, name])] : [name];
    updateSociety(societyId,{ blockNames });
  }
  recordAccountActivity("admin",{title:"Added block",detail:`${name} created for ${getSociety(societyId)?.name || "society"}`});
  return block;
}
export function updateBlock(id,data){
  const blocks=getBlocks();
  const index=blocks.findIndex((block) => block.id === id);
  if(index === -1)throw new Error("Block not found.");
  const next={...blocks[index],...data};
  if(!next.name)throw new Error("Block name is required.");
  if(!Number.isFinite(Number(next.totalFlats)) || Number(next.totalFlats) < 1)throw new Error("Total flats must be a valid number greater than zero.");
  if(!Number.isFinite(Number(next.occupiedFlats)) || Number(next.occupiedFlats) < 0)throw new Error("Occupied flats must be zero or more.");
  next.totalFlats=Math.round(Number(next.totalFlats));
  next.occupiedFlats=Math.round(Number(next.occupiedFlats));
  blocks[index]=next;
  write(BLOCKS_KEY,blocks);
  return next;
}
export function getComplaints(societyId=getCurrentSocietyId()){return getSocietyRecords(COMPLAINTS_KEY,seedComplaints,societyId)}
export function saveComplaints(complaints,societyId=getCurrentSocietyId()){saveSocietyRecords(COMPLAINTS_KEY,complaints,seedComplaints,societyId)}
export function getComplaint(id){return getComplaints().find(c=>c.id===id)}
export function updateComplaint(id,patch){const existing=getComplaint(id);const updated=getComplaints().map(c=>c.id===id?{...c,...patch}:c);saveComplaints(updated);if(existing&&patch.status&&patch.status!==existing.status){recordAccountActivity("admin",{title:`Reviewed complaint ${id}`,detail:`Status changed to ${patch.status}.`})}return updated.find(c=>c.id===id)}
export function createComplaint(payload){const complaints=getComplaints(), id=makeId("CMP",complaints), now=new Date();const date=now.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});const time=now.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});const complaint={...payload,id,date,createdAt:`${date} · ${time}`,status:"Under Review",timeline:[{label:"Submitted",time:`${date} · ${time}`,note:"Your complaint was successfully submitted."}],response:"Your complaint has been received and is waiting for society management review."};saveComplaints([complaint,...complaints]);createNotification({title:"Complaint submitted",body:`${complaint.title} was submitted successfully and is under review.`,time:"Just now",type:"complaint",complaintId:id});return complaint}
export function assignComplaint(id,staffId){const staff=getStaff().find(s=>s.id===staffId);const complaint=getComplaint(id);if(!complaint)return null;const updated=updateComplaint(id,{assignedStaffId:staffId,assignedStaffName:staff?.name||"Unassigned"});createNotification({title:"Complaint assigned",body:`${complaint.title} has been assigned to ${staff?.name||"a staff member"}.`,time:"Just now",type:"complaint",complaintId:id});return updated}
export function getFeedback(societyId=getCurrentSocietyId()){return getSocietyRecords(FEEDBACK_KEY,[],societyId)}
export function saveFeedback(entry){saveSocietyRecords(FEEDBACK_KEY,[{...entry,id:`FB${Date.now()}`,submittedAt:new Date().toISOString()},...getFeedback()],[])}
export function getNotifications(societyId=getCurrentSocietyId()){return getSocietyRecords(NOTIFICATIONS_KEY,seedNotifications,societyId)}
export function createNotification(notification){saveSocietyRecords(NOTIFICATIONS_KEY,[{id:`N${Date.now()}`,unread:true,...notification},...getNotifications()],seedNotifications)}
export function markAllNotificationsRead(){saveSocietyRecords(NOTIFICATIONS_KEY,getNotifications().map(item=>({...item,unread:false})),seedNotifications)}
export function markNotificationRead(id){saveSocietyRecords(NOTIFICATIONS_KEY,getNotifications().map(item=>item.id===id?{...item,unread:false}:item),seedNotifications)}

export function getStaff(societyId=getCurrentSocietyId()){return getSocietyRecords(STAFF_KEY,seedStaff,societyId)}
export function saveStaff(items,societyId=getCurrentSocietyId()){saveSocietyRecords(STAFF_KEY,items,seedStaff,societyId)}
export function createStaff(payload){const items=getStaff();const item={...payload,id:makeId("ST",items),joined:payload.joined||new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),avatar:payload.name.split(" ").map(v=>v[0]).slice(0,2).join("").toUpperCase()};saveStaff([...items,item]);createNotification({title:"New staff member added",body:`${item.name} was added to the society team.`,time:"Just now",type:"notice"});return item}
export function toggleStaffStatus(id){const items=getStaff().map(item=>item.id===id?{...item,status:item.status==="Active"?"On Leave":"Active"}:item);saveStaff(items);return items.find(item=>item.id===id)}

export function getResidents(societyId=getCurrentSocietyId()){return getSocietyRecords(RESIDENTS_KEY,seedResidents,societyId)}
export function getSocietyOverview(societyId=getCurrentSocietyId()){
  const society=getSociety(societyId)||seedSocieties[0];
  const residents=getResidents(societyId);
  const staff=getStaff(societyId);
  const blocks=getBlocksBySociety(societyId);
  const derivedBlocks = blocks.length ? blocks.map((block) => ({
    id: block.id,
    name: block.name,
    totalFlats: Number(block.totalFlats) || 0,
    occupiedFlats: Number(block.occupiedFlats) || 0,
    contact: block.contact || "",
    manager: block.manager || "",
    status: block.status || "Active",
    flatCount: Number(block.totalFlats) || 0,
    residentCount: Number(block.occupiedFlats) || 0
  })) : (Array.isArray(society.blockNames) ? society.blockNames.map((name) => {
    const blockResidents=residents.filter(item=>item.block===name);
    return {name,flatCount:new Set(blockResidents.map(item=>item.flat).filter(Boolean)).size,residentCount:blockResidents.length};
  }) : []);
  return {
    ...society,
    location: society.location || society.city || "",
    city: society.city || society.location || "",
    state: society.state || "",
    blockCount: Math.max(Number(society.demoStats?.blockCount) || 0, derivedBlocks.length),
    residentCount: (Number(society.demoStats?.residentCount) || 0) + residents.length,
    staffCount: (Number(society.demoStats?.staffCount) || 0) + staff.length,
    blocks: derivedBlocks
  };
}
export function saveResidents(items,societyId=getCurrentSocietyId()){saveSocietyRecords(RESIDENTS_KEY,items,seedResidents,societyId)}
export function createResident(payload){const items=getResidents();const item={...payload,id:makeId("R",items),joined:payload.joined||new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),status:payload.status||"Active"};saveResidents([...items,item]);createNotification({title:"Resident added",body:`${item.name} has been added to the resident directory.`,time:"Just now",type:"notice"});return item}
export function toggleResidentStatus(id){const items=getResidents().map(item=>item.id===id?{...item,status:item.status==="Active"?"Inactive":"Active"}:item);saveResidents(items);return items.find(item=>item.id===id)}

export function getNotices(societyId=getCurrentSocietyId()){return getSocietyRecords(NOTICES_KEY,seedNotices,societyId)}
export function saveNotices(items,societyId=getCurrentSocietyId()){saveSocietyRecords(NOTICES_KEY,items,seedNotices,societyId)}
export function createNotice(payload){const items=getNotices();const now=new Date();const item={...payload,id:makeId("NT",items),date:payload.date||now.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),time:payload.time||now.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}),status:payload.status||"Published",audience:payload.audience||"All residents"};saveNotices([item,...items]);if(item.status==="Published"){createNotification({title:"New society notice",body:item.title,time:"Just now",type:"notice"});recordAccountActivity("admin",{title:"Published society notice",detail:item.title})}return item}
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

export function getUserProfile(role="resident"){
  const profileRole=PROFILE_KEYS[role]?role:"resident";
  const seed=seedProfiles[profileRole];
  const stored=read(PROFILE_KEYS[profileRole],seed);
  return {...seed,...stored,notificationPreferences:{...defaultNotificationPreferences,...stored.notificationPreferences}};
}
export function saveUserProfile(role="resident",patch={}){
  const key=PROFILE_KEYS[role]||PROFILE_KEYS.resident;
  const current=getUserProfile(role);
  const next={...current,...patch,notificationPreferences:{...current.notificationPreferences,...patch.notificationPreferences}};
  write(key,next);
  if(role==="resident"){
    const residents=getResidents();
    const index=residents.findIndex(item=>item.id===next.id);
    if(index>=0){const updated={...residents[index],name:next.name,email:next.email,phone:next.phone};residents[index]=updated;saveResidents(residents)}
  }
  return next;
}
export function getAccountActivity(role="resident"){
  const key=ACCOUNT_ACTIVITY_KEYS[role]||ACCOUNT_ACTIVITY_KEYS.resident;
  return read(key,[]);
}
export function recordAccountActivity(role="resident",entry={}){
  const key=ACCOUNT_ACTIVITY_KEYS[role]||ACCOUNT_ACTIVITY_KEYS.resident;
  const activity=[{...entry,id:`ACT${Date.now()}`,at:new Date().toISOString()},...getAccountActivity(role)].slice(0,30);
  write(key,activity);
  return activity[0];
}
export async function hashUserPassword(password){
  const bytes=new TextEncoder().encode(password);
  const digest=await window.crypto.subtle.digest("SHA-256",bytes);
  return Array.from(new Uint8Array(digest),value=>value.toString(16).padStart(2,"0")).join("");
}
export async function verifyUserPassword(role,password){
  const passwordHash=getUserProfile(role).passwordHash;
  return !passwordHash||passwordHash===await hashUserPassword(password);
}
