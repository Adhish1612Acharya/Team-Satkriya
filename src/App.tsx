import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Footer from "@/components/Footer.jsx";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RegisterFarmer from "./pages/RegisterFarmer";
import LoginFarmer from "./pages/LoginFarmer";

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
        <Route path="/expert/login" element={<Login />} />
        <Route path="/expert/register" element={<Register />} />
        <Route path="/farmer/login" element={<LoginFarmer />} />
        <Route path="/farmer/register" element={<RegisterFarmer />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
