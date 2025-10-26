import React, { useState } from 'react';
import { useAllData, useDashboardData } from '../hooks/useApiData';

const DataFetcher = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useDashboardData();
  const { data: allData, loading: allLoading, error: allError, refetch } = useAllData();

  const handleRefresh = () => {
    refetch();
  };

  if (dashboardLoading || allLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading data...</div>
      </div>
    );
  }

  if (dashboardError || allError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error:</strong> {dashboardError || allError}
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-blue-100 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800">Total Users</h3>
        <p className="text-2xl font-bold text-blue-600">{dashboardData.totalUsers}</p>
      </div>
      <div className="bg-green-100 p-4 rounded-lg">
        <h3 className="font-semibold text-green-800">Total Vehicles</h3>
        <p className="text-2xl font-bold text-green-600">{dashboardData.totalVehicles}</p>
      </div>
      <div className="bg-yellow-100 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800">Total Appointments</h3>
        <p className="text-2xl font-bold text-yellow-600">{dashboardData.totalAppointments}</p>
      </div>
      <div className="bg-purple-100 p-4 rounded-lg">
        <h3 className="font-semibold text-purple-800">Total Payments</h3>
        <p className="text-2xl font-bold text-purple-600">{dashboardData.totalPayments}</p>
      </div>
      <div className="bg-red-100 p-4 rounded-lg">
        <h3 className="font-semibold text-red-800">Pending Reminders</h3>
        <p className="text-2xl font-bold text-red-600">{dashboardData.pendingReminders}</p>
      </div>
    </div>
  );

  const renderDataTable = (title, data, keyField) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              {data.length > 0 && Object.keys(data[0]).map((key) => (
                <th key={key} className="px-4 py-2 border-b text-left">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item[keyField]} className="hover:bg-gray-50">
                {Object.values(item).map((value, index) => (
                  <td key={index} className="px-4 py-2 border-b">
                    {value !== null ? String(value) : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAllData = () => (
    <div className="space-y-6">
      {renderDataTable('Users', allData.users || [], 'id')}
      {renderDataTable('Vehicles', allData.vehicles || [], 'id')}
      {renderDataTable('Service Centers', allData.serviceCenters || [], 'id')}
      {renderDataTable('Appointments', allData.appointments || [], 'id')}
      {renderDataTable('Payments', allData.payments || [], 'id')}
      {renderDataTable('Reports', allData.reports || [], 'id')}
      {renderDataTable('Parts', allData.parts || [], 'id')}
      {renderDataTable('Part Types', allData.partTypes || [], 'id')}
      {renderDataTable('Maintenance Plans', allData.maintenancePlans || [], 'id')}
      {renderDataTable('Reminders', allData.reminders || [], 'id')}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">EV Service Center Data</h1>
        <button
          onClick={handleRefresh}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Refresh Data
        </button>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Data
          </button>
        </nav>
      </div>

      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'all' && renderAllData()}
    </div>
  );
};

export default DataFetcher;