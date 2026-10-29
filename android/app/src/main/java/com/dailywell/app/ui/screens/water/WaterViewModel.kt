package com.dailywell.app.ui.screens.water

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.dailywell.app.data.local.entity.WaterLogEntity
import com.dailywell.app.data.preferences.UserPreferences
import com.dailywell.app.data.repository.WellnessRepository
import com.dailywell.app.util.DateUtils
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class WaterUiState(
    val todayMl: Int = 0,
    val targetMl: Int = 2000,
    val logs: List<WaterLogEntity> = emptyList(),
    val isReminderEnabled: Boolean = true,
    val reminderIntervalHours: Int = 2
)

class WaterViewModel(
    private val repository: WellnessRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(WaterUiState())
    val uiState: StateFlow<WaterUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            combine(
                repository.getTodayWaterTotal(),
                repository.getWaterLogs(),
                repository.userPreferences
            ) { total, logs, prefs ->
                WaterUiState(
                    todayMl = total,
                    targetMl = prefs.dailyWaterGoalMl,
                    logs = logs,
                    isReminderEnabled = prefs.isHydrationReminderEnabled,
                    reminderIntervalHours = prefs.hydrationReminderIntervalHours
                )
            }.collect { newState ->
                _uiState.value = newState
            }
        }
    }

    fun addWater(amountMl: Int) {
        viewModelScope.launch {
            repository.addWater(amountMl)
        }
    }

    fun deleteLog(id: Long) {
        viewModelScope.launch {
            repository.deleteWaterLog(id)
        }
    }

    fun updateTarget(newTargetMl: Int) {
        viewModelScope.launch {
            repository.updateWaterGoal(newTargetMl)
        }
    }

    fun toggleReminder(enabled: Boolean) {
        viewModelScope.launch {
            repository.updateHydrationReminders(enabled, _uiState.value.reminderIntervalHours)
        }
    }

    class Factory(private val repository: WellnessRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return WaterViewModel(repository) as T
        }
    }
}
