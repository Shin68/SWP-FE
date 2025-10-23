// Base URL của API
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

// Các đường dẫn trang
export const PAGE_URLS = {
  HOME: "/home",
  LOGIN: "/",
  REGISTER: "/register",

  PROFILE_VIEW: "/profile-view",
  PROFILE_EDIT: "/profile-edit",

  DEALER_LIST: "/dealer",
  DEALER_DETAIL: "/dealer-detail",

  SERVICE_BOOKING: "/service-booking",
  BOOKING_LIST: "/booking-list",
  BOOKING_DETAIL: "/booking-detail",

  VEHICLE_DETAIL: "/vehicledetail",

  STAFF_BOOKING_LIST: "/staff/bookings",
  SELECT_TECHNICIAN: "/staff/select-technician",
  CREATE_STAFF_ACCOUNT: "/staff/create-account",

  ADMIN_DASHBOARD: "/admin-dashboard",
};
