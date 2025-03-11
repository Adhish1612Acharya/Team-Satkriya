import { BaseProfile } from '../index';

export interface DoctorProfile extends BaseProfile {
  uniqueId: string;
  education: string;
  yearsOfPractice: number;
  clinicLocation: string;
}