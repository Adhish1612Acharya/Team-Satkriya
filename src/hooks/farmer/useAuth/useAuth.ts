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
// import { setupRecaptcha } from "../../utils/firebaseUtils";

const useAuth = () => {
  const navigate = useNavigate();

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
      const user = auth.currentUser;
      const docRef = doc(db, "farmer", `${user?.uid}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let farmerData = docSnap.data();

        if (farmerData.profile === null) {
          navigate("/farmer/complete-profile");
        }
      }
      setLoginLoad(false);
    } catch (err) {
      setLoginLoad(false);
      console.log("Login error : ", err);
      toast.warn("Either phone or passowrd is incorrect");
    }
  };

  const farmerSignUp: FarmerSignUp = async (
    email,
    password,
    phoneNumber,
    language,
    name,
    state,
    city,
    experience
  ) => {
    try {
      setSignUpLoad(true);
      await createUserWithEmailAndPassword(auth, email, password).then(
        async (userCredential) => {
          const user = userCredential.user;
          const docRef = doc(db, "farmer", user.uid);

          await setDoc(docRef, {
            name: name,
            email: user.email,
            contactNo: phoneNumber,
            posts: [],
            role: "farmer",
            profileData: {
              language: language,
              state: state,
              city: city,
              experience: experience,
            },
          });
        }
      );
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
