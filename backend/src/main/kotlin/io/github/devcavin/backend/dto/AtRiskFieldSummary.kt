package io.github.devcavin.backend.dto

import io.github.devcavin.backend.enums.FieldStage

data class AtRiskFieldSummary(
    val fieldId: Long,
    val fieldName: String,
    val cropType: String,
    val stage: FieldStage,
    val daysSincePlanting: Long,
    val assignedAgentName: String
)
