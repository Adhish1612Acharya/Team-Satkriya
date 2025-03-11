export type PhonePasswordLogin = (
  phone: string,
  password: string
) => Promise<void>;

interface FarmerSignUpArgu{
  password: string,
  phoneNumber: number,
  language: string,
  name: string,
  state: string,
  city: string,
  experience: string
}

export type FarmerSignUp = (data:FarmerSignUpArgu) => Promise<void>;
