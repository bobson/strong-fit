import type { MainLiftId, ProgramScheme, WorkoutLabel } from "types";
// import { MAIN_LIFTS } from "./program";
import { supabase } from "./supabase";

interface LiftResult {
	liftId: MainLiftId;
	name: string;
	weight: number;
	repsPerSet: number[];
}

export async function saveSession(
	userId: string,
	workoutLabel: WorkoutLabel,
	program: ProgramScheme,
	lifts: LiftResult[],
	durationSeconds: number,
): Promise<void> {
	await supabase.from("sessions").insert({
		user_id: userId,
		workout_label: workoutLabel,
		program,
		lifts,
		duration_seconds: durationSeconds,
	});
}

export async function loadSessions(userId: string) {
	const { data, error } = await supabase
		.from("sessions")
		.select("*")
		.eq("user_id", userId)
		.order("date", { ascending: false });

	if (error || !data) return [];
	return data;
}
