import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LoginPage } from "#/components/LoginPage";
import { STORAGE_KEY, useApp } from "#/context/AppContext";
import { useAuth } from "#/context/AuthContext";
import HomeContent from "../components/home/HomeContent";
import ProgramSetup from "../components/home/ProgramSetup";
import WeightsSetup from "../components/home/WeightsSetup";

export const Route = createLazyFileRoute("/")({ component: App });

type Step = "program" | "weights" | "home";

function App() {
	const { user, loading } = useAuth();
	const { state, setState, hydrated } = useApp();
	const [step, setStep] = useState<Step>("program"); // always "program" on server

	// once hydrated, skip setup if already completed
	useEffect(() => {
		if (hydrated && state.setupComplete) {
			setStep("home");
		}
	}, [hydrated, state.setupComplete]);

	if (!hydrated) return null;

	// not logged in — show login page
	if (!user) return <LoginPage />;

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
					const newState = { ...state, weights, setupComplete: true };
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
