package com.dailywell.app.ui.screens.settings

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.dailywell.app.data.preferences.UserPreferences
import com.dailywell.app.data.repository.WellnessRepository
import com.dailywell.app.util.CsvExporter
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class SettingsUiState(
    val preferences: UserPreferences = UserPreferences(),
    val exportDataString: String? = null,
    val isDataErased: Boolean = false
)

class SettingsViewModel(
    private val repository: WellnessRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(SettingsUiState())
    val uiState: StateFlow<SettingsUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            repository.userPreferences.collect { prefs ->
                _uiState.update { it.copy(preferences = prefs) }
            }
        }
    }

    fun updateWaterGoal(goalMl: Int) {
        viewModelScope.launch { repository.updateWaterGoal(goalMl) }
    }

    fun updateStepGoal(steps: Int) {
        viewModelScope.launch { repository.updateStepGoal(steps) }
    }

    fun updateHydrationReminders(enabled: Boolean, interval: Int) {
        viewModelScope.launch { repository.updateHydrationReminders(enabled, interval) }
    }

    fun updateTheme(theme: String) {
        viewModelScope.launch { repository.updateTheme(theme) }
    }

    fun updateFirstDayOfWeek(firstDay: String) {
        viewModelScope.launch { repository.updateFirstDayOfWeek(firstDay) }
    }

    fun eraseAllData() {
        viewModelScope.launch {
            repository.wipeAllUserData()
            _uiState.update { it.copy(isDataErased = true) }
        }
    }

    class Factory(private val repository: WellnessRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return SettingsViewModel(repository) as T
        }
    }
}
