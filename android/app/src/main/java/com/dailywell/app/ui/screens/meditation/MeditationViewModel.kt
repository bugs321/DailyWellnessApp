package com.dailywell.app.ui.screens.meditation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.dailywell.app.data.local.entity.MeditationSessionEntity
import com.dailywell.app.data.repository.WellnessRepository
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class MeditationUiState(
    val selectedMinutes: Int = 5,
    val remainingSeconds: Int = 300,
    val isRunning: Boolean = false,
    val isFinished: Boolean = false,
    val breathingPhase: String = "Inhale", // "Inhale", "Hold", "Exhale", "Hold"
    val breathingPhaseProgress: Float = 0f,
    val completedSessionsToday: List<MeditationSessionEntity> = emptyList(),
    val totalMinutesToday: Int = 0
)

class MeditationViewModel(
    private val repository: WellnessRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(MeditationUiState())
    val uiState: StateFlow<MeditationUiState> = _uiState.asStateFlow()

    private var timerJob: Job? = null
    private var breathJob: Job? = null

    init {
        viewModelScope.launch {
            combine(
                repository.getMeditationSessions(),
                repository.getMeditationMinutes()
            ) { sessions, totalMins ->
                _uiState.update {
                    it.copy(
                        completedSessionsToday = sessions,
                        totalMinutesToday = totalMins
                    )
                }
            }.collect()
        }
    }

    fun selectDuration(minutes: Int) {
        if (!_uiState.value.isRunning) {
            _uiState.update {
                it.copy(
                    selectedMinutes = minutes,
                    remainingSeconds = minutes * 60,
                    isFinished = false
                )
            }
        }
    }

    fun startTimer() {
        if (_uiState.value.isRunning) return

        _uiState.update { it.copy(isRunning = true, isFinished = false) }

        timerJob = viewModelScope.launch {
            while (_uiState.value.remainingSeconds > 0 && _uiState.value.isRunning) {
                delay(1000)
                _uiState.update {
                    val next = it.remainingSeconds - 1
                    if (next <= 0) {
                        onSessionFinished()
                        it.copy(remainingSeconds = 0, isRunning = false, isFinished = true)
                    } else {
                        it.copy(remainingSeconds = next)
                    }
                }
            }
        }

        startBreathingCycle()
    }

    private fun startBreathingCycle() {
        breathJob = viewModelScope.launch {
            val phases = listOf("Inhale" to 4, "Hold" to 4, "Exhale" to 4, "Hold" to 4)
            while (_uiState.value.isRunning) {
                for ((phase, duration) in phases) {
                    if (!_uiState.value.isRunning) break
                    for (step in 1..duration) {
                        if (!_uiState.value.isRunning) break
                        _uiState.update {
                            it.copy(
                                breathingPhase = phase,
                                breathingPhaseProgress = step.toFloat() / duration.toFloat()
                            )
                        }
                        delay(1000)
                    }
                }
            }
        }
    }

    fun pauseTimer() {
        timerJob?.cancel()
        breathJob?.cancel()
        _uiState.update { it.copy(isRunning = false) }
    }

    fun resetTimer() {
        pauseTimer()
        _uiState.update {
            it.copy(
                remainingSeconds = it.selectedMinutes * 60,
                isRunning = false,
                isFinished = false,
                breathingPhase = "Inhale",
                breathingPhaseProgress = 0f
            )
        }
    }

    private fun onSessionFinished() {
        val duration = _uiState.value.selectedMinutes
        viewModelScope.launch {
            repository.addMeditation(
                MeditationSessionEntity(
                    durationMinutes = duration,
                    technique = "Box Breathing (4-4-4-4)"
                )
            )
        }
    }

    class Factory(private val repository: WellnessRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return MeditationViewModel(repository) as T
        }
    }
}
