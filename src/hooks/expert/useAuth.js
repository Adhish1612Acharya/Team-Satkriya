import { useState } from "react";
import { db, signInWithGooglePopPup } from "@/firebaseconfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const googleLogin = async (role) => {
    try {
      await signInWithGooglePopPup().then(async (data) => {
        const docRef = doc(db, "expert", `${data.user.uid}`);

        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          const user = data.user;
          await setDoc(docRef, {
            username: user.displayName,
            email: user.email,
            contactNo: -1,
            role: role,
            posts: [],
          });
        }
        return {
          uid: data.user.uid,
        };
      });
    } catch (err) {
      console.log("Error : ", err);
    }
  };
  return <div>useAuth</div>;
};

export default useAuth;
