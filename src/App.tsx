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
import ProtectedRoute from "./pages/ProtectedRoute/ProtectRoute";
import { PostsPage } from "@/pages/Posts/PostsPage/PostsPage";
import NavBar from "./components/NavBar/NavBar";
import AuthProtectedRoute from "./pages/ProtectedRoute/AuthProtectedRoute";
import ExpertProtectRoute from "./pages/ProtectedRoute/ExpertProtectRoute";
import RoleSelection from "./pages/RoleSelection/RoleSelection";

const App = () => {
  return (
    <>
      <NavBar />
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
        <Route element={<AuthProtectedRoute />}>
          <Route path="/expert/register" element={<RegisterExpert />} />
          <Route path="/farmer/login" element={<LoginFarmer />} />
          <Route path="/farmer/register" element={<RegisterFarmer />} />
          <Route path="/expert/login" element={<LoginExpert />} />
          <Route path="/auth" element={<RoleSelection/>}/>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/posts" element={<PostsPage />} />
        </Route>

        <Route element={<ExpertProtectRoute />}>
          <Route path="/profile/farmer" element={<FarmerProfile />} />
          <Route path="/profile/doctor" element={<DoctorProfile />} />
          <Route path="/profile/ngo" element={<NGOProfile />} />
          <Route
            path="/profile/researchinsti"
            element={<ResearchInstituteProfile />}
          />
          <Route path="/profile/volunteer" element={<VolunteerProfile />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
};

export default App;
