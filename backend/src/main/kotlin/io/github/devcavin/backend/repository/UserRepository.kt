package io.github.devcavin.backend.repository

import io.github.devcavin.backend.entity.User
import io.github.devcavin.backend.enums.UserRole
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository: JpaRepository<User, Long> {
    fun findByUsername(username: String): User?
    fun existsByUsername(username: String): Boolean
    fun findByRole(role: UserRole): List<User>
}