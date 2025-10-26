import { useState, useEffect, useCallback } from 'react';
import { dataService } from '../services';

export const useApiData = (dataType, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let result;
      switch (dataType) {
        case 'users':
          result = await (await import('../services/userService')).userService.getAllUsers();
          break;
        case 'vehicles':
          result = await (await import('../services/vehicleService')).vehicleService.getAllVehicles();
          break;
        case 'serviceCenters':
          result = await (await import('../services/serviceCenterService')).serviceCenterService.getAllServiceCenters();
          break;
        case 'appointments':
          result = await (await import('../services/appointmentService')).appointmentService.getAllAppointments();
          break;
        case 'payments':
          result = await (await import('../services/paymentService')).paymentService.getAllPayments();
          break;
        case 'reports':
          result = await (await import('../services/reportService')).reportService.getAllReports();
          break;
        case 'parts':
          result = await (await import('../services/partService')).partService.getAllParts();
          break;
        case 'partTypes':
          result = await (await import('../services/partService')).partTypeService.getAllPartTypes();
          break;
        case 'maintenancePlans':
          result = await (await import('../services/maintenanceService')).maintenancePlanService.getAllMaintenancePlans();
          break;
        case 'reminders':
          result = await (await import('../services/maintenanceService')).reminderService.getAllReminders();
          break;
        case 'all':
          result = await dataService.fetchAllData();
          break;
        case 'dashboard':
          result = await dataService.fetchDashboardData();
          break;
        default:
          throw new Error(`Unknown data type: ${dataType}`);
      }
      
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dataType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useAllData = () => {
  return useApiData('all');
};

export const useDashboardData = () => {
  return useApiData('dashboard');
};