package io.github.devcavin.backend.dto

import io.github.devcavin.backend.enums.FieldStage
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.PastOrPresent
import java.time.LocalDate

data class CreateFieldRequest(
    @field:NotNull(message = "Field name is required")
    var name: String,

    @field:NotNull(message = "Crop type is required")
    var cropType: String,

    @field:NotNull(message = "Planting date is required")
    @field:PastOrPresent(message = "Planting date cannot be in the future")
    var plantingDate: LocalDate,

    @field:NotNull(message = "Agent ID is required")
    var agentId: Long,

    val fieldStage: FieldStage? = null
)
