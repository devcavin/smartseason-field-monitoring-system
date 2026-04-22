package io.github.devcavin.backend.dto

import io.github.devcavin.backend.entity.FieldUpdate
import io.github.devcavin.backend.enums.FieldStage
import java.time.Instant

data class FieldUpdateResponse(
    val id: Long,
    val fieldId: Long,
    val fieldName: String,
    val agentName: String,
    val stage: FieldStage?,
    val note: String?,
    val createdAt: Instant?
)

fun FieldUpdate.toResponse(): FieldUpdateResponse {
    return FieldUpdateResponse(
        id = id!!,
        fieldId = field.id!!,
        fieldName = field.name,
        agentName = agent.fullName,
        stage = newStage,
        note = note,
        createdAt = Instant.now()
    )
}
