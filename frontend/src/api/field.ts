import api from "./axios";
import type { addFieldUpdateRequest, CreateFieldRequest, FieldResponse, FieldUpdateResponse } from "../types";

export const getAllFields = async(): Promise<FieldResponse[]> => {
    const { data } = await api.get<FieldResponse[]>('/admin/fields')
    return data
}

export const createField = async(request: CreateFieldRequest): Promise<FieldResponse> => {
    const { data } = await api.post('/admin/fields', request)
    return data
}

export const reAssignField = async(fieldId: number, agentId: number): Promise<FieldResponse> => {
    const { data } = await api.patch(`/admin/fields/${fieldId}/reassign?agentId=${agentId}`)
    return data
}

export const deleteField = async(fieldId: number): Promise<void> => {
    const{ data } =  await api.delete(`/admin/fields/${fieldId}`)
    return data
}

export const getFieldUpdates = async(fieldId: number): Promise<FieldUpdateResponse[]> => {
  const { data } = await api.get<FieldUpdateResponse[]>(`/admin/fields/${fieldId}/updates`)
  return data
}

export const getFieldById = async (fieldId: number): Promise<FieldResponse> => {
  const { data } = await api.get<FieldResponse>(`/admin/fields/${fieldId}`)
  return data
}

export const getMyFields = async(): Promise<FieldResponse[]> => {
    const { data } = await api.get<FieldResponse[]>('/agent/fields')
    return data
}

export const getMyFieldById = async (fieldId: number): Promise<FieldResponse> => {
  const { data } = await api.get<FieldResponse>(`/agent/fields/${fieldId}`)
  return data
}

export const addFieldUpdate = async(fieldId: number, request: addFieldUpdateRequest): Promise<FieldUpdateResponse> => {
    const { data } = await api.post(`/agent/fields/${fieldId}/updates`, request)
    return data
}

export const getMyFieldUpdates = async(fieldId: number): Promise<FieldUpdateResponse[]> => {
    const { data } = await api.get<FieldUpdateResponse[]>(`/agent/fields/${fieldId}/updates`)
    return data
}