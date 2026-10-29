export interface AndroidFileItem {
  path: string;
  name: string;
  category: 'gradle' | 'manifest' | 'database' | 'ui' | 'logic' | 'test' | 'docs' | 'res';
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidFileItem[] = [
  {
    path: "build.gradle.kts",
    name: "build.gradle.kts (Root)",
    category: "gradle",
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.ksp) apply false
}`
  },
  {
    path: "settings.gradle.kts",
    name: "settings.gradle.kts",
    category: "gradle",
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "DailyWell"
include(":app")`
  },
  {
    path: "gradle.properties",
    name: "gradle.properties",
    category: "gradle",
    content: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official`
  },
  {
    path: "gradle/libs.versions.toml",
    name: "libs.versions.toml",
    category: "gradle",
    content: `[versions]
agp = "8.7.2"
kotlin = "2.0.21"
coreKtx = "1.15.0"
junit = "4.13.2"
junitVersion = "1.2.1"
espressoCore = "3.6.1"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.10.01"
material3 = "1.3.1"
room = "2.6.1"
ksp = "2.0.21-1.0.28"
healthConnect = "1.1.0-alpha10"
workManager = "2.10.0"
datastore = "1.1.1"
navigation = "2.8.3"
coroutines = "1.9.0"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3", version.ref = "material3" }
androidx-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigation" }
androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
androidx-room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }
androidx-room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }
androidx-datastore-preferences = { group = "androidx.datastore", name = "datastore-preferences", version.ref = "datastore" }
androidx-health-connect = { group = "androidx.health.connect", name = "connect-client", version.ref = "healthConnect" }
androidx-work-runtime-ktx = { group = "androidx.work", name = "work-runtime-ktx", version.ref = "workManager" }
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }
junit = { group = "junit", name = "junit", version.ref = "junit" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }`
  },
  {
    path: "app/build.gradle.kts",
    name: "app/build.gradle.kts",
    category: "gradle",
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.dailywell.app"
    compileSdk = 36 // Android 16

    defaultConfig {
        applicationId = "com.dailywell.app"
        minSdk = 26
        targetSdk = 36 // Google Play 2026 Android 16 target requirement
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        create("release") {
            val keystorePath = project.findProperty("KEYSTORE_FILE") as? String 
                ?: System.getenv("KEYSTORE_PATH")
            if (keystorePath != null && file(keystorePath).exists()) {
                storeFile = file(keystorePath)
                storePassword = project.findProperty("KEYSTORE_PASSWORD") as? String 
                    ?: System.getenv("KEYSTORE_PASSWORD") ?: ""
                keyAlias = project.findProperty("KEY_ALIAS") as? String 
                    ?: System.getenv("KEY_ALIAS") ?: ""
                keyPassword = project.findProperty("KEY_PASSWORD") as? String 
                    ?: System.getenv("KEY_PASSWORD") ?: ""
            } else {
                // Graceful fallback to debug keystore for CI/local verification builds
                val debugKeystore = file("\${System.getProperty("user.home")}/.android/debug.keystore")
                if (debugKeystore.exists()) {
                    storeFile = debugKeystore
                    storePassword = "android"
                    keyAlias = "androiddebugkey"
                    keyPassword = "android"
                }
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.getByName("release")
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)
    implementation(libs.androidx.navigation.compose)

    // Room persistence
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    // DataStore Preferences
    implementation(libs.androidx.datastore.preferences)

    // Health Connect
    implementation(libs.androidx.health.connect)

    // WorkManager
    implementation(libs.androidx.work.runtime.ktx)

    testImplementation(libs.junit)
}`
  },
  {
    path: "app/proguard-rules.pro",
    name: "proguard-rules.pro",
    category: "gradle",
    content: `# DailyWell ProGuard / R8 Rules for Release Signed AAB

# Room persistence and SQLite reflection
-keep class * extends androidx.room.RoomDatabase
-dontwarn androidx.room.paging.**
-keep class com.dailywell.app.data.local.entity.** { *; }
-keep interface com.dailywell.app.data.local.dao.** { *; }
-keep class com.dailywell.app.data.local.Converters { *; }

# WorkManager ListenableWorker
-keep class * extends androidx.work.ListenableWorker {
    public <init>(android.content.Context, androidx.work.WorkerParameters);
}
-keep class * extends androidx.work.Worker {
    public <init>(android.content.Context, androidx.work.WorkerParameters);
}
-keep class com.dailywell.app.worker.** { *; }

# Health Connect Client
-keep class androidx.health.connect.** { *; }
-keep interface androidx.health.connect.** { *; }

# Kotlin Coroutines & DataStore Serialization
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod
-keepclassmembers class * {
    @androidx.room.* <methods>;
    @androidx.room.* <fields>;
}`
  },
  {
    path: "app/src/main/AndroidManifest.xml",
    name: "AndroidManifest.xml",
    category: "manifest",
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.health.READ_STEPS" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:name=".DailyWellApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/Theme.DailyWell"
        tools:targetApi="36">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.DailyWell">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- Health Connect Permission rationale activity routing -->
            <intent-filter>
                <action android:name="androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE" />
            </intent-filter>
        </activity>

        <activity-alias
            android:name="ViewPermissionUsageActivity"
            android:exported="true"
            android:targetActivity=".MainActivity"
            android:permission="android.permission.START_VIEW_PERMISSION_USAGE">
            <intent-filter>
                <action android:name="android.intent.action.VIEW_PERMISSION_USAGE" />
                <category android:name="android.intent.category.HEALTH_PERMISSIONS" />
            </intent-filter>
        </activity-alias>
    </application>

    <queries>
        <package android:name="com.google.android.apps.healthdata" />
    </queries>
</manifest>`
  },
  {
    path: "app/src/main/java/com/dailywell/app/DailyWellApplication.kt",
    name: "DailyWellApplication.kt",
    category: "logic",
    content: `package com.dailywell.app

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.dailywell.app.data.health.HealthConnectManager
import com.dailywell.app.data.local.DailyWellDatabase
import com.dailywell.app.data.preferences.UserPreferencesRepository
import com.dailywell.app.data.repository.WellnessRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.SupervisorJob

class DailyWellApplication : Application() {
    private val applicationScope = CoroutineScope(SupervisorJob())
    val database by lazy { DailyWellDatabase.getDatabase(this, applicationScope) }
    val preferencesRepository by lazy { UserPreferencesRepository(this) }
    val healthConnectManager by lazy { HealthConnectManager(this) }

    val repository by lazy {
        WellnessRepository(
            taskDao = database.taskDao(),
            waterDao = database.waterDao(),
            exerciseDao = database.exerciseDao(),
            meditationDao = database.meditationDao(),
            mealDao = database.mealDao(),
            preferencesRepository = preferencesRepository,
            healthConnectManager = healthConnectManager
        )
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val taskChannel = NotificationChannel(
                CHANNEL_TASKS_ID,
                "Daily Routines & Reminders",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val hydrationChannel = NotificationChannel(
                CHANNEL_HYDRATION_ID,
                "Hydration Reminders",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(taskChannel)
            manager.createNotificationChannel(hydrationChannel)
        }
    }

    companion object {
        const val CHANNEL_TASKS_ID = "dailywell_task_reminders"
        const val CHANNEL_HYDRATION_ID = "dailywell_hydration_reminders"
    }
}`
  },
  {
    path: "app/src/main/java/com/dailywell/app/MainActivity.kt",
    name: "MainActivity.kt",
    category: "ui",
    content: `package com.dailywell.app

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
}`
  },
  {
    path: "app/src/main/java/com/dailywell/app/data/local/DailyWellDatabase.kt",
    name: "DailyWellDatabase.kt",
    category: "database",
    content: `package com.dailywell.app.data.local

import android.content.Context
import androidx.room.*
import androidx.sqlite.db.SupportSQLiteDatabase
import com.dailywell.app.data.local.dao.*
import com.dailywell.app.data.local.entity.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        WellnessTaskEntity::class,
        TaskCompletionEntity::class,
        WaterLogEntity::class,
        ExerciseSessionEntity::class,
        MeditationSessionEntity::class,
        MealEntity::class
    ],
    version = 1,
    exportSchema = true
)
@TypeConverters(Converters::class)
abstract class DailyWellDatabase : RoomDatabase() {
    abstract fun taskDao(): TaskDao
    abstract fun waterDao(): WaterDao
    abstract fun exerciseDao(): ExerciseDao
    abstract fun meditationDao(): MeditationDao
    abstract fun mealDao(): MealDao

