import { apiClient } from "@/src/shared/services/api/client";
import { handleRequest } from "@/src/shared/services/api/handleRequest";
import { Modifier } from "@/src/shared/types";
import { ServiceResponse } from "@/src/shared/types/serviceResponse";

export const ModifiersService = {
    getModifiers: async() : Promise<ServiceResponse<Modifier[]>> => {
        return handleRequest<Modifier[]>(apiClient.get('/api/modifiers'));
    },
    createModifier: async (data: Omit<Modifier, 'id'>): Promise<ServiceResponse<Modifier>> => {
        return handleRequest<Modifier>(apiClient.post('/api/modifiers', data));
    },
    updateModifier: async (id: string, data: Partial<Modifier>): Promise<ServiceResponse<Modifier>> => {
        return handleRequest<Modifier>(apiClient.put(`/api/modifiers/${id}`, data));
    },
    deleteModifier: async (id: string): Promise<ServiceResponse<void>> => {
        return handleRequest<void>(apiClient.delete(`/api/modifiers/${id}`));
    },
}