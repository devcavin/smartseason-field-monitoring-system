package io.github.devcavin.backend.service

import io.github.devcavin.backend.dto.AdminDashboardResponse
import io.github.devcavin.backend.dto.AgentDashboardResponse
import io.github.devcavin.backend.dto.AgentFieldSummary
import io.github.devcavin.backend.dto.AtRiskFieldSummary
import io.github.devcavin.backend.dto.toResponse
import io.github.devcavin.backend.entity.Field
import io.github.devcavin.backend.enums.FieldStage
import io.github.devcavin.backend.enums.FieldStatus
import io.github.devcavin.backend.enums.UserRole
import io.github.devcavin.backend.exception.ResourceNotFoundException
import io.github.devcavin.backend.repository.FieldRepository
import io.github.devcavin.backend.repository.FieldUpdateRepository
import io.github.devcavin.backend.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@Service
class DashboardService(
    private val userRepository: UserRepository,
    private val fieldRepository: FieldRepository,
    private val fieldUpdateRepository: FieldUpdateRepository,
    private val fieldStatusService: FieldStatusService
) {

    @Transactional(readOnly = true)
    fun getAdminDashboard(): AdminDashboardResponse {
        val allFields = fieldRepository.findAll()
        val allAgents = userRepository.findByRole(UserRole.AGENT)
        val allUpdates = fieldUpdateRepository.findAll()

        val statusBreakdown = computeStatusBreakdown(allFields)
        val stageBreakdown = computeStageBreakdown(allFields)
        val atRiskFields = computeAtRiskFields(allFields)

        // 🚀 Optimized: avoid N+1 queries
        val fieldsByAgent = allFields.groupBy { it.assignedAgent.id }
        val updatesByAgent = allUpdates.groupBy { it.agent.id }

        val agentSummaries = allAgents.map { agent ->
            val agentFields = fieldsByAgent[agent.id] ?: emptyList()
            val agentUpdates = updatesByAgent[agent.id] ?: emptyList()

            AgentFieldSummary(
                agentId = agent.id!!,
                agentName = agent.fullName,
                totalFields = agentFields.size,
                updateCount = agentUpdates.size
            )
        }

        val mostActiveAgent = agentSummaries.maxByOrNull { it.updateCount }

        val recentUpdates = allUpdates
            .sortedByDescending { it.createdAt }
            .take(5)
            .map { it.toResponse() }

        return AdminDashboardResponse(
            totalFields = allFields.size,
            totalAgents = allAgents.size,
            statusBreakdown = statusBreakdown,
            stageBreakdown = stageBreakdown,
            atRiskFields = atRiskFields,
            agentSummaries = agentSummaries,
            mostActiveAgent = mostActiveAgent,
            recentUpdates = recentUpdates
        )
    }

    @Transactional(readOnly = true)
    fun getAgentDashboard(username: String): AgentDashboardResponse {
        val agent = userRepository.findByUsername(username)
            ?: throw ResourceNotFoundException("Agent not found")

        val agentFields = fieldRepository.findByAssignedAgent(agent)

        val statusBreakdown = computeStatusBreakdown(agentFields)
        val stageBreakdown = computeStageBreakdown(agentFields)
        val atRiskFields = computeAtRiskFields(agentFields)

        val actionHints = buildActionHints(agentFields)

        val recentUpdates = fieldUpdateRepository
            .findByAgentIdOrderByCreatedAtDesc(agent.id!!)
            .take(5)
            .map { it.toResponse() }

        return AgentDashboardResponse(
            totalAssignedFields = agentFields.size,
            statusBreakdown = statusBreakdown,
            stageBreakdown = stageBreakdown,
            atRiskFields = atRiskFields,
            actionHints = actionHints,
            recentUpdates = recentUpdates
        )
    }

    private fun computeStatusBreakdown(fields: List<Field>): Map<FieldStatus, Int> {
        val counts = fields
            .groupingBy { fieldStatusService.computeFieldStatus(it) }
            .eachCount()

        return FieldStatus.entries.associateWith { counts[it] ?: 0 }
    }

    private fun computeStageBreakdown(fields: List<Field>): Map<FieldStage, Int> {
        val counts = fields.groupingBy { it.stage }.eachCount()
        return FieldStage.entries.associateWith { counts[it] ?: 0 }
    }

    private fun computeAtRiskFields(fields: List<Field>): List<AtRiskFieldSummary> {
        return fields
            .filter { fieldStatusService.computeFieldStatus(it) == FieldStatus.AT_RISK }
            .map { it.toAtRiskSummary() }
    }

    private fun Field.toAtRiskSummary(): AtRiskFieldSummary {
        val daysSincePlanting =
            LocalDate.now().toEpochDay() - plantingDate.toEpochDay()

        return AtRiskFieldSummary(
            fieldId = id!!,
            fieldName = name,
            cropType = cropType,
            stage = stage,
            daysSincePlanting = daysSincePlanting,
            assignedAgentName = assignedAgent.fullName
        )
    }

    private fun buildActionHints(fields: List<Field>): List<String> {
        val hints = mutableListOf<String>()

        val readyFields = fields.count { it.stage == FieldStage.READY }
        if (readyFields > 0) {
            hints.add("$readyFields field(s) are ready for harvesting")
        }

        val atRiskFields =
            fields.count { fieldStatusService.computeFieldStatus(it) == FieldStatus.AT_RISK }
        if (atRiskFields > 0) {
            hints.add("$atRiskFields field(s) are at risk - consider updating their stages")
        }

        val plantedCount = fields.count { it.stage == FieldStage.PLANTED }
        if (plantedCount > 0) {
            hints.add("$plantedCount field(s) are recently planted - monitor them for early growth")
        }

        if (hints.isEmpty()) {
            hints.add("All field(s) are on track")
        }

        return hints
    }
}