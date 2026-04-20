package io.github.devcavin.backend.service

import io.github.devcavin.backend.dto.AuthResponse
import io.github.devcavin.backend.dto.LoginRequest
import io.github.devcavin.backend.dto.RegisterRequest
import io.github.devcavin.backend.dto.toEntity
import io.github.devcavin.backend.repository.UserRepository
import io.github.devcavin.backend.security.JwtUtil
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtUtil: JwtUtil,
    private val authenticationManager: AuthenticationManager
) {
    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByUsername(request.username)) throw IllegalArgumentException("User already exists")

        val user = userRepository.save(request.toEntity(passwordEncoder))
        val token = jwtUtil.generateToken(user.username, user.role.name)

        return AuthResponse(
            token = token,
            username = user.username,
            fullName = user.fullName,
            role = user.role
        )
    }

    fun login(request: LoginRequest): AuthResponse {
        authenticationManager.authenticate(UsernamePasswordAuthenticationToken(
            request.username,
            request.password
        ))

        val user = userRepository.findByUsername(request.username) ?: throw IllegalArgumentException("User not found")

        val token = jwtUtil.generateToken(user.username, user.role.name)

        return AuthResponse(
            token = token,
            username = user.username,
            fullName = user.fullName,
            role = user.role
        )
    }
}