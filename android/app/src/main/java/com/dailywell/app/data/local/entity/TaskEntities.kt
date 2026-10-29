package com.dailywell.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "wellness_tasks")
data class WellnessTaskEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val name: String,
    val description: String = "",
    val category: TaskCategory,
    val scheduledTime: String? = null, // "HH:mm" in 24-hr format
    val reminderEnabled: Boolean = false,
    val recurrence: RecurrenceType = RecurrenceType.DAILY,
    val selectedDaysOfWeek: String = "1,2,3,4,5,6,7", // ISO-8601 day numbers (1=Mon ... 7=Sun)
    val goalValue: Float? = null,
    val goalUnit: String? = null,
    val isPaused: Boolean = false,
    val sortOrder: Int = 0,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(
    tableName = "task_completions",
    indices = [
        androidx.room.Index(value = ["taskId", "localDate"], unique = true)
    ]
)
data class TaskCompletionEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val taskId: Long,
    val localDate: String, // "YYYY-MM-DD"
    val isCompleted: Boolean = true,
    val isSkipped: Boolean = false,
    val completedAt: Long? = System.currentTimeMillis(),
    val notes: String? = null
)
