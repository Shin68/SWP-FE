import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaHome, FaCog, FaArrowLeft, FaPlus, FaSave, FaTrash } from "react-icons/fa";

export default function MaintenanceReport() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [maintenanceItems, setMaintenanceItems] = useState([
    {
      id: 1,
      serviceName: "Oil Change",
      partName: "Engine Oil 5W-30",
      quantity: 4,
      actionType: "Replace",
      conditionStatus: "Required",
      laborCost: 200000,
      maintenanceItem: "Regular Maintenance"
    },
    {
      id: 2,
      serviceName: "Brake Inspection",
      partName: "Brake Pads",
      quantity: 2,
      actionType: "Inspect",
      conditionStatus: "Good",
      laborCost: 150000,
      maintenanceItem: "Safety Check"
    }
  ]);

  const [newItem, setNewItem] = useState({
    serviceName: "",
    partName: "",
    quantity: 1,
    actionType: "Replace",
    conditionStatus: "Required",
    laborCost: 0,
    maintenanceItem: ""
  });

  const handleAddItem = () => {
    if (newItem.serviceName && newItem.partName && newItem.maintenanceItem) {
      const item = {
        id: Date.now(),
        ...newItem,
        quantity: parseInt(newItem.quantity) || 1,
        laborCost: parseInt(newItem.laborCost) || 0
      };
      setMaintenanceItems([...maintenanceItems, item]);
      setNewItem({
        serviceName: "",
        partName: "",
        quantity: 1,
        actionType: "Replace",
        conditionStatus: "Required",
        laborCost: 0,
        maintenanceItem: ""
      });
    }
  };

  const handleDeleteItem = (id) => {
    setMaintenanceItems(maintenanceItems.filter(item => item.id !== id));
  };

  const handleSaveReport = () => {
    console.log("Saving maintenance report for booking:", bookingId);
    console.log("Maintenance items:", maintenanceItems);
    alert("Maintenance report saved successfully!");
    navigate("/technician");
  };

  const getTotalCost = () => {
    return maintenanceItems.reduce((total, item) => total + (item.laborCost * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-gray-700 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/technician")}
            className="text-white hover:text-gray-300"
          >
            <FaArrowLeft size={20} />
          </button>
          <span className="font-bold text-lg">Maintenance Report - Booking #{bookingId}</span>
        </div>

        <div className="flex gap-4 items-center relative">
          <button
            onClick={() => navigate("/home")}
            className="text-white hover:text-gray-300"
          >
            <FaHome size={20} />
          </button>

          <span>🔔</span>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white hover:text-gray-300"
            >
              <FaCog size={20} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-lg z-50">
                <button
                  onClick={() => {
                    navigate("/profile-view");
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 font-bold hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          {/* Maintenance Items Table */}
          <div className="bg-gray-800 rounded-lg overflow-hidden mb-4">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Maintenance Items</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Service Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Part Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Action Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Condition Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Labor Cost
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Maintenance Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {maintenanceItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-700">
                      <td className="px-4 py-3 text-sm">{item.serviceName}</td>
                      <td className="px-4 py-3 text-sm">{item.partName}</td>
                      <td className="px-4 py-3 text-sm">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs rounded ${
                          item.actionType === 'Replace' ? 'bg-red-100 text-red-800' :
                          item.actionType === 'Inspect' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.actionType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs rounded ${
                          item.conditionStatus === 'Required' ? 'bg-red-100 text-red-800' :
                          item.conditionStatus === 'Good' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.conditionStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{item.laborCost.toLocaleString()} VND</td>
                      <td className="px-4 py-3 text-sm">{item.maintenanceItem}</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FaTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add New Item Form */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-4">Add Maintenance Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Service Name"
                value={newItem.serviceName}
                onChange={(e) => setNewItem({...newItem, serviceName: e.target.value})}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Part Name"
                value={newItem.partName}
                onChange={(e) => setNewItem({...newItem, partName: e.target.value})}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                min="1"
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
              <select
                value={newItem.actionType}
                onChange={(e) => setNewItem({...newItem, actionType: e.target.value})}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Replace">Replace</option>
                <option value="Inspect">Inspect</option>
                <option value="Repair">Repair</option>
                <option value="Clean">Clean</option>
              </select>
              <select
                value={newItem.conditionStatus}
                onChange={(e) => setNewItem({...newItem, conditionStatus: e.target.value})}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Required">Required</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
              <input
                type="number"
                placeholder="Labor Cost (VND)"
                value={newItem.laborCost}
                onChange={(e) => setNewItem({...newItem, laborCost: e.target.value})}
                min="0"
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Maintenance Item"
                value={newItem.maintenanceItem}
                onChange={(e) => setNewItem({...newItem, maintenanceItem: e.target.value})}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddItem}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
              >
                <FaPlus size={14} />
                Add Item
              </button>
            </div>
          </div>

          {/* Summary and Actions */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Report Summary</h3>
                <p className="text-gray-400">Total Items: {maintenanceItems.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Total Labor Cost:</p>
                <p className="text-2xl font-bold text-green-400">{getTotalCost().toLocaleString()} VND</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleSaveReport}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center gap-2"
              >
                <FaSave size={16} />
                Save Report
              </button>
              <button
                onClick={() => navigate("/technician")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}