package com.dailywell.app.ui.screens.meditation

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MeditationScreen(
    viewModel: MeditationViewModel,
    onNavigateUp: () -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    val minutes = state.remainingSeconds / 60
    val seconds = state.remainingSeconds % 60
    val timeFormatted = String.format("%02d:%02d", minutes, seconds)

    // Animated breathing scale
    val targetScale = when (state.breathingPhase) {
        "Inhale" -> 1.35f
        "Hold" -> 1.35f
        "Exhale" -> 0.85f
        else -> 0.85f
    }
    val animatedScale by animateFloatAsState(
        targetValue = if (state.isRunning) targetScale else 1.0f,
        animationSpec = tween(durationMillis = 3800, easing = FastOutSlowInEasing),
        label = "breathScale"
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Mindfulness & Breathwork", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateUp) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
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
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            // Duration selector
            item {
                Text(
                    text = "Select Session Duration",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf(1, 3, 5, 10, 15).forEach { mins ->
                        FilterChip(
                            selected = state.selectedMinutes == mins,
                            onClick = { viewModel.selectDuration(mins) },
                            enabled = !state.isRunning,
                            label = { Text("$mins min") },
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }

            // Central Animated Breathing Orb
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f))
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 36.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Box(
                            modifier = Modifier
                                .size(200.dp)
                                .scale(animatedScale)
                                .clip(CircleShape)
                                .background(Color(0xFF8E24AA).copy(alpha = 0.18f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(130.dp)
                                    .clip(CircleShape)
                                    .background(Color(0xFF8E24AA).copy(alpha = 0.4f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text(
                                        text = timeFormatted,
                                        style = MaterialTheme.typography.headlineLarge.copy(fontWeight = FontWeight.Bold, fontSize = 32.sp),
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                    if (state.isRunning) {
                                        Text(
                                            text = state.breathingPhase,
                                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                                            color = Color(0xFF8E24AA)
                                        )
                                    }
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        if (state.isFinished) {
                            Text(
                                text = "Session complete! Logged to your daily records.",
                                style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Medium),
                                color = MaterialTheme.colorScheme.primary
                            )
                        } else {
                            Text(
                                text = if (state.isRunning) "Follow the natural rhythm of the expanding circle." else "Box Breathing: 4s Inhale • 4s Hold • 4s Exhale • 4s Hold",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        Spacer(modifier = Modifier.height(20.dp))

                        // Controls: Play / Pause / Reset
                        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                            if (!state.isRunning) {
                                Button(
                                    onClick = { viewModel.startTimer() },
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF8E24AA))
                                ) {
                                    Icon(Icons.Filled.PlayArrow, contentDescription = null)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("Begin")
                                }
                            } else {
                                Button(
                                    onClick = { viewModel.pauseTimer() },
                                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary)
                                ) {
                                    Icon(Icons.Filled.Pause, contentDescription = null)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("Pause")
                                }
                            }

                            OutlinedButton(onClick = { viewModel.resetTimer() }) {
                                Icon(Icons.Filled.Refresh, contentDescription = null)
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Reset")
                            }
                        }
                    }
                }
            }

            // Today's total summary
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Today's Mindfulness", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold))
                            Text(
                                "${state.completedSessionsToday.size} session(s) completed",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Text(
                            "${state.totalMinutesToday} mins",
                            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
                            color = Color(0xFF8E24AA)
                        )
                    }
                }
            }
        }
    }
}
