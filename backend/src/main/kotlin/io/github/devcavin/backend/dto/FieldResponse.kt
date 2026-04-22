package io.github.devcavin.backend.dto

import io.github.devcavin.backend.entity.Field
import io.github.devcavin.backend.enums.FieldStage
import io.github.devcavin.backend.enums.FieldStatus
import java.time.LocalDate

data class FieldResponse(
    val id: Long,
    val name: String,
    val cropType: String,
    val plantingDate: LocalDate,
    val stage: FieldStage,
    val status: FieldStatus,
    val assignedAgentId: Long,
    val assignedAgentName: String
)

fun Field.toResponse(status: FieldStatus): FieldResponse {
    return FieldResponse(
        id = id!!,
        name = name,
        cropType = cropType,
        plantingDate = plantingDate,
        stage = stage,
        status = status,
        assignedAgentId = assignedAgent.id!!,
        assignedAgentName = assignedAgent.fullName
    )
}
