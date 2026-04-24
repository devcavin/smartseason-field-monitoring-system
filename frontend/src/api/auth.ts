import api from "./axios";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";

export const login = async (request: LoginRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', request)
    return data
}

export const register = async (request: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', request)
    return data
}