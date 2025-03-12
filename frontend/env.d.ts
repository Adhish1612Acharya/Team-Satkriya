/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_AUTH_DOMAIN: string;
  readonly VITE_PROJECT_ID: string;
  readonly VITE_STORAGE_BUCKET: string;
  readonly VITE_MESSAGING_SENDER_ID: string;
  readonly VITE_APP_ID: string;
  readonly VITE_CLOUDINARY_PRESET: string;
  readonly VITE_CLOUDINARY_NAME: string;
  readonly VITE_CLOUDINARY_UPLOAD_URL: string;
  readonly VITE_GEMINI_API_KEY: string;
  readonly GENKIT_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}