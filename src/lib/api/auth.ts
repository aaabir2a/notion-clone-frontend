import { api, apiClient } from './client';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
  ApiResponse,
} from '@/types';

export const authApi = {
  // Register new user
  async register(credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/auth/register', credentials);
    if (response.data?.accessToken) {
      apiClient.setAccessToken(response.data.accessToken);
    }
    return response;
  },

  // Login user
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.accessToken) {
      apiClient.setAccessToken(response.data.accessToken);
    }
    return response;
  },

  // Logout user
  async logout(): Promise<ApiResponse> {
    const response = await api.post('/auth/logout');
    apiClient.clearTokens();
    return response;
  },

  // Get current user
  async getMe(): Promise<ApiResponse<{ user: User }>> {
    return api.get('/auth/me');
  },

  // Update profile
  async updateProfile(data: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    return api.patch('/auth/profile', data);
  },

  // Refresh token
  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    return api.post('/auth/refresh');
  },
};
