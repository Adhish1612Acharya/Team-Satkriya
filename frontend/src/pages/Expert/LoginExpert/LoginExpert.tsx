import AuthLayoutExpert from "@/components/AuthLayoutExpert/AuthLayoutExpert";
import ExpertLoginForm from "@/components/Forms/Expert/ExpertLoginForm/ExpertLoginForm";

const LoginExpert = () => {
  return (
    <AuthLayoutExpert
      title="Welcome Back!"
      subtitle="Sign in to your account to continue your journey with us."
    >
      <ExpertLoginForm />
    </AuthLayoutExpert>
  );
};

export default LoginExpert;
