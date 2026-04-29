import type { AppState } from "types";
import { supabase } from "./supabase";

export async function loadUserState(userId: string): Promise<AppState | null> {
	const { data, error } = await supabase
		.from("user_state")
		.select("*")
		.eq("user_id", userId)
		.single();

	if (error || !data) return null;

	return {
		current: data.current_workout,
		previous: null,
		program: data.program,
		weights: data.weights,
		incrementKg: data.increment_kg,
	};
}

export async function saveUserState(
	userId: string,
	state: AppState,
): Promise<void> {
	await supabase.from("user_state").upsert(
		{
			user_id: userId,
			program: state.program,
			current_workout: state.current,
			weights: state.weights,
			increment_kg: state.incrementKg,
			updated_at: new Date().toISOString(),
		},
		{
			onConflict: "user_id",
		},
	);
}
