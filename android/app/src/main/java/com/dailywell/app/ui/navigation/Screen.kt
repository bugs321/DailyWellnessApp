package com.dailywell.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(
    val route: String,
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {
    object Today : Screen("today", "Today", Icons.Filled.Today, Icons.Outlined.Today)
    object Routines : Screen("routines", "Routines", Icons.Filled.Checklist, Icons.Outlined.Checklist)
    object Insights : Screen("insights", "Insights", Icons.Filled.BarChart, Icons.Outlined.BarChart)
    object Settings : Screen("settings", "Settings", Icons.Filled.Settings, Icons.Outlined.Settings)

    // Sub-screens
    object WaterTracker : Screen("water_tracker", "Hydration", Icons.Filled.WaterDrop, Icons.Outlined.WaterDrop)
    object ExerciseTracker : Screen("exercise_tracker", "Exercise", Icons.Filled.FitnessCenter, Icons.Outlined.FitnessCenter)
    object StepCounter : Screen("step_counter", "Steps", Icons.Filled.DirectionsWalk, Icons.Outlined.DirectionsWalk)
    object Meditation : Screen("meditation", "Mindfulness", Icons.Filled.SelfImprovement, Icons.Outlined.SelfImprovement)
    object FoodJournal : Screen("food_journal", "Food Journal", Icons.Filled.Restaurant, Icons.Outlined.Restaurant)
}

val bottomNavItems = listOf(
    Screen.Today,
    Screen.Routines,
    Screen.Insights,
    Screen.Settings
)
