import { db, signInWithGooglePopPup } from "@/firebaseconfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { profile } from "console";

const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(auth, (user) => {
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const googleLogin = async (role) => {
    try {
      setLoading(true);
      await signInWithGooglePopPup().then(async (data) => {
        const docRef = doc(db, "expert", `${data.user.uid}`);

        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          const user = data.user;
          await setDoc(docRef, {
            name: user.displayName,
            email: user.email,
            role: role,
            posts: [],
          });
        }
        navigate("/expert/complete-profile");
      });
    } catch (err) {
      console.log("Error : ", err);
    }
  };

  const signInWithEmailPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Emial or password is not correct");
    }
  };

  const signUp = async (
    email,
    password,
    username,
    address,
    contactNo,
    role,
    profileData
  ) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        async (userCredential) => {
          const user = userCredential.user;
          const docRef = doc(db, "expert", user.uid);

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
    } catch (err) {
      console.log(err);
      toast.error("Some error occured");
    }
  };

  const completeProfile = async (profileData) => {
    auth.onAuthStateChanged(async (user) => {
      const expertDocRef = doc(db, "expert", user.uid);
      await updateDoc(expertDocRef, {
        profileData: profileData,
      });
    });
  };

  return { googleLogin, signInWithEmailPassword, completeProfile, signUp };
};

export default useAuth;