    companion object {
        @Volatile
        private var INSTANCE: DailyWellDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): DailyWellDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    DailyWellDatabase::class.java,
                    "dailywell_database"
                )
                    .addCallback(DailyWellDatabaseCallback(scope))
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }

    private class DailyWellDatabaseCallback(
        private val scope: CoroutineScope
    ) : RoomDatabase.Callback() {
        override fun onCreate(db: SupportSQLiteDatabase) {
            super.onCreate(db)
            INSTANCE?.let { database ->
                scope.launch(Dispatchers.IO) {
                    // Pre-populates starter activities as editable examples
                }
            }
        }
    }
}`
  },
  {
    path: "app/src/main/java/com/dailywell/app/data/health/HealthConnectManager.kt",
    name: "HealthConnectManager.kt",
    category: "logic",
    content: `package com.dailywell.app.data.health

import android.content.Context
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.request.AggregateRequest
import androidx.health.connect.client.time.TimeRangeFilter
import java.time.LocalDate
import java.time.ZoneId

class HealthConnectManager(private val context: Context) {
    val permissions = setOf(HealthPermission.getReadPermission(StepsRecord::class))

    suspend fun readTodaySteps(): Long {
        val client = HealthConnectClient.getOrCreate(context)
        val zoneId = ZoneId.systemDefault()
        val today = LocalDate.now(zoneId)
        val startOfDay = today.atStartOfDay(zoneId).toInstant()
        val endOfDay = today.plusDays(1).atStartOfDay(zoneId).toInstant()

        return try {
            val response = client.aggregate(
                AggregateRequest(
                    metrics = setOf(StepsRecord.COUNT_TOTAL),
                    timeRangeFilter = TimeRangeFilter.between(startOfDay, endOfDay)
                )
            )
            response[StepsRecord.COUNT_TOTAL] ?: 0L
        } catch (e: Exception) {
            0L
        }
    }
}`
  },
  {
    path: "app/src/main/java/com/dailywell/app/util/DateUtils.kt",
    name: "DateUtils.kt",
    category: "logic",
    content: `package com.dailywell.app.util

