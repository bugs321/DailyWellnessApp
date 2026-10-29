package com.dailywell.app.data.repository

import com.dailywell.app.data.health.HealthConnectManager
import com.dailywell.app.data.local.dao.*
import com.dailywell.app.data.local.entity.*
import com.dailywell.app.data.preferences.UserPreferences
import com.dailywell.app.data.preferences.UserPreferencesRepository
import com.dailywell.app.util.DateUtils
import kotlinx.coroutines.flow.*
import java.time.LocalDate

data class DailyTaskItem(
    val task: WellnessTaskEntity,
    val isCompleted: Boolean,
    val isSkipped: Boolean = false,
    val completedAt: Long?,
    val isOverdue: Boolean
)

class WellnessRepository(
    private val taskDao: TaskDao,
    private val waterDao: WaterDao,
    private val exerciseDao: ExerciseDao,
    private val meditationDao: MeditationDao,
    private val mealDao: MealDao,
    private val preferencesRepository: UserPreferencesRepository,
    val healthConnectManager: HealthConnectManager
) {
    val userPreferences: Flow<UserPreferences> = preferencesRepository.userPreferencesFlow
    val allTasks: Flow<List<WellnessTaskEntity>> = taskDao.getAllTasks()

    fun getDailyTasks(date: LocalDate = DateUtils.todayLocalDate()): Flow<List<DailyTaskItem>> {
        val dateString = DateUtils.formatDate(date)
        return combine(
            taskDao.getAllTasks(),
            taskDao.getCompletionsForDate(dateString)
        ) { tasks, completions ->
            val completionMap = completions.associateBy { it.taskId }
            val nowTime = java.time.LocalTime.now()

            tasks
                .filter { task -> DateUtils.isTaskScheduledForDate(task, date) }
                .map { task ->
                    val completion = completionMap[task.id]
                    val isDone = completion?.isCompleted == true
                    val isSkipped = completion?.isSkipped == true

                    val isOverdue = !isDone && !isSkipped && date == DateUtils.todayLocalDate() && task.scheduledTime?.let {
                        runCatching {
                            val parts = it.split(":")
                            val taskTime = java.time.LocalTime.of(parts[0].toInt(), parts[1].toInt())
                            nowTime.isAfter(taskTime.plusMinutes(30))
                        }.getOrDefault(false)
                    } ?: false

                    DailyTaskItem(
                        task = task,
                        isCompleted = isDone,
                        isSkipped = isSkipped,
                        completedAt = completion?.completedAt,
                        isOverdue = isOverdue
                    )
                }
        }
    }

    suspend fun toggleTaskCompletion(taskId: Long, dateString: String = DateUtils.todayDateString()) {
        val existing = taskDao.getCompletion(taskId, dateString)
        if (existing != null && existing.isCompleted) {
            taskDao.deleteCompletion(taskId, dateString)
        } else {
            taskDao.insertCompletion(
                TaskCompletionEntity(
                    taskId = taskId,
                    localDate = dateString,
                    isCompleted = true,
                    isSkipped = false,
                    completedAt = System.currentTimeMillis()
                )
            )
        }
    }

    suspend fun toggleTaskSkip(taskId: Long, dateString: String = DateUtils.todayDateString()) {
        val existing = taskDao.getCompletion(taskId, dateString)
        if (existing != null && existing.isSkipped) {
            taskDao.deleteCompletion(taskId, dateString)
        } else {
            taskDao.insertCompletion(
                TaskCompletionEntity(
                    taskId = taskId,
                    localDate = dateString,
                    isCompleted = false,
                    isSkipped = true,
                    completedAt = null
                )
            )
        }
    }

    suspend fun addTask(task: WellnessTaskEntity): Long = taskDao.insertTask(task)
    suspend fun updateTask(task: WellnessTaskEntity) = taskDao.updateTask(task)
    suspend fun deleteTask(task: WellnessTaskEntity) = taskDao.deleteTask(task)

    // Water
    fun getWaterLogs(dateString: String = DateUtils.todayDateString()) = waterDao.getLogsForDate(dateString)
    fun getTodayWaterTotal(dateString: String = DateUtils.todayDateString()) = waterDao.getTotalMlForDate(dateString)
    suspend fun addWater(amountMl: Int, dateString: String = DateUtils.todayDateString()): Long {
        return waterDao.insertLog(WaterLogEntity(amountMl = amountMl, localDate = dateString))
    }
    suspend fun deleteWaterLog(id: Long) = waterDao.deleteLogById(id)

    // Exercise
    fun getExerciseSessions(dateString: String = DateUtils.todayDateString()) = exerciseDao.getSessionsForDate(dateString)
    fun getExerciseMinutes(dateString: String = DateUtils.todayDateString()) = exerciseDao.getTotalMinutesForDate(dateString)
    suspend fun addExercise(session: ExerciseSessionEntity) = exerciseDao.insertSession(session)
    suspend fun deleteExercise(id: Long) = exerciseDao.deleteSessionById(id)

    // Meditation
    fun getMeditationSessions(dateString: String = DateUtils.todayDateString()) = meditationDao.getSessionsForDate(dateString)
    fun getMeditationMinutes(dateString: String = DateUtils.todayDateString()) = meditationDao.getTotalMinutesForDate(dateString)
    suspend fun addMeditation(session: MeditationSessionEntity) = meditationDao.insertSession(session)
    suspend fun deleteMeditation(id: Long) = meditationDao.deleteSessionById(id)

    // Meals
    fun getMeals(dateString: String = DateUtils.todayDateString()) = mealDao.getMealsForDate(dateString)
    suspend fun addMeal(meal: MealEntity) = mealDao.insertMeal(meal)
    suspend fun updateMeal(meal: MealEntity) = mealDao.updateMeal(meal)
    suspend fun deleteMeal(id: Long) = mealDao.deleteMealById(id)

    // Preferences & Settings
    suspend fun updateWaterGoal(goalMl: Int) = preferencesRepository.updateWaterGoal(goalMl)
    suspend fun updateStepGoal(steps: Int) = preferencesRepository.updateStepGoal(steps)
    suspend fun updateHydrationReminders(enabled: Boolean, interval: Int) = preferencesRepository.updateHydrationReminders(enabled, interval)
    suspend fun updateTheme(theme: String) = preferencesRepository.updateTheme(theme)
    suspend fun updateFirstDayOfWeek(day: String) = preferencesRepository.updateFirstDayOfWeek(day)

    suspend fun wipeAllUserData() {
        taskDao.clearAllTasks()
        taskDao.clearAllCompletions()
        waterDao.clearAll()
        exerciseDao.clearAll()
        meditationDao.clearAll()
        mealDao.clearAll()
        preferencesRepository.clearAllPreferences()
    }
}
