import AuthLayoutFarmer from "@/components/AuthLayoutFarmer/AuthLayoutFarmer";
import FarmerLoginForm from "@/components/Forms/Farmer/FarmerLoginForm/FarmerLoginForm";

const LoginFarmer = () => {
  return (
    <AuthLayoutFarmer
      title="Welcome Back, Farmer!"
      subtitle="Sign in to your account to continue your journey with us."
    >
      <FarmerLoginForm />
      <p className="text-center text-sm text-gray-600">
        Dont have an account?{" "}
        <a
          href="/farmer/register"
          className="font-medium text-green-600 hover:text-green-500"
        >
          Register here
        </a>
      </p>
    </AuthLayoutFarmer>
  );
};

export default LoginFarmer;
