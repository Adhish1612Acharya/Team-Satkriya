import { AuthLayoutFarmer } from "@/components/AuthLayoutFarmer";
import ExpertLoginForm from "@/components/Forms/Expert/ExpertLoginForm/ExpertLoginForm";

const LoginExpert = () => {
  return (
    <AuthLayoutFarmer
      title="Welcome Back!"
      subtitle="Sign in to your account to continue your journey with us."
    >
      <ExpertLoginForm />
    </AuthLayoutFarmer>
  );
};

export default LoginExpert;
