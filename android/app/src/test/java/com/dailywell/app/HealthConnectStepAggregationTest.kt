package com.dailywell.app

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId

class HealthConnectStepAggregationTest {

    // Simple test data model mirroring Health Connect Step Record
    data class SimulatedStepRecord(
        val count: Long,
        val startTime: Instant,
        val endTime: Instant
    )

    private fun aggregateSteps(
        records: List<SimulatedStepRecord>,
        targetDate: LocalDate,
        zoneId: ZoneId
    ): Long {
        val startOfDay = targetDate.atStartOfDay(zoneId).toInstant()
        val endOfDay = targetDate.plusDays(1).atStartOfDay(zoneId).toInstant()

        return records
            .filter { it.startTime >= startOfDay && it.endTime <= endOfDay }
            .sumOf { it.count.coerceAtLeast(0) }
    }

    @Test
    fun emptyRecords_returnsZeroSteps() {
        val date = LocalDate.of(2025, 3, 15)
        val zoneId = ZoneId.of("America/New_York")
        val total = aggregateSteps(emptyList(), date, zoneId)
        assertEquals(0L, total)
    }

    @Test
    fun multipleSessionsSameDay_aggregatesCorrectly() {
        val date = LocalDate.of(2025, 3, 15)
        val zoneId = ZoneId.of("America/New_York")

        val startOfDay = date.atStartOfDay(zoneId).toInstant()
        val morningWalk = SimulatedStepRecord(
            count = 2450,
            startTime = startOfDay.plusSeconds(3600 * 8),
            endTime = startOfDay.plusSeconds(3600 * 9)
        )
        val afternoonStroll = SimulatedStepRecord(
            count = 1800,
            startTime = startOfDay.plusSeconds(3600 * 14),
            endTime = startOfDay.plusSeconds(3600 * 15)
        )

        val total = aggregateSteps(listOf(morningWalk, afternoonStroll), date, zoneId)
        assertEquals(4250L, total)
    }

    @Test
    fun recordsCrossingMidnight_excludedFromTargetDay() {
        val date = LocalDate.of(2025, 3, 15)
        val zoneId = ZoneId.of("America/New_York")

        val prevDayStart = date.minusDays(1).atStartOfDay(zoneId).toInstant()
        val yesterdayRecord = SimulatedStepRecord(
            count = 5000,
            startTime = prevDayStart.plusSeconds(3600 * 10),
            endTime = prevDayStart.plusSeconds(3600 * 11)
        )

        val nextDayStart = date.plusDays(1).atStartOfDay(zoneId).toInstant()
        val tomorrowRecord = SimulatedStepRecord(
            count = 3000,
            startTime = nextDayStart.plusSeconds(3600 * 8),
            endTime = nextDayStart.plusSeconds(3600 * 9)
        )

        val total = aggregateSteps(listOf(yesterdayRecord, tomorrowRecord), date, zoneId)
        assertEquals(0L, total)
    }

    @Test
    fun stepGoalValidation_clampsProperly() {
        fun validateStepGoal(goal: Int): Int {
            return goal.coerceIn(1000, 100000)
        }

        assertEquals(1000, validateStepGoal(500))
        assertEquals(10000, validateStepGoal(10000))
        assertEquals(100000, validateStepGoal(150000))
    }
}
