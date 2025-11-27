
import { apiClient } from './api/client';
import { Order } from '../types';

export const orderService = {
    getOrders: () => apiClient.get<Order[]>('/orders'),
    createOrder: (data: Omit<Order, 'id'>) => apiClient.post<Order>('/orders', data),
    updateOrder: (id: string, data: Partial<Order>) => apiClient.put<Order>(`/orders/${id}`, data),
    deleteOrder: (id: string) => apiClient.delete<void>(`/orders/${id}`),
};
