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
import AdminProfile from "../pages/Admin/AdminProfile";
import StaffDashboard from "../pages/Staff/StaffDashboard";
import StaffProfile from "../pages/Staff/StaffProfile";
import TechnicianDashboard from "../pages/Technician/TechnicianDashboard";
import TechnicianReport from "../pages/Technician/TechnicianReport";
import BookingList from "../pages/Booking/BookingList";
import ReportViewer from "../pages/Customer/ReportViewer";
import Payment from "../pages/Customer/Payment";
import PaymentSuccess from "../pages/Customer/PaymentSuccess";
import PaymentReturn from "../pages/Customer/PaymentReturn";
import AddVehicle from "../pages/Vehicle/AddVehicle";
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
        <Route path={PAGE_URLS.ADMIN_PROFILE} element={<AdminProfile />} />
        <Route path={PAGE_URLS.STAFF_DASHBOARD} element={<StaffDashboard />} />
        <Route path={PAGE_URLS.STAFF_PROFILE} element={<StaffProfile />} />
        <Route path={PAGE_URLS.TECHNICIAN_DASHBOARD} element={<TechnicianDashboard />} />
        <Route path={PAGE_URLS.TECHNICIAN_REPORT + "/:appointmentId"} element={<TechnicianReport />} />
        <Route path={PAGE_URLS.BOOKING_LIST} element={<BookingList />} />
        <Route path={PAGE_URLS.REPORT_VIEWER + "/:appointmentId"} element={<ReportViewer />} />
        <Route path={PAGE_URLS.PAYMENT + "/:appointmentId"} element={<Payment />} />
        <Route path={PAGE_URLS.PAYMENT_SUCCESS} element={<PaymentSuccess />} />
        <Route path={PAGE_URLS.PAYMENT_RETURN} element={<PaymentReturn />} />
        <Route path={PAGE_URLS.ADD_VEHICLE} element={<AddVehicle />} />

      </Routes>
    </Router>
  );
}

export default App;
