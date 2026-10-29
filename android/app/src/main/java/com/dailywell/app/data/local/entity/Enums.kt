package com.dailywell.app.data.local.entity

enum class TaskCategory(val displayName: String) {
    EXERCISE("Exercise"),
    HYDRATION("Hydration"),
    MEDITATION("Meditation"),
    MOVEMENT_BREAK("Movement Break"),
    NUTRITION("Nutrition"),
    SLEEP("Sleep"),
    PERSONAL_CARE("Personal Care"),
    CUSTOM("Custom")
}

enum class RecurrenceType(val displayName: String) {
    DAILY("Daily"),
    SPECIFIC_DAYS("Selected Weekdays"),
    ONE_TIME("One-Time")
}

enum class MealType(val displayName: String) {
    BREAKFAST("Breakfast"),
    LUNCH("Lunch"),
    DINNER("Dinner"),
    SNACK("Snack"),
    CUSTOM("Custom")
}
