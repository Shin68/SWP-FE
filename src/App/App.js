import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/HomeScreen/Home";
import Login from "../pages/HomeScreen/Login";
import Register from "../pages/HomeScreen/Register";

import ProfileView from "../pages/User/ProfileView";
import ProfileEdit from "../pages/User/ProfileEdit";

import DealerList from "../pages/Dealer/Dealer";
import DealerDetail from "../pages/Dealer/DealerDetail";

import ServiceBooking from "../pages/Booking/ServiceBooking";
import BookingList from "../pages/Booking/BookingList";
import BookingDetail from "../pages/Booking/BookingDetail";

import VehicleDetail from "../pages/Vehicle/VehicleDetail";

import SelectTechnician from "../pages/Staff/SelectTechnician";
import StaffBookingList from "../pages/Staff/StaffBookingList";
import CreateStaffAccount from "../pages/Staff/CreateStaffAccount";

import AdminDashboard from "../pages/Admin/AdminDashboard";

import { PAGE_URLS } from "./config";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path={PAGE_URLS.LOGIN} element={<Login />} />
        <Route path={PAGE_URLS.REGISTER} element={<Register />} />

        {/* Home */}
        <Route path={PAGE_URLS.HOME} element={<Home />} />

        {/* User */}
        <Route path={PAGE_URLS.PROFILE_VIEW} element={<ProfileView />} />
        <Route path={PAGE_URLS.PROFILE_EDIT} element={<ProfileEdit />} />

        {/* Vehicle */}
        <Route path={PAGE_URLS.VEHICLE_DETAIL} element={<VehicleDetail />} />

        {/* Dealer */}
        <Route path={PAGE_URLS.DEALER_LIST} element={<DealerList />} />
        <Route path={PAGE_URLS.DEALER_DETAIL} element={<DealerDetail />} />

        {/* Booking */}
        <Route path={PAGE_URLS.SERVICE_BOOKING} element={<ServiceBooking />} />
        <Route path={PAGE_URLS.BOOKING_LIST} element={<BookingList />} />
        <Route path={PAGE_URLS.BOOKING_DETAIL} element={<BookingDetail />} />

        {/* Staff */}
        <Route path={PAGE_URLS.SELECT_TECHNICIAN} element={<SelectTechnician />} />
        <Route path={PAGE_URLS.STAFF_BOOKING_LIST} element={<StaffBookingList />} />
        <Route path={PAGE_URLS.CREATE_STAFF_ACCOUNT} element={<CreateStaffAccount />} />

        {/* Admin */}
        <Route path={PAGE_URLS.ADMIN_DASHBOARD} element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;