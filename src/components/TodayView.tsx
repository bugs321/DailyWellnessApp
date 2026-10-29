import React from 'react';
import { WellnessTask, TaskCompletion, UserPreferences } from '../types';
import { formatDisplayDate, getTodayDateString, isTaskScheduledForDate } from '../utils/dateHelper';
import {
  CheckCircle2,
  Circle,
  Clock,
  Droplets,
  Utensils,
  Wind,
  Footprints,
  Sparkles,
  ChevronRight,
  PlusCircle,
  Dumbbell,
  SkipForward,
  Undo2,
  Calendar
} from 'lucide-react';

interface TodayViewProps {
  tasks: WellnessTask[];
  completions: TaskCompletion[];
  waterTotalMl: number;
  exerciseMinutesToday: number;
  meditationMinutesToday: number;
  stepsToday: number;
  preferences: UserPreferences;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  onToggleTask: (taskId: string) => void;
  onToggleSkipTask: (taskId: string) => void;
  onQuickAddWater: (amountMl: number) => void;
  onNavigateTab: (tab: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  tasks,
  completions,
  waterTotalMl,
  exerciseMinutesToday,
  meditationMinutesToday,
  stepsToday,
  preferences,
  selectedDate,
  onSelectDate,
  onToggleTask,
  onToggleSkipTask,
  onQuickAddWater,
  onNavigateTab,
}) => {
  const isActualToday = selectedDate === getTodayDateString();
  const scheduledTasks = tasks.filter((t) => isTaskScheduledForDate(t, selectedDate));

  const completionEntries = completions.filter((c) => c.date === selectedDate);
  const completionMap = new Map(
    completionEntries.map((c) => [c.taskId, c])
  );

  const completedCount = scheduledTasks.filter((t) => completionMap.get(t.id)?.isCompleted).length;
  const skippedCount = scheduledTasks.filter((t) => completionMap.get(t.id)?.isSkipped).length;
  const totalCount = scheduledTasks.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Check if overdue: scheduledTime earlier than current time by 30 mins (only on actual today)
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [y, m, d] = selectedDate.split('-').map(Number);
  const curDate = new Date(y, m - 1, d);
  const prevDate = new Date(curDate);
  prevDate.setDate(prevDate.getDate() - 1);
  const nextDate = new Date(curDate);
  nextDate.setDate(nextDate.getDate() + 1);

  const toDateStr = (date: Date) => {
    const yr = date.getFullYear();
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    const da = String(date.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${da}`;
  };

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto">
      {/* Date & Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-700 dark:text-emerald-400">
              {formatDisplayDate(selectedDate)}
            </span>
            {isActualToday ? (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                Today
              </span>
            ) : (
              <button
                onClick={() => onSelectDate(getTodayDateString())}
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300 cursor-pointer"
              >
                Return to Today
              </button>
            )}
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
            {isActualToday ? "Today's Balance" : "Daily Activity Log"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Date switcher for testing midnight rollover and recurring schedules */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300">
            <button
              onClick={() => onSelectDate(toDateStr(prevDate))}
              className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-stone-700 transition-colors cursor-pointer"
              title="Previous day"
            >
              ← Prev
            </button>
            <button
              onClick={() => onSelectDate(getTodayDateString())}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                isActualToday ? 'bg-white dark:bg-stone-700 font-bold text-emerald-700 dark:text-emerald-400 shadow-xs' : 'hover:bg-white dark:hover:bg-stone-700'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => onSelectDate(toDateStr(nextDate))}
              className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-stone-700 transition-colors cursor-pointer"
              title="Next day"
            >
              Next →
            </button>
          </div>

          <button
            onClick={() => onNavigateTab('routines')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Routines
          </button>
        </div>
      </div>

      {/* Daily Completion Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-48 h-48 bg-emerald-600/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold">
              Daily Balance
            </span>
            <div className="text-3xl font-extrabold tracking-tight">
              {completedCount} <span className="text-lg font-normal text-emerald-200">of {totalCount} completed</span>
            </div>
            <p className="text-xs text-emerald-100/90 pt-1">
              {percentage === 100 && totalCount > 0
                ? '✨ All daily rituals fulfilled! Cherish your balance.'
                : 'Take your day one mindful step at a time.'}
            </p>
          </div>

          {/* Radial progress ring */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-emerald-950/40"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-300 transition-all duration-700 ease-out"
                strokeDasharray={`${percentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-sm font-bold text-white">{percentage}%</span>
          </div>
        </div>
      </div>

      {/* Quick Wellbeing Actions */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
          Quick Wellbeing Actions
        </h2>
        <div className="grid grid-cols-4 gap-2.5">
          <button
            onClick={() => onQuickAddWater(250)}
            className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-all flex flex-col items-center text-center cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              <Droplets className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-sky-900 dark:text-sky-200">+250ml</span>
            <span className="text-[10px] text-sky-600 dark:text-sky-400">Water</span>
          </button>

          <button
            onClick={() => onNavigateTab('meals')}
            className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all flex flex-col items-center text-center cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              <Utensils className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">Log Meal</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Nourish</span>
          </button>

          <button
            onClick={() => onNavigateTab('meditation')}
            className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all flex flex-col items-center text-center cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              <Wind className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-purple-900 dark:text-purple-200">Breathe</span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400">5 min</span>
          </button>

          <button
            onClick={() => onNavigateTab('steps')}
            className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all flex flex-col items-center text-center cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              <Footprints className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">Steps</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400">{stepsToday}</span>
          </button>
        </div>
      </div>

      {/* Snapshot Cards (Water & Exercise) */}
      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => onNavigateTab('water')}
          className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:border-sky-300 dark:hover:border-sky-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-medium">Hydration</span>
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
          </div>
          <div className="text-lg font-bold text-stone-900 dark:text-white">
            {waterTotalMl} <span className="text-xs font-normal text-stone-400">/ {preferences.dailyWaterGoalMl} ml</span>
          </div>
          <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (waterTotalMl / preferences.dailyWaterGoalMl) * 100)}%` }}
            />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('exercise')}
          className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:border-orange-300 dark:hover:border-orange-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-medium">Exercise</span>
            <Dumbbell className="w-3.5 h-3.5 text-orange-500" />
          </div>
          <div className="text-lg font-bold text-stone-900 dark:text-white">
            {exerciseMinutesToday} <span className="text-xs font-normal text-stone-400">/ {preferences.dailyExerciseGoalMinutes} min</span>
          </div>
          <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (exerciseMinutesToday / preferences.dailyExerciseGoalMinutes) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Scheduled Activities Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Scheduled Activities ({scheduledTasks.length})
          </h2>
          <button
            onClick={() => onNavigateTab('routines')}
            className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline flex items-center"
          >
            Customize
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>

        {scheduledTasks.length === 0 ? (
          <div className="p-8 rounded-3xl bg-stone-50 dark:bg-stone-900/40 border border-dashed border-stone-200 dark:border-stone-800 text-center">
            <Sparkles className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              No activities scheduled for today
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              You can add daily routines or habits anytime to stay gently aligned with your wellbeing goals.
            </p>
            <button
              onClick={() => onNavigateTab('routines')}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              Add a Routine
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {scheduledTasks.map((task) => {
              const comp = completionMap.get(task.id);
              const isCompleted = comp?.isCompleted || false;
              const isSkipped = comp?.isSkipped || false;

              let isOverdue = false;
              if (isActualToday && !isCompleted && !isSkipped && task.scheduledTime) {
                const [h, m] = task.scheduledTime.split(':').map(Number);
                const taskMins = h * 60 + m;
                if (currentMinutes > taskMins + 30) {
                  isOverdue = true;
                }
              }

              return (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 opacity-80'
                      : isSkipped
                      ? 'bg-stone-100/70 dark:bg-stone-900/40 border-dashed border-stone-300 dark:border-stone-700 opacity-60'
                      : isOverdue
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60'
                      : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700'
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-stone-400 hover:text-emerald-600 transition-colors shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTask(task.id);
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 fill-emerald-100 dark:fill-emerald-950/60" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300 dark:text-stone-600 hover:text-emerald-500" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-sm font-semibold truncate ${
                          isCompleted
                            ? 'line-through text-stone-500 dark:text-stone-400'
                            : isSkipped
                            ? 'line-through text-stone-400 dark:text-stone-500 italic'
                            : 'text-stone-800 dark:text-stone-100'
                        }`}
                      >
                        {task.name}
                      </span>
                      {task.scheduledTime && (
                        <span className="flex items-center gap-1 text-[11px] text-stone-400 shrink-0 font-medium">
                          <Clock className="w-3 h-3" />
                          {task.scheduledTime}
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {task.category}
                        </span>

                        {task.goalValue && task.goalUnit && (
                          <span className="text-[10px] text-stone-400">
                            Goal: {task.goalValue} {task.goalUnit}
                          </span>
                        )}

                        {isCompleted && comp?.completedAt && (
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                            ✓ Done {new Date(comp.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}

                        {isSkipped && (
                          <span className="text-[10px] font-medium text-stone-500 bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 rounded">
                            Skipped for today
                          </span>
                        )}

                        {isOverdue && !isCompleted && !isSkipped && (
                          <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
                            Due earlier today
                          </span>
                        )}
                      </div>

                      {/* Skip / Unskip action control */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSkipTask(task.id);
                        }}
                        className="text-[11px] font-medium text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 px-2 py-0.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      >
                        {isSkipped ? 'Unskip' : 'Skip'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
