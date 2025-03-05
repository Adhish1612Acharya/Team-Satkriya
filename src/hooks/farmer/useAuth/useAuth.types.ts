export type PhonePasswordLogin = (
  phone: string,
  password: string
) => Promise<void>;

export type FarmerSignUp = (
  email: string,
  password: string,
  phoneNumber: number,
  language: string,
  name: string,
  state: string,
  city: string,
  experience: string
) => Promise<void>;
