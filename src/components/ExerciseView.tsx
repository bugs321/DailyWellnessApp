import React, { useState } from 'react';
import { ExerciseSession } from '../types';
import { getTodayDateString, formatTime } from '../utils/dateHelper';
import {
  Dumbbell,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  X
} from 'lucide-react';

interface ExerciseViewProps {
  exerciseSessions: ExerciseSession[];
  exerciseGoalMinutes: number;
  onAddExercise: (session: Omit<ExerciseSession, 'id' | 'timestamp' | 'date'>) => void;
  onDeleteExercise: (id: string) => void;
  onBack: () => void;
}

const COMMON_WORKOUTS = ['Walking', 'Running', 'Strength Training', 'Yoga', 'Stretching', 'Cycling', 'HIIT', 'Custom'];

export const ExerciseView: React.FC<ExerciseViewProps> = ({
  exerciseSessions,
  exerciseGoalMinutes,
  onAddExercise,
  onDeleteExercise,
  onBack,
}) => {
  const todayStr = getTodayDateString();
  const todaySessions = exerciseSessions.filter((s) => s.date === todayStr);
  const totalMinutesToday = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const progressPercent = Math.min(100, Math.round((totalMinutesToday / Math.max(1, exerciseGoalMinutes)) * 100));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workoutType, setWorkoutType] = useState('Walking');
  const [duration, setDuration] = useState('30');
  const [distance, setDistance] = useState('');
  const [reps, setReps] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dur = parseInt(duration, 10);
    if (dur > 0) {
      onAddExercise({
        workoutType,
        durationMinutes: dur,
        distanceKm: distance ? parseFloat(distance) : undefined,
        repetitions: reps ? parseInt(reps, 10) : undefined,
        notes: notes.trim() || undefined,
      });
      setIsModalOpen(false);
      setDuration('30');
      setDistance('');
      setReps('');
      setNotes('');
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          ← Back to Today
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-md shadow-orange-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Log Workout
        </button>
      </div>

      {/* Main Exercise Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-700 text-white shadow-xl shadow-orange-600/20 relative overflow-hidden text-center">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-48 h-48 bg-orange-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center shadow-inner">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>

          <div>
            <div className="text-4xl font-black tracking-tight">{totalMinutesToday} min</div>
            <p className="text-sm text-orange-100 font-medium">
              Daily Target: {exerciseGoalMinutes} minutes
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-orange-950/30 h-3 rounded-full overflow-hidden p-0.5 border border-orange-400/30 mt-2">
            <div
              className="bg-white h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-orange-100 font-semibold px-1">
            <span>0 min</span>
            <span>{progressPercent}% Goal Completed</span>
            <span>{exerciseGoalMinutes} min</span>
          </div>
        </div>
      </div>

      {/* Today's Workout Sessions */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Today's Workout Sessions ({todaySessions.length})
        </h2>

        {todaySessions.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-dashed border-stone-200 dark:border-stone-800">
            <Sparkles className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-xs text-stone-500">
              No exercise recorded yet today. Tap Log Workout above to track your physical movement.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todaySessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900 dark:text-white">
                      {session.workoutType}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-orange-100 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300">
                      {session.durationMinutes} min
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                    {session.distanceKm && <span>{session.distanceKm} km</span>}
                    {session.repetitions && <span>• {session.repetitions} reps</span>}
                    <span>• {formatTime(session.timestamp)}</span>
                  </div>

                  {session.notes && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      {session.notes}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onDeleteExercise(session.id)}
                  className="p-2 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Workout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">Log Exercise Session</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Workout Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_WORKOUTS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setWorkoutType(t)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        workoutType === t
                          ? 'bg-orange-600 text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="360"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="e.g. 3.5"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Reps / Sets
                  </label>
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Felt strong, good breathing"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                Save Workout
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
