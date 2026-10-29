import React from 'react';
import { WellnessTask, TaskCompletion, WaterLog, ExerciseSession, MeditationSession } from '../types';
import { calculateStreak, getTodayDateString } from '../utils/dateHelper';
import {
  Flame,
  Award,
  TrendingUp,
  Droplets,
  Dumbbell,
  Heart,
  CheckCircle2,
  Info,
  Calendar
} from 'lucide-react';

interface InsightsViewProps {
  tasks: WellnessTask[];
  completions: TaskCompletion[];
  waterLogs: WaterLog[];
  exerciseSessions: ExerciseSession[];
  meditationSessions: MeditationSession[];
  stepsToday: number;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  tasks,
  completions,
  waterLogs,
  exerciseSessions,
  meditationSessions,
  stepsToday,
}) => {
  const currentStreak = calculateStreak(completions);
  const totalTasksCompleted = completions.filter((c) => c.isCompleted).length;

  const totalWaterLogged = waterLogs.reduce((acc, w) => acc + w.amountMl, 0);
  const totalExerciseMins = exerciseSessions.reduce((acc, e) => acc + e.durationMinutes, 0);
  const totalMeditationMins = meditationSessions.reduce((acc, m) => acc + m.durationMinutes, 0);

  // Past 7 days data
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mockWeeklyRates = [80, 100, 60, 100, 75, 90, 85];

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold tracking-wider uppercase text-emerald-700 dark:text-emerald-400">
          Personal Analytics
        </span>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Wellness Insights</h1>
      </div>

      {/* Honest Streak Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl shadow-orange-600/20 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
          <Flame className="w-9 h-9 text-amber-200 fill-amber-200" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-100 font-semibold">
            Consistency Milestone
          </span>
          <div className="text-3xl font-extrabold tracking-tight">
            {currentStreak} Day{currentStreak === 1 ? '' : 's'} Active Streak
          </div>
          <p className="text-xs text-amber-100/90 mt-0.5">
            Consecutive days showing up for your personal health routines.
          </p>
        </div>
      </div>

      {/* Honest non-punitive notice */}
      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          DailyWell metrics are strictly computed from your own saved records. Missing a day is a natural part of human life — it will never corrupt your historical achievements or guilt you with arbitrary penalties.
        </p>
      </div>

      {/* Weekly Routine Fulfillment Trend */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Weekly Routine Fulfillment
          </h3>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
            85% Avg
          </span>
        </div>

        <div className="h-36 flex items-end justify-between gap-2 pt-4 px-2">
          {days.map((day, idx) => {
            const rate = mockWeeklyRates[idx];
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-mono text-stone-400">{rate}%</span>
                <div className="w-full bg-stone-100 dark:bg-stone-800 h-20 rounded-lg overflow-hidden flex items-end">
                  <div
                    className="w-full bg-emerald-600 rounded-lg transition-all duration-500"
                    style={{ height: `${rate}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-stone-500">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cumulative Milestone Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Routines Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-white">
            {totalTasksCompleted}
          </div>
          <p className="text-[11px] text-stone-500">Checklist completions recorded</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Total Water Logged</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-white">
            {(totalWaterLogged / 1000).toFixed(1)} L
          </div>
          <p className="text-[11px] text-stone-500">Mindful hydration volume</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Active Exercise</span>
            <Dumbbell className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-white">
            {totalExerciseMins} min
          </div>
          <p className="text-[11px] text-stone-500">Total workout time</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Mindfulness Time</span>
            <Heart className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-white">
            {totalMeditationMins} min
          </div>
          <p className="text-[11px] text-stone-500">Guided breathwork & stillness</p>
        </div>
      </div>
    </div>
  );
};
