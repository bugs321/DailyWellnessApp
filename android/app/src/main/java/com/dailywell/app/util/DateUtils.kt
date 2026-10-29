package com.dailywell.app.util

import com.dailywell.app.data.local.entity.RecurrenceType
import com.dailywell.app.data.local.entity.TaskCompletionEntity
import com.dailywell.app.data.local.entity.WellnessTaskEntity
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

object DateUtils {
    private val ISO_DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE
    private val DISPLAY_DATE_FORMATTER = DateTimeFormatter.ofPattern("EEEE, MMM d", Locale.getDefault())
    private val SHORT_DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM d", Locale.getDefault())

    fun todayLocalDate(): LocalDate = LocalDate.now(ZoneId.systemDefault())

    fun todayDateString(): String = todayLocalDate().format(ISO_DATE_FORMATTER)

    fun formatDate(date: LocalDate): String = date.format(ISO_DATE_FORMATTER)

    fun parseDate(dateString: String): LocalDate = LocalDate.parse(dateString, ISO_DATE_FORMATTER)

    fun formatDisplayDate(dateString: String): String {
        return runCatching {
            val date = parseDate(dateString)
            date.format(DISPLAY_DATE_FORMATTER)
        }.getOrDefault(dateString)
    }

    fun formatShortDate(dateString: String): String {
        return runCatching {
            val date = parseDate(dateString)
            date.format(SHORT_DATE_FORMATTER)
        }.getOrDefault(dateString)
    }

    /**
     * Determines whether a given task is scheduled for a specific LocalDate.
     * Pure function suitable for unit testing.
     */
    fun isTaskScheduledForDate(task: WellnessTaskEntity, date: LocalDate): Boolean {
        if (task.isPaused) return false

        return when (task.recurrence) {
            RecurrenceType.DAILY -> true
            RecurrenceType.SPECIFIC_DAYS -> {
                val dayOfWeekNum = date.dayOfWeek.value.toString() // 1 for Mon, 7 for Sun
                val selectedDays = task.selectedDaysOfWeek.split(",").map { it.trim() }
                selectedDays.contains(dayOfWeekNum)
            }
            RecurrenceType.ONE_TIME -> {
                // One time tasks are scheduled on creation date
                val creationDate = java.time.Instant.ofEpochMilli(task.createdAt)
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate()
                creationDate == date
            }
        }
    }

    /**
     * Calculate honest current streak of consecutive days with at least one completed task.
     * Does not corrupt historical data.
     */
    fun calculateStreak(
        completions: List<TaskCompletionEntity>,
        referenceDate: LocalDate = todayLocalDate()
    ): Int {
        if (completions.isEmpty()) return 0

        val completedDates = completions
            .filter { it.isCompleted }
            .map { runCatching { parseDate(it.localDate) }.getOrNull() }
            .filterNotNull()
            .toSet()

        if (completedDates.isEmpty()) return 0

        var streak = 0
        var checkDate = referenceDate

        // If today has no completion yet, allow yesterday as the starting point so current streak isn't lost before bedtime
        if (!completedDates.contains(checkDate)) {
            checkDate = checkDate.minusDays(1)
            if (!completedDates.contains(checkDate)) {
                return 0
            }
        }

        while (completedDates.contains(checkDate)) {
            streak++
            checkDate = checkDate.minusDays(1)
        }

        return streak
    }

    /**
     * Calculates completion percentage for a given date
     */
    fun calculateCompletionPercentage(completedCount: Int, totalCount: Int): Int {
        if (totalCount <= 0) return 0
        return ((completedCount.toDouble() / totalCount.toDouble()) * 100).toInt().coerceIn(0, 100)
    }
}
