import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/HomeScreen/Home";
import Register from "../pages/HomeScreen/Register";
import VehicleList from "../pages/Vehicle/VehicleList";
import Login from "../pages/HomeScreen/Login";
import ProfileView from "../pages/User/ProfileView";
import ProfileEdit from "../pages/User/ProfileEdit";
import VehicleDetail from "../pages/Vehicle/VehicleDetail";
import DealerList from "../pages/Dealer/Dealer";
import DealerDetail from "../pages/Dealer/DealerDetail";
import ServiceBooking from "../pages/Booking/ServiceBooking";
import BookingList from "../pages/Booking/BookingList";
import BookingDetail from "../pages/Booking/BookingDetail";
import Review from "../pages/Booking/Review";
import SelectTechnician from "../pages/Staff/SelectTechnician";
import StaffBookingList from "../pages/Staff/StaffBookingList";
import TechnicianScreen from "../pages/Technician/TechnicianScreen";
import SelectVehicle from "../pages/Vehicle/SelectVehicle";
import { PAGE_URLS } from "./config";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={PAGE_URLS.LOGIN} element={<Login />} />
        <Route path={PAGE_URLS.HOME} element={<Home />} />
        <Route path={PAGE_URLS.REGISTER} element={<Register />} />
        <Route path={PAGE_URLS.VEHICLE_LIST} element={<VehicleList />} />
        <Route path={PAGE_URLS.PROFILE_VIEW} element={<ProfileView />} />
        <Route path={PAGE_URLS.PROFILE_EDIT} element={<ProfileEdit />} />
        <Route path={PAGE_URLS.VEHICLE_DETAIL} element={<VehicleDetail />} />
        <Route path={PAGE_URLS.DEALER_LIST} element={<DealerList />} />
        <Route path={PAGE_URLS.DEALER_DETAIL} element={<DealerDetail />} />
        <Route path={PAGE_URLS.SERVICE_BOOKING} element={<ServiceBooking />} />
        <Route path={PAGE_URLS.BOOKING_LIST} element={<BookingList />} />
        <Route path={PAGE_URLS.BOOKING_DETAIL} element={<BookingDetail />} />
        <Route path={PAGE_URLS.REVIEW} element={<Review />} />
        <Route path={PAGE_URLS.SELECT_TECHNICIAN + "/:bookingId"} element={<SelectTechnician />} />
        <Route path={PAGE_URLS.STAFF_BOOKING_LIST} element={<StaffBookingList />} />
        <Route path={PAGE_URLS.TECHNICIAN_SCREEN} element={<TechnicianScreen />} />
        <Route path={PAGE_URLS.SELECT_VEHICLE} element={<SelectVehicle />} />

      </Routes>
    </Router>
  );
}

export default App;
