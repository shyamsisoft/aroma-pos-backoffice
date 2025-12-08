import { BranchAddress } from './BranchAddress';
import { BranchConfiguration } from './BranchConfiguration';

export interface Branch {
  id: string;
  name: string;
  code: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;
  address: BranchAddress;
  configuration: BranchConfiguration;
  createdOnUtc?: string;
  updatedOnUtc?: string;
}

export type CreateBranchDto = Omit<Branch, 'id'>;