import VerifiedPostProfile from "@/types/verifiedPostProfileInfo";

interface VerifyPostButtonProps {
    userRole:string;
  verifiedProfiles: VerifiedPostProfile[];
  postId:string;
}

export default VerifyPostButtonProps;
