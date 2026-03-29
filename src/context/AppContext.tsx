import { DEFAULT_APP_STATE } from "program";
import { createContext, useContext, useEffect, useState } from "react";
import type { AppState } from "types";

export const STORAGE_KEY = "strongfit-app-state";

function loadState(): AppState {
	if (typeof window === "undefined") return DEFAULT_APP_STATE;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as AppState) : DEFAULT_APP_STATE;
	} catch {
		return DEFAULT_APP_STATE;
	}
}

const AppContext = createContext<{
	state: AppState;
	setState: React.Dispatch<React.SetStateAction<AppState>>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState(loadState);

	// Sync to localStorage on every state change
	useEffect(() => {
		if (!localStorage.getItem(STORAGE_KEY)) return; // setup not done yet
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	}, [state]);

	return (
		<AppContext.Provider value={{ state, setState }}>
			{children}
		</AppContext.Provider>
	);
}

export function useApp() {
	const ctx = useContext(AppContext);
	if (!ctx) throw new Error("useApp must be used within AppProvider");
	return ctx;
}
