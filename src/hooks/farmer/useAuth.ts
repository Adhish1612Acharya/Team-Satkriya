// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   // signInWithPhoneNumber,
// } from "firebase/auth";
// import { useState } from "react";
// import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
// import { auth, db } from "../../firebase";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// // import { setupRecaptcha } from "../../utils/firebaseUtils";

// const useAuth = () => {
//   // const [confirmationResult, setConfirmationResult] = useState(null);
//   // const sendOtp = async (phone) => {
//   //   if (phone.length < 10) {
//   //     alert("Enter a valid phone number");
//   //     return;
//   //   }
//   //   setLoading(true);
//   //   try {
//   //     setupRecaptcha();
//   //     const appVerifier = window.recaptchaVerifier;
//   //     const result = await signInWithPhoneNumber(auth, phone, appVerifier);
//   //     setConfirmationResult(result);
//   //     alert("OTP sent successfully!");
//   //   } catch (error) {
//   //     console.error(error);
//   //     alert("Failed to send OTP. Try again.");
//   //   }
//   //   setLoading(false);
//   // };
//   // const verifyOtp = async (otp) => {
//   //   try {
//   //     const result = await confirmationResult.confirm(otp);
//   //     console.log("User verified:", result.user);
//   //     alert("OTP verified successfully!");
//   //   } catch (error) {
//   //     console.error(error);
//   //     alert("Invalid OTP. Try again.");
//   //   }
//   // };
//   // return { sendOtp, verifyOtp, loading, confirmationResult };

//   // const [loginLoad, setLoginLoad] = useState(false);
//   // const [signUpLoad, setSignUpLoad] = useState(false);

//   // const navigate = useNavigate();

//   const phonePaswordLogin = async ({ email, password }) => {
//     try {
//       // setLoginLoad(true);
//       const resp = await signInWithEmailAndPassword(auth, email, password);
//       const user = auth.currentUser;
//       const docRef = doc(db, "farmers", `${user?.uid}`);
//       await getDoc(docRef);
//       // setLoginLoad(true);
//       return {
//         uid: resp.user.uid,
//         email: resp.user.email,
//       };
//     } catch (err) {
//       console.log("Login error : ", err);
//       toast.warn("Either phone or passowrd is incorrect");
//     }
//   };

//   const farmerSignUp = async ({
//     email,
//     password,
//     phoneNumber,
//     language,
//     name,
//     state,
//     city,
//     experience,
//   }) => {
//     await createUserWithEmailAndPassword(auth, email, password).then(
//       async (userCredential) => {
//         const user = userCredential.user;
//         const docRef = doc(db, "farmer", user.uid);

//         await setDoc(docRef, {
//           name: name,
//           email: user.email,
//           contactNo: phoneNumber,
//           posts: [],
//           role: "farmer",
//           profileData: {
//             language: language,
//             state: state,
//             city: city,
//             experience: experience,
//           },
//         });
//       }
//     );
//   };

//   return {
//     // loading,
//     // setLoading,
//     phonePaswordLogin,
//     // completeFarmerProfile,
//     farmerSignUp,
//   };
// };

// export default useAuth;
