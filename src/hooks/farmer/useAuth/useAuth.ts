import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // signInWithPhoneNumber,
} from "firebase/auth";
import {
  doc,
  // getDoc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FarmerSignUp, PhonePasswordLogin } from "./useAuth.types";
// import { setupRecaptcha } from "../../utils/firebaseUtils";

const useAuth = () => {
  const navigate = useNavigate();

  const phonePaswordLogin: PhonePasswordLogin = async (phone, password) => {
    try {
      await signInWithEmailAndPassword(auth, phone, password);
      navigate("/posts");
    } catch (err) {
      console.log("Login error : ", err);
      toast.warn("Either phone or passowrd is incorrect");
    }
  };

  const farmerSignUp: FarmerSignUp = async (data) => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        data.phoneNumber + "@gmail.com",
        data.password
      ).then(async (userCredential) => {
        const user = userCredential.user;
        const docRef = doc(db, "farmers", user.uid);

        await setDoc(docRef, {
          name: data.name,
          email: user.email,
          contactNo: data.phoneNumber,
          posts: [],
          role: "farmer",
          profileData: {
            language: data.language,
            state: data.state,
            city: data.city,
            experience: data.experience,
          },
          registrations: [],
          bookmarks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
      navigate("/posts");
    } catch (err: any) {
      console.log(err);
      toast.warn(err);
    }
  };

  return {
    phonePaswordLogin,
    farmerSignUp,
  };
};

export default useAuth;
