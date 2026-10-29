package com.dailywell.app.ui.screens.routines

import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.dailywell.app.data.local.entity.RecurrenceType
import com.dailywell.app.data.local.entity.TaskCategory
import com.dailywell.app.data.local.entity.WellnessTaskEntity

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RoutinesScreen(
    viewModel: RoutinesViewModel
) {
    val state by viewModel.uiState.collectAsState()
    var showDialog by remember { mutableStateOf(false) }
    var taskToEdit by remember { mutableStateOf<WellnessTaskEntity?>(null) }
    var taskToDelete by remember { mutableStateOf<WellnessTaskEntity?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Routines & Tasks", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    taskToEdit = null
                    showDialog = true
                },
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary
            ) {
                Icon(Icons.Filled.Add, contentDescription = "Add New Routine")
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Category filter chips
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FilterChip(
                    selected = state.selectedCategory == null,
                    onClick = { viewModel.setCategoryFilter(null) },
                    label = { Text("All") }
                )
                TaskCategory.values().forEach { cat ->
                    FilterChip(
                        selected = state.selectedCategory == cat,
                        onClick = { viewModel.setCategoryFilter(if (state.selectedCategory == cat) null else cat) },
                        label = { Text(cat.displayName) }
                    )
                }
            }

            if (state.tasks.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            Icons.Outlined.ChecklistRtl,
                            contentDescription = null,
                            modifier = Modifier.size(56.dp),
                            tint = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "No routines found",
                            style = MaterialTheme.typography.titleMedium
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Create healthy habits and daily reminders that suit your lifestyle.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(state.tasks, key = { it.id }) { task ->
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = if (task.isPaused)
                                    MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)
                                else
                                    MaterialTheme.colorScheme.surface
                            ),
                            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.Top
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Text(
                                                text = task.name,
                                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold)
                                            )
                                            if (task.isPaused) {
                                                Spacer(modifier = Modifier.width(8.dp))
                                                Surface(
                                                    shape = RoundedCornerShape(4.dp),
                                                    color = MaterialTheme.colorScheme.secondaryContainer
                                                ) {
                                                    Text(
                                                        text = "Paused",
                                                        style = MaterialTheme.typography.labelSmall,
                                                        modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                                                    )
                                                }
                                            }
                                        }

                                        if (task.description.isNotBlank()) {
                                            Spacer(modifier = Modifier.height(4.dp))
                                            Text(
                                                text = task.description,
                                                style = MaterialTheme.typography.bodySmall,
                                                color = MaterialTheme.colorScheme.onSurfaceVariant
                                            )
                                        }
                                    }

                                    Row {
                                        IconButton(onClick = { viewModel.toggleTaskPause(task) }) {
                                            Icon(
                                                if (task.isPaused) Icons.Default.PlayArrow else Icons.Default.Pause,
                                                contentDescription = if (task.isPaused) "Resume" else "Pause",
                                                tint = MaterialTheme.colorScheme.primary
                                            )
                                        }
                                        IconButton(onClick = {
                                            taskToEdit = task
                                            showDialog = true
                                        }) {
                                            Icon(Icons.Outlined.Edit, contentDescription = "Edit")
                                        }
                                        IconButton(onClick = { taskToDelete = task }) {
                                            Icon(Icons.Outlined.Delete, contentDescription = "Delete", tint = MaterialTheme.colorScheme.error)
                                        }
                                    }
                                }

                                Spacer(modifier = Modifier.height(10.dp))

                                Row(
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Surface(
                                        shape = RoundedCornerShape(6.dp),
                                        color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f)
                                    ) {
                                        Text(
                                            text = task.category.displayName,
                                            style = MaterialTheme.typography.labelSmall,
                                            color = MaterialTheme.colorScheme.onPrimaryContainer,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }

                                    Text(
                                        text = "• ${task.recurrence.displayName}",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )

                                    if (task.scheduledTime != null) {
                                        Text(
                                            text = "• at ${task.scheduledTime}",
                                            style = MaterialTheme.typography.labelSmall,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }

                                    if (task.goalValue != null && task.goalUnit != null) {
                                        Text(
                                            text = "• Goal: ${task.goalValue.toInt()} ${task.goalUnit}",
                                            style = MaterialTheme.typography.labelSmall,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (showDialog) {
        RoutineDialog(
            task = taskToEdit,
            onDismiss = { showDialog = false },
            onSave = { name, desc, cat, time, reminder, recurrence, days, goalVal, goalUnit ->
                viewModel.saveTask(
                    id = taskToEdit?.id ?: 0L,
                    name = name,
                    description = desc,
                    category = cat,
                    scheduledTime = time,
                    reminderEnabled = reminder,
                    recurrence = recurrence,
                    selectedDaysOfWeek = days,
                    goalValue = goalVal,
                    goalUnit = goalUnit
                )
                showDialog = false
            }
        )
    }

    if (taskToDelete != null) {
        AlertDialog(
            onDismissRequest = { taskToDelete = null },
            title = { Text("Delete Routine?") },
            text = { Text("Are you sure you want to delete \"${taskToDelete?.name}\"? Historical completion logs will remain safe in your records.") },
            confirmButton = {
                Button(
                    onClick = {
                        taskToDelete?.let { viewModel.deleteTask(it) }
                        taskToDelete = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) {
                    Text("Delete")
                }
            },
            dismissButton = {
                TextButton(onClick = { taskToDelete = null }) {
                    Text("Cancel")
                }
            }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RoutineDialog(
    task: WellnessTaskEntity?,
    onDismiss: () -> Unit,
    onSave: (
        name: String,
        description: String,
        category: TaskCategory,
        scheduledTime: String?,
        reminderEnabled: Boolean,
        recurrence: RecurrenceType,
        selectedDays: String,
        goalValue: Float?,
        goalUnit: String?
    ) -> Unit
) {
    var name by remember { mutableStateOf(task?.name ?: "") }
    var description by remember { mutableStateOf(task?.description ?: "") }
    var category by remember { mutableStateOf(task?.category ?: TaskCategory.EXERCISE) }
    var scheduledTime by remember { mutableStateOf(task?.scheduledTime ?: "") }
    var reminderEnabled by remember { mutableStateOf(task?.reminderEnabled ?: false) }
    var recurrence by remember { mutableStateOf(task?.recurrence ?: RecurrenceType.DAILY) }
    var goalValueText by remember { mutableStateOf(task?.goalValue?.toString() ?: "") }
    var goalUnit by remember { mutableStateOf(task?.goalUnit ?: "") }
    var validationError by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(if (task == null) "New Wellness Routine" else "Edit Routine") },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = name,
                    onValueChange = {
                        name = it
                        validationError = ""
                    },
                    label = { Text("Routine Name *") },
                    placeholder = { Text("e.g. Morning Stretch, Walk, Breathe") },
                    modifier = Modifier.fillMaxWidth(),
                    isError = validationError.isNotBlank()
                )

                if (validationError.isNotBlank()) {
                    Text(
                        text = validationError,
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall
                    )
                }

                OutlinedTextField(
                    value = description,
                    onValueChange = { description = it },
                    label = { Text("Description (Optional)") },
                    placeholder = { Text("Notes or motivation") },
                    modifier = Modifier.fillMaxWidth()
                )

                // Category selection
                Text("Category", style = MaterialTheme.typography.labelMedium)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    TaskCategory.values().forEach { cat ->
                        FilterChip(
                            selected = category == cat,
                            onClick = { category = cat },
                            label = { Text(cat.displayName) }
                        )
                    }
                }

                // Recurrence
                Text("Recurrence", style = MaterialTheme.typography.labelMedium)
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    RecurrenceType.values().forEach { rec ->
                        FilterChip(
                            selected = recurrence == rec,
                            onClick = { recurrence = rec },
                            label = { Text(rec.displayName) }
                        )
                    }
                }

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = scheduledTime,
                        onValueChange = { scheduledTime = it },
                        label = { Text("Time (HH:mm)") },
                        placeholder = { Text("08:00") },
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = goalValueText,
                        onValueChange = { goalValueText = it },
                        label = { Text("Goal") },
                        placeholder = { Text("15") },
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = goalUnit,
                        onValueChange = { goalUnit = it },
                        label = { Text("Unit") },
                        placeholder = { Text("min/ml") },
                        modifier = Modifier.weight(1f)
                    )
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Checkbox(
                        checked = reminderEnabled,
                        onCheckedChange = { reminderEnabled = it }
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Remind me before scheduled time", style = MaterialTheme.typography.bodyMedium)
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (name.isBlank()) {
                        validationError = "Please enter a routine name"
                        return@Button
                    }
                    onSave(
                        name.trim(),
                        description.trim(),
                        category,
                        scheduledTime.ifBlank { null },
                        reminderEnabled,
                        recurrence,
                        "1,2,3,4,5,6,7",
                        goalValueText.toFloatOrNull(),
                        goalUnit.ifBlank { null }
                    )
                }
            ) {
                Text("Save")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
