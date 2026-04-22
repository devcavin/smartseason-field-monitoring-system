package io.github.devcavin.backend.controller

import io.github.devcavin.backend.dto.AdminDashboardResponse
import io.github.devcavin.backend.dto.AgentDashboardResponse
import io.github.devcavin.backend.service.DashboardService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1")
class DashboardController(private val dashboardService: DashboardService) {
    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    fun getAdminDashboard(): ResponseEntity<AdminDashboardResponse> {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(dashboardService.getAdminDashboard())
    }

    @GetMapping("/agent/dashboard")
    @PreAuthorize("hasRole('AGENT')")
    fun getAgentDashboard(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<AgentDashboardResponse> {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(dashboardService.getAgentDashboard(userDetails.username))
    }
}