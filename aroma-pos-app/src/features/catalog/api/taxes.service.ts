import { apiClient } from "@/src/shared/services/api/client";
import { handleRequest } from "@/src/shared/services/api/handleRequest";
import { Tax } from "@/src/shared/types";
import { ServiceResponse } from "@/src/shared/types/serviceResponse";

export const TaxesService={
    getTaxes: async() : Promise<ServiceResponse<Tax[]>> => {
        return handleRequest<Tax[]>(apiClient.get('/api/taxes'));
    },
    createTax: async (data: Omit<Tax, 'id'>): Promise<ServiceResponse<Tax>> => {
        return handleRequest<Tax>(apiClient.post('/api/taxes', data));
    },
    updateTax: async (id: string, data: Partial<Tax>): Promise<ServiceResponse<Tax>> => {
        return handleRequest<Tax>(apiClient.put(`/api/taxes/${id}`, data));
    },
    deleteTax: async (id: string): Promise<ServiceResponse<void>> => {
        return handleRequest<void>(apiClient.delete(`/api/taxes/${id}`));
    },
}