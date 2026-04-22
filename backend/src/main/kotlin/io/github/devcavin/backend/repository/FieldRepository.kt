package io.github.devcavin.backend.repository

import io.github.devcavin.backend.entity.Field
import io.github.devcavin.backend.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface FieldRepository : JpaRepository<Field, Long> {
    fun findByAssignedAgent(agent: User): List<Field>
    fun existsByNameAndAssignedAgent(name: String, agent: User): Boolean
}