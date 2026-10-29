package com.dailywell.app.ui.screens.steps

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.dailywell.app.data.health.HealthConnectAvailability
import com.dailywell.app.data.health.StepQueryResult
import com.dailywell.app.data.repository.WellnessRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.time.LocalDate

data class StepsUiState(
    val todaySteps: Long = 0,
    val stepGoal: Int = 8000,
    val isHealthConnectAvailable: HealthConnectAvailability = HealthConnectAvailability.Available,
    val hasHealthConnectPermission: Boolean = false,
    val isPermissionDenied: Boolean = false,
    val hasNoRecordsToday: Boolean = false,
    val isUnsupportedDevice: Boolean = false,
    val isProviderUpdateRequired: Boolean = false,
    val errorMessage: String? = null,
    val weeklyHistory: Map<LocalDate, Long> = emptyMap(),
    val isManualEntryUsed: Boolean = false,
    val manualStepsToday: Long = 0,
    val isLoading: Boolean = false,
    val rationaleMessage: String = "Health Connect allows DailyWell to read your steps securely on-device without cloud uploads or telemetry."
)

class StepsViewModel(
    private val repository: WellnessRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(StepsUiState())
    val uiState: StateFlow<StepsUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            repository.userPreferences.collect { prefs ->
                _uiState.update {
                    it.copy(
                        stepGoal = prefs.dailyStepGoal,
                        isHealthConnectAvailable = repository.healthConnectManager.isHealthConnectAvailable()
                    )
                }
            }
        }
        checkPermissionsAndLoad()
    }

    fun checkPermissionsAndLoad() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            val availability = repository.healthConnectManager.isHealthConnectAvailable()

            when (availability) {
                is HealthConnectAvailability.NotSupported -> {
                    _uiState.update {
                        it.copy(
                            isHealthConnectAvailable = availability,
                            isUnsupportedDevice = true,
                            isLoading = false
                        )
                    }
                    return@launch
                }
                is HealthConnectAvailability.NotInstalled -> {
                    _uiState.update {
                        it.copy(
                            isHealthConnectAvailable = availability,
                            isProviderUpdateRequired = true,
                            isLoading = false
                        )
                    }
                    return@launch
                }
                is HealthConnectAvailability.Available -> {
                    _uiState.update {
                        it.copy(
                            isHealthConnectAvailable = availability,
                            isUnsupportedDevice = false,
                            isProviderUpdateRequired = false
                        )
                    }
                }
            }

            when (val result = repository.healthConnectManager.queryTodaySteps()) {
                is StepQueryResult.Success -> {
                    val pastWeek = repository.healthConnectManager.queryPastWeekSteps()
                    _uiState.update {
                        it.copy(
                            todaySteps = if (it.isManualEntryUsed) it.manualStepsToday else result.steps,
                            hasNoRecordsToday = !result.hasRecords && !it.isManualEntryUsed,
                            hasHealthConnectPermission = true,
                            isPermissionDenied = false,
                            weeklyHistory = pastWeek,
                            isLoading = false
                        )
                    }
                }
                is StepQueryResult.PermissionDenied -> {
                    _uiState.update {
                        it.copy(
                            hasHealthConnectPermission = false,
                            isPermissionDenied = true,
                            todaySteps = if (it.isManualEntryUsed) it.manualStepsToday else 0L,
                            isLoading = false
                        )
                    }
                }
                is StepQueryResult.Unavailable -> {
                    _uiState.update {
                        it.copy(
                            isUnsupportedDevice = result.availability is HealthConnectAvailability.NotSupported,
                            isProviderUpdateRequired = result.availability is HealthConnectAvailability.NotInstalled,
                            isLoading = false
                        )
                    }
                }
                is StepQueryResult.Error -> {
                    _uiState.update {
                        it.copy(
                            errorMessage = result.exception.localizedMessage ?: "Failed to read step records",
                            isLoading = false
                        )
                    }
                }
            }
        }
    }

    fun recordManualSteps(steps: Long) {
        _uiState.update {
            it.copy(
                isManualEntryUsed = true,
                manualStepsToday = steps,
                todaySteps = steps,
                hasNoRecordsToday = false
            )
        }
    }

    fun updateGoal(newGoal: Int) {
        val validatedGoal = newGoal.coerceIn(1000, 100000)
        viewModelScope.launch {
            repository.updateStepGoal(validatedGoal)
        }
    }

    class Factory(private val repository: WellnessRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return StepsViewModel(repository) as T
        }
    }
}
