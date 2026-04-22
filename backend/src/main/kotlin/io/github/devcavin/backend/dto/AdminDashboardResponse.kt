package io.github.devcavin.backend.dto

import io.github.devcavin.backend.enums.FieldStage
import io.github.devcavin.backend.enums.FieldStatus

data class AdminDashboardResponse(
    val totalFields: Int,
    val totalAgents: Int,
    val statusBreakdown: Map<FieldStatus, Int>,
    val stageBreakdown: Map<FieldStage, Int>,
    val atRiskFields: List<AtRiskFieldSummary>,
    val agentSummaries: List<AgentFieldSummary>,
    val mostActiveAgent: AgentFieldSummary?,
    val recentUpdates: List<FieldUpdateResponse>
)
