
import { apiClient } from './api/client';
import { Employee, Role } from '../types';

interface LoginResponseData {
    accessToken: string;
    refreshToken: string;
    tenantId: string;
    roles: string[];
}

// Helper to decode JWT to get user info (since login response only gives token)
const decodeToken = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return {};
    }
};

const mapRole = (apiRole: string): Role => {
    const r = apiRole.toLowerCase();
    if (r === 'admin') return 'Admin';
    if (r === 'manager') return 'Manager';
    if (r === 'server') return 'Server';
    if (r === 'kitchen') return 'Kitchen';
    return 'Server'; // Default
};

export const authService = {
    login: async (email: string, password: string): Promise<Employee> => {
        const data = await apiClient.post<LoginResponseData>('/api/authentication/login', { email, password }, { skipAuth: true });
        
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        // Decode token to get user details
        const payload = decodeToken(data.accessToken);
        
        // Construct User Object from Token Payload
        // Expected payload keys based on typical Identity/JWT structure or the example provided
        // Example: {"sub":"...","BranchId":"...","UserRole":"manager","Username":"manager"}
        const userRole = data.roles && data.roles.length > 0 ? data.roles[0] : (payload.UserRole || 'server');
        
        const user: Employee = {
            id: payload.sub || 'unknown',
            name: payload.Username || payload.unique_name || email.split('@')[0],
            email: email,
            role: mapRole(userRole),
            status: 'Active',
            branchId: payload.BranchId,
            loginNumber: '0000' // Placeholder as it's not in token
        };

        // Persist user for session persistence (optional)
        localStorage.setItem('currentUser', JSON.stringify(user));

        return user;
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
    },

    getCurrentUser: (): Employee | null => {
        const stored = localStorage.getItem('currentUser');
        if (stored) return JSON.parse(stored);
        return null;
    }
};
