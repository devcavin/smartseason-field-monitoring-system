package io.github.devcavin.backend.repository

import io.github.devcavin.backend.entity.Field
import io.github.devcavin.backend.entity.FieldUpdate
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface FieldUpdateRepository : JpaRepository<FieldUpdate, Long> {
    fun findByFieldOrderByCreatedAtDesc(field: Field): List<FieldUpdate>
    fun findByAgentIdOrderByCreatedAtDesc(agentId: Long): List<FieldUpdate>
}