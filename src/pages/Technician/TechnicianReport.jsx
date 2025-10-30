// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// export default function TechnicianReport() {
//     const { appointmentId } = useParams();
//     const token = localStorage.getItem("token");
//     const [details, setDetails] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [updatingId, setUpdatingId] = useState(null);

//     // Fetch ServiceReportDetails
//     const fetchDetails = async () => {
//         setLoading(true);
//         try {
//             const res = await axios.get(
//                 `http://localhost:8080/api/technician/${appointmentId}/tasks`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             setDetails(res.data || []);
//         } catch (err) {
//             console.error("❌ Failed to fetch report details:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchDetails();
//     }, [appointmentId]);

//     const handleUpdateDetail = async (detailId, updatedData) => {
//         setUpdatingId(detailId);
//         try {
//             await axios.patch(
//                 `http://localhost:8080/api/technician/reports/details/${detailId}`,
//                 updatedData,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             fetchDetails(); // refresh list
//         } catch (err) {
//             console.error("❌ Failed to update detail:", err);
//             alert("Failed to update detail!");
//         } finally {
//             setUpdatingId(null);
//         }
//     };

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-semibold mb-4">Technician Report</h1>
//             {loading ? (
//                 <p>Loading...</p>
//             ) : details.length === 0 ? (
//                 <p>No service details found.</p>
//             ) : (
//                 <table className="min-w-full text-sm border">
//                     <thead className="bg-gray-100">
//                         <tr>
//                             <th className="p-2">#</th>
//                             <th className="p-2">Part</th>
//                             <th className="p-2">Action</th>
//                             <th className="p-2">Condition</th>
//                             <th className="p-2">Quantity</th>
//                             <th className="p-2">Labor Cost</th>
//                             <th className="p-2">Update</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {details.map((d, idx) => (
//                             <tr key={d.id} className="border-t">
//                                 <td className="p-2">{idx + 1}</td>
//                                 <td className="p-2">
//                                     <input
//                                         type="number"
//                                         value={d.partId}
//                                         onChange={e => d.partId = Number(e.target.value)}
//                                         className="border px-1 w-16"
//                                     />
//                                 </td>
//                                 <td className="p-2">
//                                     <input
//                                         type="text"
//                                         value={d.actionType}
//                                         onChange={e => d.actionType = e.target.value}
//                                         className="border px-1 w-24"
//                                     />
//                                 </td>
//                                 <td className="p-2">
//                                     <input
//                                         type="text"
//                                         value={d.conditionStatus}
//                                         onChange={e => d.conditionStatus = e.target.value}
//                                         className="border px-1 w-24"
//                                     />
//                                 </td>
//                                 <td className="p-2">
//                                     <input
//                                         type="number"
//                                         value={d.quantity}
//                                         onChange={e => d.quantity = Number(e.target.value)}
//                                         className="border px-1 w-16"
//                                     />
//                                 </td>
//                                 <td className="p-2">
//                                     <input
//                                         type="number"
//                                         value={d.laborCost}
//                                         onChange={e => d.laborCost = Number(e.target.value)}
//                                         className="border px-1 w-20"
//                                     />
//                                 </td>
//                                 <td className="p-2">
//                                     <button
//                                         onClick={() => handleUpdateDetail(d.id, d)}
//                                         disabled={updatingId === d.id}
//                                         className={`px-2 py-1 text-white rounded ${updatingId === d.id ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
//                                     >
//                                         Update
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// }
