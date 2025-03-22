import { doc, getDoc, setDoc, 
  // updateDoc
 } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db, signInWithGooglePopup } from "@/firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  // CompleteProfile,
  GoogleLoginProps,
  GoogleSignUpProps,
  SignInWithEmailPasswordProps,
  SignUpArguProps,
} from "./useAuth.types";
import { useAuthContext } from "@/context/AuthContext";

const useAuth = () => {
  const { setUserType } = useAuthContext();

  const [loginLoading, setLoginLoading] = useState(false);

  const [signUpLoading, setSignUpLoading] = useState(false);

  const [gooleLoginLoad, setGoogleLoginLoad] = useState(false);

  const [completeProfileLoading, setCompleteProfileLoading] = useState(false);

  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut().then(() => {
      setUserType(null);
      toast.success("LoggedOut");
      window.location.href = "/";
    });
  };

  const googleLogin: GoogleLoginProps = async () => {
    try {
      setGoogleLoginLoad(true);
      await signInWithGooglePopup().then(async (data) => {
        const docRef = doc(db, "experts", `${data.user.uid}`);

        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setUserType(null);
          await signOut(auth);
          window.location.href = "/expert/register";
        } else {
          localStorage.setItem("userType", "experts");
        }
        setUserType("experts");
        setGoogleLoginLoad(false);
      });
    } catch (err) {
      setUserType(null);
      console.log("Error : ", err);
      setGoogleLoginLoad(false);
    }
  };

  const googleSignUp: GoogleSignUpProps = async (
    role,
    profileData,
    address,
    phoneNumber
  ) => {
    try {
      setGoogleLoginLoad(true);
      await signInWithGooglePopup().then(async (data) => {
        const docRef = doc(db, "experts", `${data.user.uid}`);

        const docSnap = await getDoc(docRef);
        setUserType("experts");

        if (!docSnap.exists()) {
          const user = data.user;
          await setDoc(docRef, {
            name: user.displayName,
            email: user.email,
            address: address,
            contactNo: phoneNumber,
            role: role,
            profileData: profileData,
            posts: [],
          });
          toast.success(
            `Welcome ${role === "doctor" && `Dr.`}${user.displayName}`
          );
        } else {
          toast.success(`Logged IN successfully`);
        }
        localStorage.setItem("userType", "experts");
        setGoogleLoginLoad(false);
        navigate("/posts");
      });
    } catch (err) {
      setUserType(null);
      console.log("Error : ", err);
      setGoogleLoginLoad(false);
    }
  };

  const signInWithEmailPassword: SignInWithEmailPasswordProps = async (
    email,
    password
  ) => {
    try {
      setLoginLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setLoginLoading(false);
      setUserType("experts");
      localStorage.setItem("userType", "experts");
      navigate("/expert/home");
    } catch (err: any) {
      setUserType(null);
      console.log(err);
      setLoginLoading(false);
      toast.error(err.message || "Email or password is not correct");
    }
  };

  const expertSignUp: SignUpArguProps = async (data) => {
    try {
      setSignUpLoading(true);
      await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      ).then(async (userCredential) => {
        const user = userCredential.user;
        const docRef = doc(db, "experts", user.uid);

        await setDoc(docRef, {
          name: data.name,
          email: user.email,
          contactNo: data.contactNo,
          address: data.address,
          posts: [],
          role: data.role,
          profileData: data.profileData,
        });
      });
      setUserType("experts");
      setSignUpLoading(false);
      localStorage.setItem("userType", "experts");
      navigate("/expert/home");
    } catch (err: any) {
      setUserType(null);
      setSignUpLoading(false);
      console.log(err);
      toast.error(err);
    }
  };

  // const completeProfile: CompleteProfile = async (profileData) => {
  //   try {
  //     auth.onAuthStateChanged(async (user) => {
  //       setCompleteProfileLoading(true);
  //       if (user?.uid) {
  //         const expertDocRef = doc(db, "experts", user.uid);
  //         await updateDoc(expertDocRef, {
  //           profileData: profileData,
  //         });
  //       } else {
  //         console.error("User ID is undefined, cannot update document.");
  //       }
  //       setUserType("experts");
  //       setCompleteProfileLoading(false);
  //     });
  //   } catch (err) {
  //     setUserType(null);
  //     console.log(err);
  //     toast.error("Some error occured");
  //   }
  // };

  return {
    loginLoading,
    signUpLoading,
    gooleLoginLoad,
    completeProfileLoading,
    setLoginLoading,
    setSignUpLoading,
    setGoogleLoginLoad,
    setCompleteProfileLoading,
    googleLogin,
    googleSignUp,
    logout,
    signInWithEmailPassword,
    // completeProfile,
    expertSignUp,
  };
};

export default useAuth;
