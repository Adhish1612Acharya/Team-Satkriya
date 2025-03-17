import { useState, useRef, useEffect } from "react";
import { CheckCircle, X, User } from "lucide-react"; 
import styles from './VerifyPostButton.module.css';

const verifiedUsers = [
  { id: 1, name: "John Doe", avatar: null },
  { id: 2, name: "Jane Smith", avatar: null },
  { id: 3, name: "Alex Johnson", avatar: null },
  { id: 4, name: "Maria Garcia", avatar: null },
  { id: 5, name: "Sam Wilson", avatar: null },
];

const VerifyPostButton = () => {
  const [verified, setVerified] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Handle initial verification
  const handleVerify = () => {
    setVerified(true);
  };

  // Toggle popup when clicking the verified button
  const handleVerifiedClick = () => {
    if (verified) {
      setShowPopup(!showPopup);
    }
  };

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <button
        onClick={verified ? handleVerifiedClick : handleVerify}
        className={`
          flex items-center justify-center gap-2 
          px-4 py-2 rounded-md font-medium
          transition-all duration-300 ease-in-out
          ${verified ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"}
        `}
      >
        {verified ? (
          <>
            <CheckCircle className="text-white" size={18} /> {/* Replaced FaCheckCircle with CheckCircle */}
            <span>Verified</span>
          </>
        ) : (
          <span>Verify</span>
        )}
      </button>

      {/* Popup showing verified users */}
      {showPopup && (
        <>
          {/* Popup triangle pointer - positioned at the top center of the popup */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200 z-50"></div> {/* Increased z-index to 50 */}

          {/* Popup content - positioned below the button */}
          <div
            ref={popupRef}
            className={`absolute top-full left-1 transform -translate-x-1/2 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden ${styles.animateFadeIn}`} // Increased z-index to 50
            style={{
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <div className="flex justify-between items-center p-2 border-b border-gray-100 bg-gray-50">
              <h3 className="font-medium text-sm text-gray-700">Verified Users</h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={14} /> {/* Replaced FaTimes with X */}
              </button>
            </div>

            <ul className="max-h-48 overflow-y-auto py-1">
              {verifiedUsers.map((user) => (
                <li key={user.id} className="px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                  {/* User Logo/Avatar - Made slightly larger and more prominent */}
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 flex-shrink-0 border border-gray-200">
                    {user.avatar ? (
                      <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <User size={14} /> 
                    )}
                  </div>
                  {/* Username - Made more prominent */}
                  <span className="text-gray-800 font-medium">{user.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default VerifyPostButton;