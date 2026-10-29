package com.dailywell.app.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.*
import com.dailywell.app.DailyWellApplication
import com.dailywell.app.ui.screens.exercise.*
import com.dailywell.app.ui.screens.food.*
import com.dailywell.app.ui.screens.insights.*
import com.dailywell.app.ui.screens.meditation.*
import com.dailywell.app.ui.screens.routines.*
import com.dailywell.app.ui.screens.settings.*
import com.dailywell.app.ui.screens.steps.*
import com.dailywell.app.ui.screens.today.*
import com.dailywell.app.ui.screens.water.*

@Composable
fun DailyWellNavHost(
    app: DailyWellApplication,
    navController: NavHostController = rememberNavController()
) {
    val repository = app.repository
    val currentNavBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = currentNavBackStackEntry?.destination?.route

    val isTopLevelDestination = bottomNavItems.any { it.route == currentRoute }

    Scaffold(
        bottomBar = {
            if (isTopLevelDestination) {
                NavigationBar {
                    bottomNavItems.forEach { screen ->
                        val selected = currentRoute == screen.route
                        NavigationBarItem(
                            icon = {
                                Icon(
                                    imageVector = if (selected) screen.selectedIcon else screen.unselectedIcon,
                                    contentDescription = screen.title
                                )
                            },
                            label = { Text(screen.title) },
                            selected = selected,
                            onClick = {
                                navController.navigate(screen.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Today.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Today.route) {
                val vm: TodayViewModel = viewModel(factory = TodayViewModel.Factory(repository))
                TodayScreen(
                    viewModel = vm,
                    onNavigateToWater = { navController.navigate(Screen.WaterTracker.route) },
                    onNavigateToSteps = { navController.navigate(Screen.StepCounter.route) },
                    onNavigateToMeditation = { navController.navigate(Screen.Meditation.route) },
                    onNavigateToMeals = { navController.navigate(Screen.FoodJournal.route) },
                    onNavigateToExercise = { navController.navigate(Screen.ExerciseTracker.route) },
                    onNavigateToRoutines = { navController.navigate(Screen.Routines.route) }
                )
            }

            composable(Screen.Routines.route) {
                val vm: RoutinesViewModel = viewModel(factory = RoutinesViewModel.Factory(repository))
                RoutinesScreen(viewModel = vm)
            }

            composable(Screen.Insights.route) {
                val vm: InsightsViewModel = viewModel(factory = InsightsViewModel.Factory(repository))
                InsightsScreen(viewModel = vm)
            }

            composable(Screen.Settings.route) {
                val vm: SettingsViewModel = viewModel(factory = SettingsViewModel.Factory(repository))
                SettingsScreen(viewModel = vm)
            }

            composable(Screen.WaterTracker.route) {
                val vm: WaterViewModel = viewModel(factory = WaterViewModel.Factory(repository))
                WaterScreen(viewModel = vm, onNavigateUp = { navController.popBackStack() })
            }

            composable(Screen.ExerciseTracker.route) {
                val vm: ExerciseViewModel = viewModel(factory = ExerciseViewModel.Factory(repository))
                ExerciseScreen(viewModel = vm, onNavigateUp = { navController.popBackStack() })
            }

            composable(Screen.StepCounter.route) {
                val vm: StepsViewModel = viewModel(factory = StepsViewModel.Factory(repository))
                StepsScreen(
                    viewModel = vm,
                    healthConnectPermissions = setOf("android.permission.health.READ_STEPS"),
                    onNavigateUp = { navController.popBackStack() }
                )
            }

            composable(Screen.Meditation.route) {
                val vm: MeditationViewModel = viewModel(factory = MeditationViewModel.Factory(repository))
                MeditationScreen(viewModel = vm, onNavigateUp = { navController.popBackStack() })
            }

            composable(Screen.FoodJournal.route) {
                val vm: FoodJournalViewModel = viewModel(factory = FoodJournalViewModel.Factory(repository))
                FoodJournalScreen(viewModel = vm, onNavigateUp = { navController.popBackStack() })
            }
        }
    }
}
