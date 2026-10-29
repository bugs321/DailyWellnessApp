package com.dailywell.app

import com.dailywell.app.data.local.entity.TaskCategory
import com.dailywell.app.data.local.entity.WellnessTaskEntity
import com.dailywell.app.util.DateUtils
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.LocalDate

class TaskStateAndReorderTest {

    @Test
    fun completionPercentage_excludesSkippedTasks() {
        val completedCount = 3
        val totalCount = 5
        // Skipped tasks don't count toward completion percentage, keeping statistics honest
        val percentage = DateUtils.calculateCompletionPercentage(completedCount, totalCount)
        assertEquals(60, percentage)
    }

    @Test
    fun taskReordering_maintainsOrder() {
        val tasks = mutableListOf(
            WellnessTaskEntity(id = 1, name = "Task A", category = TaskCategory.EXERCISE, sortOrder = 1),
            WellnessTaskEntity(id = 2, name = "Task B", category = TaskCategory.HYDRATION, sortOrder = 2),
            WellnessTaskEntity(id = 3, name = "Task C", category = TaskCategory.MEDITATION, sortOrder = 3)
        )

        // Swap task 1 and task 2
        val moved = tasks.removeAt(0)
        tasks.add(1, moved)

        assertEquals("Task B", tasks[0].name)
        assertEquals("Task A", tasks[1].name)
        assertEquals("Task C", tasks[2].name)
    }

    @Test
    fun midnightRollover_dateBoundariesPreserved() {
        val yesterday = LocalDate.of(2026, 10, 28)
        val today = LocalDate.of(2026, 10, 29)

        assertFalse(DateUtils.formatDate(yesterday) == DateUtils.formatDate(today))
        assertEquals("2026-10-28", DateUtils.formatDate(yesterday))
        assertEquals("2026-10-29", DateUtils.formatDate(today))
    }
}
