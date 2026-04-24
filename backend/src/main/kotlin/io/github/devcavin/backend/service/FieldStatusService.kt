package io.github.devcavin.backend.service

import io.github.devcavin.backend.entity.Field
import io.github.devcavin.backend.enums.FieldStage
import io.github.devcavin.backend.enums.FieldStatus
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class FieldStatusService {

    private val stageOrder = listOf(
        FieldStage.PLANTED,
        FieldStage.GROWING,
        FieldStage.READY,
        FieldStage.HARVESTED
    )

    private val stageThresholds = mapOf(
        FieldStage.PLANTED to 14,
        FieldStage.GROWING to 60,
        FieldStage.READY to 75
    )

    fun computeFieldStatus(field: Field): FieldStatus {
        if (field.stage == FieldStage.HARVESTED) return FieldStatus.COMPLETED

        val daysSincePlanting = LocalDate.now().toEpochDay() - field.plantingDate.toEpochDay()

        val isAtRisk = stageThresholds[field.stage]
            ?.let { daysSincePlanting > it }
            ?: false

        return if (isAtRisk) FieldStatus.AT_RISK else FieldStatus.ACTIVE
    }

    fun isValidTransition(current: FieldStage, next: FieldStage): Boolean {
        val currentIndex = stageOrder.indexOf(current)
        val nextIndex = stageOrder.indexOf(next)
        return nextIndex == currentIndex + 1
    }

    fun nextStage(current: FieldStage): FieldStage? {
        val currentIndex = stageOrder.indexOf(current)
        return stageOrder.getOrNull(currentIndex + 1)
    }
}