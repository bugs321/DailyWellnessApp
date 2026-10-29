package com.dailywell.app.data.local.dao

import androidx.room.*
import com.dailywell.app.data.local.entity.MeditationSessionEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface MeditationDao {
    @Query("SELECT * FROM meditation_sessions WHERE localDate = :localDate ORDER BY timestamp DESC")
    fun getSessionsForDate(localDate: String): Flow<List<MeditationSessionEntity>>

    @Query("SELECT COALESCE(SUM(durationMinutes), 0) FROM meditation_sessions WHERE localDate = :localDate")
    fun getTotalMinutesForDate(localDate: String): Flow<Int>

    @Query("SELECT * FROM meditation_sessions WHERE localDate BETWEEN :startDate AND :endDate ORDER BY timestamp ASC")
    fun getSessionsBetweenDates(startDate: String, endDate: String): Flow<List<MeditationSessionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSession(session: MeditationSessionEntity): Long

    @Delete
    suspend fun deleteSession(session: MeditationSessionEntity)

    @Query("DELETE FROM meditation_sessions WHERE id = :id")
    suspend fun deleteSessionById(id: Long)

    @Query("DELETE FROM meditation_sessions")
    suspend fun clearAll()
}
