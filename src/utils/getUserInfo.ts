import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

const getUserInfo=async (userId:string,userType:"farmers" | "experts")=>{
    try {
        const userDocRef = doc(db, userType, userId); // Assuming user data is in the 'users' collection
        const userDocSnap = await getDoc(userDocRef);
    
        if (userDocSnap.exists()) {
          return userDocSnap.data(); 
        } else {
          console.log("No user found with UID:", userId);
          return null;
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        throw error;
      }
}

export default getUserInfo;

//import { db } from "@/firebase";
// import { doc, getDoc } from "firebase/firestore";

// const getUserInfo = async (userId: string, userType: string) => {
//   try {
//     let userDocSnap;
//     if (userType === "farmers" || userType === "experts") {
//       const userDocRef = doc(db, userType, userId); // Assuming user data is in the 'users' collection
//       userDocSnap = await getDoc(userDocRef);
//     } else {
//       userDocSnap = await getDoc(doc(db, "farmers", userId));

//       if (userDocSnap.exists()) {
//         return userDocSnap.data();
//       } else {
//         userDocSnap = await getDoc(doc(db, "experts", userId));
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//     throw error;
//   }
// };

// export default getUserInfo;
