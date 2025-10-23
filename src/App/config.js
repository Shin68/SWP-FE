// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Page URLs
export const PAGE_URLS = {
  HOME: '/home',
  LOGIN: '/',
  VEHICLE_LIST: '/vehicle-list',
  VEHICLE_DETAIL: '/vehicledetail',
  PROFILE_VIEW: '/profile-view',
  PROFILE_EDIT: '/profile-edit',
  DEALER_LIST: '/dealer',
  DEALER_DETAIL: '/dealer-detail',
  SERVICE_BOOKING: '/service-booking',
  BOOKING_LIST: '/booking-list',
  BOOKING_DETAIL: '/booking-detail',
  REVIEW: '/review',
  REGISTER: '/register',
  SELECT_TECHNICIAN: '/staff/select-technician',
  STAFF_BOOKING_LIST: '/staff/bookings',
  APPOINTMENT_DETAIL: '/staff/appointment/:bookingId',
  TECHNICIAN_SCREEN: '/technician',
  TECHNICIAN_APPOINTMENT_DETAIL: '/technician/appointment/:bookingId',
  MAINTENANCE_REPORT: '/technician/maintenance-report/:bookingId',
  SELECT_VEHICLE: '/select-vehicle',
};

// Other configs can be added here