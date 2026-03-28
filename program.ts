import type {
  MainLiftConfig,
  MainLiftId,
  ProgramScheme,
  WorkoutLabel,
  LiftWeights,
  AppState,
  CompletedMainLift,
} from "./types";

// ─── Main lift definitions ────────────────────────────────────────────────────

export const MAIN_LIFTS: Record<MainLiftId, MainLiftConfig> = {
  squat: {
    id: "squat",
    name: "Squat",
    incrementKg: 2.5,
    alwaysSingleSet: false,
  },
  bench: {
    id: "bench",
    name: "Bench Press",
    incrementKg: 2.5,
    alwaysSingleSet: false,
  },
  row: {
    id: "row",
    name: "Barbell Row",
    incrementKg: 2.5,
    alwaysSingleSet: false,
  },
  "overhead-press": {
    id: "overhead-press",
    name: "Overhead Press",
    incrementKg: 2.5,
    alwaysSingleSet: false,
  },
  deadlift: {
    id: "deadlift",
    name: "Deadlift",
    incrementKg: 5,
    alwaysSingleSet: true, // always 1x5
  },
};

// ─── Workout A / B lift order ─────────────────────────────────────────────────

export const WORKOUT_LIFTS: Record<WorkoutLabel, MainLiftId[]> = {
  A: ["squat", "bench", "row"],
  B: ["squat", "overhead-press", "deadlift"],
};

// ─── Program scheme → sets/reps ───────────────────────────────────────────────

export const PROGRAM_SCHEMES: Record<ProgramScheme, { sets: number; reps: number }> = {
  "5x5": { sets: 5, reps: 5 },
  "3x5": { sets: 3, reps: 5 },
};

// Deadlift is always 1 set of 5 reps regardless of program
export const DEADLIFT_SCHEME = { sets: 1, reps: 5 };

// ─── Default starting weights (kg) ───────────────────────────────────────────

export const DEFAULT_WEIGHTS: LiftWeights = {
  squat: 20,
  bench: 20,
  row: 20,
  "overhead-press": 20,
  deadlift: 40,
};

// ─── Default app state ────────────────────────────────────────────────────────

export const DEFAULT_APP_STATE: AppState = {
  program: "5x5",
  nextWorkout: "A",
  weights: DEFAULT_WEIGHTS,
  failStreak: {},
  assistanceConfig: { A: [], B: [] },
  sessions: [],
};

// ─── Rest timer duration (seconds) ───────────────────────────────────────────

export const REST_SECONDS = {
  main: 90,     // between main lift sets
  deadlift: 180, // deadlift needs more recovery
  assistance: 60,
};

// ─── Deload threshold ─────────────────────────────────────────────────────────

// Deload after this many consecutive failed sessions on a lift
export const DELOAD_AFTER_FAILS = 3;
export const DELOAD_FACTOR = 0.9; // 10% deload

// ─── Progression logic ────────────────────────────────────────────────────────

/**
 * Given the completed main lifts from a session, calculate the new weights
 * and updated fail streaks for next session.
 */
export function calculateNextWeights(
  currentWeights: LiftWeights,
  currentFailStreak: Partial<Record<MainLiftId, number>>,
  completedLifts: CompletedMainLift[]
): {
  newWeights: LiftWeights;
  newFailStreak: Partial<Record<MainLiftId, number>>;
} {
  const newWeights = { ...currentWeights };
  const newFailStreak = { ...currentFailStreak };

  for (const lift of completedLifts) {
    const config = MAIN_LIFTS[lift.liftId];
    const streak = newFailStreak[lift.liftId] ?? 0;

    if (lift.success) {
      // Success — increment weight, reset fail streak
      newWeights[lift.liftId] = roundToPlate(
        currentWeights[lift.liftId] + config.incrementKg
      );
      newFailStreak[lift.liftId] = 0;
    } else {
      const newStreak = streak + 1;
      newFailStreak[lift.liftId] = newStreak;

      if (newStreak >= DELOAD_AFTER_FAILS) {
        // Deload — drop weight and reset streak
        newWeights[lift.liftId] = roundToPlate(
          currentWeights[lift.liftId] * DELOAD_FACTOR
        );
        newFailStreak[lift.liftId] = 0;
      }
      // else weight stays the same — retry next session
    }
  }

  return { newWeights, newFailStreak };
}

/**
 * Round to nearest 2.5kg (smallest standard plate pair)
 */
function roundToPlate(weight: number): number {
  return Math.round(weight / 2.5) * 2.5;
}

/**
 * Get the sets/reps for a given lift given the current program
 */
export function getSetsReps(
  liftId: MainLiftId,
  program: ProgramScheme
): { sets: number; reps: number } {
  if (MAIN_LIFTS[liftId].alwaysSingleSet) return DEADLIFT_SCHEME;
  return PROGRAM_SCHEMES[program];
}

/**
 * Toggle next workout label
 */
export function getNextWorkoutLabel(current: WorkoutLabel): WorkoutLabel {
  return current === "A" ? "B" : "A";
}



export function getNextWeights(
  weights: LiftWeights,
  incrementKg: number,
  nextLabel: WorkoutLabel
): LiftWeights {
  // Squat is in every workout so it always increments
  // Other lifts only increment after they've been completed
  const liftIds = WORKOUT_LIFTS[nextLabel];

  return Object.fromEntries(
    Object.entries(weights).map(([liftId, weight]) => [
      liftId,
      liftIds.includes(liftId as MainLiftId)
        ? weight + incrementKg
        : weight,
    ])
  ) as LiftWeights;
}

