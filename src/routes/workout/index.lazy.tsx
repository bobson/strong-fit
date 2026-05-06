import { createLazyFileRoute } from "@tanstack/react-router";
import { MAIN_LIFTS } from "program";
import { memo } from "react";
// import { useEffect } from "react";
import type { MainLiftId, WorkoutLabel } from "types";
import { RestTimer } from "#/components/RestTimer";
import SetCircle from "#/components/SetCircle";
import { useWorkoutState } from "#/hooks/useWorkoutState";

export const Route = createLazyFileRoute("/workout/")({
	component: RouteComponent,
});

// add this above RouteComponent
interface LiftCardProps {
	liftId: MainLiftId;
	name: string;
	weight: number;
	sets: number;
	onTimerStart: () => void;
	onTimerStop: () => void;
	onDelete: (liftId: string) => void;
	onComplete: (liftId: string, setIndex: number, success: boolean) => void;
	onUpdateWeight: (liftId: MainLiftId, delta: number) => void;
}

const LiftCard = memo(function LiftCard({
	liftId,
	name,
	weight,
	sets,
	onTimerStart,
	onTimerStop,
	onDelete,
	onComplete,
	onUpdateWeight,
}: LiftCardProps) {
	return (
		<div className="island-shell rounded-2xl p-5 flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<span className="font-semibold text-[var(--sea-ink)]">{name}</span>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => onUpdateWeight(liftId, -2.5)}
						className="size-7 rounded-full border border-[var(--line)] text-[var(--sea-ink-soft)]
              hover:border-[var(--lagoon-deep)] hover:text-[var(--lagoon-deep)]
              cursor-pointer font-bold transition-all flex items-center justify-center text-sm"
					>
						−
					</button>
					<span className="text-sm font-bold text-[var(--sea-ink-soft)] w-16 text-center">
						{weight} kg
					</span>
					<button
						type="button"
						onClick={() => onUpdateWeight(liftId, 2.5)}
						className="size-7 rounded-full border border-[var(--line)] text-[var(--sea-ink-soft)]
              hover:border-[var(--lagoon-deep)] hover:text-[var(--lagoon-deep)]
              cursor-pointer font-bold transition-all flex items-center justify-center text-sm"
					>
						+
					</button>
				</div>
			</div>
			<div className="flex gap-3">
				{Array.from({ length: sets }).map((_, i) => (
					<SetCircle
						// biome-ignore lint/suspicious/noArrayIndexKey: order is fixed
						key={i}
						onTimerStart={onTimerStart}
						onTimerStop={onTimerStop}
						onDelete={() => onDelete(liftId)}
						onComplete={(success) => onComplete(liftId, i, success)}
					/>
				))}
			</div>
		</div>
	);
});

function RouteComponent() {
	const { label: initialLabel } = Route.useSearch();

	const {
		label,
		state,
		liftIds,
		setsCount,
		timerActive,
		secondsRemaining,
		showConfirm,
		// timerRef,
		hasAnySetCompleted,
		handleLabelChange,
		updateWeight,
		deleteSet,
		handleSetComplete,
		startTimer,
		stopTimer,
		handleFinishClick,
		handleFinishWorkout,
		setShowConfirm,
	} = useWorkoutState(initialLabel);

	// timer countdown
	// useEffect(() => {
	// 	if (!timerActive) {
	// 		if (timerRef.current) clearInterval(timerRef.current);
	// 		return
	// 	}
	// 	timerRef.current = setInterval(() => {
	// 		handled inside hook via stopTimer
	// 	}, 1000);
	// 	return () => {
	// 		if (timerRef.current) clearInterval(timerRef.current);
	// 	}
	// }, [timerActive, timerRef]);

	return (
		<div className="page-wrap flex flex-col gap-6">
			{/* Workout selector */}
			<select
				value={label}
				onChange={(e) => handleLabelChange(e.target.value as WorkoutLabel)}
				className="island-shell rounded-xl px-4 py-2  text-sm font-semibold text-[var(--sea-ink)] w-fit"
			>
				<option value="A">Workout A — Squat, Bench, Row</option>
				<option value="B">Workout B — Squat, OHP, Deadlift</option>
			</select>

			{/* Lift cards */}
			<div className="flex flex-col gap-4">
				{liftIds.map((liftId) => (
					<LiftCard
						key={liftId}
						liftId={liftId}
						name={MAIN_LIFTS[liftId].name}
						weight={state.weights[liftId]}
						sets={setsCount[liftId]}
						onTimerStart={startTimer}
						onTimerStop={stopTimer}
						onDelete={deleteSet}
						onComplete={handleSetComplete}
						onUpdateWeight={updateWeight}
					/>
				))}
			</div>

			{/* Finish button */}
			<button
				type="button"
				onClick={handleFinishClick}
				disabled={!hasAnySetCompleted}
				className={`island-shell rounded-2xl px-8 py-4 font-bold transition-all w-full text-center
          ${
						hasAnySetCompleted
							? "text-[var(--lagoon-deep)] cursor-pointer hover:border-[var(--lagoon-deep)]"
							: "text-[var(--sea-ink-soft)] opacity-50 cursor-not-allowed"
					}`}
			>
				Finish Workout
			</button>

			{/* Confirmation modal */}
			{showConfirm && (
				<>
					<div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
					<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
						<div className="island-shell rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
							<div>
								<h2 className="font-bold text-lg text-[var(--sea-ink)]">
									Finish Workout?
								</h2>
								<p className="text-sm text-[var(--sea-ink-soft)] mt-1">
									You haven't logged all sets. Incomplete lifts will have their
									weight decreased by 10% next session.
								</p>
							</div>
							<div className="flex gap-3">
								<button
									type="button"
									onClick={() => setShowConfirm(false)}
									className="flex-1 island-shell rounded-xl py-3 text-sm font-semibold
                    text-[var(--sea-ink-soft)] cursor-pointer hover:border-[var(--lagoon-deep)]
                    transition-all text-center"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={() => {
										setShowConfirm(false);
										handleFinishWorkout();
									}}
									className="flex-1 island-shell rounded-xl py-3 text-sm font-semibold
                    text-[var(--lagoon-deep)] cursor-pointer hover:border-[var(--lagoon-deep)]
                    transition-all text-center"
								>
									Finish
								</button>
							</div>
						</div>
					</div>
				</>
			)}

			<RestTimer
				secondsRemaining={secondsRemaining}
				visible={timerActive}
				onClose={stopTimer}
			/>
		</div>
	);
}
