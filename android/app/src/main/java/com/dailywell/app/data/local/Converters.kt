package com.dailywell.app.data.local

import androidx.room.TypeConverter
import com.dailywell.app.data.local.entity.MealType
import com.dailywell.app.data.local.entity.RecurrenceType
import com.dailywell.app.data.local.entity.TaskCategory

class Converters {
    @TypeConverter
    fun fromCategory(category: TaskCategory): String = category.name

    @TypeConverter
    fun toCategory(value: String): TaskCategory = runCatching {
        TaskCategory.valueOf(value)
    }.getOrDefault(TaskCategory.CUSTOM)

    @TypeConverter
    fun fromRecurrence(recurrence: RecurrenceType): String = recurrence.name

    @TypeConverter
    fun toRecurrence(value: String): RecurrenceType = runCatching {
        RecurrenceType.valueOf(value)
    }.getOrDefault(RecurrenceType.DAILY)

    @TypeConverter
    fun fromMealType(mealType: MealType): String = mealType.name

    @TypeConverter
    fun toMealType(value: String): MealType = runCatching {
        MealType.valueOf(value)
    }.getOrDefault(MealType.CUSTOM)
}
