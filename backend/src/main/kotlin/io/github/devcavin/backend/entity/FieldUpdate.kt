package io.github.devcavin.backend.entity

import io.github.devcavin.backend.enums.FieldStage
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
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
    lateinit var createdAt: Instant

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is FieldUpdate) return false
        return id != null && id == other.id
    }

    override fun hashCode(): Int {
        return id?.hashCode() ?: System.identityHashCode(this)
    }

    override fun toString(): String {
        return "FieldUpdate(id=$id, fieldId=${field.id}, agentId=${agent.id}, newStage=$newStage)"
    }
}