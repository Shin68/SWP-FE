// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

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
  STAFF_DASHBOARD: '/staff-dashboard',
  TECHNICIAN_DASHBOARD: '/technician-dashboard',
  TECHNICIAN_REPORT: "/technician-report",
};

// Other configs can be added here