import AuthLayoutFarmer from "@/components/AuthLayoutFarmer/AuthLayoutFarmer";
import { FarmerRegisterForm } from "@/components/Forms/Farmer/FarmerRegisterForm/FarmerRegisterForm";

export function RegisterFarmer() {
  return (
    <AuthLayoutFarmer
      title="Create an Account, Farmer"
      subtitle="Join our community and make a difference."
    >
      <FarmerRegisterForm />
    </AuthLayoutFarmer>
  );
}

export default RegisterFarmer;
