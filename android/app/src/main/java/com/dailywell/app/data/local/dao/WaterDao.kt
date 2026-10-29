package com.dailywell.app.data.local.dao

import androidx.room.*
import com.dailywell.app.data.local.entity.WaterLogEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface WaterDao {
    @Query("SELECT * FROM water_logs WHERE localDate = :localDate ORDER BY timestamp DESC")
    fun getLogsForDate(localDate: String): Flow<List<WaterLogEntity>>

    @Query("SELECT COALESCE(SUM(amountMl), 0) FROM water_logs WHERE localDate = :localDate")
    fun getTotalMlForDate(localDate: String): Flow<Int>

    @Query("SELECT * FROM water_logs WHERE localDate BETWEEN :startDate AND :endDate ORDER BY timestamp ASC")
    fun getLogsBetweenDates(startDate: String, endDate: String): Flow<List<WaterLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLog(log: WaterLogEntity): Long

    @Update
    suspend fun updateLog(log: WaterLogEntity)

    @Delete
    suspend fun deleteLog(log: WaterLogEntity)

    @Query("DELETE FROM water_logs WHERE id = :id")
    suspend fun deleteLogById(id: Long)

    @Query("DELETE FROM water_logs")
    suspend fun clearAll()
}
