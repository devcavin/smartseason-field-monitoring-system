package io.github.devcavin.backend.service

import io.github.devcavin.backend.dto.*
import io.github.devcavin.backend.entity.Field
import io.github.devcavin.backend.entity.FieldUpdate
import io.github.devcavin.backend.entity.User
import io.github.devcavin.backend.enums.FieldStage
import io.github.devcavin.backend.exception.DuplicateFieldException
import io.github.devcavin.backend.exception.ResourceNotFoundException
import io.github.devcavin.backend.repository.FieldRepository
import io.github.devcavin.backend.repository.FieldUpdateRepository
import io.github.devcavin.backend.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class FieldService(
    private val fieldRepository: FieldRepository,
    private val fieldUpdateRepository: FieldUpdateRepository,
    private val userRepository: UserRepository,
    private val fieldStatusService: FieldStatusService
) {
    // Admin operations
    @Transactional
    fun createField(request: CreateFieldRequest): FieldResponse {
        val agent = userRepository.findById(request.agentId)
            .orElseThrow { ResourceNotFoundException("Agent not found") }

        if (fieldRepository.existsByNameAndAssignedAgent(request.name, agent)) {
            throw DuplicateFieldException("Agent already assigned to another field")
        }

        val field = Field(
            name = request.name,
            assignedAgent = agent,
            cropType = request.cropType,
            plantingDate = request.plantingDate,
            stage = request.fieldStage ?: FieldStage.PLANTED
        )

        return fieldRepository.save(field).toResponse(fieldStatusService.computeFieldStatus(field))
    }

    @Transactional(readOnly = true)
    fun getAllFields(): List<FieldResponse> {
        return fieldRepository.findAll().map { it.toResponse(fieldStatusService.computeFieldStatus(it)) }
    }

    @Transactional(readOnly = true)
    fun getFieldById(fieldId: Long): FieldResponse {
        val field = findFieldOrThrow(fieldId)
        return field.toResponse(fieldStatusService.computeFieldStatus(field))
    }

    @Transactional
    fun reAssignField(fieldId: Long, agentId: Long): FieldResponse {
        val field = findFieldOrThrow(fieldId)
        val agent = userRepository.findById(agentId).orElseThrow { ResourceNotFoundException("Agent not found") }

        field.assignedAgent = agent
        return fieldRepository.save(field).toResponse(fieldStatusService.computeFieldStatus(field))
    }

    @Transactional
    fun deleteField(fieldId: Long) {
        if (!fieldRepository.existsById(fieldId)) throw ResourceNotFoundException("Field not found")

        return fieldRepository.deleteById(fieldId)
    }

    @Transactional(readOnly = true)
    fun getAgentField(fieldId: Long, agentUsername: String): FieldResponse {
        val field = findFieldOrThrow(fieldId)
        val agent = findAgentOrThrow(agentUsername)

        if (field.assignedAgent.id != agent.id) throw ResourceNotFoundException("Field not assigned to the agent")

        return field.toResponse(fieldStatusService.computeFieldStatus(field))
    }

    @Transactional(readOnly = true)
    fun getAgentFieldUpdates(fieldId: Long, agentUsername: String): List<FieldUpdateResponse> {
        val field = findFieldOrThrow(fieldId)
        val agent = findAgentOrThrow(agentUsername)

        if (field.assignedAgent.id != agent.id) throw ResourceNotFoundException("Field not assigned to the agent")

        return fieldUpdateRepository.findByFieldOrderByCreatedAtDesc(field).map { it.toResponse() }
    }

    // Agent operations
    @Transactional(readOnly = true)
    fun getAgentFields(username: String): List<FieldResponse> {
        val agent = findAgentOrThrow(username)

        return fieldRepository.findByAssignedAgent(agent)
            .map { it.toResponse(fieldStatusService.computeFieldStatus(it)) }
    }

    @Transactional
    fun addFieldUpdate(fieldId: Long, username: String, request: AddFieldUpdateRequest): FieldUpdateResponse {
        val field = findFieldOrThrow(fieldId)
        val agent = findAgentOrThrow(username)

        if (field.assignedAgent.id != agent.id) {
            throw ResourceNotFoundException("Field with id $fieldId not found")
        }

        // Validate stage transition if a new stage is requested
        request.newStage?.let { newStage ->
            if (!fieldStatusService.isValidTransition(field.stage, newStage)) {
                throw IllegalArgumentException(
                    "Invalid stage transition: cannot move from ${field.stage} to $newStage. " +
                            "Expected next stage is ${fieldStatusService.nextStage(field.stage) ?: "none — field is already harvested"}"
                )
            }
            field.stage = newStage
        }

        fieldRepository.save(field)

        val update = FieldUpdate(
            field = field,
            agent = agent,
            newStage = request.newStage,
            note = request.note
        )

        return fieldUpdateRepository.save(update).toResponse()
    }

    @Transactional(readOnly = true)
    fun getFieldUpdates(fieldId: Long): List<FieldUpdateResponse> {
        val field = findFieldOrThrow(fieldId)

        return fieldUpdateRepository.findByFieldOrderByCreatedAtDesc(field).map { it.toResponse() }
    }

    // Helpers

    private fun findFieldOrThrow(fieldId: Long): Field {
        return fieldRepository.findById(fieldId).orElseThrow { ResourceNotFoundException("Field not found") }
    }

    private fun findAgentOrThrow(username: String): User {
        return userRepository.findByUsername(username) ?: throw ResourceNotFoundException("Agent not found")
    }
}