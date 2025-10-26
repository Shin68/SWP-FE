import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left items-center gap-4">
      

      {/* Avatar */}
      <img
        src="/img/avt.jpg"
        alt="User"
        className="h-8 w-8 rounded-full border border-gray-400 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />

      {/* Menu xổ xuống */}
      {isOpen && (
        <div className="absolute top-10 right-0 w-56 bg-white shadow-xl rounded-lg p-3 z-10 border border-gray-200">
          <h3 className="text-sm text-gray-700 px-2 font-semibold mb-3 border-b border-gray-200 pb-1">
            My Information
          </h3>
           <Link
             to="/profile/view"
             onClick={() => setIsOpen(false)}
             className="flex items-center gap-2 px-3 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
           >
              View Profile
           </Link>
           <Link
             to="/profile/edit"
             onClick={() => setIsOpen(false)}
             className="flex items-center gap-2 px-3 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
           >
              Edit Profile
           </Link>
        </div>
      )}
    </div>
  );
}
