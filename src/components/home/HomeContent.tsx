import { Link } from "@tanstack/react-router";
import { getNextWeights } from "program";
import type { AppState, WorkoutLabel } from "types";
import WorkoutCard from "./WorkoutCard";

const HomeContent = ({ state }: { state: AppState }) => {
	const next: WorkoutLabel = state.current === "A" ? "B" : "A";
	return (
		<main className="page-wrap  pb-8 pt-14">
			<h1>The Big 5</h1>

			<section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{state.previous && (
					<Link
						to="/workout"
						search={{ label: state.previous }}
						className="no-underline cursor-pointer"
					>
						<WorkoutCard
							label={state.previous}
							variant="previous"
							index={0}
							weights={state.weights}
						/>
					</Link>
				)}
				<Link
					to="/workout"
					search={{ label: state.current }}
					className="no-underline cursor-pointer"
				>
					<WorkoutCard
						label={state.current}
						variant="current"
						index={state.previous ? 1 : 0}
						weights={state.weights}
					/>
				</Link>
				<Link
					to="/workout"
					search={{ label: next }}
					className="no-underline cursor-pointer"
				>
					<WorkoutCard
						label={next}
						variant="next"
						index={state.previous ? 2 : 1}
						weights={getNextWeights(state.weights, next)}
					/>
				</Link>
			</section>
		</main>
	);
};

export default HomeContent;
