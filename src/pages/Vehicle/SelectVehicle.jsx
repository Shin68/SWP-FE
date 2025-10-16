import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaHome } from "react-icons/fa";
import { PAGE_URLS } from "../../App/config";

export default function SelectVehicle() {
    const navigate = useNavigate();

    // Danh sách xe cứng
    const [bikes, setBikes] = useState([
        {
            name: "Felix2025",
            plate: "59X4-12969",
            serial: "VF8E1ABC03456789",
            nextMaintenance: "27/11/2025",
            img: "/img/bike1.jpg",
        },
        {
            name: "Evo Neo",
            plate: "30A-123.45",
            serial: "VF8E1ABC01234567",
            nextMaintenance: "15/10/2025",
            img: "/img/bike2.jpg",
        },
        {
            name: "Klara Neo",
            plate: "51F-999.01",
            serial: "VF8E1ABC07654321",
            nextMaintenance: "15/10/2025",
            img: "/img/bike3.jpg",
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newVIN, setNewVIN] = useState("");
    const [message, setMessage] = useState("");

    // Thêm xe mới
    const handleAddVehicle = () => {
        const vin = newVIN.trim().toUpperCase();
        if (!vin) {
            setMessage("Please enter a VIN (Frame Number).");
            return;
        }
        const exists = bikes.some((bike) => bike.serial.toUpperCase() === vin);
        if (exists) {
            setMessage("This VIN already exists!");
            return;
        }

        ```
const newVehicle = {
  name: "Unknown Model (Loaded from DB)",
  plate: "Updating...",
  serial: vin,
  nextMaintenance: "Updating...",
  img: "/img/bike1.jpg",
};

setBikes([...bikes, newVehicle]);
setMessage("Vehicle added successfully!");
setIsModalOpen(false);
setNewVIN("");
setTimeout(() => setMessage(""), 2000);
```

    };

    // Khi chọn xe -> sang bước ServiceBooking
    const handleSelect = (bike) => {
        console.log("Selected vehicle:", bike);
        navigate(PAGE_URLS.SERVICE_BOOKING, { state: { vehicle: bike } });
    };

    return (<div className="min-h-screen bg-gray-700 text-white">
        {/* Header */} <header className="bg-gray-800 p-4 flex justify-between items-center"> <div className="flex items-center gap-2"> <img src="/img/logo.jpg" alt="Logo" className="h-10 w-10" /> <span className="font-bold text-lg">EV</span> </div> <div className="flex gap-4 items-center">
            <button
                onClick={() => navigate(PAGE_URLS.HOME)}
                className="text-white hover:text-gray-300"
            > <FaHome size={20} /> </button> <span>🔔</span> <span>⚙️</span> <img
                src="/img/avt.jpg"
                alt="User"
                className="h-8 w-8 rounded-full border border-gray-400"
            /> </div> </header>

        ```
        {/* Nội dung */}
        <div className="p-10">
            <h2 className="text-2xl font-semibold mb-6 text-center">
                Select Your Vehicle
            </h2>

            {message && (
                <p className="text-center text-green-400 font-medium mb-4">
                    {message}
                </p>
            )}

            {/* Danh sách xe */}
            <div className="grid grid-cols-3 gap-8 justify-items-center">
                {bikes.map((bike) => (
                    <div
                        key={bike.serial}
                        onClick={() => handleSelect(bike)}
                        className="bg-gray-600 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-transform cursor-pointer w-full max-w-sm"
                    >
                        <img
                            src={bike.img}
                            alt={bike.name}
                            className="w-full h-56 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-bold">{bike.name}</h3>
                            <p className="text-sm mt-1">{bike.plate}</p>
                            <p className="text-xs text-gray-300">{bike.serial}</p>
                            <p className="text-xs text-gray-300 mt-1">
                                Next maintenance:{" "}
                                <span className="text-yellow-400">
                                    {bike.nextMaintenance}
                                </span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Nút Add Vehicle */}
            <div className="flex justify-center mt-10">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
                >
                    <FaPlus size={20} />
                    Add Vehicle by VIN
                </button>
            </div>

            {/* Quay lại Dealer */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={() => navigate(PAGE_URLS.DEALER_DETAIL)}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg"
                >
                    ← Back to Dealer
                </button>
            </div>
        </div>

        {/* Modal Thêm xe */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-8 rounded-xl w-full max-w-lg shadow-xl">
                    <h3 className="text-2xl font-semibold mb-6 text-center">
                        Add Vehicle by VIN
                    </h3>

                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enter VIN / Frame Number"
                            value={newVIN}
                            onChange={(e) => setNewVIN(e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddVehicle}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
    );
}
