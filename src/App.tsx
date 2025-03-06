import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer"; 
import RegisterFarmer from "./pages/Farmer/RegisterFarmer/RegisterFarmer";
import LoginFarmer from "./pages/Farmer/LoginFarmer/LoginFarmer";
import LoginExpert from "./pages/Expert/LoginExpert/LoginExpert";
import RegisterExpert from "./pages/Expert/RegisterExpert/RegisterExpert";
import { FarmerProfile } from "./pages/Profiles/FarmerProfile/FarmerProfile"; 
import { DoctorProfile } from "./pages/Profiles/DoctorProfile/DoctorProfile";
import { NGOProfile } from "./pages/Profiles/NGOProfile/NGOProfile";
import { ResearchInstituteProfile } from "./pages/Profiles/ResearchInstituteProfile/ResearchInstituteProfile";
import { VolunteerProfile } from "./pages/Profiles/VolunteerProfile/VolunteerProfile";

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
        style={{ marginTop: "5rem" }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/expert/login" element={<LoginExpert />} />
        <Route path="/expert/register" element={<RegisterExpert />} />
        <Route path="/farmer/login" element={<LoginFarmer />} />
        <Route path="/farmer/register" element={<RegisterFarmer />} />
        <Route path="/profile/farmer/:id" element={<FarmerProfile />} />
        <Route path="/profile/doctor/:id" element={<DoctorProfile />} />
        <Route path="/profile/ngo/:id" element={<NGOProfile />} />
        <Route path="/profile/researchinsti/:id" element={<ResearchInstituteProfile />} />     
        <Route path="/profile/volunteer/:id" element={<VolunteerProfile />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
