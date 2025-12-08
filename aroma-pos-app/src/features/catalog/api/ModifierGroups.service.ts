import { apiClient } from "@/src/shared/services/api/client";
import { handleRequest } from "@/src/shared/services/api/handleRequest";
import { ModifierGroup } from "@/src/shared/types";
import { ServiceResponse } from "@/src/shared/types/serviceResponse";

export const ModifierGroupsService = {
    getModifierGroups: async() : Promise<ServiceResponse<ModifierGroup[]>> => {
        return handleRequest<ModifierGroup[]>(apiClient.get('/api/modifier-groups'));
    },
    createModifierGroup: async (data: Omit<ModifierGroup, 'id'>): Promise<ServiceResponse<ModifierGroup>> => {
        return handleRequest<ModifierGroup>(apiClient.post('/api/modifier-groups', data));
    },
    updateModifierGroup: async (id: string, data: Partial<ModifierGroup>): Promise<ServiceResponse<ModifierGroup>> => {
        return handleRequest<ModifierGroup>(apiClient.put(`/api/modifier-groups/${id}`, data));
    },
    deleteModifierGroup: async (id: string): Promise<ServiceResponse<void>> => {
        return handleRequest<void>(apiClient.delete(`/api/modifier-groups/${id}`));
    },
}