import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // signInWithPhoneNumber,
} from "firebase/auth";
import { useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FarmerSignUp, PhonePasswordLogin } from "./useAuth.types";
import { useAuthContext } from "@/context/AuthContext";
// import { setupRecaptcha } from "../../utils/firebaseUtils";

const useAuth = () => {
  const navigate = useNavigate();
  const {setUserType}=useAuthContext();

  const [loginLoad, setLoginLoad] = useState(false);
  const [signUpLoad, setSignUpLoad] = useState(false);
  // const [confirmationResult, setConfirmationResult] = useState(null);
  // const sendOtp = async (phone) => {
  //   if (phone.length < 10) {
  //     alert("Enter a valid phone number");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     setupRecaptcha();
  //     const appVerifier = window.recaptchaVerifier;
  //     const result = await signInWithPhoneNumber(auth, phone, appVerifier);
  //     setConfirmationResult(result);
  //     alert("OTP sent successfully!");
  //   } catch (error) {
  //     console.error(error);
  //     alert("Failed to send OTP. Try again.");
  //   }
  //   setLoading(false);
  // };
  // const verifyOtp = async (otp) => {
  //   try {
  //     const result = await confirmationResult.confirm(otp);
  //     console.log("User verified:", result.user);
  //     alert("OTP verified successfully!");
  //   } catch (error) {
  //     console.error(error);
  //     alert("Invalid OTP. Try again.");
  //   }
  // };
  // return { sendOtp, verifyOtp, loading, confirmationResult };

  const phonePaswordLogin: PhonePasswordLogin = async (phone, password) => {
    try {
      setLoginLoad(true);
      await signInWithEmailAndPassword(auth, phone, password);
      setUserType("farmers");
      localStorage.setItem("userType", "farmers");
      navigate("/posts");
      setLoginLoad(false);
    } catch (err) {
      setLoginLoad(false);
      console.log("Login error : ", err);
      toast.warn("Either phone or passowrd is incorrect");
    }
  };

  const farmerSignUp: FarmerSignUp = async (data) => {
    try {
      setSignUpLoad(true);
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
        });
      });
      setUserType("farmers");
      localStorage.setItem("userType", "experts");
      navigate("/posts");
      setSignUpLoad(false);
    } catch (err: any) {
      setSignUpLoad(false);
      console.log(err);
      toast.warn(err);
    }
  };

  return {
    loginLoad,
    setLoginLoad,
    signUpLoad,
    setSignUpLoad,
    phonePaswordLogin,
    farmerSignUp,
  };
};

export default useAuth;
