// import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
// import { auth, db, signInWithGooglePopup } from "@/firebase";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { toast } from "react-toastify";

// const useAuth = () => {
//   const [loginLoading, setLoginLoading] = useState(false);

//   const [signUpLoading, setSignUpLoading] = useState(false);

//   const [gooleLoginLoad, setGoogleLoginLoad] = useState(false);

//   const [completeProfileLoading, setCompleteProfileLoading] = useState(false);

//   const navigate = useNavigate();

//   // useEffect(() => {
//   //   const unsubscribe = auth.onAuthStateChanged(auth, (user) => {
//   //     setLoading(false);
//   //   });

//   //   return () => unsubscribe();
//   // }, []);

//   const logout = async () => {
//     await auth.signOut().then(() => {
//       toast.success("LoggedOut");
//       window.location.href = "/";
//     });
//   };

//   const googleLogin = async (role) => {
//     try {
//       setGoogleLoginLoad(true);
//       await signInWithGooglePopup().then(async (data) => {
//         const docRef = doc(db, "expert", `${data.user.uid}`);

//         const docSnap = await getDoc(docRef);
//         if (!docSnap.exists()) {
//           const user = data.user;
//           await setDoc(docRef, {
//             name: user.displayName,
//             email: user.email,
//             role: role,
//             posts: [],
//           });
//         }
//         setGoogleLoginLoad(false);
//         navigate("/expert/complete-profile");
//       });
//     } catch (err) {
//       console.log("Error : ", err);
//       setGoogleLoginLoad(false);
//     }
//   };

//   const signInWithEmailPassword = async (email, password) => {
//     try {
//       setLoginLoading(true);
//       await signInWithEmailAndPassword(auth, email, password);
//       setLoginLoading(false);
//     } catch (err) {
//       console.log(err);
//       setLoginLoading(false);
//       toast.error(err.message || "Emial or password is not correct");
//     }
//   };

//   const signUp = async (
//     email,
//     password,
//     username,
//     address,
//     contactNo,
//     role,
//     profileData
//   ) => {
//     try {
//       setSignUpLoading(true);
//       await createUserWithEmailAndPassword(auth, email, password).then(
//         async (userCredential) => {
//           const user = userCredential.user;
//           const docRef = doc(db, "expert", user.uid);

//           await setDoc(docRef, {
//             name: username,
//             email: user.email,
//             contactNo: contactNo,
//             address: address,
//             posts: [],
//             role: role,
//             profileData: profileData,
//           });
//         }
//       );
//       setSignUpLoading(false);
//     } catch (err) {
//       setSignUpLoading(false);
//       console.log(err);
//       toast.error("Some error occured");
//     }
//   };

//   const completeProfile = async (profileData: any) => {
//     try {
//       auth.onAuthStateChanged(async (user) => {
//         setCompleteProfileLoading(true);
//         const expertDocRef = doc(db, "expert", user.uid);
//         await updateDoc(expertDocRef, {
//           profileData: profileData,
//         });
//         setCompleteProfileLoading(false);
//       });
//     } catch (err) {
//       console.log(err);
//       toast.error("Some error occured");
//     }
//   };

//   return {
//     loginLoading,
//     signUpLoading,
//     gooleLoginLoad,
//     completeProfileLoading,
//     setLoginLoading,
//     setSignUpLoading,
//     setGoogleLoginLoad,
//     setCompleteProfileLoading,
//     googleLogin,
//     logout,
//     signInWithEmailPassword,
//     completeProfile,
//     signUp,
//   };
// };

// export default useAuth;
