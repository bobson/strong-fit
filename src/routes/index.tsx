import { createFileRoute, Link } from "@tanstack/react-router";
import { DEFAULT_WEIGHTS, getNextWeights } from "program";
import { useState } from "react";
import type { LiftWeights, WorkoutLabel } from "types";
import WorkoutCard from "#/components/WorkoutCard";

export const Route = createFileRoute("/")({ component: App });

interface AppState {
	current: WorkoutLabel;
	previous: WorkoutLabel | null;
	weights: LiftWeights;
	incrementKg: number;
}

function App() {
	const [state, setState] = useState<AppState>({
		current: "A",
		previous: null,
		weights: DEFAULT_WEIGHTS,
		incrementKg: 2.5,
	});

	const next: WorkoutLabel = state.current === "A" ? "B" : "A";
	return (
		<main className="page-wrap  pb-8 pt-14">
			<h1>The Big 5</h1>

			<section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{state.previous && (
					<Link to="/workout" className="no-underline cursor-pointer">
						<WorkoutCard
							label={state.previous}
							variant="previous"
							index={0}
							weights={state.weights}
						/>
					</Link>
				)}
				<Link to="/workout" className="no-underline cursor-pointer">
					<WorkoutCard
						label={state.current}
						variant="current"
						index={state.previous ? 1 : 0}
						weights={state.weights}
					/>
				</Link>
				<Link to="/workout" className="no-underline cursor-pointer">
					<WorkoutCard
						label={next}
						variant="next"
						index={state.previous ? 2 : 1}
						weights={getNextWeights(state.weights, state.incrementKg, next)}
					/>
				</Link>
			</section>
		</main>
	);
}
