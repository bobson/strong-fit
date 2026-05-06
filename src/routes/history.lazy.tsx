import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "#/context/AuthContext";
import { loadSessions } from "#/lib/sessions";

export const Route = createLazyFileRoute("/history")({
	component: HistoryPage,
});

interface SessionRecord {
	id: string;
	workout_label: string;
	date: string;
	program: string;
	lifts: {
		liftId: string;
		name: string;
		weight: number;
		success: boolean;
	}[];
	duration_seconds: number;
}

function HistoryPage() {
	const { user } = useAuth();
	const [sessions, setSessions] = useState<SessionRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selected, setSelected] = useState<SessionRecord | null>(null);

	useEffect(() => {
		if (!user) return;
		loadSessions(user.id).then((data) => {
			setSessions(data as SessionRecord[]);
			setLoading(false);
		});
	}, [user]);

	// calendar helpers
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();

	const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	// map date string "YYYY-MM-DD" to session
	const sessionsByDate = sessions.reduce<Record<string, SessionRecord>>(
		(acc, session) => {
			const date = new Date(session.date).toLocaleDateString("en-CA"); // YYYY-MM-DD
			acc[date] = session;
			return acc;
		},
		{},
	);

	function prevMonth() {
		setCurrentDate(new Date(year, month - 1, 1));
		setSelected(null);
	}

	function nextMonth() {
		setCurrentDate(new Date(year, month + 1, 1));
		setSelected(null);
	}

	const monthName = currentDate.toLocaleString("default", {
		month: "long",
		year: "numeric",
	});

	if (loading)
		return (
			<div className="page-wrap text-[var(--sea-ink-soft)] text-sm">
				Loading...
			</div>
		);

	return (
		<div className="page-wrap flex flex-col gap-6">
			<h1 className="display-title text-3xl text-[var(--sea-ink)]">History</h1>

			{/* Calendar */}
			<div className="island-shell rounded-2xl p-5 flex flex-col gap-4">
				{/* Month navigation */}
				<div className="flex items-center justify-between">
					<button
						type="button"
						onClick={prevMonth}
						className="size-8 rounded-full border border-[var(--line)] flex items-center
              justify-center text-[var(--sea-ink-soft)] hover:border-[var(--lagoon-deep)]
              hover:text-[var(--lagoon-deep)] cursor-pointer transition-all"
					>
						←
					</button>
					<span className="font-bold text-[var(--sea-ink)]">{monthName}</span>
					<button
						type="button"
						onClick={nextMonth}
						className="size-8 rounded-full border border-[var(--line)] flex items-center
              justify-center text-[var(--sea-ink-soft)] hover:border-[var(--lagoon-deep)]
              hover:text-[var(--lagoon-deep)] cursor-pointer transition-all"
					>
						→
					</button>
				</div>

				{/* Day labels */}
				<div className="grid grid-cols-7 text-center ">
					{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
						<span
							key={d}
							className="text-xs font-bold text-[var(--sea-ink-soft)] py-1"
						>
							{d}
						</span>
					))}
				</div>

				{/* Calendar grid */}
				<div className="grid grid-cols-7 gap-3">
					{/* empty cells before first day */}
					{Array.from({ length: firstDay }).map((_, i) => (
						<div
							key={`empty-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								i
							}`}
						/>
					))}

					{/* day cells */}
					{Array.from({ length: daysInMonth }).map((_, i) => {
						const day = i + 1;
						const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
						const session = sessionsByDate[dateStr];
						const isToday = new Date().toLocaleDateString("en-CA") === dateStr;
						const isSelected = selected?.id === session?.id;
						const allSuccess = session?.lifts.every((l) => l.success);

						return (
							<button
								key={day}
								type="button"
								onClick={() =>
									session && setSelected(isSelected ? null : session)
								}
								className={`
    aspect-square rounded-full flex flex-col items-center justify-center gap-0.5
    text-xs font-semibold transition-all max-w-9
    ${session ? "cursor-pointer hover:border-[var(--lagoon-deep)]" : "cursor-default"}
    ${isSelected ? "border-[var(--lagoon-deep)] bg-[var(--lagoon)]/10 border" : ""}
    ${isToday ? "border border-[var(--line)]" : ""}
    ${!session && !isToday ? "text-[var(--sea-ink-soft)]" : "text-[var(--sea-ink)]"}
  `}
							>
								{day}
								{session && (
									<span
										className={`size-1 rounded-full ${
											allSuccess
												? "bg-[var(--palm)]"
												: "bg-[var(--lagoon-deep)]"
										}`}
									/>
								)}
							</button>
						);
					})}
				</div>
			</div>

			{/* Selected session detail */}
			{selected && (
				<div className="island-shell rounded-2xl p-5 flex flex-col gap-4 rise-in">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="font-bold text-[var(--sea-ink)]">
								Workout {selected.workout_label}
							</h2>
							<p className="text-xs text-[var(--sea-ink-soft)] mt-0.5">
								{new Date(selected.date).toLocaleDateString("default", {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</p>
						</div>
						<span className="island-kicker">{selected.program}</span>
					</div>

					<div className="flex flex-col gap-2">
						{selected.lifts.map((lift) => (
							<div
								key={lift.liftId}
								className="flex items-center justify-between py-2 border-b border-[var(--line)] last:border-0"
							>
								<span className="text-sm font-semibold text-[var(--sea-ink)]">
									{lift.name}
								</span>
								<div className="flex items-center gap-3">
									<span className="text-sm text-[var(--sea-ink-soft)]">
										{lift.weight} kg
									</span>
									<span
										className={`text-xs font-bold px-2 py-0.5 rounded-full ${
											lift.success
												? "bg-[var(--palm)]/15 text-[var(--palm)]"
												: "bg-[var(--lagoon-deep)]/15 text-[var(--lagoon-deep)]"
										}`}
									>
										{lift.success ? "✓ Done" : "✗ Failed"}
									</span>
								</div>
							</div>
						))}
					</div>

					{selected.duration_seconds > 0 && (
						<p className="text-xs text-[var(--sea-ink-soft)]">
							Duration: {Math.floor(selected.duration_seconds / 60)} min
						</p>
					)}
				</div>
			)}

			{sessions.length === 0 && (
				<p className="text-sm text-[var(--sea-ink-soft)] text-center py-8">
					No workouts yet. Finish your first workout to see it here.
				</p>
			)}
		</div>
	);
}
