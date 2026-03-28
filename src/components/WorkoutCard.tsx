import type { LiftWeights, WorkoutLabel } from "types";
import { MAIN_LIFTS, WORKOUT_LIFTS } from "../../program";

interface WorkoutCardProps {
	label: WorkoutLabel;
	variant: "current" | "next" | "previous";
	index: number;
	weights: LiftWeights;
}

const WorkoutCard = ({ label, variant, weights, index }: WorkoutCardProps) => {
	const liftIds = WORKOUT_LIFTS[label];
	return (
		<article
			className={`island-shell feature-card rise-in rounded-2xl p-5 ${
				variant === "current" ? "workout-card--current" : ""
			}`}
			style={{ animationDelay: `${index * 90 + 80}ms` }}
		>
			<h2 className="flex items-center mb-2 text-base font-semibold text-[var(--sea-ink)]">
				Workout {label}
				<span className="ml-auto badge">
					{variant === "current"
						? "Today"
						: variant === "previous"
							? "Previous"
							: "Next"}
				</span>
			</h2>

			{liftIds.map((lift) => (
				<div key={lift} className="flex items-center justify-between py-1">
					<p className="m-0 text-sm text-[var(--sea-ink-soft)]">
						{MAIN_LIFTS[lift].name}
					</p>
					<span className="text-sm  text-[var(--sea-ink)]">
						{weights[lift]} kg
					</span>
				</div>
			))}
		</article>
	);
};

export default WorkoutCard;
