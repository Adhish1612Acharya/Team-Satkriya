import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db, signInWithGooglePopup } from "@/firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  CompleteProfile,
  GoogleLoginProps,
  SignInWithEmailPasswordProps,
  SignUpArguProps,
} from "./useAuth.types";

const useAuth = () => {
  const [loginLoading, setLoginLoading] = useState(false);

  const [signUpLoading, setSignUpLoading] = useState(false);

  const [gooleLoginLoad, setGoogleLoginLoad] = useState(false);

  const [completeProfileLoading, setCompleteProfileLoading] = useState(false);

  const navigate = useNavigate();

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(auth, (user) => {
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);

  const logout = async () => {
    await auth.signOut().then(() => {
      toast.success("LoggedOut");
      window.location.href = "/";
    });
  };

  const googleLogin: GoogleLoginProps = async (role) => {
    try {
      setGoogleLoginLoad(true);
      await signInWithGooglePopup().then(async (data) => {
        const docRef = doc(db, "experts", `${data.user.uid}`);

        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          const user = data.user;
          await setDoc(docRef, {
            name: user.displayName,
            email: user.email,
            role: role,
            profileData: null,
            posts: [],
          });
          navigate("/expert/complete-profile");
        } else {
          const userData = docSnap.data();
          if (userData.profileData === null) {
            navigate("/expert/complete-profile");
          } else {
            navigate("/expert/home");
          }
        }
        setGoogleLoginLoad(false);
      });
    } catch (err) {
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
      navigate("/expert/home");
    } catch (err: any) {
      console.log(err);
      setLoginLoading(false);
      toast.error(err.message || "Email or password is not correct");
    }
  };

  const signUp: SignUpArguProps = async (
    email,
    password,
    username,
    address,
    contactNo,
    role,
    profileData
  ) => {
    try {
      setSignUpLoading(true);
      await createUserWithEmailAndPassword(auth, email, password).then(
        async (userCredential) => {
          const user = userCredential.user;
          const docRef = doc(db, "experts", user.uid);

          await setDoc(docRef, {
            name: username,
            email: user.email,
            contactNo: contactNo,
            address: address,
            posts: [],
            role: role,
            profileData: profileData,
          });
        }
      );
      setSignUpLoading(false);
      navigate("/expert/home");
    } catch (err:any) {
      setSignUpLoading(false);
      console.log(err);
      toast.error(err);
    }
  };

  const completeProfile: CompleteProfile = async (profileData) => {
    try {
      auth.onAuthStateChanged(async (user) => {
        setCompleteProfileLoading(true);
        if (user?.uid) {
          const expertDocRef = doc(db, "experts", user.uid);
          await updateDoc(expertDocRef, {
            profileData: profileData,
          });
        } else {
          console.error("User ID is undefined, cannot update document.");
        }
        setCompleteProfileLoading(false);
      });
    } catch (err) {
      console.log(err);
      toast.error("Some error occured");
    }
  };

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
    logout,
    signInWithEmailPassword,
    completeProfile,
    signUp,
  };
};

export default useAuth;
