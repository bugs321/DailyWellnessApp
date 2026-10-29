import React, { useState } from 'react';
import { WaterLog } from '../types';
import { formatTime, getTodayDateString } from '../utils/dateHelper';
import {
  Droplets,
  Plus,
  Trash2,
  Clock,
  SlidersHorizontal,
  X,
  Bell,
  CheckCircle2
} from 'lucide-react';

interface WaterViewProps {
  waterLogs: WaterLog[];
  waterGoalMl: number;
  hydrationRemindersEnabled: boolean;
  onAddWater: (amountMl: number) => void;
  onDeleteWaterLog: (id: string) => void;
  onUpdateWaterGoal: (newGoalMl: number) => void;
  onToggleHydrationReminders: (enabled: boolean) => void;
  onBack: () => void;
}

export const WaterView: React.FC<WaterViewProps> = ({
  waterLogs,
  waterGoalMl,
  hydrationRemindersEnabled,
  onAddWater,
  onDeleteWaterLog,
  onUpdateWaterGoal,
  onToggleHydrationReminders,
  onBack,
}) => {
  const todayStr = getTodayDateString();
  const todayLogs = waterLogs.filter((l) => l.date === todayStr);
  const totalTodayMl = todayLogs.reduce((acc, l) => acc + l.amountMl, 0);
  const remainingMl = Math.max(0, waterGoalMl - totalTodayMl);
  const progressPercent = Math.min(100, Math.round((totalTodayMl / Math.max(1, waterGoalMl)) * 100));

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newGoalInput, setNewGoalInput] = useState(String(waterGoalMl));

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customAmount, 10);
    if (parsed > 0) {
      onAddWater(parsed);
      setCustomAmount('');
      setIsCustomModalOpen(false);
    }
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(newGoalInput, 10);
    if (parsed >= 500 && parsed <= 10000) {
      onUpdateWaterGoal(parsed);
      setIsGoalModalOpen(false);
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
          onClick={() => {
            setNewGoalInput(String(waterGoalMl));
            setIsGoalModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 text-xs font-semibold border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Adjust Goal ({waterGoalMl}ml)
        </button>
      </div>

      {/* Main Hydration Visual Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-xl shadow-sky-600/20 relative overflow-hidden text-center">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-48 h-48 bg-sky-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center shadow-inner">
            <Droplets className="w-8 h-8 text-white fill-white/20" />
          </div>

          <div>
            <div className="text-4xl font-black tracking-tight">{totalTodayMl} ml</div>
            <p className="text-sm text-sky-100 font-medium">
              {remainingMl > 0
                ? `${remainingMl} ml remaining to reach goal (${waterGoalMl} ml)`
                : '🎉 Daily hydration target achieved!'}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-sky-950/30 h-3 rounded-full overflow-hidden p-0.5 border border-sky-400/30">
            <div
              className="bg-white h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-sky-100 font-semibold px-1">
            <span>0 ml</span>
            <span>{progressPercent}% Complete</span>
            <span>{waterGoalMl} ml</span>
          </div>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
          Quick Log Options
        </h2>
        <div className="grid grid-cols-4 gap-2.5">
          <button
            onClick={() => onAddWater(150)}
            className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-sky-400 dark:hover:border-sky-600 transition-all flex flex-col items-center cursor-pointer shadow-sm active:scale-95"
          >
            <span className="text-base font-bold text-sky-600 dark:text-sky-400">+150</span>
            <span className="text-[11px] text-stone-500">Cup (150ml)</span>
          </button>

          <button
            onClick={() => onAddWater(250)}
            className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-sky-400 dark:hover:border-sky-600 transition-all flex flex-col items-center cursor-pointer shadow-sm active:scale-95"
          >
            <span className="text-base font-bold text-sky-600 dark:text-sky-400">+250</span>
            <span className="text-[11px] text-stone-500">Glass (250ml)</span>
          </button>

          <button
            onClick={() => onAddWater(500)}
            className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-sky-400 dark:hover:border-sky-600 transition-all flex flex-col items-center cursor-pointer shadow-sm active:scale-95"
          >
            <span className="text-base font-bold text-sky-600 dark:text-sky-400">+500</span>
            <span className="text-[11px] text-stone-500">Bottle (500ml)</span>
          </button>

          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-all flex flex-col items-center cursor-pointer shadow-sm active:scale-95 text-sky-800 dark:text-sky-200"
          >
            <span className="text-base font-bold">+Custom</span>
            <span className="text-[11px] text-sky-600 dark:text-sky-400">Any ml</span>
          </button>
        </div>
      </div>

      {/* Hydration Reminder Setting */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-900 dark:text-white">Hydration Reminders</div>
            <div className="text-[11px] text-stone-500">Gentle periodic nudge to drink water throughout the day</div>
          </div>
        </div>
        <input
          type="checkbox"
          checked={hydrationRemindersEnabled}
          onChange={(e) => onToggleHydrationReminders(e.target.checked)}
          className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
        />
      </div>

      {/* Today's Log History */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Today's Water Entries ({todayLogs.length})
        </h2>

        {todayLogs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-dashed border-stone-200 dark:border-stone-800">
            <Droplets className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-xs text-stone-500">
              No water logged yet today. Tap any preset button above to record your intake.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayLogs.map((log) => (
              <div
                key={log.id}
                className="px-4 py-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/50 text-sky-600 flex items-center justify-center">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-stone-900 dark:text-white">
                      +{log.amountMl} ml
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-stone-400">
                      <Clock className="w-3 h-3" />
                      {formatTime(log.timestamp)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteWaterLog(log.id)}
                  title="Delete entry"
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Amount Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCustomSubmit}
            className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">Log Custom Water</h3>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Amount in millilitres (ml)
              </label>
              <input
                type="number"
                min="10"
                max="5000"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="e.g. 350"
                autoFocus
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                Add Water
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Adjust Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handleGoalSubmit}
            className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">Adjust Daily Water Target</h3>
              <button
                type="button"
                onClick={() => setIsGoalModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Customize your personal daily hydration goal. We never change your target automatically.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Daily Goal (ml)
              </label>
              <input
                type="number"
                min="500"
                max="10000"
                step="50"
                value={newGoalInput}
                onChange={(e) => setNewGoalInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsGoalModalOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                Save Target
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
