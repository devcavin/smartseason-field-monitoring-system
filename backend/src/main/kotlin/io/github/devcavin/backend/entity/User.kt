package io.github.devcavin.backend.entity

import com.fasterxml.jackson.annotation.JsonIgnore
import io.github.devcavin.backend.enums.UserRole
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.Instant

@Entity
@Table(name = "users")
class User(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false, unique = true)
    var username: String,

    @Column(nullable = false)
    var fullName: String,

    @JsonIgnore
    @Column(nullable = false)
    var hashedPassword: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var role: UserRole

) {

    @CreationTimestamp
    @Column(updatable = false)
    var createdAt: Instant? = null

    @UpdateTimestamp
    var updatedAt: Instant? = null

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is User) return false
        return id != null && id == other.id
    }

    override fun hashCode(): Int {
        return id?.hashCode() ?: System.identityHashCode(this)
    }

    override fun toString(): String {
        return "User(id=$id, username=$username, fullName=$fullName, role=$role)"
    }
}