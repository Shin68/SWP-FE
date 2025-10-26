// Import all services
import { userService } from './userService';
import { vehicleService } from './vehicleService';
import { serviceCenterService } from './serviceCenterService';
import { appointmentService } from './appointmentService';
import { paymentService } from './paymentService';
import { reportService } from './reportService';
import { partService, partTypeService } from './partService';
import { maintenancePlanService, reminderService } from './maintenanceService';
import { authService } from './authService';

// Export all services
export { userService };
export { vehicleService };
export { serviceCenterService };
export { appointmentService };
export { paymentService };
export { reportService };
export { partService, partTypeService };
export { maintenancePlanService, reminderService };
export { authService };

// Combined service for fetching all data
export const dataService = {
  // Fetch all data at once
  fetchAllData: async () => {
    try {
      const [
        users,
        vehicles,
        serviceCenters,
        appointments,
        payments,
        reports,
        parts,
        partTypes,
        maintenancePlans,
        reminders
      ] = await Promise.all([
        userService.getAllUsers(),
        vehicleService.getAllVehicles(),
        serviceCenterService.getAllServiceCenters(),
        appointmentService.getAllAppointments(),
        paymentService.getAllPayments(),
        reportService.getAllReports(),
        partService.getAllParts(),
        partTypeService.getAllPartTypes(),
        maintenancePlanService.getAllMaintenancePlans(),
        reminderService.getAllReminders()
      ]);

      return {
        users,
        vehicles,
        serviceCenters,
        appointments,
        payments,
        reports,
        parts,
        partTypes,
        maintenancePlans,
        reminders
      };
    } catch (error) {
      console.error('Error fetching all data:', error);
      throw error;
    }
  },

  // Fetch dashboard data
  fetchDashboardData: async () => {
    try {
      const [
        users,
        vehicles,
        appointments,
        payments,
        reminders
      ] = await Promise.all([
        userService.getAllUsers(),
        vehicleService.getAllVehicles(),
        appointmentService.getAllAppointments(),
        paymentService.getAllPayments(),
        reminderService.getAllReminders()
      ]);

      return {
        totalUsers: users.length,
        totalVehicles: vehicles.length,
        totalAppointments: appointments.length,
        totalPayments: payments.length,
        pendingReminders: reminders.filter(r => r.status === 'PENDING').length
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
};