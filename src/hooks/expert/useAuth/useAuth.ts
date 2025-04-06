import {
  doc,
  getDoc,
  setDoc,
  // updateDoc
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db, signInWithGooglePopup } from "@/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  GoogleLoginProps,
  GoogleSignUpProps,
  SignInWithEmailPasswordProps,
  SignUpArguProps,
} from "./useAuth.types";

const useAuth = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut().then(() => {
      toast.success("LoggedOut");
      window.location.href = "/";
    });
  };

  const googleLogin: GoogleLoginProps = async () => {
    try {
      await signInWithGooglePopup().then(async (data) => {
        const docRef = doc(db, "experts", `${data.user.uid}`);

        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          await signOut(auth);
          window.location.href = "/expert/register";
        }
      });
    } catch (err) {
      console.log("Error : ", err);
    }
  };

  const googleSignUp: GoogleSignUpProps = async (
    role,
    profileData,
    address,
    phoneNumber
  ) => {
    try {
      await signInWithGooglePopup().then(async (data) => {
        const docRef = doc(db, "experts", `${data.user.uid}`);

        console.log(role);

        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          const user = data.user;
          await setDoc(docRef, {
            name: user.displayName,
            email: user.email,
            address: address,
            contactNo: phoneNumber,
            role: role,
            profileData: profileData,
            postsVerified:
              role === "doctor" || role === "researchInstitution" ? [] : null,
            posts: [],
            workshops: [],
            registrations: [],
            bookmarks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          toast.success(
            `Welcome ${role === "doctor" && `Dr.`}${user.displayName}`
          );
        } else {
          toast.success(`Logged IN successfully`);
        }

        navigate("/posts");
      });
    } catch (err) {
      console.log("Error : ", err);
    }
  };

  const signInWithEmailPassword: SignInWithEmailPasswordProps = async (
    email,
    password
  ) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/posts");
    } catch (err: any) {
      console.log(err);

      toast.error("Email or password is not correct");
    }
  };

  const expertSignUp: SignUpArguProps = async (data) => {
    try {
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
          workshops: [],
          registrations: [],
          bookmarks: [],
          postsVerified:
            data.role === "doctor" || data.role === "researchInstitution"
              ? []
              : null,
          role: data.role,
          profileData: data.profileData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
      navigate("/posts");
    } catch (err: any) {
      console.log(err);
      toast.error(err);
    }
  };

  return {
    googleLogin,
    googleSignUp,
    logout,
    signInWithEmailPassword,
    expertSignUp,
  };
};

export default useAuth;
