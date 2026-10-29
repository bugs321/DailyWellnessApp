import React, { useState } from 'react';
import { MealEntry, MealType } from '../types';
import { getTodayDateString, formatDisplayDate, formatTime } from '../utils/dateHelper';
import {
  Utensils,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Info,
  X
} from 'lucide-react';

interface FoodJournalViewProps {
  meals: MealEntry[];
  onAddMeal: (meal: Omit<MealEntry, 'id' | 'timestamp' | 'date'>) => void;
  onDeleteMeal: (id: string) => void;
  onBack: () => void;
}

const MEAL_TYPES: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Custom'];

export const FoodJournalView: React.FC<FoodJournalViewProps> = ({
  meals,
  onAddMeal,
  onDeleteMeal,
  onBack,
}) => {
  const todayStr = getTodayDateString();
  const todayMeals = meals.filter((m) => m.date === todayStr);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mealType, setMealType] = useState<MealType>('Breakfast');
  const [foodDescription, setFoodDescription] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodDescription.trim()) {
      setFormError('Please enter what you ate');
      return;
    }
    onAddMeal({
      mealType,
      foodDescription: foodDescription.trim(),
      servingSize: servingSize.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    setIsModalOpen(false);
    setFoodDescription('');
    setServingSize('');
    setNotes('');
    setFormError('');
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
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Log Nourishment
        </button>
      </div>

      {/* Philosophy banner */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed">
          DailyWell celebrates mindful eating and conscious nourishment. We avoid arbitrary calorie guessing, focusing instead on wholesome choices and mindful eating habits.
        </p>
      </div>

      {/* Date Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-stone-900 dark:text-white">
          Today's Nourishment Timeline ({formatDisplayDate(todayStr)})
        </h2>
        <span className="text-xs text-stone-400 font-medium">
          {todayMeals.length} entry(ies)
        </span>
      </div>

      {/* Meals Timeline */}
      {todayMeals.length === 0 ? (
        <div className="p-10 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <Utensils className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
            No meals logged yet today
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Keep track of what fuels your body throughout the day.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            Log First Meal
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {todayMeals.map((meal) => (
            <div
              key={meal.id}
              className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm flex items-start justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    {meal.mealType}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-stone-400">
                    <Clock className="w-3 h-3" />
                    {formatTime(meal.timestamp)}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-stone-900 dark:text-white mt-1.5">
                  {meal.foodDescription}
                </h3>

                {meal.servingSize && (
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Portion: {meal.servingSize}
                  </p>
                )}

                {meal.notes && (
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 italic">
                    "{meal.notes}"
                  </p>
                )}
              </div>

              <button
                onClick={() => onDeleteMeal(meal.id)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Delete meal"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Log Meal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">Record Nourishment</h3>
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
                  Meal Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {MEAL_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setMealType(t)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        mealType === t
                          ? 'bg-emerald-700 text-white'
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
                  What did you eat/drink? *
                </label>
                <input
                  type="text"
                  value={foodDescription}
                  onChange={(e) => {
                    setFoodDescription(e.target.value);
                    setFormError('');
                  }}
                  placeholder="e.g. Oatmeal with chia seeds, banana, and green tea"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {formError && <p className="text-red-500 text-[11px] mt-1">{formError}</p>}
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Serving Size (Optional)
                </label>
                <input
                  type="text"
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                  placeholder="e.g. 1 medium bowl"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Mindful Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ate without rush, felt satisfying"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                Save Entry
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