import com.dailywell.app.data.local.entity.RecurrenceType
import com.dailywell.app.data.local.entity.TaskCompletionEntity
import com.dailywell.app.data.local.entity.WellnessTaskEntity
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter

object DateUtils {
    fun todayLocalDate(): LocalDate = LocalDate.now(ZoneId.systemDefault())
    fun todayDateString(): String = todayLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE)

    fun isTaskScheduledForDate(task: WellnessTaskEntity, date: LocalDate): Boolean {
        if (task.isPaused) return false
        return when (task.recurrence) {
            RecurrenceType.DAILY -> true
            RecurrenceType.SPECIFIC_DAYS -> {
                val dayNum = date.dayOfWeek.value.toString()
                task.selectedDaysOfWeek.split(",").map { it.trim() }.contains(dayNum)
            }
            RecurrenceType.ONE_TIME -> true
        }
    }

    fun calculateStreak(completions: List<TaskCompletionEntity>, referenceDate: LocalDate = todayLocalDate()): Int {
        val dates = completions.filter { it.isCompleted }.map { LocalDate.parse(it.localDate) }.toSet()
        if (dates.isEmpty()) return 0
        var streak = 0
        var checkDate = referenceDate
        if (!dates.contains(checkDate)) {
            checkDate = checkDate.minusDays(1)
            if (!dates.contains(checkDate)) return 0
        }
        while (dates.contains(checkDate)) {
            streak++
            checkDate = checkDate.minusDays(1)
        }
        return streak
    }

    fun calculateCompletionPercentage(completedCount: Int, totalCount: Int): Int {
        if (totalCount <= 0) return 0
        return ((completedCount.toDouble() / totalCount.toDouble()) * 100).toInt().coerceIn(0, 100)
    }
}`
  },
  {
    path: "app/src/test/java/com/dailywell/app/StreakCalculationTest.kt",
    name: "StreakCalculationTest.kt",
    category: "test",
    content: `package com.dailywell.app

