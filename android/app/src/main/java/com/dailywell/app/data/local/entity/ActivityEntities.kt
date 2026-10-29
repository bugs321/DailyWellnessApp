package com.dailywell.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "water_logs")
data class WaterLogEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val amountMl: Int,
    val timestamp: Long = System.currentTimeMillis(),
    val localDate: String // "YYYY-MM-DD"
)

@Entity(tableName = "exercise_sessions")
data class ExerciseSessionEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val workoutType: String,
    val durationMinutes: Int,
    val distanceKm: Float? = null,
    val repetitions: Int? = null,
    val notes: String? = null,
    val timestamp: Long = System.currentTimeMillis(),
    val localDate: String // "YYYY-MM-DD"
)

@Entity(tableName = "meditation_sessions")
data class MeditationSessionEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val durationMinutes: Int,
    val technique: String = "Mindful Breathing",
    val notes: String? = null,
    val timestamp: Long = System.currentTimeMillis(),
    val localDate: String // "YYYY-MM-DD"
)

@Entity(tableName = "meal_entries")
data class MealEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val mealType: MealType,
    val foodDescription: String,
    val servingSize: String? = null,
    val notes: String? = null,
    val timestamp: Long = System.currentTimeMillis(),
    val localDate: String // "YYYY-MM-DD"
)
