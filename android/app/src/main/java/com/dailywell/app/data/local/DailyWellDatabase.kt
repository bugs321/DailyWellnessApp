package com.dailywell.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import androidx.sqlite.db.SupportSQLiteDatabase
import com.dailywell.app.data.local.dao.*
import com.dailywell.app.data.local.entity.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        WellnessTaskEntity::class,
        TaskCompletionEntity::class,
        WaterLogEntity::class,
        ExerciseSessionEntity::class,
        MeditationSessionEntity::class,
        MealEntity::class
    ],
    version = 1,
    exportSchema = true
)
@TypeConverters(Converters::class)
abstract class DailyWellDatabase : RoomDatabase() {

    abstract fun taskDao(): TaskDao
    abstract fun waterDao(): WaterDao
    abstract fun exerciseDao(): ExerciseDao
    abstract fun meditationDao(): MeditationDao
    abstract fun mealDao(): MealDao

    companion object {
        @Volatile
        private var INSTANCE: DailyWellDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): DailyWellDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    DailyWellDatabase::class.java,
                    "dailywell_database"
                )
                    .addCallback(DailyWellDatabaseCallback(scope))
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }

    private class DailyWellDatabaseCallback(
        private val scope: CoroutineScope
    ) : RoomDatabase.Callback() {
        override fun onCreate(db: SupportSQLiteDatabase) {
            super.onCreate(db)
            INSTANCE?.let { database ->
                scope.launch(Dispatchers.IO) {
                    populateInitialStarterTasks(database.taskDao())
                }
            }
        }

        private suspend fun populateInitialStarterTasks(taskDao: TaskDao) {
            val starterTasks = listOf(
                WellnessTaskEntity(
                    name = "Morning Gentle Stretch",
                    description = "5-10 minutes of gentle morning movement and spine stretches",
                    category = TaskCategory.MOVEMENT_BREAK,
                    scheduledTime = "07:30",
                    reminderEnabled = true,
                    recurrence = RecurrenceType.DAILY,
                    selectedDaysOfWeek = "1,2,3,4,5,6,7",
                    goalValue = 10f,
                    goalUnit = "min",
                    sortOrder = 1
                ),
                WellnessTaskEntity(
                    name = "Hydrate Mindfully",
                    description = "Drink a fresh glass of water to kickstart hydration",
                    category = TaskCategory.HYDRATION,
                    scheduledTime = "08:00",
                    reminderEnabled = false,
                    recurrence = RecurrenceType.DAILY,
                    selectedDaysOfWeek = "1,2,3,4,5,6,7",
                    goalValue = 250f,
                    goalUnit = "ml",
                    sortOrder = 2
                ),
                WellnessTaskEntity(
                    name = "Midday Screen & Posture Break",
                    description = "Look 20ft away, roll shoulders, and step away from screens",
                    category = TaskCategory.MOVEMENT_BREAK,
                    scheduledTime = "12:30",
                    reminderEnabled = true,
                    recurrence = RecurrenceType.DAILY,
                    selectedDaysOfWeek = "1,2,3,4,5",
                    goalValue = 5f,
                    goalUnit = "min",
                    sortOrder = 3
                ),
                WellnessTaskEntity(
                    name = "Daily Brisk Walk or Workout",
                    description = "Get moving outdoors or complete your daily fitness routine",
                    category = TaskCategory.EXERCISE,
                    scheduledTime = "17:30",
                    reminderEnabled = false,
                    recurrence = RecurrenceType.DAILY,
                    selectedDaysOfWeek = "1,2,3,4,5,6,7",
                    goalValue = 30f,
                    goalUnit = "min",
                    sortOrder = 4
                ),
                WellnessTaskEntity(
                    name = "Evening Mindful Breathing",
                    description = "Unwind with guided breathing to reset your nervous system",
                    category = TaskCategory.MEDITATION,
                    scheduledTime = "21:00",
                    reminderEnabled = true,
                    recurrence = RecurrenceType.DAILY,
                    selectedDaysOfWeek = "1,2,3,4,5,6,7",
                    goalValue = 5f,
                    goalUnit = "min",
                    sortOrder = 5
                )
            )
            taskDao.insertTasks(starterTasks)
        }
    }
}
