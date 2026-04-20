package io.github.devcavin.backend.entity

import com.fasterxml.jackson.annotation.JsonFormat
import io.github.devcavin.backend.enums.FieldStage
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.Instant
import java.time.LocalDate

@Entity
@Table(name = "fields")
class Field(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    var cropType: String,

    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    var plantingDate: LocalDate,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var stage: FieldStage,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    var assignedAgent: User
) {
    @CreationTimestamp
    @Column(updatable = false)
    lateinit var createdAt: Instant

    @UpdateTimestamp
    var updatedAt: Instant? = null

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Field) return false
        return id != null && id == other.id
    }

    override fun hashCode(): Int {
        return id?.hashCode() ?: System.identityHashCode(this)
    }

    override fun toString(): String {
        return "Field(id=$id, name=$name, cropType=$cropType, stage=$stage, plantingDate=$plantingDate, agentId=${assignedAgent.id})"
    }
}