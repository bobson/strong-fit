import { createFileRoute } from "@tanstack/react-router";
import { getSetsReps, MAIN_LIFTS, WORKOUT_LIFTS } from "program";
import { useEffect, useRef, useState } from "react";
import type { LiftWeights, ProgramScheme, WorkoutLabel } from "types";
import { RestTimer } from "#/components/RestTimer";
import SetCircle from "#/components/SetCircle";
import { useApp } from "#/context/AppContext";

export const Route = createFileRoute("/workout")({
	validateSearch: (search: Record<string, unknown>) => ({
		label: (search.label as WorkoutLabel) ?? "A",
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const { label: initialLabel } = Route.useSearch();

	const { state } = useApp();

	const restSeconds = 90;

	const [label, setLabel] = useState<WorkoutLabel>(initialLabel);
	const [timerActive, setTimerActive] = useState(false);
	const [secondsRemaining, setSecondsRemaining] = useState(restSeconds);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	function startTimer() {
		setSecondsRemaining(restSeconds);
		setTimerActive(true);
	}

	function stopTimer() {
		setTimerActive(false);
		setSecondsRemaining(restSeconds);
	}

	useEffect(() => {
		if (!timerActive) {
			if (timerRef.current) clearInterval(timerRef.current);
			return;
		}

		timerRef.current = setInterval(() => {
			setSecondsRemaining((prev) => {
				if (prev <= 1) {
					setTimerActive(false);
					return restSeconds;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [timerActive]);

	const liftIds = WORKOUT_LIFTS[label];

	return (
		<div className="page-wrap flex flex-col gap-6 py-8">
			<select
				value={label}
				onChange={(e) => setLabel(e.target.value as WorkoutLabel)}
				className="island-shell rounded-xl px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] w-fit"
			>
				<option value="A">Workout A — Squat, Bench, Row</option>
				<option value="B">Workout B — Squat, OHP, Deadlift</option>
			</select>

			<div className="flex flex-col gap-4">
				{liftIds.map((liftId) => {
					const { sets } = getSetsReps(liftId, state.program);
					return (
						<div
							key={liftId}
							className="island-shell rounded-2xl p-5 flex flex-col gap-4"
						>
							<div className="flex items-center justify-between">
								<span className="font-semibold text-[var(--sea-ink)]">
									{MAIN_LIFTS[liftId].name}
								</span>
								<span className="text-sm font-bold text-[var(--sea-ink-soft)]">
									{state.weights[liftId]} kg
								</span>
							</div>
							<div className="flex gap-3">
								{Array.from({ length: sets }).map((_, i) => (
									<SetCircle
										// biome-ignore lint/suspicious/noArrayIndexKey: order is fixed
										key={i}
										onTimerStart={startTimer}
										onTimerStop={stopTimer}
									/>
								))}
							</div>
						</div>
					);
				})}
			</div>

			<RestTimer secondsRemaining={secondsRemaining} visible={timerActive} />
		</div>
	);
}
