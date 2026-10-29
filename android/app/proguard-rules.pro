# Keep Room annotations & models
-keep class androidx.room.** { *; }
-keep class * extends androidx.room.RoomDatabase
-dontwarn androidx.room.paging.**

# Keep Health Connect data classes
-keep class androidx.health.connect.client.** { *; }

# Keep DataStore
-keepclassmembers class * extends androidx.datastore.preferences.core.Preferences { *; }
