package com.dailywell.app.ui.screens.routines

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.dailywell.app.data.local.entity.RecurrenceType
import com.dailywell.app.data.local.entity.TaskCategory
import com.dailywell.app.data.local.entity.WellnessTaskEntity
import com.dailywell.app.data.repository.WellnessRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class RoutinesUiState(
    val tasks: List<WellnessTaskEntity> = emptyList(),
    val selectedCategory: TaskCategory? = null,
    val isLoading: Boolean = false
)

class RoutinesViewModel(
    private val repository: WellnessRepository
) : ViewModel() {

    private val _selectedCategory = MutableStateFlow<TaskCategory?>(null)
    private val _uiState = MutableStateFlow(RoutinesUiState())
    val uiState: StateFlow<RoutinesUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            combine(repository.allTasks, _selectedCategory) { tasks, category ->
                val filtered = if (category == null) tasks else tasks.filter { it.category == category }
                RoutinesUiState(
                    tasks = filtered,
                    selectedCategory = category
                )
            }.collect { newState ->
                _uiState.value = newState
            }
        }
    }

    fun setCategoryFilter(category: TaskCategory?) {
        _selectedCategory.value = category
    }

    fun saveTask(
        id: Long = 0,
        name: String,
        description: String,
        category: TaskCategory,
        scheduledTime: String?,
        reminderEnabled: Boolean,
        recurrence: RecurrenceType,
        selectedDaysOfWeek: String,
        goalValue: Float?,
        goalUnit: String?
    ) {
        viewModelScope.launch {
            val task = WellnessTaskEntity(
                id = id,
                name = name,
                description = description,
                category = category,
                scheduledTime = scheduledTime,
                reminderEnabled = reminderEnabled,
                recurrence = recurrence,
                selectedDaysOfWeek = selectedDaysOfWeek,
                goalValue = goalValue,
                goalUnit = goalUnit
            )
            if (id == 0L) {
                repository.addTask(task)
            } else {
                repository.updateTask(task)
            }
        }
    }

    fun toggleTaskPause(task: WellnessTaskEntity) {
        viewModelScope.launch {
            repository.updateTask(task.copy(isPaused = !task.isPaused))
        }
    }

    fun deleteTask(task: WellnessTaskEntity) {
        viewModelScope.launch {
            repository.deleteTask(task)
        }
    }

    class Factory(private val repository: WellnessRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return RoutinesViewModel(repository) as T
        }
    }
}
