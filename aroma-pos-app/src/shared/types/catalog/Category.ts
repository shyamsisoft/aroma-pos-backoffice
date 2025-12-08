import { Tax } from './Tax';

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  taxIds?: string[];
  PrinterIds?: string[]; 
  KitichenDisplayIds?: string[];
  taxes?: Tax[];
  printers?: any[];
  kitchenDisplays?: any[];
}
