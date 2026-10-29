import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { generateCsvExport } from '../utils/dateHelper';
import {
  Settings,
  Download,
  Trash2,
  ShieldCheck,
  HeartHandshake,
  Sun,
  Moon,
  Calendar,
  AlertTriangle,
  Info,
  Check,
  X,
  FileSpreadsheet,
  Bell,
  Clock,
  Sparkles,
  Droplets,
  Zap
} from 'lucide-react';

interface SettingsViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  onEraseAllData: () => void;
  allAppData: {
    tasks: any[];
    completions: any[];
    waterLogs: any[];
    exerciseSessions: any[];
    meditationSessions: any[];
    meals: any[];
  };
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  preferences,
  onUpdatePreferences,
  onEraseAllData,
  allAppData,
}) => {
  const [showEraseModal, setShowEraseModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [csvDownloaded, setCsvDownloaded] = useState(false);
  const [testNotificationToast, setTestNotificationToast] = useState<string | null>(null);

  const handleDownloadCsv = () => {
    const csvContent = generateCsvExport(allAppData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DailyWell_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setCsvDownloaded(true);
    setTimeout(() => setCsvDownloaded(false), 2500);
  };

  const handleTestReminder = async () => {
    const msg = '💧 DailyWell Hydration Reminder: Time for a refreshing glass of water!';
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification('DailyWell Reminder', {
            body: 'Time for a refreshing glass of water to keep your energy balanced!',
            icon: '/favicon.ico',
          });
        } catch {
          // fallback to toast
        }
      } else if (Notification.permission !== 'denied') {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          new Notification('DailyWell Reminder', {
            body: 'Reminders enabled successfully!',
          });
        }
      }
    }

    setTestNotificationToast(msg);
    setTimeout(() => setTestNotificationToast(null), 3500);
  };

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto">
      {/* Toast Preview */}
      {testNotificationToast && (
        <div className="fixed top-16 right-4 left-4 sm:left-auto sm:w-96 z-50 p-4 rounded-2xl bg-stone-900 text-white shadow-2xl border border-stone-700 flex items-start gap-3 animate-bounce">
          <Bell className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-bold block text-sm">Sample Notification Preview</span>
            <p className="text-stone-300 mt-0.5">{testNotificationToast}</p>
          </div>
          <button
            onClick={() => setTestNotificationToast(null)}
            className="text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-xs font-semibold tracking-wider uppercase text-emerald-700 dark:text-emerald-400">
          Preferences & Data
        </span>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Settings & Privacy</h1>
      </div>

      {/* Scheduled Reminders & Background Work Section */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Scheduled Reminders
              </h2>
              <p className="text-xs text-stone-500">Android WorkManager & notifications</p>
            </div>
          </div>

          <button
            onClick={handleTestReminder}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            Test Sample Reminder
          </button>
        </div>

        <div className="space-y-4 text-xs pt-1">
          {/* Master Notifications Toggle */}
          <div className="flex items-center justify-between py-1">
            <div>
              <span className="font-semibold text-stone-800 dark:text-stone-200 block text-sm">
                Enable Daily Notifications
              </span>
              <span className="text-stone-500">
                Requires POST_NOTIFICATIONS permission on Android 13+
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notificationsEnabled ?? true}
                onChange={(e) => onUpdatePreferences({ notificationsEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Hydration Reminders Interval */}
          <div className="border-t border-stone-100 dark:border-stone-800 pt-3 flex items-center justify-between">
            <div>
              <span className="font-semibold text-stone-800 dark:text-stone-200 block text-sm">
                Hydration Check-ins
              </span>
              <span className="text-stone-500">
                Optional periodic nudge to drink water
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                disabled={!(preferences.notificationsEnabled ?? true)}
                value={preferences.hydrationIntervalHours}
                onChange={(e) =>
                  onUpdatePreferences({ hydrationIntervalHours: parseInt(e.target.value, 10) })
                }
                className="px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium text-xs disabled:opacity-50"
              >
                <option value={1}>Every 1 hour</option>
                <option value={1.5}>Every 1.5 hours</option>
                <option value={2}>Every 2 hours</option>
                <option value={3}>Every 3 hours</option>
                <option value={4}>Every 4 hours</option>
              </select>
            </div>
          </div>

          {/* Daily Evening Review Reminder */}
          <div className="border-t border-stone-100 dark:border-stone-800 pt-3 flex items-center justify-between">
            <div>
              <span className="font-semibold text-stone-800 dark:text-stone-200 block text-sm">
                Evening Reflection Reminder
              </span>
              <span className="text-stone-500">
                Review completed habits and check off your day
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="time"
                disabled={!(preferences.notificationsEnabled ?? true)}
                value={preferences.dailyReviewReminderTime ?? '20:30'}
                onChange={(e) => onUpdatePreferences({ dailyReviewReminderTime: e.target.value })}
                className="px-2 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-mono text-xs disabled:opacity-50"
              />
            </div>
          </div>

          {/* Android Background Execution Note */}
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 text-[11px] text-stone-500 space-y-1">
            <span className="font-semibold text-stone-700 dark:text-stone-300 block">
              ⚡ Battery-Friendly Architecture:
            </span>
            <p>
              DailyWell runs all reminders through Android <code>WorkManager</code> with standard <code>ExistingPeriodicWorkPolicy.UPDATE</code>. No battery-draining wake locks, persistent foreground services, or continuous sensor loops are kept open in the background.
            </p>
          </div>
        </div>
      </div>

      {/* Daily Targets Configuration */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Daily Targets & Limits
        </h2>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-1">
            <div>
              <span className="font-semibold text-stone-800 dark:text-stone-200 block text-sm">
                Daily Water Target
              </span>
              <span className="text-stone-500">Configured hydration goal (500 - 8,000 ml)</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="50"
                min="500"
                max="8000"
                value={preferences.dailyWaterGoalMl}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    onUpdatePreferences({ dailyWaterGoalMl: Math.max(500, Math.min(8000, val)) });
                  }
                }}
                className="w-24 px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-right font-mono font-semibold"
              />
              <span className="text-stone-500 text-xs">ml</span>
            </div>
          </div>

          <div className="border-t border-stone-100 dark:border-stone-800 pt-3 flex items-center justify-between">
            <div>
              <span className="font-semibold text-stone-800 dark:text-stone-200 block text-sm">
                Daily Step Target
              </span>
              <span className="text-stone-500">Health Connect / Pedometer goal (1,000 - 100,000)</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="500"
                min="1000"
                max="100000"
                value={preferences.dailyStepGoal}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    onUpdatePreferences({ dailyStepGoal: Math.max(1000, Math.min(100000, val)) });
                  }
                }}
                className="w-24 px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-right font-mono font-semibold"
              />
              <span className="text-stone-500 text-xs">steps</span>
            </div>
          </div>

          <div className="border-t border-stone-100 dark:border-stone-800 pt-3 flex items-center justify-between">
            <div>
              <span className="font-semibold text-stone-800 dark:text-stone-200 block text-sm">
                Daily Exercise Target
              </span>
              <span className="text-stone-500">Active movement & workout duration (5 - 180 min)</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="5"
                min="5"
                max="180"
                value={preferences.dailyExerciseGoalMinutes}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    onUpdatePreferences({
                      dailyExerciseGoalMinutes: Math.max(5, Math.min(180, val)),
                    });
                  }
                }}
                className="w-24 px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-right font-mono font-semibold"
              />
              <span className="text-stone-500 text-xs">min</span>
            </div>
          </div>

          <div className="border-t border-stone-100 dark:border-stone-800 pt-3 flex items-center justify-between">
            <div>
              <span className="font-semibold text-stone-800 dark:text-stone-200 block text-sm">
                Daily Meditation Target
              </span>
              <span className="text-stone-500">Mindfulness and breathing duration (1 - 120 min)</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="5"
                min="1"
                max="120"
                value={preferences.dailyMeditationGoalMinutes}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    onUpdatePreferences({
                      dailyMeditationGoalMinutes: Math.max(1, Math.min(120, val)),
                    });
                  }
                }}
                className="w-24 px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-right font-mono font-semibold"
              />
              <span className="text-stone-500 text-xs">min</span>
            </div>
          </div>
        </div>
      </div>

      {/* App Preferences */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Appearance & Calendar
        </h2>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-1">
            <div>
              <span className="font-semibold text-stone-800 dark:text-stone-200 block text-sm">
                Theme Appearance
              </span>
              <span className="text-stone-500">Material 3 light or dark style</span>
            </div>
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
              {(['Light', 'Dark', 'System'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => onUpdatePreferences({ preferredTheme: t })}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    preferences.preferredTheme === t
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-stone-100 dark:border-stone-800 pt-3 flex items-center justify-between">
            <div>
              <span className="font-semibold text-stone-800 dark:text-stone-200 block text-sm">
                First Day of the Week
              </span>
              <span className="text-stone-500">Calendar & streak display</span>
            </div>
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
              {(['Monday', 'Sunday'] as const).map((day) => (
                <button
                  key={day}
                  onClick={() => onUpdatePreferences({ firstDayOfWeek: day })}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    preferences.firstDayOfWeek === day
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data Management & Export */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
          Your Data & Export
        </h2>

        <button
          onClick={handleDownloadCsv}
          className="w-full p-3 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-stone-900 dark:text-white block">
                Export Records to CSV
              </span>
              <span className="text-xs text-stone-500">Download your logs for personal backup</span>
            </div>
          </div>
          {csvDownloaded ? (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Downloaded
            </span>
          ) : (
            <Download className="w-4 h-4 text-stone-400" />
          )}
        </button>

        <button
          onClick={() => setShowPrivacyModal(true)}
          className="w-full p-3 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-stone-900 dark:text-white block">
                Privacy Notice & Local Storage
              </span>
              <span className="text-xs text-stone-500">100% on-device SQLite database, no cloud telemetry</span>
            </div>
          </div>
          <Info className="w-4 h-4 text-stone-400" />
        </button>

        <button
          onClick={() => setShowDisclaimerModal(true)}
          className="w-full p-3 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-stone-900 dark:text-white block">
                Wellness & Medical Disclaimer
              </span>
              <span className="text-xs text-stone-500">DailyWell is a lifestyle habit app, not medical advice</span>
            </div>
          </div>
          <Info className="w-4 h-4 text-stone-400" />
        </button>

        <button
          onClick={() => setShowEraseModal(true)}
          className="w-full p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400 block">
                Erase All Stored Data
              </span>
              <span className="text-xs text-stone-500">Permanently delete all habits, water logs, and records</span>
            </div>
          </div>
          <AlertTriangle className="w-4 h-4 text-red-500 opacity-60 group-hover:opacity-100" />
        </button>
      </div>

      {/* Erase Modal */}
      {showEraseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                Erase All Stored Data?
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                This will permanently delete all your routines, completions, hydration logs, workouts, meditation sessions, meals, and custom goals from local storage. This action cannot be reversed.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEraseModal(false)}
                className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onEraseAllData();
                  setShowEraseModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                Yes, Erase Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Notice Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  Privacy & Data Architecture
                </h3>
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="p-1 rounded-full text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-stone-600 dark:text-stone-400 space-y-3 leading-relaxed">
              <p>
                <strong>100% Offline & Local:</strong> DailyWell stores all your activities, hydration logs, exercise sessions, and habits inside an on-device Room SQLite database.
              </p>
              <p>
                <strong>Health Connect Privacy:</strong> When you grant the <code className="font-mono text-[11px]">READ_STEPS</code> permission, DailyWell reads aggregated step intervals locally. Your step data is never sent to external servers or analytics platforms.
              </p>
              <p>
                <strong>Zero Advertisements & Trackers:</strong> DailyWell has no tracking libraries, third-party advertising SDKs, or cloud synchronization telemetry.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-semibold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wellness Disclaimer Modal */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  Wellness & Lifestyle Disclaimer
                </h3>
              </div>
              <button
                onClick={() => setShowDisclaimerModal(false)}
                className="p-1 rounded-full text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-stone-600 dark:text-stone-400 space-y-3 leading-relaxed">
              <p>
                <strong>General Habit & Wellness Tracking Only:</strong> DailyWell is designed strictly to support self-motivated healthy habits, mindful breathing, physical movement, and routine hydration.
              </p>
              <p>
                <strong>Not a Medical Device:</strong> DailyWell is not intended for the diagnosis, cure, mitigation, treatment, or prevention of any disease or medical condition.
              </p>
              <p>
                Always consult your healthcare provider or qualified physician for any medical concerns, diet restrictions, or personalized exercise guidelines.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowDisclaimerModal(false)}
                className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-semibold"
              >
                I Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
