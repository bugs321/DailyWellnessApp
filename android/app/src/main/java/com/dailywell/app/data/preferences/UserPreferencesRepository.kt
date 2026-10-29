package com.dailywell.app.data.preferences

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import java.io.IOException

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "dailywell_preferences")

data class UserPreferences(
    val dailyWaterGoalMl: Int = 2000,
    val dailyStepGoal: Int = 8000,
    val dailyExerciseGoalMinutes: Int = 30,
    val dailyMeditationGoalMinutes: Int = 10,
    val isHydrationReminderEnabled: Boolean = true,
    val hydrationReminderIntervalHours: Int = 2,
    val preferredTheme: String = "SYSTEM", // "SYSTEM", "LIGHT", "DARK"
    val firstDayOfWeek: String = "MONDAY", // "MONDAY", "SUNDAY"
    val hasSeenHealthConnectRationale: Boolean = false,
    val notificationsEnabled: Boolean = true
)

class UserPreferencesRepository(private val context: Context) {

    private object PreferencesKeys {
        val WATER_GOAL = intPreferencesKey("daily_water_goal_ml")
        val STEP_GOAL = intPreferencesKey("daily_step_goal")
        val EXERCISE_GOAL = intPreferencesKey("daily_exercise_goal_minutes")
        val MEDITATION_GOAL = intPreferencesKey("daily_meditation_goal_minutes")
        val HYDRATION_REMINDERS = booleanPreferencesKey("hydration_reminders_enabled")
        val HYDRATION_INTERVAL = intPreferencesKey("hydration_interval_hours")
        val THEME = stringPreferencesKey("preferred_theme")
        val FIRST_DAY = stringPreferencesKey("first_day_of_week")
        val HC_RATIONALE = booleanPreferencesKey("has_seen_hc_rationale")
        val NOTIFICATIONS = booleanPreferencesKey("notifications_enabled")
    }

    val userPreferencesFlow: Flow<UserPreferences> = context.dataStore.data
        .catch { exception ->
            if (exception is IOException) {
                emit(emptyPreferences())
            } else {
                throw exception
            }
        }
        .map { preferences ->
            UserPreferences(
                dailyWaterGoalMl = preferences[PreferencesKeys.WATER_GOAL] ?: 2000,
                dailyStepGoal = preferences[PreferencesKeys.STEP_GOAL] ?: 8000,
                dailyExerciseGoalMinutes = preferences[PreferencesKeys.EXERCISE_GOAL] ?: 30,
                dailyMeditationGoalMinutes = preferences[PreferencesKeys.MEDITATION_GOAL] ?: 10,
                isHydrationReminderEnabled = preferences[PreferencesKeys.HYDRATION_REMINDERS] ?: true,
                hydrationReminderIntervalHours = preferences[PreferencesKeys.HYDRATION_INTERVAL] ?: 2,
                preferredTheme = preferences[PreferencesKeys.THEME] ?: "SYSTEM",
                firstDayOfWeek = preferences[PreferencesKeys.FIRST_DAY] ?: "MONDAY",
                hasSeenHealthConnectRationale = preferences[PreferencesKeys.HC_RATIONALE] ?: false,
                notificationsEnabled = preferences[PreferencesKeys.NOTIFICATIONS] ?: true
            )
        }

    suspend fun updateWaterGoal(goalMl: Int) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.WATER_GOAL] = goalMl
        }
    }

    suspend fun updateStepGoal(goalSteps: Int) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.STEP_GOAL] = goalSteps
        }
    }

    suspend fun updateExerciseGoal(minutes: Int) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.EXERCISE_GOAL] = minutes
        }
    }

    suspend fun updateMeditationGoal(minutes: Int) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.MEDITATION_GOAL] = minutes
        }
    }

    suspend fun updateHydrationReminders(enabled: Boolean, intervalHours: Int = 2) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.HYDRATION_REMINDERS] = enabled
            preferences[PreferencesKeys.HYDRATION_INTERVAL] = intervalHours
        }
    }

    suspend fun updateTheme(theme: String) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.THEME] = theme
        }
    }

    suspend fun updateFirstDayOfWeek(firstDay: String) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.FIRST_DAY] = firstDay
        }
    }

    suspend fun setHealthConnectRationaleSeen(seen: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.HC_RATIONALE] = seen
        }
    }

    suspend fun updateNotificationsEnabled(enabled: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.NOTIFICATIONS] = enabled
        }
    }

    suspend fun clearAllPreferences() {
        context.dataStore.edit { preferences ->
            preferences.clear()
        }
    }
}
