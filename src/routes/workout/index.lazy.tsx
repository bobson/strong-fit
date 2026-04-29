import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { getSetsReps, MAIN_LIFTS, WORKOUT_LIFTS } from "program";
import { useEffect, useRef, useState } from "react";
import type { MainLiftId, WorkoutLabel } from "types";
import { RestTimer } from "#/components/RestTimer";

import { useApp } from "#/context/AppContext";
import SetCircle from "../../components/SetCircle";

export const Route = createLazyFileRoute("/workout/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { label: initialLabel } = Route.useSearch();

	const { state, setState } = useApp();

	const navigate = useNavigate();

	const restSeconds = 90;

	const [label, setLabel] = useState<WorkoutLabel>(initialLabel);
	const [timerActive, setTimerActive] = useState(false);
	const [secondsRemaining, setSecondsRemaining] = useState(restSeconds);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const [setsCount, setSetsCount] = useState<Record<string, number>>(() =>
		Object.fromEntries(
			WORKOUT_LIFTS[initialLabel].map((liftId) => [
				liftId,
				getSetsReps(liftId, state.program).sets,
			]),
		),
	);

	function updateWeight(liftId: MainLiftId, delta: number) {
		setState((prev) => ({
			...prev,
			weights: {
				...prev.weights,
				[liftId]: Math.max(0, prev.weights[liftId] + delta),
			},
		}));
	}

	function handleLabelChange(newLabel: WorkoutLabel) {
		setLabel(newLabel);
		navigate({
			to: "/workout",
			search: { label: newLabel },
			replace: true, // replace instead of push so back button works correctly
		});

		// add missing lifts for the new workout label
		setSetsCount((prev) => {
			const newEntries = Object.fromEntries(
				WORKOUT_LIFTS[newLabel].map((liftId) => [
					liftId,
					prev[liftId] ?? getSetsReps(liftId, state.program).sets,
				]),
			);
			return { ...prev, ...newEntries };
		});
	}

	function deleteSet(liftId: string) {
		setSetsCount((prev) => ({
			...prev,
			[liftId]: Math.max(1, (prev[liftId] ?? 1) - 1), // minimum 1 set
		}));
	}

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
				onChange={(e) => handleLabelChange(e.target.value as WorkoutLabel)}
				className="island-shell rounded-xl px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] w-fit"
			>
				<option value="A">Workout A — Squat, Bench, Row</option>
				<option value="B">Workout B — Squat, OHP, Deadlift</option>
			</select>

			<div className="flex flex-col gap-4">
				{liftIds.map((liftId) => {
					// const { sets } = getSetsReps(liftId, state.program);
					return (
						<div
							key={liftId}
							className="island-shell rounded-2xl p-5 flex flex-col gap-4"
						>
							<div className="flex items-center justify-between">
								<span className="font-semibold text-[var(--sea-ink)]">
									{MAIN_LIFTS[liftId].name}
								</span>
								{/* <span className="text-sm font-bold text-[var(--sea-ink-soft)]">
									{state.weights[liftId]} kg
								</span> */}
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() => updateWeight(liftId, -2.5)}
										className="size-7 rounded-full border border-[var(--line)] text-[var(--sea-ink-soft)]
      hover:border-[var(--lagoon-deep)] hover:text-[var(--lagoon-deep)]
      cursor-pointer font-bold transition-all flex items-center justify-center text-sm"
									>
										−
									</button>

									<span className="text-sm font-bold text-[var(--sea-ink-soft)]">
										{state.weights[liftId]} kg
									</span>

									<button
										type="button"
										onClick={() => updateWeight(liftId, 2.5)}
										className="size-7 rounded-full border border-[var(--line)] text-[var(--sea-ink-soft)]
      hover:border-[var(--lagoon-deep)] hover:text-[var(--lagoon-deep)]
      cursor-pointer font-bold transition-all flex items-center justify-center text-sm"
									>
										+
									</button>
								</div>
							</div>
							<div className="flex gap-3">
								{Array.from({ length: setsCount[liftId] }).map((_, i) => (
									<SetCircle
										// biome-ignore lint/suspicious/noArrayIndexKey: order is fixed
										key={i}
										onTimerStart={startTimer}
										onTimerStop={stopTimer}
										onDelete={() => deleteSet(liftId)}
									/>
								))}
							</div>
						</div>
					);
				})}
			</div>

			<RestTimer
				secondsRemaining={secondsRemaining}
				visible={timerActive}
				onClose={stopTimer}
			/>
		</div>
	);
}
