import { BaseProfile } from '@/pages/Profiles/index';

export interface FarmerProfile extends BaseProfile {
  language: string;
  state: string;
  city: string;
  experience: number;
}