package com.dailywell.app

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.dailywell.app.data.health.HealthConnectManager
import com.dailywell.app.data.local.DailyWellDatabase
import com.dailywell.app.data.preferences.UserPreferencesRepository
import com.dailywell.app.data.repository.WellnessRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.SupervisorJob

class DailyWellApplication : Application() {

    private val applicationScope = CoroutineScope(SupervisorJob())

    val database by lazy { DailyWellDatabase.getDatabase(this, applicationScope) }
    val preferencesRepository by lazy { UserPreferencesRepository(this) }
    val healthConnectManager by lazy { HealthConnectManager(this) }

    val repository by lazy {
        WellnessRepository(
            taskDao = database.taskDao(),
            waterDao = database.waterDao(),
            exerciseDao = database.exerciseDao(),
            meditationDao = database.meditationDao(),
            mealDao = database.mealDao(),
            preferencesRepository = preferencesRepository,
            healthConnectManager = healthConnectManager
        )
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val taskChannel = NotificationChannel(
                CHANNEL_TASKS_ID,
                "Daily Routines & Reminders",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Gentle reminders for scheduled daily wellness activities"
            }

            val hydrationChannel = NotificationChannel(
                CHANNEL_HYDRATION_ID,
                "Hydration Reminders",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Periodic reminders to drink water throughout the day"
            }

            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(taskChannel)
            manager.createNotificationChannel(hydrationChannel)
        }
    }

    companion object {
        const val CHANNEL_TASKS_ID = "dailywell_task_reminders"
        const val CHANNEL_HYDRATION_ID = "dailywell_hydration_reminders"
    }
}
