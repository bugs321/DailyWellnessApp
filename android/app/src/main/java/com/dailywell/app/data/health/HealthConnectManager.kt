package com.dailywell.app.data.health

import android.content.Context
import android.content.Intent
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.request.AggregateGroupByPeriodRequest
import androidx.health.connect.client.request.AggregateRequest
import androidx.health.connect.client.time.TimeRangeFilter
import java.time.LocalDate
import java.time.Period
import java.time.ZoneId

sealed interface HealthConnectAvailability {
    object Available : HealthConnectAvailability
    object NotInstalled : HealthConnectAvailability
    object NotSupported : HealthConnectAvailability
}

sealed interface StepQueryResult {
    data class Success(val steps: Long, val hasRecords: Boolean) : StepQueryResult
    object PermissionDenied : StepQueryResult
    data class Unavailable(val availability: HealthConnectAvailability) : StepQueryResult
    data class Error(val exception: Throwable) : StepQueryResult
}

class HealthConnectManager(private val context: Context) {

    val healthConnectClient: HealthConnectClient? by lazy {
        if (isHealthConnectAvailable() is HealthConnectAvailability.Available) {
            HealthConnectClient.getOrCreate(context)
        } else {
            null
        }
    }

    val permissions = setOf(
        HealthPermission.getReadPermission(StepsRecord::class)
    )

    fun isHealthConnectAvailable(): HealthConnectAvailability {
        val status = HealthConnectClient.getSdkStatus(context)
        return when (status) {
            HealthConnectClient.SDK_AVAILABLE -> HealthConnectAvailability.Available
            HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED -> HealthConnectAvailability.NotInstalled
            else -> HealthConnectAvailability.NotSupported
        }
    }

    suspend fun hasPermissions(): Boolean {
        val client = healthConnectClient ?: return false
        return try {
            val granted = client.permissionController.getGrantedPermissions()
            granted.containsAll(permissions)
        } catch (e: Exception) {
            false
        }
    }

    /**
     * Query today's aggregated step count using local-day time boundaries.
     * Accurately distinguishes between 0 recorded steps, permission denied, and unsupported states.
     * Never fabricates step data.
     */
    suspend fun queryTodaySteps(): StepQueryResult {
        val availability = isHealthConnectAvailable()
        if (availability !is HealthConnectAvailability.Available) {
            return StepQueryResult.Unavailable(availability)
        }

        val client = healthConnectClient ?: return StepQueryResult.Unavailable(HealthConnectAvailability.NotSupported)

        if (!hasPermissions()) {
            return StepQueryResult.PermissionDenied
        }

        val zoneId = ZoneId.systemDefault()
        val today = LocalDate.now(zoneId)
        val startOfDay = today.atStartOfDay(zoneId).toInstant()
        val endOfDay = today.plusDays(1).atStartOfDay(zoneId).toInstant()

        return try {
            val response = client.aggregate(
                AggregateRequest(
                    metrics = setOf(StepsRecord.COUNT_TOTAL),
                    timeRangeFilter = TimeRangeFilter.between(startOfDay, endOfDay)
                )
            )
            val stepCount = response[StepsRecord.COUNT_TOTAL]
            if (stepCount != null && stepCount > 0) {
                StepQueryResult.Success(steps = stepCount, hasRecords = true)
            } else {
                // Device has 0 steps or no step records created yet today
                StepQueryResult.Success(steps = 0L, hasRecords = false)
            }
        } catch (e: Exception) {
            StepQueryResult.Error(e)
        }
    }

    /**
     * Query daily step counts for the past 7 days grouped by 1-day period.
     * Only returns dates with actual persisted records. Never fabricates entries.
     */
    suspend fun queryPastWeekSteps(): Map<LocalDate, Long> {
        val client = healthConnectClient ?: return emptyMap()
        if (!hasPermissions()) return emptyMap()

        val zoneId = ZoneId.systemDefault()
        val today = LocalDate.now(zoneId)
        val startDate = today.minusDays(6)
        val startInstant = startDate.atStartOfDay(zoneId).toInstant()
        val endInstant = today.plusDays(1).atStartOfDay(zoneId).toInstant()

        return try {
            val response = client.aggregateGroupByPeriod(
                AggregateGroupByPeriodRequest(
                    metrics = setOf(StepsRecord.COUNT_TOTAL),
                    timeRangeFilter = TimeRangeFilter.between(startInstant, endInstant),
                    timeRangeSlicer = Period.ofDays(1)
                )
            )
            val resultMap = mutableMapOf<LocalDate, Long>()
            for (bucket in response) {
                val bucketDate = bucket.startTime.atZone(zoneId).toLocalDate()
                val steps = bucket.result[StepsRecord.COUNT_TOTAL]
                if (steps != null && steps > 0) {
                    resultMap[bucketDate] = steps
                }
            }
            resultMap
        } catch (e: Exception) {
            emptyMap()
        }
    }

    fun createSettingsIntent(): Intent {
        return Intent(HealthConnectClient.ACTION_HEALTH_CONNECT_SETTINGS)
    }
}
