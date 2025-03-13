import { BaseProfile } from '../index';

export interface NGOProfile extends BaseProfile {
  organizationName: string;
  establishmentDate: string;
}