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
  STAFF_BOOKING_LIST: '/staff/bookings',
  APPOINTMENT_DETAIL: '/staff/appointment/:bookingId',
  TECHNICIAN_SCREEN: '/technician',
  TECHNICIAN_APPOINTMENT_DETAIL: '/technician/appointment/:bookingId',
  MAINTENANCE_REPORT: '/technician/maintenance-report/:bookingId',
  CONFIRM_BOOKING: '/confirm-booking',
  VEHICLE_DETAIL: '/vehicle-detail',
};

// Other configs can be added here