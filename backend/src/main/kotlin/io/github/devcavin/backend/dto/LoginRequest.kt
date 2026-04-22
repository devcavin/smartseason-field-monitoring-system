package io.github.devcavin.backend.dto

import jakarta.validation.constraints.NotNull

data class LoginRequest(
    @field:NotNull(message = "Username is required")
    var username: String,

    @field:NotNull(message = "Password is required")
    var password: String
)
