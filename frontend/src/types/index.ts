export type UserRole = 'ADMIN' | 'AGENT'
export type FieldStage = 'PLANTED' | 'GROWING' | 'READY' | 'HARVESTED'
export type FieldStatus = 'ACTIVE' | 'AT_RISK' | 'COMPLETED'

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  fullName: string
  password: string
  role: string
}

export interface CreateFieldRequest {
    name: string,
    cropType: string,
    plantingDate: string,
    agentId: number,
    fieldStage: FieldStage | null
}

export interface addFieldUpdateRequest {
    newStage: FieldStage | null,
    note: string | null
}

export interface AuthResponse {
    token: string,
    username: string,
    fullName: string,
    role: UserRole
}

export interface FieldResponse {
    id: number,
    name: string,
    cropType: string,
    plantingDate: string,
    stage: FieldStage,
    status: FieldStatus,
    assignedAgentId: number,
    assignedAgentName: string
}

export interface FieldUpdateResponse {
    id: number,
    fieldId: number,
    fieldName: string,
    agentName: string,
    newStage: FieldStage | null,
    note: string | null,
    createdAt: string
}

export interface AtRiskFieldSummary {
    fieldId: number,
    fieldName: string,
    cropType: string,
    stage: FieldStage,
    daysSincePlanting: number,
    assignedAgentName: string
}

export interface AgentFieldSummary {
    agentId: number,
    agentName: string,
    totalFields: number,
    updateCount: number
}

export interface AdminDashboardResponse {
    totalFields: number,
    totalAgents: number,
    statusBreakdown: Record<FieldStatus, number>,
    stageBreakdown: Record<FieldStage, number>,
    atRiskFields: AtRiskFieldSummary[],
    agentSummaries: AgentFieldSummary[],
    mostActiveAgent: AgentFieldSummary | null,
    recentUpdates: FieldUpdateResponse[]
}

export interface AgentDashboardResponse {
    totalAssignedFields: number,
    statusBreakdown: Record<FieldStatus, number>,
    stageBreakdown: Record<FieldStage, number>,
    atRiskFields: AtRiskFieldSummary[],
    actionHints: string[],
    recentUpdates: FieldUpdateResponse[]
}