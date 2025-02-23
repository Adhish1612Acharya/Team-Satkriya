import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "../firebase/firebse";

export const setupRecaptcha = () => {
  try {
    if (!auth) {
        console.error("Firebase Auth not initialized yet.");
        return;
      }
    
      if (!(window ).recaptchaVerifier) {
        (window).recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {
              console.log("Recaptcha resolved");
            },
          },
          auth
        );
      }
  } catch (error) {
    console.error("Error creating RecaptchaVerifier:", error);
  }
};
