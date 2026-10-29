import React, { useState } from 'react';
import { WellnessTask, TaskCategory, RecurrenceType } from '../types';
import {
  Plus,
  Play,
  Pause,
  Edit2,
  Trash2,
  Check,
  X,
  Filter,
  Sparkles,
  Clock,
  Calendar,
  AlertCircle,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface RoutinesViewProps {
  tasks: WellnessTask[];
  onAddTask: (task: Omit<WellnessTask, 'id' | 'createdAt'>) => void;
  onUpdateTask: (task: WellnessTask) => void;
  onDeleteTask: (id: string) => void;
  onTogglePause: (id: string) => void;
  onMoveTask: (id: string, direction: 'up' | 'down') => void;
}

const CATEGORIES: TaskCategory[] = [
  'Exercise',
  'Hydration',
  'Meditation',
  'Movement Break',
  'Nutrition',
  'Sleep',
  'Personal Care',
  'Custom',
];

const RECURRENCE_OPTIONS: RecurrenceType[] = ['Daily', 'Selected Weekdays', 'One-Time'];

export const RoutinesView: React.FC<RoutinesViewProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onTogglePause,
  onMoveTask,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<WellnessTask | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<WellnessTask | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Exercise');
  const [scheduledTime, setScheduledTime] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceType>('Daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  const [goalValue, setGoalValue] = useState('');
  const [goalUnit, setGoalUnit] = useState('');
  const [formError, setFormError] = useState('');

  const openCreateModal = () => {
    setTaskToEdit(null);
    setName('');
    setDescription('');
    setCategory('Exercise');
    setScheduledTime('');
    setReminderEnabled(false);
    setRecurrence('Daily');
    setSelectedDays([1, 2, 3, 4, 5, 6, 7]);
    setGoalValue('');
    setGoalUnit('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (task: WellnessTask) => {
    setTaskToEdit(task);
    setName(task.name);
    setDescription(task.description);
    setCategory(task.category);
    setScheduledTime(task.scheduledTime || '');
    setReminderEnabled(task.reminderEnabled);
    setRecurrence(task.recurrence);
    setSelectedDays(task.selectedDaysOfWeek);
    setGoalValue(task.goalValue ? String(task.goalValue) : '');
    setGoalUnit(task.goalUnit || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setFormError('Please enter a routine name');
      return;
    }

    if (recurrence === 'Selected Weekdays' && selectedDays.length === 0) {
      setFormError('Please select at least one weekday for this routine');
      return;
    }

    if (taskToEdit) {
      onUpdateTask({
        ...taskToEdit,
        name: name.trim(),
        description: description.trim(),
        category,
        scheduledTime: scheduledTime.trim() || undefined,
        reminderEnabled,
        recurrence,
        selectedDaysOfWeek: selectedDays,
        goalValue: goalValue ? parseFloat(goalValue) : undefined,
        goalUnit: goalUnit.trim() || undefined,
      });
    } else {
      onAddTask({
        name: name.trim(),
        description: description.trim(),
        category,
        scheduledTime: scheduledTime.trim() || undefined,
        reminderEnabled,
        recurrence,
        selectedDaysOfWeek: selectedDays,
        goalValue: goalValue ? parseFloat(goalValue) : undefined,
        goalUnit: goalUnit.trim() || undefined,
        isPaused: false,
        sortOrder: tasks.length + 1,
      });
    }
    setIsModalOpen(false);
  };

  const filteredTasks = selectedCategory === 'All'
    ? tasks
    : tasks.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-emerald-700 dark:text-emerald-400">
            Habits & Routines
          </span>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Routine Manager</h1>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Routine
        </button>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1.5 rounded-full shrink-0 font-medium transition-colors cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-emerald-700 text-white'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          All ({tasks.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = tasks.filter((t) => t.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full shrink-0 font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {cat} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Tasks list */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
            No routines in this category
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Design personal routines tailored to your lifestyle.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            Create Routine
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all ${
                task.isPaused
                  ? 'bg-stone-50/70 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800/60 opacity-60'
                  : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white truncate">
                      {task.name}
                    </h3>
                    {task.isPaused && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                        Paused
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2.5 mt-2 text-[11px] text-stone-500">
                    <span className="px-2 py-0.5 rounded-md font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                      {task.category}
                    </span>
                    <span>• {task.recurrence}</span>
                    {task.scheduledTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {task.scheduledTime}
                      </span>
                    )}
                    {task.goalValue && task.goalUnit && (
                      <span>• Goal: {task.goalValue} {task.goalUnit}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <div className="flex flex-col mr-1">
                    <button
                      onClick={() => onMoveTask(task.id, 'up')}
                      title="Move up"
                      className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onMoveTask(task.id, 'down')}
                      title="Move down"
                      className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => onTogglePause(task.id)}
                    title={task.isPaused ? 'Resume' : 'Pause'}
                    className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    {task.isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEditModal(task)}
                    title="Edit"
                    className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTaskToDelete(task)}
                    title="Delete"
                    className="p-1.5 rounded-lg text-stone-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-stone-900 dark:text-white">
                {taskToEdit ? 'Edit Routine' : 'New Wellness Routine'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Routine Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setFormError('');
                  }}
                  placeholder="e.g. Morning Stretch, Walk, Hydrate"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {formError && <p className="text-red-500 text-[11px] mt-1">{formError}</p>}
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Gentle notes or guidance"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        category === cat
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Recurrence
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {RECURRENCE_OPTIONS.map((rec) => (
                    <button
                      key={rec}
                      type="button"
                      onClick={() => setRecurrence(rec)}
                      className={`py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors text-center ${
                        recurrence === rec
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {rec}
                    </button>
                  ))}
                </div>

                {recurrence === 'Selected Weekdays' && (
                  <div className="mt-2.5">
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      Select Active Days:
                    </label>
                    <div className="grid grid-cols-7 gap-1">
                      {[
                        { id: 1, label: 'Mon' },
                        { id: 2, label: 'Tue' },
                        { id: 3, label: 'Wed' },
                        { id: 4, label: 'Thu' },
                        { id: 5, label: 'Fri' },
                        { id: 6, label: 'Sat' },
                        { id: 7, label: 'Sun' },
                      ].map((day) => {
                        const isSelected = selectedDays.includes(day.id);
                        return (
                          <button
                            key={day.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedDays(selectedDays.filter((d) => d !== day.id));
                              } else {
                                setSelectedDays([...selectedDays, day.id].sort());
                              }
                            }}
                            className={`py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-center ${
                              isSelected
                                ? 'bg-emerald-700 text-white'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-700'
                            }`}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Time (HH:mm)
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Goal
                  </label>
                  <input
                    type="number"
                    value={goalValue}
                    onChange={(e) => setGoalValue(e.target.value)}
                    placeholder="15"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={goalUnit}
                    onChange={(e) => setGoalUnit(e.target.value)}
                    placeholder="min / ml"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="reminder"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="reminder" className="text-stone-600 dark:text-stone-300">
                  Notify me with gentle reminder
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer shadow-sm"
              >
                Save Routine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">Delete Routine?</h3>
                <p className="text-xs text-stone-500">
                  Are you sure you want to delete "{taskToDelete.name}"? Historical completion records are preserved.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteTask(taskToDelete.id);
                  setTaskToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
