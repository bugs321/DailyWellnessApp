/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  WellnessTask,
  TaskCompletion,
  WaterLog,
  ExerciseSession,
  MeditationSession,
  MealEntry,
  UserPreferences,
  StepLog,
} from './types';
import { INITIAL_PREFERENCES, STARTER_TASKS } from './data/initialData';
import { getTodayDateString } from './utils/dateHelper';
import { TodayView } from './components/TodayView';
import { RoutinesView } from './components/RoutinesView';
import { WaterView } from './components/WaterView';
import { StepsView } from './components/StepsView';
import { MeditationView } from './components/MeditationView';
import { ExerciseView } from './components/ExerciseView';
import { FoodJournalView } from './components/FoodJournalView';
import { InsightsView } from './components/InsightsView';
import { SettingsView } from './components/SettingsView';
import { AndroidProjectModal } from './components/AndroidProjectModal';

import {
  CalendarDays,
  CheckSquare,
  BarChart2,
  Settings as SettingsIcon,
  Smartphone,
  Sparkles,
  Download
} from 'lucide-react';

export default function App() {
  // Local storage state keys
  const [tasks, setTasks] = useState<WellnessTask[]>(() => {
    const saved = localStorage.getItem('dailywell_tasks');
    return saved ? JSON.parse(saved) : STARTER_TASKS;
  });

  const [completions, setCompletions] = useState<TaskCompletion[]>(() => {
    const saved = localStorage.getItem('dailywell_completions');
    return saved ? JSON.parse(saved) : [
      { taskId: 'starter-1', date: getTodayDateString(), isCompleted: true, completedAt: Date.now() - 3600000 * 2 }
    ];
  });

  const [waterLogs, setWaterLogs] = useState<WaterLog[]>(() => {
    const saved = localStorage.getItem('dailywell_water');
    return saved ? JSON.parse(saved) : [
      { id: 'w1', amountMl: 250, timestamp: Date.now() - 3600000 * 3, date: getTodayDateString() },
      { id: 'w2', amountMl: 500, timestamp: Date.now() - 3600000 * 1, date: getTodayDateString() }
    ];
  });

  const [exerciseSessions, setExerciseSessions] = useState<ExerciseSession[]>(() => {
    const saved = localStorage.getItem('dailywell_exercise');
    return saved ? JSON.parse(saved) : [
      { id: 'e1', workoutType: 'Brisk Walking', durationMinutes: 20, distanceKm: 1.8, timestamp: Date.now() - 3600000 * 4, date: getTodayDateString() }
    ];
  });

  const [meditationSessions, setMeditationSessions] = useState<MeditationSession[]>(() => {
    const saved = localStorage.getItem('dailywell_meditation');
    return saved ? JSON.parse(saved) : [];
  });

  const [meals, setMeals] = useState<MealEntry[]>(() => {
    const saved = localStorage.getItem('dailywell_meals');
    return saved ? JSON.parse(saved) : [
      { id: 'm1', mealType: 'Breakfast', foodDescription: 'Warm oatmeal with blueberries and chia seeds', servingSize: '1 bowl', timestamp: Date.now() - 3600000 * 3, date: getTodayDateString() }
    ];
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('dailywell_prefs');
    return saved ? JSON.parse(saved) : INITIAL_PREFERENCES;
  });

  const [stepLogs, setStepLogs] = useState<StepLog[]>(() => {
    const saved = localStorage.getItem('dailywell_step_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [activeTab, setActiveTab] = useState<string>('today');
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState<boolean>(false);

  // Derive steps for selectedDate (no fabricated numbers)
  const currentStepLog = stepLogs.find((l) => l.date === selectedDate);
  const stepsToday = currentStepLog ? currentStepLog.steps : 0;
  const isManualSteps = currentStepLog ? currentStepLog.source === 'Manual' : false;

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('dailywell_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('dailywell_completions', JSON.stringify(completions));
  }, [completions]);

  useEffect(() => {
    localStorage.setItem('dailywell_water', JSON.stringify(waterLogs));
  }, [waterLogs]);

  useEffect(() => {
    localStorage.setItem('dailywell_exercise', JSON.stringify(exerciseSessions));
  }, [exerciseSessions]);

  useEffect(() => {
    localStorage.setItem('dailywell_meditation', JSON.stringify(meditationSessions));
  }, [meditationSessions]);

  useEffect(() => {
    localStorage.setItem('dailywell_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('dailywell_step_logs', JSON.stringify(stepLogs));
  }, [stepLogs]);

  useEffect(() => {
    localStorage.setItem('dailywell_prefs', JSON.stringify(preferences));
  }, [preferences]);

  // Handle dark mode class
  useEffect(() => {
    if (preferences.preferredTheme === 'Dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.preferredTheme]);

  // Actions
  const handleToggleTask = (taskId: string) => {
    setCompletions((prev) => {
      const existing = prev.find((c) => c.taskId === taskId && c.date === selectedDate);
      if (existing) {
        if (existing.isCompleted) {
          // undo completion
          return prev.filter((c) => !(c.taskId === taskId && c.date === selectedDate));
        } else {
          return prev.map((c) =>
            c.taskId === taskId && c.date === selectedDate
              ? { ...c, isCompleted: true, isSkipped: false, completedAt: Date.now() }
              : c
          );
        }
      } else {
        return [...prev, { taskId, date: selectedDate, isCompleted: true, isSkipped: false, completedAt: Date.now() }];
      }
    });
  };

  const handleToggleSkipTask = (taskId: string) => {
    setCompletions((prev) => {
      const existing = prev.find((c) => c.taskId === taskId && c.date === selectedDate);
      if (existing) {
        if (existing.isSkipped) {
          // undo skip
          return prev.filter((c) => !(c.taskId === taskId && c.date === selectedDate));
        } else {
          return prev.map((c) =>
            c.taskId === taskId && c.date === selectedDate
              ? { ...c, isSkipped: true, isCompleted: false, completedAt: undefined }
              : c
          );
        }
      } else {
        return [...prev, { taskId, date: selectedDate, isCompleted: false, isSkipped: true }];
      }
    });
  };

  const handleMoveTask = (taskId: string, direction: 'up' | 'down') => {
    setTasks((prev) => {
      const index = prev.findIndex((t) => t.id === taskId);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const updated = [...prev];
      const [moved] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, moved);
      return updated.map((t, idx) => ({ ...t, sortOrder: idx + 1 }));
    });
  };

  const handleQuickAddWater = (amountMl: number) => {
    const newLog: WaterLog = {
      id: `w-${Date.now()}`,
      amountMl,
      timestamp: Date.now(),
      date: getTodayDateString(),
    };
    setWaterLogs((prev) => [newLog, ...prev]);
  };

  const handleDeleteWaterLog = (id: string) => {
    setWaterLogs((prev) => prev.filter((w) => w.id !== id));
  };

  const handleUpdateWaterGoal = (newGoalMl: number) => {
    setPreferences((prev) => ({ ...prev, dailyWaterGoalMl: newGoalMl }));
  };

  const handleAddTask = (newTask: Omit<WellnessTask, 'id' | 'createdAt'>) => {
    const created: WellnessTask = {
      ...newTask,
      id: `task-${Date.now()}`,
      createdAt: Date.now(),
    };
    setTasks((prev) => [...prev, created]);
  };

  const handleUpdateTask = (updated: WellnessTask) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleTogglePause = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPaused: !t.isPaused } : t))
    );
  };

  const handleAddExercise = (session: Omit<ExerciseSession, 'id' | 'timestamp' | 'date'>) => {
    const newSession: ExerciseSession = {
      ...session,
      id: `e-${Date.now()}`,
      timestamp: Date.now(),
      date: getTodayDateString(),
    };
    setExerciseSessions((prev) => [newSession, ...prev]);
  };

  const handleDeleteExercise = (id: string) => {
    setExerciseSessions((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAddMeditation = (durationMinutes: number, technique: string) => {
    const newSession: MeditationSession = {
      id: `med-${Date.now()}`,
      durationMinutes,
      technique,
      timestamp: Date.now(),
      date: getTodayDateString(),
    };
    setMeditationSessions((prev) => [newSession, ...prev]);
  };

  const handleAddMeal = (meal: Omit<MealEntry, 'id' | 'timestamp' | 'date'>) => {
    const newMeal: MealEntry = {
      ...meal,
      id: `m-${Date.now()}`,
      timestamp: Date.now(),
      date: getTodayDateString(),
    };
    setMeals((prev) => [newMeal, ...prev]);
  };

  const handleDeleteMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSetSteps = (steps: number, isManual: boolean) => {
    setStepLogs((prev) => {
      const idx = prev.findIndex((l) => l.date === selectedDate);
      const newEntry: StepLog = {
        id: `s-${Date.now()}`,
        steps,
        date: selectedDate,
        source: isManual ? 'Manual' : 'HealthConnect',
        timestamp: Date.now(),
      };
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newEntry;
        return updated;
      }
      return [newEntry, ...prev];
    });
  };

  const handleEraseAllData = () => {
    setTasks(STARTER_TASKS);
    setCompletions([]);
    setWaterLogs([]);
    setExerciseSessions([]);
    setMeditationSessions([]);
    setMeals([]);
    setStepLogs([]);
    setPreferences(INITIAL_PREFERENCES);
    localStorage.clear();
  };

  const todayStr = getTodayDateString();
  const waterTotalToday = waterLogs
    .filter((w) => w.date === todayStr)
    .reduce((acc, w) => acc + w.amountMl, 0);

  const exerciseMinutesToday = exerciseSessions
    .filter((e) => e.date === todayStr)
    .reduce((acc, e) => acc + e.durationMinutes, 0);

  const meditationMinutesToday = meditationSessions
    .filter((m) => m.date === todayStr)
    .reduce((acc, m) => acc + m.durationMinutes, 0);

  // Navigation items
  const mainTabs = [
    { id: 'today', label: 'Today', icon: CalendarDays },
    { id: 'routines', label: 'Routines', icon: CheckSquare },
    { id: 'insights', label: 'Insights', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-stone-100/70 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Banner / Android Code Exporter Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-700/20">
              DW
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-stone-900 dark:text-white">
                DailyWell
              </span>
              <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                Android 16 Native
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsAndroidModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Android Studio Project</span>
            <span className="sm:hidden">Android</span>
          </button>
        </div>
      </header>

      {/* Main Screen Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'today' && (
          <TodayView
            tasks={tasks}
            completions={completions}
            waterTotalMl={waterTotalToday}
            exerciseMinutesToday={exerciseMinutesToday}
            meditationMinutesToday={meditationMinutesToday}
            stepsToday={stepsToday}
            preferences={preferences}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onToggleTask={handleToggleTask}
            onToggleSkipTask={handleToggleSkipTask}
            onQuickAddWater={handleQuickAddWater}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'routines' && (
          <RoutinesView
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onTogglePause={handleTogglePause}
            onMoveTask={handleMoveTask}
          />
        )}

        {activeTab === 'water' && (
          <WaterView
            waterLogs={waterLogs}
            waterGoalMl={preferences.dailyWaterGoalMl}
            hydrationRemindersEnabled={preferences.hydrationRemindersEnabled}
            onAddWater={handleQuickAddWater}
            onDeleteWaterLog={handleDeleteWaterLog}
            onUpdateWaterGoal={handleUpdateWaterGoal}
            onToggleHydrationReminders={(enabled) =>
              setPreferences((prev) => ({ ...prev, hydrationRemindersEnabled: enabled }))
            }
            onBack={() => setActiveTab('today')}
          />
        )}

        {activeTab === 'steps' && (
          <StepsView
            stepsToday={stepsToday}
            stepGoal={preferences.dailyStepGoal}
            isHealthConnectGranted={preferences.healthConnectGranted}
            isManualEntry={isManualSteps}
            stepLogs={stepLogs}
            selectedDate={selectedDate}
            onUpdateStepGoal={(newGoal) =>
              setPreferences((prev) => ({ ...prev, dailyStepGoal: newGoal }))
            }
            onSetSteps={handleSetSteps}
            onGrantHealthConnect={() =>
              setPreferences((prev) => ({ ...prev, healthConnectGranted: true }))
            }
            onBack={() => setActiveTab('today')}
          />
        )}

        {activeTab === 'meditation' && (
          <MeditationView
            meditationSessions={meditationSessions}
            onAddSession={handleAddMeditation}
            onBack={() => setActiveTab('today')}
          />
        )}

        {activeTab === 'exercise' && (
          <ExerciseView
            exerciseSessions={exerciseSessions}
            exerciseGoalMinutes={preferences.dailyExerciseGoalMinutes}
            onAddExercise={handleAddExercise}
            onDeleteExercise={handleDeleteExercise}
            onBack={() => setActiveTab('today')}
          />
        )}

        {activeTab === 'meals' && (
          <FoodJournalView
            meals={meals}
            onAddMeal={handleAddMeal}
            onDeleteMeal={handleDeleteMeal}
            onBack={() => setActiveTab('today')}
          />
        )}

        {activeTab === 'insights' && (
          <InsightsView
            tasks={tasks}
            completions={completions}
            waterLogs={waterLogs}
            exerciseSessions={exerciseSessions}
            meditationSessions={meditationSessions}
            stepsToday={stepsToday}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            preferences={preferences}
            onUpdatePreferences={(newPrefs) => setPreferences((prev) => ({ ...prev, ...newPrefs }))}
            onEraseAllData={handleEraseAllData}
            allAppData={{
              tasks,
              completions,
              waterLogs,
              exerciseSessions,
              meditationSessions,
              meals,
            }}
          />
        )}
      </main>

      {/* Bottom Android-style Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-lg border-t border-stone-200/80 dark:border-stone-800">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-around">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-1 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                }`}
              >
                <div
                  className={`px-4 py-1 rounded-full transition-colors ${
                    isSelected
                      ? 'bg-emerald-100 dark:bg-emerald-950/60'
                      : 'bg-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Android Studio Project & Code Inspector Modal */}
      <AndroidProjectModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />
    </div>
  );
}