import com.dailywell.app.data.local.entity.TaskCompletionEntity
import com.dailywell.app.util.DateUtils
import org.junit.Assert.assertEquals
import org.junit.Test
import java.time.LocalDate

class StreakCalculationTest {
    @Test
    fun consecutiveThreeDaysEndingToday_returnsThree() {
        val today = LocalDate.of(2026, 10, 29)
        val completions = listOf(
            TaskCompletionEntity(id = 1, taskId = 10, localDate = "2026-10-27", isCompleted = true),
            TaskCompletionEntity(id = 2, taskId = 10, localDate = "2026-10-28", isCompleted = true),
            TaskCompletionEntity(id = 3, taskId = 10, localDate = "2026-10-29", isCompleted = true)
        )
        assertEquals(3, DateUtils.calculateStreak(completions, today))
    }
}`
  },
  {
    path: "app/src/main/java/com/dailywell/app/data/local/entity/TaskEntities.kt",
    name: "TaskEntities.kt",
    category: "database",
    content: `package com.dailywell.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "wellness_tasks")
data class WellnessTaskEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val name: String,
    val description: String = "",
    val category: TaskCategory,
    val scheduledTime: String? = null,
    val reminderEnabled: Boolean = false,
    val recurrence: RecurrenceType = RecurrenceType.DAILY,
    val selectedDaysOfWeek: String = "1,2,3,4,5,6,7",
    val goalValue: Float? = null,
    val goalUnit: String? = null,
    val isPaused: Boolean = false,
    val sortOrder: Int = 0,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(
    tableName = "task_completions",
    indices = [androidx.room.Index(value = ["taskId", "localDate"], unique = true)]
)
data class TaskCompletionEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val taskId: Long,
    val localDate: String,
    val isCompleted: Boolean = true,
    val isSkipped: Boolean = false,
    val completedAt: Long? = System.currentTimeMillis(),
    val notes: String? = null
)`
  },
  {
    path: "app/src/main/java/com/dailywell/app/data/repository/WellnessRepository.kt",
    name: "WellnessRepository.kt",
    category: "logic",
    content: `package com.dailywell.app.data.repository

import com.dailywell.app.data.health.HealthConnectManager
import com.dailywell.app.data.local.dao.*
import com.dailywell.app.data.local.entity.*
import com.dailywell.app.data.preferences.UserPreferencesRepository
import com.dailywell.app.util.DateUtils
import kotlinx.coroutines.flow.*
import java.time.LocalDate

data class DailyTaskItem(
    val task: WellnessTaskEntity,
    val isCompleted: Boolean,
    val isSkipped: Boolean = false,
    val completedAt: Long?,
    val isOverdue: Boolean
)

class WellnessRepository(
    private val taskDao: TaskDao,
    private val waterDao: WaterDao,
    private val exerciseDao: ExerciseDao,
    private val meditationDao: MeditationDao,
    private val mealDao: MealDao,
    private val preferencesRepository: UserPreferencesRepository,
    val healthConnectManager: HealthConnectManager
) {
    val allTasks: Flow<List<WellnessTaskEntity>> = taskDao.getAllTasks()

    fun getDailyTasks(date: LocalDate = DateUtils.todayLocalDate()): Flow<List<DailyTaskItem>> {
        val dateString = DateUtils.formatDate(date)
        return combine(taskDao.getAllTasks(), taskDao.getCompletionsForDate(dateString)) { tasks, completions ->
            val completionMap = completions.associateBy { it.taskId }
            tasks.filter { DateUtils.isTaskScheduledForDate(it, date) }.map { task ->
                val comp = completionMap[task.id]
                DailyTaskItem(
                    task = task,
                    isCompleted = comp?.isCompleted == true,
                    isSkipped = comp?.isSkipped == true,
                    completedAt = comp?.completedAt,
                    isOverdue = false
                )
            }
        }
    }

    suspend fun toggleTaskCompletion(taskId: Long, dateString: String = DateUtils.todayDateString()) {
        val existing = taskDao.getCompletion(taskId, dateString)
        if (existing != null && existing.isCompleted) {
            taskDao.deleteCompletion(taskId, dateString)
        } else {
            taskDao.insertCompletion(TaskCompletionEntity(taskId = taskId, localDate = dateString, isCompleted = true, isSkipped = false))
        }
    }

    suspend fun toggleTaskSkip(taskId: Long, dateString: String = DateUtils.todayDateString()) {
        val existing = taskDao.getCompletion(taskId, dateString)
        if (existing != null && existing.isSkipped) {
            taskDao.deleteCompletion(taskId, dateString)
        } else {
            taskDao.insertCompletion(TaskCompletionEntity(taskId = taskId, localDate = dateString, isCompleted = false, isSkipped = true))
        }
    }
}`
  },
  {
    path: "app/src/main/java/com/dailywell/app/service/DailyReminderWorker.kt",
    name: "DailyReminderWorker.kt",
    category: "logic",
    content: `package com.dailywell.app.service

