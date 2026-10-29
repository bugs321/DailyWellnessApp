package com.dailywell.app.ui.screens.today

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.dailywell.app.data.preferences.UserPreferences
import com.dailywell.app.data.repository.DailyTaskItem
import com.dailywell.app.data.repository.WellnessRepository
import com.dailywell.app.util.DateUtils
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class TodayUiState(
    val dateDisplay: String = "",
    val tasks: List<DailyTaskItem> = emptyList(),
    val completedCount: Int = 0,
    val totalCount: Int = 0,
    val completionPercentage: Int = 0,
    val waterTodayMl: Int = 0,
    val waterGoalMl: Int = 2000,
    val exerciseMinutesToday: Int = 0,
    val meditationMinutesToday: Int = 0,
    val stepsToday: Long = 0,
    val stepGoal: Int = 8000,
    val preferences: UserPreferences = UserPreferences()
)

class TodayViewModel(
    private val repository: WellnessRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(TodayUiState(dateDisplay = DateUtils.formatDisplayDate(DateUtils.todayDateString())))
    val uiState: StateFlow<TodayUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            combine(
                repository.getDailyTasks(),
                repository.getTodayWaterTotal(),
                repository.getExerciseMinutes(),
                repository.getMeditationMinutes(),
                repository.userPreferences
            ) { tasks, waterMl, exerciseMins, meditationMins, prefs ->
                val completed = tasks.count { it.isCompleted }
                val total = tasks.size
                val percentage = DateUtils.calculateCompletionPercentage(completed, total)

                TodayUiState(
                    dateDisplay = DateUtils.formatDisplayDate(DateUtils.todayDateString()),
                    tasks = tasks,
                    completedCount = completed,
                    totalCount = total,
                    completionPercentage = percentage,
                    waterTodayMl = waterMl,
                    waterGoalMl = prefs.dailyWaterGoalMl,
                    exerciseMinutesToday = exerciseMins,
                    meditationMinutesToday = meditationMins,
                    stepGoal = prefs.dailyStepGoal,
                    preferences = prefs
                )
            }.collect { newState ->
                _uiState.value = newState
            }
        }
        refreshSteps()
    }

    fun toggleTask(taskId: Long) {
        viewModelScope.launch {
            repository.toggleTaskCompletion(taskId)
        }
    }

    fun skipTask(taskId: Long) {
        viewModelScope.launch {
            repository.toggleTaskSkip(taskId)
        }
    }

    fun quickAddWater(amountMl: Int) {
        viewModelScope.launch {
            repository.addWater(amountMl)
        }
    }

    fun refreshSteps() {
        viewModelScope.launch {
            when (val result = repository.healthConnectManager.queryTodaySteps()) {
                is com.dailywell.app.data.health.StepQueryResult.Success -> _uiState.update { it.copy(stepsToday = result.steps) }
                else -> _uiState.update { it.copy(stepsToday = 0L) }
            }
        }
    }

    class Factory(private val repository: WellnessRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return TodayViewModel(repository) as T
        }
    }
}
