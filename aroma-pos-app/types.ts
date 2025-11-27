

export interface Variant {
  id: string;
  name: string;
  price: number;
}

export interface Modifier {
  id: string;
  name: string;
  price: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  minSelection: number;
  maxSelection: number;
  modifiers: Modifier[];
}

export interface Tax {
  id: string;
  name: string;
  rate: number;
  type: 'Percentage' | 'Fixed';
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  kdsDeviceIds?: string[];
  printerDeviceIds?: string[];
  taxIds?: string[];
}

export type DeviceType = 'POS' | 'KDS' | 'Printer' | 'Expeditor' | 'PAX';
export type DeviceStatus = 'Online' | 'Offline' | 'Maintenance';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  protocol: string;
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
  isAvailable: boolean;
  variants: Variant[];
  modifierGroupIds: string[];
}

export type Role = 'Admin' | 'Manager' | 'Server' | 'Kitchen';

// --- Updated Branch Interface ---
export interface BranchAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  longitude: string;
  latitude: string;
}

export interface BranchConfiguration {
  maxFloors: number;
  operationStartOnUtc: string; // ISO Date String
  operationEndOnUtc: string;   // ISO Date String
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;
  address: BranchAddress;
  configuration: BranchConfiguration;
  // Read-only timestamps from API
  createdOnUtc?: string;
  updatedOnUtc?: string;
  status?: string; // UI helper
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  password?: string;
  loginNumber?: string;
  role: Role;
  status: 'Active' | 'Inactive';
  branchId?: string;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: Date;
}

// --- Order System Interfaces ---

export interface TicketModifier {
    id: string;
    name: string;
    description?: string;
    price: number;
    isActive: boolean;
    quantity: number;
}

export interface TicketVariant {
    variantId: string;
    variantName: string;
    price: number;
    status: string;
}

export interface TicketTax {
    id: string;
    name: string;
    percentage: number;
    isActive: boolean;
}

export interface TicketItem {
    id: string;
    itemId: string;
    name: string;
    quantity: number;
    price: number;
    portion: number;
    discount: number;
    isDiscountPercentage: boolean;
    modifiers: TicketModifier[];
    variant?: TicketVariant;
    taxes: TicketTax[];
}

export interface TicketPayment {
    id: string;
    amount: number;
    paymentType: number; // 0 = Cash, 1 = Card
}

export interface Ticket {
    id: string;
    ticketNumber: number;
    discount: number;
    isDiscountPercentage: boolean;
    serviceCharge: number;
    isServiceChargePercentage: boolean;
    paymentStatus: number; 
    items: TicketItem[];
    payments: TicketPayment[];
}

export interface Order {
    id: string;
    orderNumber: number;
    tableId: string;
    splitedType: number;
    orderType: number;
    tickets: Ticket[];
}

export type ViewState = 'dashboard' | 'menu' | 'modifiers' | 'categories' | 'employees' | 'reports' | 'devices' | 'configuration' | 'roles' | 'taxes' | 'branches' | 'orders';

export interface SidebarItem {
  id: ViewState;
  label: string;
  icon: React.ReactNode;
}

export interface Permission {
  key: string;
  label: string;
  group: string;
  description?: string;
}
