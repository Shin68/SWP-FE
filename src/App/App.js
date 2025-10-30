import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/HomeScreen/Home";
import Register from "../pages/HomeScreen/Register";
import Login from "../pages/HomeScreen/Login";
import ProfileView from "../pages/User/ProfileView";
import ProfileEdit from "../pages/User/ProfileEdit";
import Dealer from "../pages/Dealer/Dealer";
import SelectTechnician from "../pages/Staff/SelectTechnician";
import ConfirmBooking from "../pages/Booking/ConfirmBooking";
import VehicleDetail from "../pages/Vehicle/VehicleDetail";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import StaffDashboard from "../pages/Staff/StaffDashboard";
import TechnicianDashboard from "../pages/Technician/TechnicianDashboard";
import TechnicianReport from "../pages/Technician/TechnicianReport";
import { PAGE_URLS } from "./config";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={PAGE_URLS.LOGIN} element={<Login />} />
        <Route path={PAGE_URLS.HOME} element={<Home />} />
        <Route path={PAGE_URLS.REGISTER} element={<Register />} />
        <Route path={PAGE_URLS.PROFILE_VIEW} element={<ProfileView />} />
        <Route path={PAGE_URLS.PROFILE_EDIT} element={<ProfileEdit />} />
        <Route path={PAGE_URLS.DEALER} element={<Dealer />} />
        <Route path={PAGE_URLS.SELECT_TECHNICIAN + "/:bookingId"} element={<SelectTechnician />} />
        <Route path={PAGE_URLS.VEHICLE_DETAIL} element={<VehicleDetail />} />
        <Route path={PAGE_URLS.CONFIRM_BOOKING} element={<ConfirmBooking />} />
        <Route path={PAGE_URLS.ADMIN_DASHBOARD} element={<AdminDashboard />} />
        <Route path={PAGE_URLS.STAFF_DASHBOARD} element={<StaffDashboard />} />
        <Route path={PAGE_URLS.TECHNICIAN_DASHBOARD} element={<TechnicianDashboard />} />
        <Route path={PAGE_URLS.TECHNICIAN_REPORT + "/:appointmentId"} element={<TechnicianReport />} />

      </Routes>
    </Router>
  );
}

export default App;
