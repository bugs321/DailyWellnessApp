package com.dailywell.app.ui.screens.food

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.dailywell.app.data.local.entity.MealEntity
import com.dailywell.app.data.local.entity.MealType
import com.dailywell.app.data.repository.WellnessRepository
import com.dailywell.app.util.DateUtils
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class FoodJournalUiState(
    val mealsToday: List<MealEntity> = emptyList(),
    val currentDateDisplay: String = DateUtils.formatDisplayDate(DateUtils.todayDateString())
)

class FoodJournalViewModel(
    private val repository: WellnessRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(FoodJournalUiState())
    val uiState: StateFlow<FoodJournalUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            repository.getMeals().collect { meals ->
                _uiState.update { it.copy(mealsToday = meals) }
            }
        }
    }

    fun addMeal(
        mealType: MealType,
        description: String,
        servingSize: String?,
        notes: String?
    ) {
        viewModelScope.launch {
            repository.addMeal(
                MealEntity(
                    mealType = mealType,
                    foodDescription = description,
                    servingSize = servingSize,
                    notes = notes
                )
            )
        }
    }

    fun deleteMeal(id: Long) {
        viewModelScope.launch {
            repository.deleteMeal(id)
        }
    }

    class Factory(private val repository: WellnessRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return FoodJournalViewModel(repository) as T
        }
    }
}
