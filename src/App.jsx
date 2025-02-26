import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import Footer from "@/components/Footer.jsx";
import  Register from "./pages/Register";
import  Login  from "./pages/Login";
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
        bodyClassName="toastBody"
        style={{ marginTop: "5rem" }}
      />
      {/* <h1 className="">Cattle breed project</h1> */}
        <Routes>
          <Route path="/expert/login" element={<Login />} />
          <Route path="/expert/register" element={<Register />} />
        </Routes>
        <Footer/>
      </>
  );
};

export default App;
