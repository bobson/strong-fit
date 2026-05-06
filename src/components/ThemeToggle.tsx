import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

function getInitialMode(): ThemeMode {
	if (typeof window === "undefined") return "dark";
	// read from DOM — already set by THEME_INIT_SCRIPT before React hydrates
	const fromDom = document.documentElement.getAttribute("data-theme");
	if (fromDom === "light" || fromDom === "dark") return fromDom;

	if (document.documentElement.classList.contains("light"))
		// fallback to classList
		return "light";

	return "dark";
}

function applyThemeMode(mode: ThemeMode) {
	document.documentElement.classList.remove("light", "dark");
	document.documentElement.classList.add(mode);
	document.documentElement.setAttribute("data-theme", mode);
	document.documentElement.style.colorScheme = mode;
}

function MoonIcon() {
	return (
		<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
			<title>Moon icon</title>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		</svg>
	);
}

function SunIcon() {
	return (
		<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
			<title>Sun icon</title>
			<circle cx="12" cy="12" r="5" />
			<g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
				<line x1="12" y1="1" x2="12" y2="3" />
				<line x1="12" y1="21" x2="12" y2="23" />
				<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
				<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
				<line x1="1" y1="12" x2="3" y2="12" />
				<line x1="21" y1="12" x2="23" y2="12" />
				<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
				<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
			</g>
		</svg>
	);
}

export default function ThemeToggle() {
	const [mode, setMode] = useState<ThemeMode>("dark");

	useEffect(() => {
		// sync state with DOM on mount
		setMode(getInitialMode());

		// add transition class after hydration so theme change is animated
		// but initial load is instant
		// requestAnimationFrame(() => {
		// 	document.documentElement.classList.add("theme-ready");
		// });
	}, []);

	function toggle() {
		const next: ThemeMode = mode === "dark" ? "light" : "dark";
		setMode(next);
		applyThemeMode(next);
		window.localStorage.setItem("theme", next);
	}

	const isDark = mode === "dark";

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
			className="relative flex items-center w-16 h-8 rounded-full p-1 cursor-pointer border border-[var(--chip-line)]"
			style={{ background: isDark ? "var(--sand)" : "var(--chip-bg)" }}
		>
			{/* Icons */}
			<span className="absolute left-2 text-[var(--sea-ink-soft)]">
				<MoonIcon />
			</span>
			<span className="absolute right-2 text-[var(--sea-ink-soft)]">
				<SunIcon />
			</span>

			{/* Sliding knob */}
			<span
				className="absolute left-1 size-6 rounded-full shadow-sm flex items-center justify-center"
				style={{
					background: "var(--lagoon-deep)",
					color: "white",
					transform: isDark ? "translateX(0)" : "translateX(32px)",
					transition: "transform 0.1s ease",
					willChange: "transform",
				}}
			>
				{isDark ? <MoonIcon /> : <SunIcon />}
			</span>
		</button>
	);
}
