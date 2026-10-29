export type TaskCategory =
  | 'Exercise'
  | 'Hydration'
  | 'Meditation'
  | 'Movement Break'
  | 'Nutrition'
  | 'Sleep'
  | 'Personal Care'
  | 'Custom';

export type RecurrenceType = 'Daily' | 'Selected Weekdays' | 'One-Time';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Custom';

export interface WellnessTask {
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  scheduledTime?: string; // "08:00"
  reminderEnabled: boolean;
  recurrence: RecurrenceType;
  selectedDaysOfWeek: number[]; // 1=Mon ... 7=Sun
  goalValue?: number;
  goalUnit?: string;
  isPaused: boolean;
  sortOrder: number;
  createdAt: number;
}

export interface TaskCompletion {
  taskId: string;
  date: string; // "YYYY-MM-DD"
  isCompleted: boolean;
  isSkipped?: boolean;
  completedAt?: number;
}

export interface WaterLog {
  id: string;
  amountMl: number;
  timestamp: number;
  date: string;
}

export type StepSource = 'HealthConnect' | 'Manual';

export interface StepLog {
  id: string;
  steps: number;
  date: string;
  source: StepSource;
  timestamp: number;
}

export interface ExerciseSession {
  id: string;
  workoutType: string;
  durationMinutes: number;
  distanceKm?: number;
  repetitions?: number;
  notes?: string;
  timestamp: number;
  date: string;
}

export interface MeditationSession {
  id: string;
  durationMinutes: number;
  technique: string;
  timestamp: number;
  date: string;
}

export interface MealEntry {
  id: string;
  mealType: MealType;
  foodDescription: string;
  servingSize?: string;
  notes?: string;
  timestamp: number;
  date: string;
}

export interface UserPreferences {
  dailyWaterGoalMl: number;
  dailyStepGoal: number;
  dailyExerciseGoalMinutes: number;
  dailyMeditationGoalMinutes: number;
  hydrationRemindersEnabled: boolean;
  hydrationIntervalHours: number;
  notificationsEnabled?: boolean;
  dailyReviewReminderEnabled?: boolean;
  dailyReviewReminderTime?: string;
  preferredTheme: 'System' | 'Light' | 'Dark';
  firstDayOfWeek: 'Monday' | 'Sunday';
  healthConnectGranted: boolean;
}
