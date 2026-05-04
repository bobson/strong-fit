// ─── Program ──────────────────────────────────────────────────────────────────

export type ProgramScheme = "5x5" | "3x5";
export type WorkoutLabel = "A" | "B";

// ─── Exercise library ─────────────────────────────────────────────────────────

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "core";

export type Equipment = "barbell" | "dumbbell" | "cable" | "bodyweight";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  instructions: string[];
}

// ─── Main lifts ───────────────────────────────────────────────────────────────

// The 5 core barbell lifts — fixed, not user-configurable
export type MainLiftId =
  | "squat"
  | "bench"
  | "row"
  | "overhead-press"
  | "deadlift";

export interface MainLiftConfig {
  id: MainLiftId;
  name: string;
  // Weight increment per successful session (kg)
  incrementKg: number;
  // Deadlift is always 1x5 regardless of program scheme
  alwaysSingleSet: boolean;
}

// ─── Assistance work ──────────────────────────────────────────────────────────

export interface AssistanceExercise {
  exerciseId: string; // references Exercise.id
  sets: number;
  reps: number;
  weight: number; // kg — user managed, no auto progression
}

// Assistance exercises configured per workout (A or B)
export interface AssistanceConfig {
  A: AssistanceExercise[];
  B: AssistanceExercise[];
}

// ─── Active session ───────────────────────────────────────────────────────────

export type SetStatus = "pending" | "completed" | "failed";

export interface ActiveSet {
  setNumber: number;
  targetReps: number;
  completedReps: number | null;
  status: SetStatus;
}

export interface ActiveMainLift {
  liftId: MainLiftId;
  name: string;
  weight: number;
  sets: ActiveSet[];
}

export interface ActiveAssistanceLift {
  exerciseId: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  completed: boolean;
}

export type RestTimerStatus = "idle" | "running" | "finished";

export interface ActiveSession {
  workoutLabel: WorkoutLabel;
  startedAt: string; // ISO
  currentLiftIndex: number;
  currentSetIndex: number;
  mainLifts: ActiveMainLift[];
  assistanceLifts: ActiveAssistanceLift[];
  restTimer: {
    status: RestTimerStatus;
    secondsRemaining: number;
    totalSeconds: number;
  };
}

// ─── Completed session (stored in history) ────────────────────────────────────

export interface CompletedMainLift {
  liftId: MainLiftId;
  name: string;
  weight: number;
  // e.g. [5, 5, 5, 5, 4] — reps completed per set
  repsPerSet: number[];
  // true = all sets completed with full reps
  success: boolean;
}

export interface CompletedAssistanceLift {
  exerciseId: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface CompletedSession {
  id: string;
  workoutLabel: WorkoutLabel;
  date: string; // ISO
  durationSeconds: number;
  program: ProgramScheme;
  mainLifts: CompletedMainLift[];
  assistanceLifts: CompletedAssistanceLift[];
}

// ─── App state (persisted to localStorage) ───────────────────────────────────

export interface LiftWeights {
  squat: number;
  bench: number;
  row: number;
  "overhead-press": number;
  deadlift: number;
}

// export interface AppState {
//   program: ProgramScheme;
//   nextWorkout: WorkoutLabel;
//   weights: LiftWeights;
 
//   failStreak: Partial<Record<MainLiftId, number>>;
//   assistanceConfig: AssistanceConfig;
//   sessions: CompletedSession[];
// }

export interface AppState {
  current: WorkoutLabel;
  previous: WorkoutLabel | null;
  previousWeights: LiftWeights | null;
  weights: LiftWeights;
  incrementKg: number;
  program: ProgramScheme;
  failStreak: Partial<Record<MainLiftId, number>>;
  setupComplete: boolean;
}
