package com.dailywell.app.util

import com.dailywell.app.data.local.entity.*

object CsvExporter {

    fun generateFullCsvExport(
        tasks: List<WellnessTaskEntity>,
        completions: List<TaskCompletionEntity>,
        waterLogs: List<WaterLogEntity>,
        exercises: List<ExerciseSessionEntity>,
        meditations: List<MeditationSessionEntity>,
        meals: List<MealEntity>
    ): String {
        val sb = StringBuilder()

        sb.appendLine("=== DAILYWELL HEALTH & WELLNESS EXPORT ===")
        sb.appendLine("Exported At,${java.time.Instant.now()}")
        sb.appendLine()

        // Water Logs
        sb.appendLine("--- WATER INTAKE LOGS ---")
        sb.appendLine("Date,Amount(ml),Timestamp")
        for (log in waterLogs) {
            sb.appendLine("${log.localDate},${log.amountMl},${log.timestamp}")
        }
        sb.appendLine()

        // Exercise Sessions
        sb.appendLine("--- EXERCISE SESSIONS ---")
        sb.appendLine("Date,WorkoutType,Duration(min),Distance(km),Reps,Notes")
        for (e in exercises) {
            sb.appendLine("${e.localDate},\"${escape(e.workoutType)}\",${e.durationMinutes},${e.distanceKm ?: ""},${e.repetitions ?: ""},\"${escape(e.notes ?: "")}\"")
        }
        sb.appendLine()

        // Meditation Sessions
        sb.appendLine("--- MEDITATION & BREATHING ---")
        sb.appendLine("Date,Duration(min),Technique,Notes")
        for (m in meditations) {
            sb.appendLine("${m.localDate},${m.durationMinutes},\"${escape(m.technique)}\",\"${escape(m.notes ?: "")}\"")
        }
        sb.appendLine()

        // Food Journal
        sb.appendLine("--- FOOD JOURNAL ---")
        sb.appendLine("Date,MealType,Description,Serving,Notes")
        for (meal in meals) {
            sb.appendLine("${meal.localDate},${meal.mealType.name},\"${escape(meal.foodDescription)}\",\"${escape(meal.servingSize ?: "")}\",\"${escape(meal.notes ?: "")}\"")
        }
        sb.appendLine()

        // Tasks & Completions
        sb.appendLine("--- WELLNESS ROUTINES & COMPLETIONS ---")
        val taskMap = tasks.associateBy { it.id }
        sb.appendLine("Date,TaskName,Category,Status,CompletedAt")
        for (c in completions) {
            val task = taskMap[c.taskId]
            val taskName = task?.name ?: "Task #${c.taskId}"
            val category = task?.category?.displayName ?: "Custom"
            sb.appendLine("${c.localDate},\"${escape(taskName)}\",\"${category}\",${if (c.isCompleted) "Completed" else "Incomplete"},${c.completedAt ?: ""}")
        }

        return sb.toString()
    }

    private fun escape(text: String): String {
        return text.replace("\"", "\"\"")
    }
}
