
import { apiClient } from './api/client';
import { MenuItem, Category, ModifierGroup, Tax } from '../types';

// Grouping all "Menu" related entities into a Catalog Service
export const catalogService = {
    // --- Products / Menu Items ---
    getProducts: () => apiClient.get<MenuItem[]>('/products'),
    createProduct: (data: Omit<MenuItem, 'id'>) => apiClient.post<MenuItem>('/products', data),
    updateProduct: (id: string, data: Partial<MenuItem>) => apiClient.put<MenuItem>(`/products/${id}`, data),
    deleteProduct: (id: string) => apiClient.delete<void>(`/products/${id}`),

    // --- Categories ---
    getCategories: () => apiClient.get<Category[]>('/categories'),
    createCategory: (data: Omit<Category, 'id'>) => apiClient.post<Category>('/categories', data),
    updateCategory: (id: string, data: Partial<Category>) => apiClient.put<Category>(`/categories/${id}`, data),
    deleteCategory: (id: string) => apiClient.delete<void>(`/categories/${id}`),

    // --- Modifiers ---
    getModifiers: () => apiClient.get<ModifierGroup[]>('/modifiers'),
    createModifierGroup: (data: Omit<ModifierGroup, 'id'>) => apiClient.post<ModifierGroup>('/modifiers', data),
    updateModifierGroup: (id: string, data: Partial<ModifierGroup>) => apiClient.put<ModifierGroup>(`/modifiers/${id}`, data),
    deleteModifierGroup: (id: string) => apiClient.delete<void>(`/modifiers/${id}`),

    // --- Taxes ---
    getTaxes: () => apiClient.get<Tax[]>('/taxes'),
    createTax: (data: Omit<Tax, 'id'>) => apiClient.post<Tax>('/taxes', data),
    updateTax: (id: string, data: Partial<Tax>) => apiClient.put<Tax>(`/taxes/${id}`, data),
    deleteTax: (id: string) => apiClient.delete<void>(`/taxes/${id}`),
};
