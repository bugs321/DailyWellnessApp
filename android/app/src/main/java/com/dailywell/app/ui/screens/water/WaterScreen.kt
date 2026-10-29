package com.dailywell.app.ui.screens.water

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.dailywell.app.data.local.entity.WaterLogEntity
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WaterScreen(
    viewModel: WaterViewModel,
    onNavigateUp: () -> Unit
) {
    val state by viewModel.uiState.collectAsState()
    var showCustomDialog by remember { mutableStateOf(false) }
    var showTargetDialog by remember { mutableStateOf(false) }
    var logToDelete by remember { mutableStateOf<WaterLogEntity?>(null) }

    val remainingMl = (state.targetMl - state.todayMl).coerceAtLeast(0)
    val progress = (state.todayMl.toFloat() / state.targetMl.coerceAtLeast(1)).coerceIn(0f, 1f)
    val timeFormatter = remember { SimpleDateFormat("hh:mm a", Locale.getDefault()) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Hydration Tracker", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateUp) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = { showTargetDialog = true }) {
                        Icon(Icons.Outlined.Tune, contentDescription = "Adjust Target")
                    }
                },
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
            // Main Water Visual Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF0288D1).copy(alpha = 0.12f))
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            Icons.Filled.WaterDrop,
                            contentDescription = null,
                            tint = Color(0xFF0288D1),
                            modifier = Modifier.size(48.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "${state.todayMl} ml",
                            style = MaterialTheme.typography.headlineLarge.copy(fontWeight = FontWeight.Bold),
                            color = Color(0xFF01579B)
                        )
                        Text(
                            text = if (remainingMl > 0) "$remainingMl ml left to reach goal (${state.targetMl} ml)" else "Target reached today! (${state.targetMl} ml)",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        LinearProgressIndicator(
                            progress = { progress },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(12.dp)
                                .clip(RoundedCornerShape(6.dp)),
                            color = Color(0xFF0288D1),
                            trackColor = Color(0xFF0288D1).copy(alpha = 0.2f)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "${(progress * 100).toInt()}% completed",
                            style = MaterialTheme.typography.labelMedium,
                            color = Color(0xFF01579B)
                        )
                    }
                }
            }

            // Quick Add Buttons
            item {
                Text("Quick Add", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold))
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = { viewModel.addWater(150) },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0288D1))
                    ) {
                        Text("+150 ml")
                    }
                    Button(
                        onClick = { viewModel.addWater(250) },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0288D1))
                    ) {
                        Text("+250 ml")
                    }
                    Button(
                        onClick = { viewModel.addWater(500) },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0288D1))
                    ) {
                        Text("+500 ml")
                    }
                    OutlinedButton(
                        onClick = { showCustomDialog = true },
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Custom")
                    }
                }
            }

            // Log entries
            item {
                Text("Today's Hydration Log", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold))
            }

            if (state.logs.isEmpty()) {
                item {
                    Text(
                        text = "No water intake logged yet today. Tap above to record your first glass!",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else {
                items(state.logs, key = { it.id }) { log ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f))
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp, vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Filled.WaterDrop, contentDescription = null, tint = Color(0xFF0288D1), modifier = Modifier.size(20.dp))
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(
                                        text = "${log.amountMl} ml",
                                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold)
                                    )
                                    Text(
                                        text = timeFormatter.format(Date(log.timestamp)),
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                            IconButton(onClick = { logToDelete = log }) {
                                Icon(Icons.Outlined.Delete, contentDescription = "Delete entry", tint = MaterialTheme.colorScheme.error)
                            }
                        }
                    }
                }
            }
        }
    }

    if (showCustomDialog) {
        var customAmountText by remember { mutableStateOf("") }
        AlertDialog(
            onDismissRequest = { showCustomDialog = false },
            title = { Text("Log Custom Water") },
            text = {
                OutlinedTextField(
                    value = customAmountText,
                    onValueChange = { customAmountText = it.filter { char -> char.isDigit() } },
                    label = { Text("Amount (ml)") },
                    placeholder = { Text("e.g. 350") },
                    singleLine = true
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        val amount = customAmountText.toIntOrNull()
                        if (amount != null && amount > 0) {
                            viewModel.addWater(amount)
                            showCustomDialog = false
                        }
                    }
                ) {
                    Text("Add")
                }
            },
            dismissButton = {
                TextButton(onClick = { showCustomDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    if (showTargetDialog) {
        var targetText by remember { mutableStateOf(state.targetMl.toString()) }
        AlertDialog(
            onDismissRequest = { showTargetDialog = false },
            title = { Text("Adjust Daily Water Goal") },
            text = {
                Column {
                    Text("Configure your personal daily hydration goal in millilitres.")
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = targetText,
                        onValueChange = { targetText = it.filter { char -> char.isDigit() } },
                        label = { Text("Daily Target (ml)") },
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val target = targetText.toIntOrNull()
                        if (target != null && target >= 500) {
                            viewModel.updateTarget(target)
                            showTargetDialog = false
                        }
                    }
                ) {
                    Text("Save Goal")
                }
            },
            dismissButton = {
                TextButton(onClick = { showTargetDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    if (logToDelete != null) {
        AlertDialog(
            onDismissRequest = { logToDelete = null },
            title = { Text("Delete Entry?") },
            text = { Text("Delete this log of ${logToDelete?.amountMl} ml?") },
            confirmButton = {
                Button(
                    onClick = {
                        logToDelete?.let { viewModel.deleteLog(it.id) }
                        logToDelete = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) {
                    Text("Delete")
                }
            },
            dismissButton = {
                TextButton(onClick = { logToDelete = null }) {
                    Text("Cancel")
                }
            }
        )
    }
}
