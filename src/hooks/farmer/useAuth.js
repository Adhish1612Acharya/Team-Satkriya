import {
  signInWithEmailAndPassword,
  // signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import { setupRecaptcha } from "../../utils/firebaseUtils";

const useAuth = () => {
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

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const phonePaswordLogin = async (email, password) => {
    try {
      const resp = await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      const docRef = doc(db, "farmers", `${user?.uid}`);
      await getDoc(docRef);
      return {
        uid: resp.user.uid,
        email: resp.user.email,
      };
    } catch (err) {
      console.log("Login error : ", err);
      toast.warn("Either phone or passowrd is incorrect");
    }
  };

  const completeFarmerProfile = async (
    phoneNo,
    language,
    name,
    state,
    city,
    experience
  ) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const farmerProfileData = {
          phoneNo,
          language,
          name,
          state,
          city,
          experience,
        };
        const userRef = doc(db, "users", user.uid); // Ensure correct path
        const userDocSnap = await updateDoc(userRef, farmerProfileData);
        if (!userDocSnap.exists()) {
          toast.error("You need to login");
          navigate("/login");
        }
      } else {
        toast.error("Not logged In");
        navigate("/login");
      }
    });
  };

  return { loading, setLoading, phonePaswordLogin, completeFarmerProfile };
};

export default useAuth;
