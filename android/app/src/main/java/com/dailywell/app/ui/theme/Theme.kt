package com.dailywell.app.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = SageGreen80,
    onPrimary = SageGreen40,
    primaryContainer = SoftMintContainerDark,
    onPrimaryContainer = SoftMintOnContainerDark,
    secondary = Eucalyptus80,
    onSecondary = Eucalyptus40,
    background = CalmingBackgroundDark,
    surface = CalmingSurfaceDark,
    onBackground = CalmingOnSurfaceDark,
    onSurface = CalmingOnSurfaceDark
)

private val LightColorScheme = lightColorScheme(
    primary = SageGreen40,
    onPrimary = androidx.compose.ui.graphics.Color.White,
    primaryContainer = SoftMintContainerLight,
    onPrimaryContainer = SoftMintOnContainerLight,
    secondary = Eucalyptus40,
    onSecondary = androidx.compose.ui.graphics.Color.White,
    background = CalmingBackgroundLight,
    surface = CalmingSurfaceLight,
    onBackground = CalmingOnSurfaceLight,
    onSurface = CalmingOnSurfaceLight
)

@Composable
fun DailyWellTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
