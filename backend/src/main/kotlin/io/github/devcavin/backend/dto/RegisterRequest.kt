package io.github.devcavin.backend.dto

import io.github.devcavin.backend.entity.User
import io.github.devcavin.backend.enums.UserRole
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import org.springframework.security.crypto.password.PasswordEncoder

data class RegisterRequest(
    @field:NotNull(message = "Username is required")
    var username: String,

    @field:NotNull(message = "Agent name is required")
    var fullName: String,

    @field:NotNull(message = "Password is required")
    @Size(min = 6, max = 15, message = "Password must be between 6 and 15")
    var password: String,

    @field:NotNull(message = "Agent role is required")
    var role: UserRole
)

fun RegisterRequest.toEntity(passwordEncoder: PasswordEncoder): User {
    return User(
        username = this.username,
        fullName = this.fullName,
        hashedPassword = passwordEncoder.encode(this.password),
        role = this.role
    )
}
