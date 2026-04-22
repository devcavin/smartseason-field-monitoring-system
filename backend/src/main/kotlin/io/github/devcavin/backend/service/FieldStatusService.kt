package io.github.devcavin.backend.service

import io.github.devcavin.backend.entity.Field
import io.github.devcavin.backend.enums.FieldStage
import io.github.devcavin.backend.enums.FieldStatus
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class FieldStatusService {
    private val stageThresholds = mapOf(
        FieldStage.PLANTED to 14,
        FieldStage.GROWING to 60,
        FieldStage.READY to 75
    )

    fun computeFieldStatus(field: Field): FieldStatus {
        // Harvested fields are considered complete
        if (field.stage == FieldStage.HARVESTED) return FieldStatus.COMPLETED

        // days elapsed since planting
        val daysSincePlanting = LocalDate.now().toEpochDay() - field.plantingDate.toEpochDay()

        // Determine if field has exceeded expected duration per stage
        val isAtRisk = stageThresholds[field.stage]
            ?.let { daysSincePlanting > it }
        ?: false

        return if (isAtRisk) FieldStatus.AT_RISK else FieldStatus.ACTIVE
    }
}