

import { MenuItem, Employee, ModifierGroup, Category, Device } from './types';

export const MOCK_CATEGORIES: Category[] = [
  { 
      id: 'cat1', 
      name: 'Burgers', 
      description: 'Juicy flame-grilled burgers',
      kdsDeviceIds: ['d1', 'd2'], // Assigned to Main Kitchen & Grill KDS
      printerDeviceIds: ['d5'] // Assigned to Expo Printer
  },
  { 
      id: 'cat2', 
      name: 'Pizza', 
      description: 'Wood-fired pizzas',
      kdsDeviceIds: ['d3'], // Pizza Station KDS
      printerDeviceIds: ['d5']
  },
  { 
      id: 'cat3', 
      name: 'Drinks', 
      description: 'Cold beverages and cocktails',
      kdsDeviceIds: [],
      printerDeviceIds: ['d4'] // Bar Printer
  },
  { 
      id: 'cat4', 
      name: 'Appetizers', 
      description: 'Starters and shareables',
      kdsDeviceIds: ['d1'],
      printerDeviceIds: ['d5']
  },
];

export const MOCK_MODIFIER_GROUPS: ModifierGroup[] = [
  {
    id: 'mg1',
    name: 'Burger Sides',
    minSelection: 1,
    maxSelection: 1,
    modifiers: [
      { id: 'm1', name: 'Fries', price: 0 },
      { id: 'm2', name: 'Onion Rings', price: 1.50 },
      { id: 'm3', name: 'Side Salad', price: 0 },
    ]
  },
  {
    id: 'mg2',
    name: 'Meat Temperature',
    minSelection: 1,
    maxSelection: 1,
    modifiers: [
      { id: 'm4', name: 'Rare', price: 0 },
      { id: 'm5', name: 'Medium', price: 0 },
      { id: 'm6', name: 'Well Done', price: 0 },
    ]
  },
  {
    id: 'mg3',
    name: 'Pizza Toppings',
    minSelection: 0,
    maxSelection: 5,
    modifiers: [
      { id: 'm7', name: 'Extra Cheese', price: 2.00 },
      { id: 'm8', name: 'Pepperoni', price: 1.50 },
      { id: 'm9', name: 'Mushrooms', price: 1.00 },
    ]
  }
];

export const MOCK_DEVICES: Device[] = [
  { 
    id: 'd1', 
    name: 'Main Kitchen KDS', 
    type: 'KDS', 
    protocol: 'TCP/IP', 
    location: 'Kitchen - Hot Line', 
    status: 'Online', 
    ipAddress: '192.168.1.101', 
    port: 8080 
  },
  { 
    id: 'd2', 
    name: 'Grill Station KDS', 
    type: 'KDS', 
    protocol: 'TCP/IP', 
    location: 'Kitchen - Grill', 
    status: 'Online', 
    ipAddress: '192.168.1.102', 
    port: 8080 
  },
  { 
    id: 'd3', 
    name: 'Pizza Station KDS', 
    type: 'KDS', 
    protocol: 'TCP/IP', 
    location: 'Kitchen - Pizza Oven', 
    status: 'Offline', 
    ipAddress: '192.168.1.103', 
    port: 8080 
  },
  { 
    id: 'd4', 
    name: 'Bar Printer', 
    type: 'Printer', 
    protocol: 'ESC/POS', 
    location: 'Bar Area', 
    status: 'Online', 
    ipAddress: '192.168.1.201', 
    port: 9100,
    serialNumber: 'EPSON-123456'
  },
  { 
    id: 'd5', 
    name: 'Expo Printer', 
    type: 'Printer', 
    protocol: 'ESC/POS', 
    location: 'Expo Line', 
    status: 'Online', 
    ipAddress: '192.168.1.202', 
    port: 9100 
  },
  { 
    id: 'd6', 
    name: 'Receipt Printer', 
    type: 'Printer', 
    protocol: 'ESC/POS', 
    location: 'Cashier 1', 
    status: 'Online', 
    ipAddress: '192.168.1.203', 
    port: 9100 
  },
  { 
    id: 'd7', 
    name: 'Main POS Terminal', 
    type: 'POS', 
    protocol: 'None', 
    location: 'Front Counter', 
    status: 'Online', 
    ipAddress: '192.168.1.50', 
    serialNumber: 'POS-X99-001'
  },
  { 
    id: 'd8', 
    name: 'Expo Screen', 
    type: 'Expeditor', 
    protocol: 'TCP/IP', 
    location: 'Expo Line', 
    status: 'Online', 
    ipAddress: '192.168.1.110', 
    port: 3000
  },
  { 
    id: 'd9', 
    name: 'Bar PAX Terminal', 
    type: 'PAX', 
    protocol: 'TCP/IP', 
    location: 'Bar Counter', 
    status: 'Online', 
    ipAddress: '192.168.1.60', 
    port: 10009,
    serialNumber: 'PAX-A920-001'
  },
];

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    categoryId: 'cat1',
    isAvailable: true,
    description: 'Angus beef patty with cheddar, lettuce, tomato, and house sauce.',
    variants: [
        { id: 'v1', name: 'Standard', price: 12.99 },
        { id: 'v2', name: 'Double Patty', price: 16.99 }
    ],
    modifierGroupIds: ['mg1', 'mg2']
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    categoryId: 'cat2',
    isAvailable: true,
    description: 'San Marzano tomato sauce, fresh mozzarella, basil.',
    variants: [
        { id: 'v3', name: 'Small (10")', price: 14.00 },
        { id: 'v4', name: 'Large (14")', price: 18.00 },
    ],
    modifierGroupIds: ['mg3']
  },
  {
    id: '3',
    name: 'Craft Cola',
    categoryId: 'cat3',
    isAvailable: true,
    description: 'Artisanal cane sugar cola.',
    variants: [
        { id: 'v5', name: 'Regular', price: 3.50 }
    ],
    modifierGroupIds: []
  },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'John Doe', email: 'john@restaurant.com', role: 'Admin', status: 'Active', loginNumber: '1001', password: 'password123' },
  { id: '2', name: 'Jane Smith', email: 'jane@restaurant.com', role: 'Manager', status: 'Active', loginNumber: '2001', password: 'password123' },
  { id: '3', name: 'Mike Cook', email: 'mike@restaurant.com', role: 'Kitchen', status: 'Active', loginNumber: '3001', password: 'password123' },
];