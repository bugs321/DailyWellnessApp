package com.dailywell.app.data.local.dao

import androidx.room.*
import com.dailywell.app.data.local.entity.TaskCompletionEntity
import com.dailywell.app.data.local.entity.WellnessTaskEntity
import kotlinx.coroutines.flow.Flow

data class TaskWithCompletion(
    @Embedded val task: WellnessTaskEntity,
    @Relation(
        parentColumn = "id",
        entityColumn = "taskId"
    )
    val completions: List<TaskCompletionEntity>
)

@Dao
interface TaskDao {
    @Query("SELECT * FROM wellness_tasks ORDER BY sortOrder ASC, id ASC")
    fun getAllTasks(): Flow<List<WellnessTaskEntity>>

    @Query("SELECT * FROM wellness_tasks WHERE isPaused = 0 ORDER BY sortOrder ASC")
    fun getActiveTasks(): Flow<List<WellnessTaskEntity>>

    @Query("SELECT * FROM wellness_tasks WHERE id = :taskId")
    suspend fun getTaskById(taskId: Long): WellnessTaskEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTask(task: WellnessTaskEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTasks(tasks: List<WellnessTaskEntity>): List<Long>

    @Update
    suspend fun updateTask(task: WellnessTaskEntity)

    @Delete
    suspend fun deleteTask(task: WellnessTaskEntity)

    @Query("DELETE FROM wellness_tasks WHERE id = :taskId")
    suspend fun deleteTaskById(taskId: Long)

    // Completions
    @Query("SELECT * FROM task_completions WHERE localDate = :localDate")
    fun getCompletionsForDate(localDate: String): Flow<List<TaskCompletionEntity>>

    @Query("SELECT * FROM task_completions WHERE taskId = :taskId AND localDate = :localDate LIMIT 1")
    suspend fun getCompletion(taskId: Long, localDate: String): TaskCompletionEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCompletion(completion: TaskCompletionEntity): Long

    @Query("DELETE FROM task_completions WHERE taskId = :taskId AND localDate = :localDate")
    suspend fun deleteCompletion(taskId: Long, localDate: String)

    @Query("SELECT * FROM task_completions WHERE localDate BETWEEN :startDate AND :endDate")
    fun getCompletionsBetweenDates(startDate: String, endDate: String): Flow<List<TaskCompletionEntity>>

    @Query("DELETE FROM wellness_tasks")
    suspend fun clearAllTasks()

    @Query("DELETE FROM task_completions")
    suspend fun clearAllCompletions()
}
