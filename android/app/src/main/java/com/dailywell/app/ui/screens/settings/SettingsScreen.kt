package com.dailywell.app.ui.screens.settings

import android.content.Intent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    viewModel: SettingsViewModel
) {
    val state by viewModel.uiState.collectAsState()
    val context = LocalContext.current
    var showEraseDialog by remember { mutableStateOf(false) }
    var showDisclaimerDialog by remember { mutableStateOf(false) }
    var showPrivacyDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings & Privacy", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Personal Targets Section
            item {
                Text("Daily Targets", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold))
                Spacer(modifier = Modifier.height(8.dp))
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Water Target", style = MaterialTheme.typography.bodyLarge)
                            Text("${state.preferences.dailyWaterGoalMl} ml", fontWeight = FontWeight.SemiBold)
                        }
                        Divider(modifier = Modifier.padding(vertical = 12.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Step Target", style = MaterialTheme.typography.bodyLarge)
                            Text("${state.preferences.dailyStepGoal} steps", fontWeight = FontWeight.SemiBold)
                        }
                        Divider(modifier = Modifier.padding(vertical = 12.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Exercise Target", style = MaterialTheme.typography.bodyLarge)
                            Text("${state.preferences.dailyExerciseGoalMinutes} min", fontWeight = FontWeight.SemiBold)
                        }
                    }
                }
            }

            // Preferences (Theme & First day of week)
            item {
                Text("App Preferences", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold))
                Spacer(modifier = Modifier.height(8.dp))
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Theme Appearance", style = MaterialTheme.typography.labelMedium)
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 6.dp)) {
                            listOf("SYSTEM" to "System", "LIGHT" to "Light", "DARK" to "Dark").forEach { (key, label) ->
                                FilterChip(
                                    selected = state.preferences.preferredTheme == key,
                                    onClick = { viewModel.updateTheme(key) },
                                    label = { Text(label) }
                                )
                            }
                        }
                        Divider(modifier = Modifier.padding(vertical = 12.dp))
                        Text("First Day of the Week", style = MaterialTheme.typography.labelMedium)
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 6.dp)) {
                            listOf("MONDAY" to "Monday", "SUNDAY" to "Sunday").forEach { (key, label) ->
                                FilterChip(
                                    selected = state.preferences.firstDayOfWeek == key,
                                    onClick = { viewModel.updateFirstDayOfWeek(key) },
                                    label = { Text(label) }
                                )
                            }
                        }
                    }
                }
            }

            // Data & Export
            item {
                Text("Data & Privacy", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold))
                Spacer(modifier = Modifier.height(8.dp))
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column {
                        ListItem(
                            headlineContent = { Text("Export Records to CSV") },
                            supportingContent = { Text("Save an offline CSV copy of your wellness logs") },
                            leadingContent = { Icon(Icons.Outlined.FileDownload, contentDescription = null) },
                            modifier = Modifier.clickable {
                                val sendIntent: Intent = Intent().apply {
                                    action = Intent.ACTION_SEND
                                    putExtra(Intent.EXTRA_TEXT, "DailyWell export ready")
                                    type = "text/csv"
                                }
                                val shareIntent = Intent.createChooser(sendIntent, "Export Health Records")
                                context.startActivity(shareIntent)
                            }
                        )
                        Divider()
                        ListItem(
                            headlineContent = { Text("Privacy Notice & On-Device Storage") },
                            supportingContent = { Text("No accounts, cloud sync or third-party telemetry") },
                            leadingContent = { Icon(Icons.Outlined.Security, contentDescription = null) },
                            modifier = Modifier.clickable { showPrivacyDialog = true }
                        )
                        Divider()
                        ListItem(
                            headlineContent = { Text("Wellness & Medical Disclaimer") },
                            supportingContent = { Text("DailyWell is a lifestyle & habit app") },
                            leadingContent = { Icon(Icons.Outlined.HealthAndSafety, contentDescription = null) },
                            modifier = Modifier.clickable { showDisclaimerDialog = true }
                        )
                        Divider()
                        ListItem(
                            headlineContent = { Text("Erase All Data", color = MaterialTheme.colorScheme.error) },
                            supportingContent = { Text("Permanently delete all stored routines and logs") },
                            leadingContent = { Icon(Icons.Outlined.DeleteForever, contentDescription = null, tint = MaterialTheme.colorScheme.error) },
                            modifier = Modifier.clickable { showEraseDialog = true }
                        )
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }

    if (showEraseDialog) {
        AlertDialog(
            onDismissRequest = { showEraseDialog = false },
            title = { Text("Erase All Stored Data?") },
            text = { Text("This will permanently wipe all routines, water logs, exercises, meditation sessions, meals and preferences from your device. This action cannot be undone.") },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.eraseAllData()
                        showEraseDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) {
                    Text("Erase Everything")
                }
            },
            dismissButton = {
                TextButton(onClick = { showEraseDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    if (showDisclaimerDialog) {
        AlertDialog(
            onDismissRequest = { showDisclaimerDialog = false },
            title = { Text("Wellness Disclaimer") },
            text = {
                Text("DailyWell is designed solely for personal habit tracking, mindfulness, and general lifestyle wellbeing. It does not provide medical diagnosis, clinical decisions, treatment, or medical advice. Always consult a licensed healthcare professional for medical questions or health conditions.")
            },
            confirmButton = {
                Button(onClick = { showDisclaimerDialog = false }) {
                    Text("I Understand")
                }
            }
        )
    }

    if (showPrivacyDialog) {
        AlertDialog(
            onDismissRequest = { showPrivacyDialog = false },
            title = { Text("Privacy & Data Safety") },
            text = {
                Text("DailyWell is built with local privacy first. All your routine logs, water records, exercise sessions, and food journal entries are saved strictly in your local SQLite Room database on this phone. No personal data is transmitted to remote servers, and no advertising or user tracking SDKs are included.")
            },
            confirmButton = {
                Button(onClick = { showPrivacyDialog = false }) {
                    Text("Close")
                }
            }
        )
    }
}
