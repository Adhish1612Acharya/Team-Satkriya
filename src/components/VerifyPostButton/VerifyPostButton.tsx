import { useState, useRef, useEffect, FC } from "react";
import { X, User, Loader2 } from "lucide-react";
import styles from "./VerifyPostButton.module.css";
import VerifyPostButtonProps from "./VerifyPostButton.types";
import { auth } from "@/firebase";
import usePost from "@/hooks/usePost/usePost";
import VerifiedPostProfile from "@/types/verifiedPostProfileInfo";

const VerifyPostButton: FC<VerifyPostButtonProps> = ({
  userRole,
  verifiedProfiles,
  postId,
}) => {
  const { verifyPost } = usePost();

  const [verified, setVerified] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const [verifyLoad, setVerifyLoad] = useState<boolean>(false);
  const [postVeriedProfiles, setPostVerifiedProfiles] =
    useState<VerifiedPostProfile[]>(verifiedProfiles);

  // Handle initial verification
  const handleVerify = async () => {
    if (!verified) {
      setVerifyLoad(true);
      const response = await verifyPost(postId);

      if (response) {
        setPostVerifiedProfiles((prev) => {
          return [...prev, response];
        });
        setVerified(true);
      }
      setVerifyLoad(false);
    }
  };

  // Toggle popup when clicking the verified button
  const handleVerifiedClick = () => {
    setShowPopup(!showPopup);
  };

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (userRole === "doctor" || userRole === "researchInstitution") {
      setVerified(
        verifiedProfiles?.some(
          (eachProfile) => eachProfile.id === auth.currentUser?.uid
        )
      );
    }
  }, [userRole, verifiedProfiles]);

  return (
    <div className="relative inline-block">
      {userRole && (
        <button
          onClick={
            (userRole !== "doctor" &&
              userRole !== "researchInstitution" &&
              verifiedProfiles.length > 0) ||
            ((userRole === "doctor" || userRole === "researchInstitution") &&
              verified)
              ? handleVerifiedClick
              : handleVerify
          }
          className={` cursor-pointer
    flex items-center justify-center gap-2 
    px-4 py-2 rounded-md font-medium
    transition-all duration-300 ease-in-out
    ${
      ((userRole === "doctor" || userRole === "researchInstitution") &&
        verified) ||
      ((userRole === "farmer" ||
        userRole === "volunteer" ||
        userRole === "ngo") &&
        verifiedProfiles?.length > 0)
        ? "bg-green-500 hover:bg-green-600 text-white"
        : "bg-red-500 hover:bg-red-600 text-white"
    }
  `}
          disabled={
            verifyLoad ||
            (userRole !== "doctor" &&
              userRole !== "researchInstitution" &&
              verifiedProfiles?.length == 0)
          }
        >
          {verifyLoad ? (
            <Loader2 className="animate-spin" /> // Show loader while verifying
          ) : (
            <>
              {/* For non-verifiers */}
              {userRole !== "doctor" && userRole !== "researchInstitution" && (
                <div>
                  {verifiedProfiles?.length > 0
                    ? "Verified"
                    : "Under Verification"}
                </div>
              )}

              {/* For verifiers */}
              {(userRole === "doctor" ||
                userRole === "researchInstitution") && (
                <div>
                  {verified ? (
                    "Verified By You"
                  ) : (
                    <div className="flex flex-col items-center">
                      <div>Not Verified</div>
                      <span className="text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 px-2 py-0.5 rounded-full mt-1 transition-all shadow-sm">
                        Click to verify
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </button>
      )}

      {/* Popup showing verified users */}
      {showPopup && (
        <>
          {/* Popup triangle pointer - positioned at the top center of the popup */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200 z-50"></div>{" "}
          {/* Increased z-index to 50 */}
          {/* Popup content - positioned below the button */}
          <div
            ref={popupRef}
            className={`absolute top-full left-1 transform -translate-x-1/2 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden ${styles.animateFadeIn}`} // Increased z-index to 50
            style={{
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <div className="flex justify-between items-center p-2 border-b border-gray-100 bg-gray-50">
              <h3 className="font-medium text-sm text-gray-700">
                Verified Users
              </h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={14} /> {/* Replaced FaTimes with X */}
              </button>
            </div>

            <ul className="max-h-48 overflow-y-auto py-1">
              {postVeriedProfiles.map((user) => (
                <li
                  key={user.id}
                  className="px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  {/* User Logo/Avatar - Made slightly larger and more prominent */}
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 flex-shrink-0 border border-gray-200">
                    {user.profilePic ? (
                      <img
                        src={user.profilePic || "/placeholder.svg"}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
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
