package com.dailywell.app.service

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
            // POST_NOTIFICATIONS permission not granted
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

        fun cancelTaskReminder(context: Context, taskId: Long) {
            WorkManager.getInstance(context).cancelUniqueWork("task_reminder_$taskId")
        }

        fun scheduleHydrationIntervalReminder(context: Context, intervalHours: Long) {
            val data = workDataOf(
                KEY_TITLE to "Hydration Reminder 💧",
                KEY_MESSAGE to "Time for a glass of water to keep your body refreshed!",
                KEY_NOTIFICATION_ID to 2001,
                KEY_CHANNEL_ID to DailyWellApplication.CHANNEL_HYDRATION_ID
            )

            // WorkManager periodic work requires minimum 15 minutes interval
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

        fun scheduleDailyReviewReminder(context: Context, hour: Int = 20, minute: Int = 30) {
            val now = LocalDateTime.now()
            var target = now.with(LocalTime.of(hour, minute, 0))
            if (now.isAfter(target)) {
                target = target.plusDays(1)
            }
            val delaySeconds = Duration.between(now, target).seconds

            val data = workDataOf(
                KEY_TITLE to "Daily Reflection 🌟",
                KEY_MESSAGE to "Review today's wellness accomplishments and wrap up your day.",
                KEY_NOTIFICATION_ID to 3001,
                KEY_CHANNEL_ID to DailyWellApplication.CHANNEL_TASKS_ID
            )

            val request = PeriodicWorkRequestBuilder<DailyReminderWorker>(24, TimeUnit.HOURS)
                .setInputData(data)
                .setInitialDelay(delaySeconds, TimeUnit.SECONDS)
                .build()

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                WORK_DAILY_REVIEW,
                ExistingPeriodicWorkPolicy.UPDATE,
                request
            )
        }

        fun cancelDailyReviewReminder(context: Context) {
            WorkManager.getInstance(context).cancelUniqueWork(WORK_DAILY_REVIEW)
        }
    }
}