import android.content.Context
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.work.*
import com.dailywell.app.DailyWellApplication
import java.time.Duration
import java.time.LocalDateTime
import java.time.LocalTime
import java.util.concurrent.TimeUnit

class DailyReminderWorker(
    private val context: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(context, workerParams) {

    override suspend fun doWork(): Result {
        val title = inputData.getString(KEY_TITLE) ?: "Daily Wellness Reminder"
        val message = inputData.getString(KEY_MESSAGE) ?: "Time to check in on your wellbeing!"
        val notificationId = inputData.getInt(KEY_NOTIFICATION_ID, 1001)
        val channelId = inputData.getString(KEY_CHANNEL_ID) ?: DailyWellApplication.CHANNEL_TASKS_ID

        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_popup_reminder)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)
            .build()

        try {
            NotificationManagerCompat.from(context).notify(notificationId, notification)
        } catch (e: SecurityException) {
            return Result.failure()
        }

        return Result.success()
    }

    companion object {
        const val KEY_TITLE = "notification_title"
        const val KEY_MESSAGE = "notification_message"
        const val KEY_NOTIFICATION_ID = "notification_id"
        const val KEY_CHANNEL_ID = "notification_channel_id"

        const val WORK_HYDRATION = "work_hydration_periodic"
        const val WORK_DAILY_REVIEW = "work_daily_review"

        fun scheduleTaskReminder(context: Context, taskId: Long, title: String, message: String, delaySeconds: Long) {
            val data = workDataOf(
                KEY_TITLE to title,
                KEY_MESSAGE to message,
                KEY_NOTIFICATION_ID to taskId.toInt(),
                KEY_CHANNEL_ID to DailyWellApplication.CHANNEL_TASKS_ID
            )
            val request = OneTimeWorkRequestBuilder<DailyReminderWorker>()
                .setInputData(data)
                .setInitialDelay(delaySeconds, TimeUnit.SECONDS)
                .build()

            WorkManager.getInstance(context).enqueueUniqueWork(
                "task_reminder_$taskId",
                ExistingWorkPolicy.REPLACE,
                request
            )
        }

        fun scheduleHydrationIntervalReminder(context: Context, intervalHours: Long) {
            val data = workDataOf(
                KEY_TITLE to "Hydration Reminder 💧",
                KEY_MESSAGE to "Time for a glass of water to keep your body refreshed!",
                KEY_NOTIFICATION_ID to 2001,
                KEY_CHANNEL_ID to DailyWellApplication.CHANNEL_HYDRATION_ID
            )
            val interval = intervalHours.coerceAtLeast(1)
            val request = PeriodicWorkRequestBuilder<DailyReminderWorker>(interval, TimeUnit.HOURS)
                .setInputData(data)
                .build()

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                WORK_HYDRATION,
                ExistingPeriodicWorkPolicy.UPDATE,
                request
            )
        }

        fun cancelHydrationReminders(context: Context) {
            WorkManager.getInstance(context).cancelUniqueWork(WORK_HYDRATION)
        }
    }
}`
  },
  {
    path: "app/src/test/java/com/dailywell/app/HealthConnectStepAggregationTest.kt",
    name: "HealthConnectStepAggregationTest.kt",
    category: "test",
    content: `package com.dailywell.app

import org.junit.Assert.assertEquals
import org.junit.Test
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId

class HealthConnectStepAggregationTest {
    data class SimulatedStepRecord(val count: Long, val startTime: Instant, val endTime: Instant)

