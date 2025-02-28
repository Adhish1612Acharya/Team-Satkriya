import { AuthLayout } from "../components/AuthLayout";
import ExpertLoginForm from "@/components/Forms/Expert/ExpertLoginForm";

export function Login() {
  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Sign in to your account to continue your journey with us."
    >
      <ExpertLoginForm />
    </AuthLayout>
  );
}

export default Login;
