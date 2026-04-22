package io.github.devcavin.backend.controller

import io.github.devcavin.backend.dto.AddFieldUpdateRequest
import io.github.devcavin.backend.dto.CreateFieldRequest
import io.github.devcavin.backend.dto.FieldResponse
import io.github.devcavin.backend.dto.FieldUpdateResponse
import io.github.devcavin.backend.service.FieldService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1")
class FieldController(private val fieldService: FieldService) {
    // Admin endpoints
    @PostMapping("/admin/fields")
    @PreAuthorize("hasRole('ADMIN')")
    fun createField(@Valid @RequestBody request: CreateFieldRequest): ResponseEntity<FieldResponse> {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(fieldService.createField(request))
    }

    @GetMapping("/admin/fields")
    @PreAuthorize("hasRole('ADMIN')")
    fun getAllFields(): ResponseEntity<List<FieldResponse>> {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(fieldService.getAllFields())
    }

    @GetMapping("/admin/fields/{fieldId}")
    @PreAuthorize("hasRole('ADMIN')")
    fun getFieldById(@Valid @PathVariable fieldId: Long): ResponseEntity<FieldResponse> {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(fieldService.getFieldById(fieldId))
    }

    @PatchMapping("/admin/fields/{fieldId}/reassign")
    @PreAuthorize("hasRole('ADMIN')")
    fun reAssignField(@Valid @PathVariable fieldId: Long, @RequestParam agentId: Long): ResponseEntity<FieldResponse> {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(fieldService.reAssignField(fieldId, agentId))
    }

    @DeleteMapping("/admin/fields/{fieldId}")
    @PreAuthorize("hasRole('ADMIN')")
    fun deleteField(@PathVariable fieldId: Long): ResponseEntity<Void> {
        fieldService.deleteField(fieldId)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/admin/fields/{fieldId}/updates")
    @PreAuthorize("hasRole('ADMIN')")
    fun getFieldUpdates(@PathVariable fieldId: Long): ResponseEntity<List<FieldUpdateResponse>> {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(fieldService.getFieldUpdates(fieldId))
    }

    // Agent endpoints
    @GetMapping("/agent/fields")
    @PreAuthorize("hasRole('AGENT')")
    fun getMyFields(
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<List<FieldResponse>> {
        return ResponseEntity.ok(fieldService.getAgentFields(userDetails.username))
    }

    @GetMapping("/agent/fields/{fieldId}")
    @PreAuthorize("hasRole('AGENT')")
    fun getMyField(
        @PathVariable fieldId: Long,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<FieldResponse> {
        return ResponseEntity.ok(fieldService.getAgentField(fieldId, userDetails.username))
    }

    @PostMapping("/agent/fields/{fieldId}/updates")
    @PreAuthorize("hasRole('AGENT')")
    fun addFieldUpdate(
        @PathVariable fieldId: Long,
        @Valid @RequestBody request: AddFieldUpdateRequest,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<FieldUpdateResponse> {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(fieldService.addFieldUpdate(fieldId, userDetails.username, request))
    }

    @GetMapping("/agent/fields/{fieldId}/updates")
    @PreAuthorize("hasRole('AGENT')")
    fun getMyFieldUpdates(
        @PathVariable fieldId: Long,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<List<FieldUpdateResponse>> {
        return ResponseEntity.ok(fieldService.getAgentFieldUpdates(fieldId, userDetails.username))
    }
}