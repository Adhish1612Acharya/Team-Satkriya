import VerifiedPostProfile from "@/types/verifiedPostProfileInfo";

interface VerifyPostButtonProps {
    userRole:"farmer" | "doctor" | "ngo" | "volunteer" | "researchInstitution" | null;
  verifiedProfiles: VerifiedPostProfile[];
  postId:string;
}

export default VerifyPostButtonProps;
