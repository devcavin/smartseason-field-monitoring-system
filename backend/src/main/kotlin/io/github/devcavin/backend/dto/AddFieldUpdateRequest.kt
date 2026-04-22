package io.github.devcavin.backend.dto

import io.github.devcavin.backend.enums.FieldStage

data class AddFieldUpdateRequest(
    val newStage: FieldStage? = null,
    val note: String? = null
)
