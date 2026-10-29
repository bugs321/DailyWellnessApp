package com.dailywell.app.data.local.dao

import androidx.room.*
import com.dailywell.app.data.local.entity.ExerciseSessionEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ExerciseDao {
    @Query("SELECT * FROM exercise_sessions WHERE localDate = :localDate ORDER BY timestamp DESC")
    fun getSessionsForDate(localDate: String): Flow<List<ExerciseSessionEntity>>

    @Query("SELECT COALESCE(SUM(durationMinutes), 0) FROM exercise_sessions WHERE localDate = :localDate")
    fun getTotalMinutesForDate(localDate: String): Flow<Int>

    @Query("SELECT * FROM exercise_sessions WHERE localDate BETWEEN :startDate AND :endDate ORDER BY timestamp ASC")
    fun getSessionsBetweenDates(startDate: String, endDate: String): Flow<List<ExerciseSessionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSession(session: ExerciseSessionEntity): Long

    @Update
    suspend fun updateSession(session: ExerciseSessionEntity)

    @Delete
    suspend fun deleteSession(session: ExerciseSessionEntity)

    @Query("DELETE FROM exercise_sessions WHERE id = :id")
    suspend fun deleteSessionById(id: Long)

    @Query("DELETE FROM exercise_sessions")
    suspend fun clearAll()
}
