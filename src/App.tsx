import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Footer from "@/components/Footer/Footer.js";
import RegisterFarmer from "./pages/Farmer/RegisterFarmer/RegisterFarmer";
import LoginFarmer from "./pages/Farmer/LoginFarmer/LoginFarmer";
import LoginExpert from "./pages/Expert/LoginExpert/LoginExpert";
import RegisterExpert from "./pages/Expert/RegisterExpert/RegisterExpert";

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        // bodyClassName="toastBody"
        style={{ marginTop: "5rem" }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/expert/login" element={<LoginExpert />} />
        <Route path="/expert/register" element={<RegisterExpert />} />
        <Route path="/farmer/login" element={<LoginFarmer />} />
        <Route path="/farmer/register" element={<RegisterFarmer />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
