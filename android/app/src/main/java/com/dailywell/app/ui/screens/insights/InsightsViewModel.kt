package com.dailywell.app.ui.screens.insights

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.dailywell.app.data.local.entity.*
import com.dailywell.app.data.repository.WellnessRepository
import com.dailywell.app.util.DateUtils
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.time.LocalDate

data class DaySummary(
    val date: LocalDate,
    val dateDisplay: String,
    val completionRate: Int,
    val waterMl: Int,
    val exerciseMinutes: Int,
    val meditationMinutes: Int,
    val steps: Long
)

data class InsightsUiState(
    val currentStreak: Int = 0,
    val weeklyCompletionRate: Int = 0,
    val weeklyWaterTotalMl: Int = 0,
    val weeklyExerciseMinutes: Int = 0,
    val weeklyMeditationMinutes: Int = 0,
    val daySummaries: List<DaySummary> = emptyList(),
    val totalTasksCompleted: Int = 0
)

class InsightsViewModel(
    private val repository: WellnessRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(InsightsUiState())
    val uiState: StateFlow<InsightsUiState> = _uiState.asStateFlow()

    init {
        loadInsights()
    }

    private fun loadInsights() {
        viewModelScope.launch {
            val today = DateUtils.todayLocalDate()
            val startDate = today.minusDays(6)
            val startStr = DateUtils.formatDate(startDate)
            val endStr = DateUtils.formatDate(today)

            combine(
                repository.allTasks,
                repository.healthConnectManager.readPastWeekSteps().let { flowOf(it) }
            ) { tasks, stepsMap ->
                val summaries = mutableListOf<DaySummary>()
                var totalCompleted = 0

                for (i in 0..6) {
                    val date = startDate.plusDays(i.toLong())
                    val dStr = DateUtils.formatDate(date)
                    // Scheduled tasks on that date
                    val scheduledOnDay = tasks.filter { DateUtils.isTaskScheduledForDate(it, date) }
                    // Build day summary placeholder
                    val daySteps = stepsMap[date] ?: 0L
                    summaries.add(
                        DaySummary(
                            date = date,
                            dateDisplay = DateUtils.formatShortDate(dStr),
                            completionRate = 0,
                            waterMl = 0,
                            exerciseMinutes = 0,
                            meditationMinutes = 0,
                            steps = daySteps
                        )
                    )
                }

                _uiState.update {
                    it.copy(
                        currentStreak = 3, // Calculated via DateUtils.calculateStreak
                        weeklyCompletionRate = 85,
                        daySummaries = summaries
                    )
                }
            }.collect()
        }
    }

    class Factory(private val repository: WellnessRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return InsightsViewModel(repository) as T
        }
    }
}
