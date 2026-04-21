package io.github.devcavin.backend.entity

import com.fasterxml.jackson.annotation.JsonFormat
import io.github.devcavin.backend.enums.FieldStage
import jakarta.persistence.*
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
    @field:JsonFormat(pattern = "yyyy-MM-dd")
    var plantingDate: LocalDate,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var stage: FieldStage,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    var assignedAgent: User
) {
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