import type { AdminDashboardResponse, AgentDashboardResponse } from "../types";
import api from "./axios";

export const getAdminDashboard = async(): Promise<AdminDashboardResponse> => {
    const { data } = await api.get<AdminDashboardResponse>('/admin/dashboard')
    return data
}

export const getAgentDashboard = async(): Promise<AgentDashboardResponse> => {
    const { data } = await api.get<AgentDashboardResponse>('/agent/dashboard')
    return data
}