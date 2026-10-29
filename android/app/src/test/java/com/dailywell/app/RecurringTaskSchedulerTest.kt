package com.dailywell.app

import com.dailywell.app.data.local.entity.RecurrenceType
import com.dailywell.app.data.local.entity.TaskCategory
import com.dailywell.app.data.local.entity.WellnessTaskEntity
import com.dailywell.app.util.DateUtils
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.LocalDate

class RecurringTaskSchedulerTest {

    @Test
    fun dailyTask_isScheduledOnAnyDay() {
        val task = WellnessTaskEntity(
            id = 1,
            name = "Drink Water",
            category = TaskCategory.HYDRATION,
            recurrence = RecurrenceType.DAILY
        )

        val monday = LocalDate.of(2026, 10, 26) // Monday
        val sunday = LocalDate.of(2026, 11, 1)  // Sunday

        assertTrue(DateUtils.isTaskScheduledForDate(task, monday))
        assertTrue(DateUtils.isTaskScheduledForDate(task, sunday))
    }

    @Test
    fun weekdayTask_onlyScheduledOnSelectedDays() {
        // Monday through Friday = 1,2,3,4,5
        val task = WellnessTaskEntity(
            id = 2,
            name = "Screen Break",
            category = TaskCategory.MOVEMENT_BREAK,
            recurrence = RecurrenceType.SPECIFIC_DAYS,
            selectedDaysOfWeek = "1,2,3,4,5"
        )

        val wednesday = LocalDate.of(2026, 10, 28) // Wednesday (Day 3)
        val saturday = LocalDate.of(2026, 10, 31)  // Saturday (Day 6)

        assertTrue(DateUtils.isTaskScheduledForDate(task, wednesday))
        assertFalse(DateUtils.isTaskScheduledForDate(task, saturday))
    }

    @Test
    fun pausedTask_isNeverScheduled() {
        val task = WellnessTaskEntity(
            id = 3,
            name = "Morning Run",
            category = TaskCategory.EXERCISE,
            recurrence = RecurrenceType.DAILY,
            isPaused = true
        )

        val today = LocalDate.now()
        assertFalse(DateUtils.isTaskScheduledForDate(task, today))
    }
}
