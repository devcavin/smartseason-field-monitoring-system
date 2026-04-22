package io.github.devcavin.backend.dto

data class AgentFieldSummary(
    val agentId: Long,
    val agentName: String,
    val totalFields: Int,
    val updateCount: Int
)
