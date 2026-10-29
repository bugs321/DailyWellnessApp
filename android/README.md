# DailyWell - Native Android Daily Health & Wellness Manager

DailyWell is a production-grade native Android application developed with **Kotlin**, **Jetpack Compose**, **Material 3**, **Room** local database persistence, **DataStore Preferences**, and **Android Health Connect**.

It is crafted as a personal lifestyle and habit-tracking manager with zero cloud telemetry, 100% on-device privacy, and no advertising or subscriptions.

---

## 📱 Architecture & Target SDK Specifications
- **Target SDK**: `36` (Android 16, compliant with Google Play's required target SDK standards as of late 2026)
- **Compile SDK**: `36`
- **Min SDK**: `26` (Android 8.0 Oreo, ensuring modern `java.time` support and broad device compatibility)
- **UI Framework**: Jetpack Compose with Material 3 design tokens (`MaterialTheme`, dynamic color, generous spacing, one-handed ergonomically positioned controls)
- **Persistence**: Room Database (`dailywell_database`) with SQLite foreign keys, unique indices, and safe TypeConverters for ISO dates and enum mappings
- **Key-Value Store**: Jetpack DataStore Preferences for user targets, first-day-of-week, notification preferences, and themes
- **Sensor & Health Integrations**: Official Android Health Connect API (`androidx.health.connect:connect-client:1.1.0-alpha10`)
- **Background Tasks**: AndroidX WorkManager for local notification reminders (`POST_NOTIFICATIONS` permission aware)

---

## 📂 Project Directory Structure

```
DailyWell/
├── build.gradle.kts                # Root Gradle configuration
├── settings.gradle.kts             # Subproject & Maven repository definitions
├── gradle.properties               # AndroidX, JVM memory & compiler flags
├── gradle/
│   └── libs.versions.toml          # Gradle Version Catalog (AGP 8.7, Kotlin 2.0, Compose BOM)
└── app/
    ├── build.gradle.kts            # App module build definition (compileSdk 36, targetSdk 36)
    ├── proguard-rules.pro          # Obfuscation & shrinking rules for Room & Health Connect
    └── src/
        ├── main/
        │   ├── AndroidManifest.xml # Health Connect, Notification, and Privacy declarations
        │   ├── java/com/dailywell/app/
        │   │   ├── DailyWellApplication.kt        # App lifecycle & notification channels
        │   │   ├── MainActivity.kt                # Compose entry point & Edge-to-Edge setup
        │   │   ├── data/
        │   │   │   ├── local/
        │   │   │   │   ├── DailyWellDatabase.kt   # Room database with initial seed routines
        │   │   │   │   ├── Converters.kt          # Room TypeConverters
        │   │   │   │   ├── entity/
        │   │   │   │   │   ├── Enums.kt           # TaskCategory, RecurrenceType, MealType
        │   │   │   │   │   ├── TaskEntities.kt    # WellnessTaskEntity & TaskCompletionEntity
        │   │   │   │   │   └── ActivityEntities.kt# WaterLog, Exercise, Meditation, Meal
        │   │   │   │   └── dao/
        │   │   │   │       ├── TaskDao.kt
        │   │   │   │       ├── WaterDao.kt
        │   │   │   │       ├── ExerciseDao.kt
        │   │   │   │       ├── MeditationDao.kt
        │   │   │   │       └── MealDao.kt
        │   │   │   ├── preferences/
        │   │   │   │   └── UserPreferencesRepository.kt
        │   │   │   ├── health/
        │   │   │   │   └── HealthConnectManager.kt # Step record reader & local-day aggregator
        │   │   │   └── repository/
        │   │   │       └── WellnessRepository.kt   # Single source of truth
        │   │   ├── service/
        │   │   │   └── DailyReminderWorker.kt      # WorkManager scheduled notifications
        │   │   ├── ui/
        │   │   │   ├── theme/
        │   │   │   │   ├── Color.kt
        │   │   │   │   ├── Type.kt
        │   │   │   │   └── Theme.kt
        │   │   │   ├── navigation/
        │   │   │   │   ├── Screen.kt
        │   │   │   │   └── DailyWellNavHost.kt
        │   │   │   └── screens/
        │   │   │       ├── today/ (TodayScreen & TodayViewModel)
        │   │   │       ├── routines/ (RoutinesScreen & RoutinesViewModel)
        │   │   │       ├── water/ (WaterScreen & WaterViewModel)
        │   │   │       ├── steps/ (StepsScreen & StepsViewModel)
        │   │   │       ├── meditation/ (MeditationScreen & MeditationViewModel)
        │   │   │       ├── exercise/ (ExerciseScreen & ExerciseViewModel)
        │   │   │       ├── food/ (FoodJournalScreen & FoodJournalViewModel)
        │   │   │       ├── insights/ (InsightsScreen & InsightsViewModel)
        │   │   │       └── settings/ (SettingsScreen & SettingsViewModel)
        │   │   └── util/
        │   │       ├── DateUtils.kt    # Pure functions for streaks, percentage, schedules
        │   │       └── CsvExporter.kt  # Full offline CSV backup generator
        │   └── res/
        │       ├── values/ (strings.xml, colors.xml, themes.xml)
        │       └── xml/ (data_extraction_rules.xml, backup_rules.xml)
        └── test/java/com/dailywell/app/
            ├── DailyCompletionPercentageTest.kt
            ├── RecurringTaskSchedulerTest.kt
            ├── StreakCalculationTest.kt
            └── LocalDateAndWaterTest.kt
```

---

## 🏃 Opening & Building in Android Studio

1. Open **Android Studio** (Ladybug 2024.2+ or Meerkat recommended).
2. Select **Open** and choose this project folder (`android/`).
3. Allow Gradle to sync dependencies via `libs.versions.toml`.
4. Run on an Android 14, 15, or 16 emulator (API 34-36) or physical Android device.

---

## 🩺 Testing Health Connect & Step Records

DailyWell utilizes Android Health Connect for private, battery-friendly reading of verified step count records.

1. **On Android 14+**: Health Connect is built directly into Android Settings (`Settings -> Security & Privacy -> Health Connect`).
2. **On Android 13 or earlier**: Install the Health Connect app from Google Play.
3. **Using Health Connect Toolbox for Testing**:
   - Install **Health Connect Toolbox** from Google Play or ADB onto your test device/emulator.
   - In Health Connect Toolbox, insert test `Steps` records (e.g. 5,420 steps for today).
   - In DailyWell, open the **Daily Steps** screen. Tap **Connect Step Data**.
   - DailyWell presents an on-device permission rationale dialog before requesting `android.permission.health.READ_STEPS`.
   - Once permitted, DailyWell queries and aggregates the records within today's local midnight-to-midnight boundary without double-counting.
   - If Health Connect is unavailable on the device, DailyWell provides a clear fallback for manual step logging, explicitly tagged as **Manually Entered**.

---

## 🔔 Testing Notifications & Scheduling

- DailyWell targets API 36, requiring the runtime permission `android.permission.POST_NOTIFICATIONS` on Android 13+.
- To test notifications via ADB:
  ```bash
  adb shell cmd jobscheduler run -f com.dailywell.app <JOB_ID>
  ```
  Or trigger the WorkManager worker directly inside unit/instrumentation tests.
- DailyWell creates two distinct notification channels in `DailyWellApplication.kt`:
  - `dailywell_task_reminders`: Routine reminders
  - `dailywell_hydration_reminders`: Hydration breaks

---

## 📦 Building a Signed Release Android App Bundle (AAB)

To prepare for Google Play distribution:

1. Generate a production keystore (if not already existing):
   ```bash
   keytool -genkey -v -keystore dailywell-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias dailywell
   ```
2. Configure release signing in `app/build.gradle.kts` using environment variables or a local `keystore.properties`:
   ```kotlin
   signingConfigs {
       create("release") {
           storeFile = file(System.getenv("KEYSTORE_PATH") ?: "dailywell-release-key.jks")
           storePassword = System.getenv("KEYSTORE_PASSWORD")
           keyAlias = System.getenv("KEY_ALIAS")
           keyPassword = System.getenv("KEY_PASSWORD")
       }
   }
   ```
3. Run the Gradle release bundle command:
   ```bash
   ./gradlew bundleRelease
   ```
4. Output file location:
   `app/build/outputs/bundle/release/app-release.aab`

---

## 🛡️ Google Play Health Declaration & Compliance Checklist

When publishing to Google Play:
1. **Health Apps Declaration**: Declare that DailyWell uses the Health Connect `READ_STEPS` permission solely for personal fitness and habit tracking.
2. **Privacy Policy**: Link to your privacy policy demonstrating that health data is processed entirely on the user's device and never sold or shared.
3. **Rationale Activity**: DailyWell includes the mandatory `androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE` intent filter and `VIEW_PERMISSION_USAGE` activity alias in `AndroidManifest.xml`.
4. **Medical Disclaimer**: DailyWell features an explicit in-app disclaimer affirming that the app is for wellness habit tracking and does not provide clinical diagnoses or treatments.
