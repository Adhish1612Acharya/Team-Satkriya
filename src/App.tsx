import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import RegisterFarmer from "./pages/Farmer/RegisterFarmer/RegisterFarmer";
import LoginFarmer from "./pages/Farmer/LoginFarmer/LoginFarmer";
import LoginExpert from "./pages/Expert/LoginExpert/LoginExpert";
import RegisterExpert from "./pages/Expert/RegisterExpert/RegisterExpert";
import ProtectedRoute from "./pages/ProtectedRoute/ProtectRoute";
import { PostsPage } from "@/pages/Posts/PostsPage/PostsPage";
import NavBar from "./components/NavBar/NavBar";
import AuthProtectedRoute from "./pages/ProtectedRoute/AuthProtectedRoute";
import ExpertProtectRoute from "./pages/ProtectedRoute/ExpertProtectRoute";
import RoleSelection from "./pages/RoleSelection/RoleSelection";
import FarmerProtectRoute from "./pages/ProtectedRoute/FarmerProtectRoute";
import AiSolveQuery from "./pages/Farmer/AiSolveQuery/AiSolveQuery";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import WorkshopsPage from "./pages/WorkShops/WorkShops";
import CreateWorkShop from "./pages/Expert/CreateWorkShop/CreateWorkShop";
import WorkShopDetail from "./pages/WorkShopDetails/WorkShopDetail";
import { useAuthContext } from "./context/AuthContext";
import PostDetailPage from "./pages/Posts/PostDetailPage/PostDetailPage";
import WorkshopRegistration from "./pages/Expert/WorkShopRegistration/WorkShopRegistration";
import YourPostPage from "./pages/YourPostsPage/YourPostPage";
import YourRegistrationsPage from "./pages/YourRegistrationsPage/YourRegistrationsPage";

const App = () => {
  const { nav } = useAuthContext();
  return (
    <>
      {nav && <NavBar />}

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
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<AuthProtectedRoute />}>
            <Route path="/expert/register" element={<RegisterExpert />} />
            <Route path="/farmer/login" element={<LoginFarmer />} />
            <Route path="/farmer/register" element={<RegisterFarmer />} />
            <Route path="/expert/login" element={<LoginExpert />} />
            <Route path="/auth" element={<RoleSelection />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/workshops" element={<WorkshopsPage />} />
            <Route path="/workshops/:id" element={<WorkShopDetail />} />
            <Route path="/user/posts" element={<YourPostPage />} />
            <Route
              path="/user/registrations"
              element={<YourRegistrationsPage />}
            />
          </Route>
          <Route element={<FarmerProtectRoute />}>
            <Route path="/solve-query" element={<AiSolveQuery />} />
          </Route>

          <Route element={<ExpertProtectRoute />}>
            <Route path="/workshops/create" element={<CreateWorkShop />} />
            <Route
              path="/workshops/:id/registration"
              element={<WorkshopRegistration />}
            />
            {/* <Route path="/profile/farmer" element={<FarmerProfile />} />
            <Route path="/profile/doctor" element={<DoctorProfile />} />
            <Route path="/profile/ngo" element={<NGOProfile />} />
            <Route
              path="/profile/researchinsti"
              element={<ResearchInstituteProfile />}
            />
            <Route path="/profile/volunteer" element={<VolunteerProfile />} /> */}
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>

      {nav && <Footer />}
    </>
  );
};

export default App;