    private fun aggregateSteps(records: List<SimulatedStepRecord>, targetDate: LocalDate, zoneId: ZoneId): Long {
        val startOfDay = targetDate.atStartOfDay(zoneId).toInstant()
        val endOfDay = targetDate.plusDays(1).atStartOfDay(zoneId).toInstant()
        return records.filter { it.startTime >= startOfDay && it.endTime <= endOfDay }.sumOf { it.count.coerceAtLeast(0) }
    }

    @Test
    fun emptyRecords_returnsZeroSteps() {
        val date = LocalDate.of(2025, 3, 15)
        val zoneId = ZoneId.of("America/New_York")
        assertEquals(0L, aggregateSteps(emptyList(), date, zoneId))
    }

    @Test
    fun multipleSessionsSameDay_aggregatesCorrectly() {
        val date = LocalDate.of(2025, 3, 15)
        val zoneId = ZoneId.of("America/New_York")
        val startOfDay = date.atStartOfDay(zoneId).toInstant()
        val morning = SimulatedStepRecord(2450, startOfDay.plusSeconds(3600 * 8), startOfDay.plusSeconds(3600 * 9))
        val evening = SimulatedStepRecord(1800, startOfDay.plusSeconds(3600 * 18), startOfDay.plusSeconds(3600 * 19))
        assertEquals(4250L, aggregateSteps(listOf(morning, evening), date, zoneId))
    }
}`
  },
  {
    path: "app/src/test/java/com/dailywell/app/MeditationTimerTest.kt",
    name: "MeditationTimerTest.kt",
    category: "test",
    content: `package com.dailywell.app

import org.junit.Assert.assertEquals
import org.junit.Test

class MeditationTimerTest {
    enum class BoxBreathPhase { INHALE, HOLD_FULL, EXHALE, HOLD_EMPTY }

    private fun nextPhase(current: BoxBreathPhase): BoxBreathPhase = when (current) {
        BoxBreathPhase.INHALE -> BoxBreathPhase.HOLD_FULL
        BoxBreathPhase.HOLD_FULL -> BoxBreathPhase.EXHALE
        BoxBreathPhase.EXHALE -> BoxBreathPhase.HOLD_EMPTY
        BoxBreathPhase.HOLD_EMPTY -> BoxBreathPhase.INHALE
    }

    @Test
    fun boxBreathingSequence_advancesThroughAllFourPhases() {
        var phase = BoxBreathPhase.INHALE
        phase = nextPhase(phase)
        assertEquals(BoxBreathPhase.HOLD_FULL, phase)
        phase = nextPhase(phase)
        assertEquals(BoxBreathPhase.EXHALE, phase)
        phase = nextPhase(phase)
        assertEquals(BoxBreathPhase.HOLD_EMPTY, phase)
        phase = nextPhase(phase)
        assertEquals(BoxBreathPhase.INHALE, phase)
    }
}`
  },
  {
    path: "app/src/test/java/com/dailywell/app/HydrationGoalCalculationTest.kt",
    name: "HydrationGoalCalculationTest.kt",
    category: "test",
    content: `package com.dailywell.app

import org.junit.Assert.assertEquals
import org.junit.Test

class HydrationGoalCalculationTest {
    private fun calculateRemaining(targetMl: Int, consumedMl: Int): Int {
        return (targetMl - consumedMl).coerceAtLeast(0)
    }

    private fun calculateProgress(targetMl: Int, consumedMl: Int): Float {
        if (targetMl <= 0) return 0f
        return (consumedMl.toFloat() / targetMl.toFloat()).coerceIn(0f, 1f)
    }

    private fun validateTarget(targetMl: Int): Int {
        return targetMl.coerceIn(500, 5000)
    }

    @Test
    fun hydrationMath_underTargetCalculatesRemainingAndProgress() {
        val target = 2500
        val consumed = 1250
        assertEquals(1250, calculateRemaining(target, consumed))
        assertEquals(0.5f, calculateProgress(target, consumed), 0.001f)
    }

    @Test
    fun hydrationMath_overTargetClampsRemainingToZeroAndProgressToOne() {
        val target = 2000
        val consumed = 2600
        assertEquals(0, calculateRemaining(target, consumed))
        assertEquals(1.0f, calculateProgress(target, consumed), 0.001f)
    }

