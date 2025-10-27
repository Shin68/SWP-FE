import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/HomeScreen/Home";
import Register from "../pages/HomeScreen/Register";
import Login from "../pages/HomeScreen/Login";
import ProfileView from "../pages/User/ProfileView";
import ProfileEdit from "../pages/User/ProfileEdit";
import Dealer from "../pages/Dealer/Dealer";
import SelectTechnician from "../pages/Staff/SelectTechnician";
import StaffBookingList from "../pages/Staff/StaffBookingList";
import AppointmentDetail from "../pages/Staff/AppointmentDetail";
import TechnicianScreen from "../pages/Technician/TechnicianScreen";
import TechnicianAppointmentDetail from "../pages/Technician/AppointmentDetail";
import MaintenanceReport from "../pages/Technician/MaintenanceReport";
import ConfirmBooking from "../pages/Booking/ConfirmBooking";
import VehicleDetail from "../pages/Vehicle/VehicleDetail";
import AdminDashboard from "../pages/Admin/AdminDashboard";
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
        <Route path={PAGE_URLS.STAFF_BOOKING_LIST} element={<StaffBookingList />} />
        <Route path={PAGE_URLS.APPOINTMENT_DETAIL} element={<AppointmentDetail />} />
        <Route path={PAGE_URLS.TECHNICIAN_SCREEN} element={<TechnicianScreen />} />
        <Route path={PAGE_URLS.TECHNICIAN_APPOINTMENT_DETAIL} element={<TechnicianAppointmentDetail />} />
        <Route path={PAGE_URLS.MAINTENANCE_REPORT} element={<MaintenanceReport />} />
        <Route path={PAGE_URLS.VEHICLE_DETAIL} element={<VehicleDetail />} />
        <Route path={PAGE_URLS.CONFIRM_BOOKING} element={<ConfirmBooking />} />
        <Route path={PAGE_URLS.ADMIN_DASHBOARD} element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
