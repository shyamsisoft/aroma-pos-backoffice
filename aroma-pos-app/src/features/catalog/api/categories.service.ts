import { apiClient } from "@/src/shared/services/api/client";
import { handleRequest } from "@/src/shared/services/api/handleRequest";
import { Category } from "@/src/shared/types";
import { ServiceResponse } from "@/src/shared/types/serviceResponse";

export const CategoriesService ={
    getCategories: async() : Promise<ServiceResponse<Category[]>> => {
        return handleRequest<Category[]>(apiClient.get('/api/categories'));
    },
    createCategory: async (data: Omit<Category, 'id'>): Promise<ServiceResponse<Category>> => {
        return handleRequest<Category>(apiClient.post('/api/categories', data));
    },
    updateCategory: async (id: string, data: Partial<Category>): Promise<ServiceResponse<Category>> => {
        return handleRequest<Category>(apiClient.put(`/api/categories/${id}`, data));
    },
    deleteCategory: async (id: string): Promise<ServiceResponse<void>> => {
        return handleRequest<void>(apiClient.delete(`/api/categories/${id}`));
    },
}