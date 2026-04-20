package io.github.devcavin.backend.entity

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

@Entity
@Table(name = "field_updates")
class FieldUpdate(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id", nullable = false)
    var field: Field,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    var agent: User,

    @Column(length = 1000)
    var note: String? = null,

    @Enumerated(EnumType.STRING)
    var newStage: FieldStage? = null,
) {
    @CreationTimestamp
    @Column(updatable = false)
    var createdAt: Instant? = null

    @UpdateTimestamp
    var updatedAt: Instant? = null

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is FieldUpdate) return false
        return id != null && id == other.id
    }

    override fun hashCode(): Int {
        return id?.hashCode() ?: System.identityHashCode(this)
    }

    override fun toString(): String {
        return "FieldUpdate(id=$id, fieldId=${field.id}, agentId=${agent.id}, newStage=$newStage, createdAt=$createdAt)"
    }
}
