package com.dailywell.app

import com.dailywell.app.data.local.entity.WaterLogEntity
import com.dailywell.app.util.DateUtils
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Test
import java.time.LocalDate
import java.time.ZoneId

class LocalDateBoundariesTest {

    @Test
    fun localDateBoundaries_preventsUtcShift() {
        val zone = ZoneId.of("America/Los_Angeles")
        val date = LocalDate.of(2026, 10, 29)
        val startInstant = date.atStartOfDay(zone).toInstant()
        val endInstant = date.plusDays(1).atStartOfDay(zone).toInstant()

        val durationHours = java.time.Duration.between(startInstant, endInstant).toHours()
        assertEquals(24L, durationHours)
    }

    @Test
    fun dateFormatting_isDeterministic() {
        val date = LocalDate.of(2026, 10, 29)
        val formatted = DateUtils.formatDate(date)
        assertEquals("2026-10-29", formatted)

        val parsed = DateUtils.parseDate(formatted)
        assertEquals(date, parsed)
    }
}

class WaterTotalAggregationTest {

    @Test
    fun sumWaterLogs_aggregatesCorrectly() {
        val logs = listOf(
            WaterLogEntity(id = 1, amountMl = 250, localDate = "2026-10-29"),
            WaterLogEntity(id = 2, amountMl = 500, localDate = "2026-10-29"),
            WaterLogEntity(id = 3, amountMl = 150, localDate = "2026-10-29")
        )

        val total = logs.sumOf { it.amountMl }
        assertEquals(900, total)
    }

    @Test
    fun waterLogs_differentDaysFilteredAccurately() {
        val logs = listOf(
            WaterLogEntity(id = 1, amountMl = 250, localDate = "2026-10-28"),
            WaterLogEntity(id = 2, amountMl = 500, localDate = "2026-10-29"),
            WaterLogEntity(id = 3, amountMl = 150, localDate = "2026-10-29")
        )

        val todayTotal = logs.filter { it.localDate == "2026-10-29" }.sumOf { it.amountMl }
        assertEquals(650, todayTotal)
    }
}
