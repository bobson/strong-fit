import type { WorkoutLabel, LiftWeights, ProgramScheme, MainLiftId } from "./types";
import {
  WORKOUT_LIFTS,
  MAIN_LIFTS,
  getSetsReps,
  getNextWorkoutLabel,
} from "./program";

export interface ScheduledLift {
  liftId: MainLiftId;
  name: string;
  weight: number;
  sets: number;
  reps: number;
}

export interface ScheduledWorkout {
  label: WorkoutLabel;
  isNext: boolean; // first in the list
  lifts: ScheduledLift[];
}

/**
 * Returns the next 3 workouts in order (e.g. A, B, A or B, A, B)
 * based on the current nextWorkout label.
 */
export function getSchedule(
  nextWorkout: WorkoutLabel,
  weights: LiftWeights,
  program: ProgramScheme
): [ScheduledWorkout, ScheduledWorkout, ScheduledWorkout] {
  const labels: WorkoutLabel[] = [
    nextWorkout,
    getNextWorkoutLabel(nextWorkout),
    nextWorkout,
  ];

  return labels.map((label, index) => ({
    label,
    isNext: index === 0,
    lifts: WORKOUT_LIFTS[label].map((liftId) => {
      const { sets, reps } = getSetsReps(liftId, program);
      return {
        liftId,
        name: MAIN_LIFTS[liftId].name,
        weight: weights[liftId],
        sets,
        reps,
      };
    }),
  })) as [ScheduledWorkout, ScheduledWorkout, ScheduledWorkout];
}
