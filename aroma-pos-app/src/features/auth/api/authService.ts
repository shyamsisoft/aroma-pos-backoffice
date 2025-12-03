import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authApi from '@/src/shared/services/authApi';
import { Employee } from '@/types';
import { ApiResult } from '@/src/shared/dto/apiResult';


export const login = async (email: string, password: string): Promise<ApiResult> => {
    try {
        const response = await authApi.post('/api/authentication/login', { email, password });
        const user: Employee = {
            id: response.data.data.tenantId,
            name: "Test User",
            email: email,
            role: response.data.data.roles[0],
            status: "Active",
        }
        const token = response.data.data.accessToken;

        await AsyncStorage.setItem('token', token);

        return { success: true, user };
    } catch (err: any) {
        const errorResponse = err.response?.data || { message: 'Login failed' };
        return { success: false, message: errorResponse.message };
    }
};

export const logout = async () => {
    await AsyncStorage.removeItem('token');
};
