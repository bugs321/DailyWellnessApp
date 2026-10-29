package com.dailywell.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import com.dailywell.app.ui.navigation.DailyWellNavHost
import com.dailywell.app.ui.theme.DailyWellTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val app = application as DailyWellApplication

        setContent {
            val userPrefs by app.repository.userPreferences.collectAsState(initial = null)
            val isDark = when (userPrefs?.preferredTheme) {
                "DARK" -> true
                "LIGHT" -> false
                else -> isSystemInDarkTheme()
            }

            DailyWellTheme(darkTheme = isDark) {
                DailyWellNavHost(app = app)
            }
        }
    }
}
