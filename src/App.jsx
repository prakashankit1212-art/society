import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/auth/Login";
import ResidentDashboard from "./pages/resident/ResidentDashboard";
import SubmitComplaint from "./pages/resident/SubmitComplaint";
import MyComplaints from "./pages/resident/MyComplaints";
import ComplaintDetails from "./pages/resident/ComplaintDetails";
import Feedback from "./pages/resident/Feedback";
import PresidentDashboard from "./pages/president/PresidentDashboard";
import PresidentComplaints from "./pages/president/PresidentComplaints";
import PresidentComplaintDetails from "./pages/president/PresidentComplaintDetails";
import PresidentStaff from "./pages/president/PresidentStaff";
import PresidentAnalytics from "./pages/president/PresidentAnalytics";
import PresidentNotices from "./pages/president/PresidentNotices";
import PresidentResidents from "./pages/president/PresidentResidents";
import Profile from "./pages/Profile";
import { SocietyDetails, SocietyBlocks, SocietySettings } from "./pages/SocietyPages";
import "./presentation.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/resident/dashboard" element={<ResidentDashboard />} />
        <Route path="/resident/complaints/new" element={<SubmitComplaint />} />
        <Route path="/resident/complaints" element={<MyComplaints />} />
        <Route path="/resident/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/resident/feedback" element={<Feedback />} />
        <Route path="/resident/profile" element={<Profile role="resident" />} />
        <Route path="/resident/society" element={<SocietyDetails role="resident" />} />
        <Route path="/resident/blocks" element={<SocietyBlocks role="resident" />} />
        <Route path="/admin/profile" element={<Profile role="admin" />} />
        <Route path="/admin/society" element={<SocietyDetails role="admin" />} />
        <Route path="/admin/blocks" element={<SocietyBlocks role="admin" />} />
        <Route path="/president/dashboard" element={<PresidentDashboard />} />
        <Route path="/president/complaints" element={<PresidentComplaints />} />
        <Route path="/president/complaints/:id" element={<PresidentComplaintDetails />} />
        <Route path="/president/staff" element={<PresidentStaff />} />
        <Route path="/president/analytics" element={<PresidentAnalytics />} />
        <Route path="/president/notices" element={<PresidentNotices />} />
        <Route path="/president/residents" element={<PresidentResidents />} />
        <Route path="/president/profile" element={<Profile role="president" />} />
        <Route path="/president/society" element={<SocietyDetails role="president" />} />
        <Route path="/president/blocks" element={<SocietyBlocks role="president" />} />
        <Route path="/president/society/settings" element={<SocietySettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
