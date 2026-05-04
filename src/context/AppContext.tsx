import { DEFAULT_APP_STATE } from "program";
import { createContext, useContext, useEffect, useState } from "react";
import type { AppState } from "types";
import { loadUserState, saveUserState } from "#/lib/userState";
import { useAuth } from "./AuthContext";

export const STORAGE_KEY = "strongfit-app-state";

const AppContext = createContext<{
	state: AppState;
	setState: React.Dispatch<React.SetStateAction<AppState>>;
	hydrated: boolean;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
	const { user } = useAuth();
	const [state, setState] = useState<AppState>(DEFAULT_APP_STATE);
	const [hydrated, setHydrated] = useState(false);

	// load state when user logs in
	useEffect(() => {
		if (!user) {
			// still check localStorage for non-logged-in users
			try {
				const raw = localStorage.getItem(STORAGE_KEY);
				if (raw) setState(JSON.parse(raw) as AppState);
			} catch {}
			setHydrated(true);
			return;
		}

		loadUserState(user.id).then((savedState) => {
			if (savedState) {
				setState(savedState);
			} else {
				// first time user — check localStorage as fallback
				try {
					const raw = localStorage.getItem(STORAGE_KEY);
					if (raw) setState(JSON.parse(raw) as AppState);
				} catch {}
			}
			setHydrated(true);
		});
	}, [user]);

	// save to Supabase and localStorage whenever state changes
	useEffect(() => {
		if (!hydrated) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		if (user) saveUserState(user.id, state);
	}, [state, hydrated, user]);

	return (
		<AppContext.Provider value={{ state, setState, hydrated }}>
			{children}
		</AppContext.Provider>
	);
}

export function useApp() {
	const ctx = useContext(AppContext);
	if (!ctx) throw new Error("useApp must be used within AppProvider");
	return ctx;
}
