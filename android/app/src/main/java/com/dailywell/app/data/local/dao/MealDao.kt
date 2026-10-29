package com.dailywell.app.data.local.dao

import androidx.room.*
import com.dailywell.app.data.local.entity.MealEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface MealDao {
    @Query("SELECT * FROM meal_entries WHERE localDate = :localDate ORDER BY timestamp ASC")
    fun getMealsForDate(localDate: String): Flow<List<MealEntity>>

    @Query("SELECT * FROM meal_entries WHERE localDate BETWEEN :startDate AND :endDate ORDER BY timestamp ASC")
    fun getMealsBetweenDates(startDate: String, endDate: String): Flow<List<MealEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMeal(meal: MealEntity): Long

    @Update
    suspend fun updateMeal(meal: MealEntity)

    @Delete
    suspend fun deleteMeal(meal: MealEntity)

    @Query("DELETE FROM meal_entries WHERE id = :id")
    suspend fun deleteMealById(id: Long)

    @Query("DELETE FROM meal_entries")
    suspend fun clearAll()
}
