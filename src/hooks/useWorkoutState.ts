import { useNavigate } from "@tanstack/react-router";
import {
	calculateNextWeights,
	getSetsReps,
	MAIN_LIFTS,
	WORKOUT_LIFTS,
} from "program";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MainLiftId, WorkoutLabel } from "types";
import { useApp } from "#/context/AppContext";
import { useAuth } from "#/context/AuthContext";
import { saveSession } from "#/lib/sessions";

export function useWorkoutState(initialLabel: WorkoutLabel) {
	const { state, setState } = useApp();
	const { user } = useAuth();
	const navigate = useNavigate();
	const startTimeRef = useRef<number>(Date.now());

	const [label, setLabel] = useState<WorkoutLabel>(initialLabel);
	const [timerActive, setTimerActive] = useState(false);
	const [secondsRemaining, setSecondsRemaining] = useState(90);
	const [showConfirm, setShowConfirm] = useState(false);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const [setsCount, setSetsCount] = useState<Record<string, number>>(() =>
		Object.fromEntries(
			WORKOUT_LIFTS[initialLabel].map((liftId) => [
				liftId,
				getSetsReps(liftId, state.program).sets,
			]),
		),
	);

	const [liftSuccess, setLiftSuccess] = useState<Record<string, boolean[]>>(
		() =>
			Object.fromEntries(
				WORKOUT_LIFTS[initialLabel].map((liftId) => [
					liftId,
					Array(getSetsReps(liftId, state.program).sets).fill(false),
				]),
			),
	);

	useEffect(() => {
		if (!timerActive) {
			if (timerRef.current) clearInterval(timerRef.current);
			return;
		}

		timerRef.current = setInterval(() => {
			setSecondsRemaining((prev) => {
				if (prev <= 1) {
					setTimerActive(false);
					return 90;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [timerActive]);

	function handleLabelChange(newLabel: WorkoutLabel) {
		setLabel(newLabel);
		navigate({ to: "/workout", search: { label: newLabel }, replace: true });
		setSetsCount((prev) => ({
			...prev,
			...Object.fromEntries(
				WORKOUT_LIFTS[newLabel].map((liftId) => [
					liftId,
					prev[liftId] ?? getSetsReps(liftId, state.program).sets,
				]),
			),
		}));
	}

	const handleSetComplete = useCallback(
		(liftId: string, setIndex: number, success: boolean) => {
			setLiftSuccess((prev) => {
				const updated = [...(prev[liftId] ?? [])];
				updated[setIndex] = success;
				return { ...prev, [liftId]: updated };
			});
		},
		[],
	);

	const deleteSet = useCallback((liftId: string) => {
		setSetsCount((prev) => ({
			...prev,
			[liftId]: Math.max(1, (prev[liftId] ?? 1) - 1),
		}));
	}, []);

	const updateWeight = useCallback(
		(liftId: MainLiftId, delta: number) => {
			setState((prev) => ({
				...prev,
				weights: {
					...prev.weights,
					[liftId]: Math.max(0, prev.weights[liftId] + delta),
				},
			}));
		},
		[setState],
	);

	const startTimer = useCallback(() => {
		setSecondsRemaining(90);
		setTimerActive(true);
	}, []);

	const stopTimer = useCallback(() => {
		setTimerActive(false);
		setSecondsRemaining(90);
	}, []);

	const liftIds = WORKOUT_LIFTS[label];

	const hasAnySetCompleted = liftIds.some((liftId) =>
		(liftSuccess[liftId] ?? []).some(Boolean),
	);

	const allSetsCompleted = liftIds.every((liftId) =>
		(liftSuccess[liftId] ?? []).every(Boolean),
	);

	function handleFinishClick() {
		if (!allSetsCompleted) {
			setShowConfirm(true);
		} else {
			handleFinishWorkout();
		}
	}

	async function handleFinishWorkout() {
		if (!user) return;

		const durationSeconds = Math.floor(
			(Date.now() - startTimeRef.current) / 1000,
		);

		const completedLifts = liftIds.map((liftId) => ({
			liftId,
			name: MAIN_LIFTS[liftId].name,
			weight: state.weights[liftId],
			repsPerSet: [],
			success: (liftSuccess[liftId] ?? []).every(Boolean),
		}));

		await saveSession(
			user.id,
			label,
			state.program,
			completedLifts,
			durationSeconds,
		);

		const { newWeights, newFailStreak } = calculateNextWeights(
			state.weights,
			state.failStreak ?? {},
			completedLifts,
		);

		setState((prev) => ({
			...prev,
			current: prev.current === "A" ? "B" : "A",
			previous: label,
			previousWeights: prev.weights,
			weights: newWeights,
			failStreak: newFailStreak,
		}));

		navigate({ to: "/" });
	}

	return {
		label,
		state,
		liftIds,
		setsCount,
		liftSuccess,
		timerActive,
		secondsRemaining,
		showConfirm,
		timerRef,
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
	};
}