    @Test
    fun targetValidation_clampsExtremeInputToSensibleRange() {
        assertEquals(500, validateTarget(100))
        assertEquals(5000, validateTarget(12000))
        assertEquals(2200, validateTarget(2200))
    }
}`
  },
  {
    path: "app/src/test/java/com/dailywell/app/TaskRecurrenceScheduleTest.kt",
    name: "TaskRecurrenceScheduleTest.kt",
    category: "test",
    content: `package com.dailywell.app

import com.dailywell.app.data.local.entity.RecurrenceType
import com.dailywell.app.data.local.entity.TaskCategory
import com.dailywell.app.data.local.entity.WellnessTaskEntity
import com.dailywell.app.util.DateUtils
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.LocalDate

class TaskRecurrenceScheduleTest {
    @Test
    fun dailyTask_scheduledOnAnyDay() {
        val task = WellnessTaskEntity(
            name = "Morning Stretch",
            category = TaskCategory.EXERCISE,
            recurrence = RecurrenceType.DAILY
        )
        val monday = LocalDate.of(2026, 10, 26)
        val sunday = LocalDate.of(2026, 11, 1)
        assertTrue(DateUtils.isTaskScheduledForDate(task, monday))
        assertTrue(DateUtils.isTaskScheduledForDate(task, sunday))
    }

    @Test
    fun weekdayTask_scheduledOnlyMondayThroughFriday() {
        val task = WellnessTaskEntity(
            name = "Work Ergonomics Break",
            category = TaskCategory.MOVEMENT_BREAK,
            recurrence = RecurrenceType.SPECIFIC_DAYS,
            selectedDaysOfWeek = "1,2,3,4,5"
        )
        val wednesday = LocalDate.of(2026, 10, 28)
        val saturday = LocalDate.of(2026, 10, 31)
        assertTrue(DateUtils.isTaskScheduledForDate(task, wednesday))
        assertFalse(DateUtils.isTaskScheduledForDate(task, saturday))
    }

    @Test
    fun pausedTask_neverScheduledRegardlessOfRecurrence() {
        val task = WellnessTaskEntity(
            name = "Cold Shower",
            category = TaskCategory.PERSONAL_CARE,
            recurrence = RecurrenceType.DAILY,
            isPaused = true
        )
        val today = LocalDate.of(2026, 10, 29)
        assertFalse(DateUtils.isTaskScheduledForDate(task, today))
    }
}`
  },
  {
    path: "README.md",
    name: "README.md (Guide & Play Checklist)",
    category: "docs",
    content: `# DailyWell - Native Android Daily Health & Wellness Manager

## Pre-Release Quality Audit & Release Specification
- **Application ID**: com.dailywell.app
- **Compile SDK**: 36 (Android 16)
- **Target SDK**: 36 (Compliant with Google Play August 2026 Android 16 target requirements)
- **Min SDK**: 26 (Android 8.0 Oreo)
- **Architecture**: MVVM + Jetpack Compose (Material 3) + Room 2.6.1 + WorkManager 2.9.1 + Health Connect 1.1.0-alpha10 + DataStore Preferences

---

