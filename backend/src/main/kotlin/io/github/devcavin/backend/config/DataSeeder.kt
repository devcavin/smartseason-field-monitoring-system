package io.github.devcavin.backend.config

import io.github.devcavin.backend.entity.User
import io.github.devcavin.backend.enums.UserRole
import io.github.devcavin.backend.repository.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class DataSeeder(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) : ApplicationRunner {
    private val logger = LoggerFactory.getLogger(DataSeeder::class.java)

    override fun run(args: ApplicationArguments) {
        seedUsers()
    }

    private fun seedUsers() {
        if (userRepository.count() > 0) return

        val users = listOf(
            User(
                username = "admin",
                fullName = "System Admin",
                hashedPassword = passwordEncoder.encode("admin123"),
                role = UserRole.ADMIN
            ),
            User(
                username = "agent",
                fullName = "System Agent",
                hashedPassword = passwordEncoder.encode("agent123"),
                role = UserRole.AGENT
            )
        )

        userRepository.saveAll(users)
        logger.info("Demo data seeded successfully")
    }
}