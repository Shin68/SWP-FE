// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api';

// Axios default configuration
export const axiosConfig = {
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  }
};

// Page URLs
export const PAGE_URLS = {
  HOME: '/home',
  REGISTER: '/register',
  LOGIN: '/',
  PROFILE_VIEW: '/profile-view',
  PROFILE_EDIT: '/profile-edit',
  DEALER: '/dealer',
  SELECT_TECHNICIAN: '/staff/select-technician',
  CONFIRM_BOOKING: '/confirm-booking',
  VEHICLE_DETAIL: '/vehicle-detail',
  ADMIN_DASHBOARD: '/admin-dashboard',
  ADMIN_PROFILE: '/admin-profile',
  STAFF_DASHBOARD: '/staff-dashboard',
  STAFF_PROFILE: '/staff-profile',
  TECHNICIAN_DASHBOARD: '/technician-dashboard',
  TECHNICIAN_REPORT: "/technician-report",
  BOOKING_LIST: "/booking-list",
  QUOTATION_APPROVAL: "/quotation",
  REPORT_VIEWER: "/report-viewer",
  PAYMENT: "/payment",
  PAYMENT_SUCCESS: "/payment-success",
  PAYMENT_RETURN: "/payment-return",
  ADD_VEHICLE: "/add-vehicle",
};

// Other configs can be added here