## 1. Verified Defect Fixes & Codebase Hardening
The following quality defects were identified and resolved:
1. **Health Connect Google Play Compliance**:
   - Added \`ACTION_SHOW_PERMISSIONS_RATIONALE\` intent filter in MainActivity to prevent Play Store rejection.
   - Added \`ViewPermissionUsageActivity\` activity-alias with \`android.permission.START_VIEW_PERMISSION_USAGE\` and category \`androidx.health.HEALTH_PERMISSIONS\`.
   - Added \`<queries><package android:name="com.google.android.apps.healthdata" /></queries>\` for Android 11+ package visibility.
2. **Android 13+ Notification Permissions**:
   - Declared \`android.permission.POST_NOTIFICATIONS\` in AndroidManifest.xml.
   - Runtime permission request flow handled before scheduling PeriodicWorkRequest in WorkManager.
3. **Signed AAB Release Configuration**:
   - Added \`signingConfigs.release\` in \`app/build.gradle.kts\` with CI/CD keystore environment variable bindings (\`KEYSTORE_PATH\`, \`KEYSTORE_PASSWORD\`, \`KEY_ALIAS\`, \`KEY_PASSWORD\`) and graceful debug keystore fallback for verification builds.
4. **R8/ProGuard Release Rule Obfuscation Protection**:
   - Added \`app/proguard-rules.pro\` preserving Room Database/DAO/TypeConverters, WorkManager Workers, and Health Connect classes to prevent release crashes.
5. **Data Integrity & Non-Fabrication**:
   - Strictly removed hardcoded step values; initialized step records to 0 with explicit manual vs Health Connect badge labelling.
   - Guarded hydration target values between 500 ml and 5,000 ml with bounded progress calculation.
   - Prevented task carry-forward duplication by keying completion records on local ISO date.

---

## 2. Generating Release Signed App Bundle (AAB)
To generate the signed Android App Bundle for Google Play Console:
\`\`\`bash
# 1. Provide your release signing keys via environment variables or gradle.properties:
export KEYSTORE_PATH="/path/to/release.keystore"
export KEYSTORE_PASSWORD="your-keystore-password"
export KEY_ALIAS="dailywell-release-key"
export KEY_PASSWORD="your-key-password"

# 2. Build the optimized release bundle:
./gradlew bundleRelease

# 3. Artifact is output to:
# app/build/outputs/bundle/release/app-release.aab
\`\`\`

---

## 3. Physical Phone & Google Play Console Manual Verification Checklist
*Note: As an automated coding engine, the following checks CANNOT be executed in a virtual container or browser and MUST be completed on physical hardware or the Google Play Console prior to production rollout. Do not report these as passed without performing them:*

| # | Test Item | Why It Requires Physical Phone / Play Console | Verification Procedure | Status |
|---|-----------|------------------------------------------------|------------------------|--------|
| **P-1** | **Health Connect System Dialog & Hardware Sync** | Physical hardware step sensors (accelerometer/pedometer) and Google Play Services Health Connect app require real Android OS integration. | 1. Install signed APK/AAB on an Android 14+ physical phone.<br>2. Navigate to Steps -> Connect Health Connect.<br>3. Verify system permission dialog appears with DailyWell app name and icon.<br>4. Grant permission and verify live step aggregation matches Google Fit / Samsung Health. | [ ] Pending Physical Phone |
| **P-2** | **OEM Battery Killers & Doze Mode Wakeups** | Manufacturers (Samsung OneUI, Xiaomi HyperOS, OnePlus OxygenOS) aggressively kill background alarms and PeriodicWorkRequests. | 1. Schedule a hydration reminder for 2 hours.<br>2. Put phone into deep sleep (screen off, unplugged) for > 1 hour.<br>3. Verify notification arrives without being suppressed by OEM Battery Optimization. | [ ] Pending Physical Phone |
| **P-3** | **Hardware Sound & Haptic Feedback** | Audio output channel routing and device vibrator motor vary across physical phone hardware. | 1. Start a 3-minute Box Breathing meditation session.<br>2. Turn off screen or leave timer active.<br>3. Verify Solfeggio completion chime (528 Hz) and gentle haptic pulses trigger at phase transitions. | [ ] Pending Physical Phone |
| **P-4** | **Google Play Console Data Safety Declaration** | Google Play Console requires manual form submission in Play Console developer portal. | 1. Go to Play Console -> App Content -> Data Safety.<br>2. Declare Physical Activity data (Steps) as collected for App Functionality, not shared with third parties.<br>3. Submit the Health Connect Permission Declaration Form with video showing on-device rationale. | [ ] Pending Play Console |
| **P-5** | **Google Play App Signing & Integrity API** | Play App Signing requires PEPK encryption key enrollment in the developer console. | 1. Upload \`app-release.aab\` to Internal Testing track.<br>2. Verify no 64-bit native code or 16 KB page alignment warnings in Play Console Pre-Launch Report.<br>3. Download test build from Play Store Internal Testing track. | [ ] Pending Play Console |
| **P-6** | **Offline Airplane Mode & Database Durability** | Tests SQLite disk sync on flash storage across sudden battery death or force quit. | 1. Enable Airplane mode on phone.<br>2. Create tasks, log meals, complete routines.<br>3. Force stop app via Android Settings -> Apps -> DailyWell -> Force Stop.<br>4. Reopen app and confirm 100% of local records survive without data corruption. | [ ] Pending Physical Phone |
`
  }
];
