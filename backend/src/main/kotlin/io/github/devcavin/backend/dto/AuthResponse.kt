package io.github.devcavin.backend.dto

import io.github.devcavin.backend.enums.UserRole

data class AuthResponse(
    val token: String,
    val username: String,
    val fullName: String,
    val role: UserRole
)
