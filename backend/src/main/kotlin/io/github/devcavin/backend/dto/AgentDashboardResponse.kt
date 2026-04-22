package io.github.devcavin.backend.dto

import io.github.devcavin.backend.enums.FieldStage
import io.github.devcavin.backend.enums.FieldStatus

data class AgentDashboardResponse(
    val totalAssignedFields: Int,
    val statusBreakdown: Map<FieldStatus, Int>,
    val stageBreakdown: Map<FieldStage, Int>,
    val atRiskFields: List<AtRiskFieldSummary>,
    val actionHints: List<String>,
    val recentUpdates: List<FieldUpdateResponse>
)
