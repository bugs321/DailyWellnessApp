package com.dailywell.app.ui.screens.exercise

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.dailywell.app.data.local.entity.ExerciseSessionEntity
import com.dailywell.app.data.preferences.UserPreferences
import com.dailywell.app.data.repository.WellnessRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class ExerciseUiState(
    val sessionsToday: List<ExerciseSessionEntity> = emptyList(),
    val totalMinutesToday: Int = 0,
    val exerciseGoalMinutes: Int = 30
)

class ExerciseViewModel(
    private val repository: WellnessRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ExerciseUiState())
    val uiState: StateFlow<ExerciseUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            combine(
                repository.getExerciseSessions(),
                repository.getExerciseMinutes(),
                repository.userPreferences
            ) { sessions, totalMins, prefs ->
                ExerciseUiState(
                    sessionsToday = sessions,
                    totalMinutesToday = totalMins,
                    exerciseGoalMinutes = prefs.dailyExerciseGoalMinutes
                )
            }.collect { newState ->
                _uiState.value = newState
            }
        }
    }

    fun addExercise(
        workoutType: String,
        durationMinutes: Int,
        distanceKm: Float?,
        repetitions: Int?,
        notes: String?
    ) {
        viewModelScope.launch {
            repository.addExercise(
                ExerciseSessionEntity(
                    workoutType = workoutType,
                    durationMinutes = durationMinutes,
                    distanceKm = distanceKm,
                    repetitions = repetitions,
                    notes = notes
                )
            )
        }
    }

    fun deleteSession(id: Long) {
        viewModelScope.launch {
            repository.deleteExercise(id)
        }
    }

    class Factory(private val repository: WellnessRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return ExerciseViewModel(repository) as T
        }
    }
}
