import { TaskCompletion, WellnessTask } from '../types';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function isTaskScheduledForDate(task: WellnessTask, dateStr: string): boolean {
  if (task.isPaused) return false;
  if (task.recurrence === 'Daily') return true;

  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  // JS getDay(): 0=Sun, 1=Mon ... 6=Sat -> ISO: 1=Mon ... 7=Sun
  const jsDay = date.getDay();
  const isoDay = jsDay === 0 ? 7 : jsDay;

  if (task.recurrence === 'Selected Weekdays') {
    return task.selectedDaysOfWeek.includes(isoDay);
  }

  if (task.recurrence === 'One-Time') {
    const d = new Date(task.createdAt);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const taskDateStr = `${y}-${m}-${day}`;
    return taskDateStr === dateStr;
  }

  return true;
}

export function calculateStreak(completions: TaskCompletion[], todayStr: string = getTodayDateString()): number {
  const completedDates = new Set(
    completions.filter((c) => c.isCompleted).map((c) => c.date)
  );

  if (completedDates.size === 0) return 0;

  let streak = 0;
  const [year, month, day] = todayStr.split('-').map(Number);
  let checkDate = new Date(year, month - 1, day);

  const formatCheck = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };

  // If today hasn't been completed yet, check yesterday
  let checkStr = formatCheck(checkDate);
  if (!completedDates.has(checkStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
    checkStr = formatCheck(checkDate);
    if (!completedDates.has(checkStr)) {
      return 0;
    }
  }

  while (completedDates.has(checkStr)) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
    checkStr = formatCheck(checkDate);
  }

  return streak;
}

export function generateCsvExport(data: {
  tasks: WellnessTask[];
  completions: TaskCompletion[];
  waterLogs: any[];
  exerciseSessions: any[];
  meditationSessions: any[];
  meals: any[];
}): string {
  let csv = '=== DAILYWELL WELLNESS DATA EXPORT ===\n';
  csv += `Exported,${new Date().toISOString()}\n\n`;

  csv += '--- WATER INTAKE LOGS ---\nDate,Amount(ml),Time\n';
  data.waterLogs.forEach((w) => {
    csv += `${w.date},${w.amountMl},${new Date(w.timestamp).toLocaleTimeString()}\n`;
  });
  csv += '\n';

  csv += '--- EXERCISE SESSIONS ---\nDate,Type,Duration(min),Distance(km),Reps,Notes\n';
  data.exerciseSessions.forEach((e) => {
    csv += `${e.date},"${e.workoutType}",${e.durationMinutes},${e.distanceKm || ''},${e.repetitions || ''},"${(e.notes || '').replace(/"/g, '""')}"\n`;
  });
  csv += '\n';

  csv += '--- MINDFULNESS & BREATHING ---\nDate,Duration(min),Technique\n';
  data.meditationSessions.forEach((m) => {
    csv += `${m.date},${m.durationMinutes},"${m.technique}"\n`;
  });
  csv += '\n';

  csv += '--- FOOD JOURNAL ---\nDate,MealType,Description,Serving,Notes\n';
  data.meals.forEach((meal) => {
    csv += `${meal.date},${meal.mealType},"${meal.foodDescription.replace(/"/g, '""')}","${(meal.servingSize || '').replace(/"/g, '""')}","${(meal.notes || '').replace(/"/g, '""')}"\n`;
  });
  csv += '\n';

  csv += '--- ROUTINE COMPLETIONS ---\nDate,Task,Status\n';
  const taskMap = new Map(data.tasks.map((t) => [t.id, t.name]));
  data.completions.forEach((c) => {
    csv += `${c.date},"${taskMap.get(c.taskId) || c.taskId}",${c.isCompleted ? 'Completed' : 'Incomplete'}\n`;
  });

  return csv;
}
