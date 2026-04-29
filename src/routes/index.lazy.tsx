import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { STORAGE_KEY, useApp } from "#/context/AppContext";

import HomeContent from "../components/home/HomeContent";
import ProgramSetup from "../components/home/ProgramSetup";
import WeightsSetup from "../components/home/WeightsSetup";

export const Route = createLazyFileRoute("/")({ component: App });

type Step = "program" | "weights" | "home";

function App() {
	const { state, setState } = useApp();
	const [step, setStep] = useState<Step>("program"); // always "program" on server
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		if (localStorage.getItem(STORAGE_KEY)) {
			setStep("home");
		}
		setHydrated(true);
	}, []);

	if (!hydrated) return null;

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
