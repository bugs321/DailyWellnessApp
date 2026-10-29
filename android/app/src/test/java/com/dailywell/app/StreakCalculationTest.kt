package com.dailywell.app

import com.dailywell.app.data.local.entity.TaskCompletionEntity
import com.dailywell.app.util.DateUtils
import org.junit.Assert.assertEquals
import org.junit.Test
import java.time.LocalDate

class StreakCalculationTest {

    @Test
    fun emptyCompletions_returnsZeroStreak() {
        val streak = DateUtils.calculateStreak(emptyList(), LocalDate.of(2026, 10, 29))
        assertEquals(0, streak)
    }

    @Test
    fun consecutiveThreeDaysEndingToday_returnsThree() {
        val today = LocalDate.of(2026, 10, 29)
        val completions = listOf(
            TaskCompletionEntity(id = 1, taskId = 10, localDate = "2026-10-27", isCompleted = true),
            TaskCompletionEntity(id = 2, taskId = 10, localDate = "2026-10-28", isCompleted = true),
            TaskCompletionEntity(id = 3, taskId = 10, localDate = "2026-10-29", isCompleted = true)
        )

        val streak = DateUtils.calculateStreak(completions, today)
        assertEquals(3, streak)
    }

    @Test
    fun noCompletionsYetToday_preservesYesterdayStreak() {
        val today = LocalDate.of(2026, 10, 29)
        val completions = listOf(
            TaskCompletionEntity(id = 1, taskId = 10, localDate = "2026-10-27", isCompleted = true),
            TaskCompletionEntity(id = 2, taskId = 10, localDate = "2026-10-28", isCompleted = true)
        )

        // Today is not finished yet, user hasn't logged anything today, so yesterday's streak of 2 is preserved
        val streak = DateUtils.calculateStreak(completions, today)
        assertEquals(2, streak)
    }

    @Test
    fun gapInDays_breaksStreakHonourablyWithoutDataCorruption() {
        val today = LocalDate.of(2026, 10, 29)
        val completions = listOf(
            TaskCompletionEntity(id = 1, taskId = 10, localDate = "2026-10-20", isCompleted = true),
            TaskCompletionEntity(id = 2, taskId = 10, localDate = "2026-10-21", isCompleted = true),
            // Missed days: 22, 23, 24, 25, 26, 27
            TaskCompletionEntity(id = 3, taskId = 10, localDate = "2026-10-28", isCompleted = true),
            TaskCompletionEntity(id = 4, taskId = 10, localDate = "2026-10-29", isCompleted = true)
        )

        val streak = DateUtils.calculateStreak(completions, today)
        assertEquals(2, streak)
    }
}
