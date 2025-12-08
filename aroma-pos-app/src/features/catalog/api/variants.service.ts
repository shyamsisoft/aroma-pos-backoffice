import { apiClient } from "@/src/shared/services/api/client";
import { handleRequest } from "@/src/shared/services/api/handleRequest";
import { Variant } from "@/src/shared/types";
import { ServiceResponse } from "@/src/shared/types/serviceResponse";

export const VariantService = {
    getVariants: async() : Promise<ServiceResponse<Variant[]>> => {
        return handleRequest<Variant[]>(apiClient.get('/api/variants'));
    },
    createVariant: async (data: {name: string, description?: string}): Promise<ServiceResponse<Variant>> => {
        return handleRequest<Variant>(apiClient.post('/api/variants', data));
    },
    updateVariant: async (id: string, data: {name?: string, description?: string}) : Promise<ServiceResponse<Variant>> => {
        return handleRequest<Variant>(apiClient.put(`/api/variants/${id}`, data));
    },
    deleteVariant: async (id: string) : Promise<ServiceResponse<void>> => {
        return handleRequest<void>(apiClient.delete(`/api/variants/${id}`));
    },
}