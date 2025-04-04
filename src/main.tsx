import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Layout from "./Layout.tsx";


createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Layout>
        <App />
        </Layout>
      </LocalizationProvider>
    </AuthProvider>
  </BrowserRouter>
);
