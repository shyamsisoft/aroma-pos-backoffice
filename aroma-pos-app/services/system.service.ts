
import { apiClient } from './api/client';
import { Employee, Device, Role, Activity, Branch } from '../types';

export const systemService = {
    // --- Employees ---
    getEmployees: () => apiClient.get<Employee[]>('/api/employees'),
    createEmployee: (data: Omit<Employee, 'id'>) => apiClient.post<Employee>('/api/employees', data),
    updateEmployee: (id: string, data: Partial<Employee>) => apiClient.put<Employee>(`/api/employees/${id}`, data),
    deleteEmployee: (id: string) => apiClient.delete<void>(`/api/employees/${id}`),

    // --- Devices ---
    getDevices: () => apiClient.get<Device[]>('/api/devices'),
    createDevice: (data: Omit<Device, 'id'>) => apiClient.post<Device>('/api/devices', data),
    updateDevice: (id: string, data: Partial<Device>) => apiClient.put<Device>(`/api/devices/${id}`, data),
    deleteDevice: (id: string) => apiClient.delete<void>(`/api/devices/${id}`),
    
    // --- Branches ---
    // The API wraps array responses in { data: [...] }, handled by client.ts
    getBranches: () => apiClient.get<Branch[]>('/api/branches'),
    
    createBranch: (data: Omit<Branch, 'id'>) => apiClient.post<Branch>('/api/branches', data),
    
    updateBranch: (id: string, data: Partial<Branch>) => apiClient.put<Branch>(`/api/branches/${id}`, data),
    
    deleteBranch: (id: string) => apiClient.delete<void>(`/api/branches/${id}`),

    // --- Roles & Permissions ---
    getPermissions: () => apiClient.get<Record<Role, string[]>>('/api/permissions'),
    updatePermissions: (data: Record<Role, string[]>) => apiClient.put<void>('/api/permissions', data),

    // --- Activity Logs ---
    getActivities: () => apiClient.get<Activity[]>('/api/activities'),
    logActivity: (data: { action: string, target: string, user: string }) => apiClient.post<void>('/api/activities', data),
};
