import { createFileRoute } from "@tanstack/react-router";
import { DEFAULT_APP_STATE, DEFAULT_WEIGHTS } from "program";
import { useEffect, useState } from "react";
import type { LiftWeights, ProgramScheme, WorkoutLabel } from "types";
import HomeContent from "#/components/HomeContent";
import ProgramSetup from "#/components/ProgramSetup";
import WeightsSetup from "#/components/WeightsSetup";
import { STORAGE_KEY, useApp } from "#/context/AppContext";

export const Route = createFileRoute("/")({ component: App });

type Step = "program" | "weights" | "home";

function App() {
	const { state, setState } = useApp();
	const [step, setStep] = useState<Step>(() => {
		if (typeof window === "undefined") return "program";
		return localStorage.getItem(STORAGE_KEY) ? "home" : "program";
	});

	if (step === "program") {
		return (
			<ProgramSetup
				program={state.program}
				onChange={(program) => setState((prev) => ({ ...prev, program }))}
				onNext={() => setStep("weights")}
			/>
		);
	}

	if (step === "weights") {
		return (
			<WeightsSetup
				onBack={() => setStep("program")}
				onStart={(weights) => {
					const newState = { ...state, weights };
					setState(newState);
					// first time we write to localStorage — setup is complete
					localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
					setStep("home");
				}}
			/>
		);
	}

	return <HomeContent state={state} />;
}
