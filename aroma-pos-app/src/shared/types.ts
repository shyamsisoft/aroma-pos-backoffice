

export interface Variant {
  id: string;
  name: string; // e.g., "Small", "Large", "Spicy", "Standard"
  price: number;
}

export interface ModifierItem {
  id: string;
  name: string;
  price: number; // Base price
}

export interface GroupModifierConfig {
    modifierId: string;
    minQuantity: number; // e.g., 0
    maxQuantity: number; // e.g., 1 or 5
}

export interface ModifierGroup {
  id: string;
  name: string; // e.g., "Sides", "Temperature", "Toppings"
  minSelection: number; // Group level constraint
  maxSelection: number; // Group level constraint
  modifiers: GroupModifierConfig[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  kdsDeviceIds?: string[]; // References Device IDs (Type KDS)
  printerDeviceIds?: string[]; // References Device IDs (Type Printer)
}

export type DeviceType = 'POS' | 'KDS' | 'Printer' | 'Expeditor' | 'PAX';
export type DeviceStatus = 'Online' | 'Offline' | 'Maintenance';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  protocol: string; // 'None', 'TCP/IP', 'Serial', etc.
  location: string;
  status: DeviceStatus;
  serialNumber?: string;
  ipAddress?: string;
  port?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  // basePrice removed, strictly use variants
  isAvailable: boolean;
  variants: Variant[];
  modifierGroupIds: string[]; // References ModifierGroup IDs
  // Device routing now handled via Category
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  password?: string;
  loginNumber?: string; // POS Login PIN/Number
  role: 'Admin' | 'Manager' | 'Server' | 'Kitchen';
  status: 'Active' | 'Inactive';
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: Date;
}

export type ViewState = 'dashboard' | 'menu' | 'modifiers' | 'categories' | 'employees' | 'reports' | 'devices' | 'configuration';

export interface SidebarItem {
  id: ViewState;
  label: string;
  icon: React.ReactNode;
}