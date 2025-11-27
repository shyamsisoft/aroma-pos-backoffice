
import { API_CONFIG } from './config';

interface RequestOptions extends RequestInit {
    skipAuth?: boolean;
}

// Standard Response Envelope from your API
interface ApiResponse<T> {
    success: boolean;
    status: number;
    message: string;
    data: T;
    error: any;
}

class ApiClient {
    private getToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { skipAuth, headers, ...customConfig } = options;

        const config: RequestInit = {
            ...customConfig,
            headers: {
                ...API_CONFIG.HEADERS,
                ...headers,
            } as HeadersInit,
        };

        if (!skipAuth) {
            const token = this.getToken();
            if (token) {
                (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
            }
        }

        try {
            // Remove leading slash if present to avoid double slashes with base url
            const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
            const response = await fetch(`${API_CONFIG.BASE_URL}${cleanEndpoint}`, config);

            if (response.status === 401) {
                // Unauthorized
                localStorage.removeItem('accessToken');
                localStorage.removeItem('currentUser');
                window.location.href = '/login';
                throw new Error('Unauthorized');
            }

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            // Parse JSON
            const responseBody: ApiResponse<T> = await response.json();

            // Check API level success flag
            if (!responseBody.success) {
                const errorMsg = responseBody.message || 'Operation failed';
                throw new Error(errorMsg);
            }

            // Return the inner data
            return responseBody.data;

        } catch (error) {
            console.error(`API Call Failed: ${endpoint}`, error);
            throw error;
        }
    }

    public get<T>(endpoint: string, options?: RequestOptions) {
        return this.request<T>(endpoint, { method: 'GET', ...options });
    }

    public post<T>(endpoint: string, body: any, options?: RequestOptions) {
        return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), ...options });
    }

    public put<T>(endpoint: string, body: any, options?: RequestOptions) {
        return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options });
    }

    public delete<T>(endpoint: string, options?: RequestOptions) {
        return this.request<T>(endpoint, { method: 'DELETE', ...options });
    }
}

export const apiClient = new ApiClient();
