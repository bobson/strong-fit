import { DEFAULT_WEIGHTS, MAIN_LIFTS } from "program";
import { useState } from "react";
import type { LiftWeights } from "types";

interface WeightsSetupProps {
	onBack: () => void;
	onStart: (weights: LiftWeights) => void;
}

const LIFTS = Object.values(MAIN_LIFTS);

export default function WeightsSetup({ onBack, onStart }: WeightsSetupProps) {
	const [weights, setWeights] = useState(DEFAULT_WEIGHTS);

	function update(id: keyof LiftWeights, value: number) {
		setWeights((prev) => ({ ...prev, [id]: Math.max(0, value) }));
	}

	function decrement(id: keyof LiftWeights) {
		update(id, weights[id] - 2.5);
	}

	function increment(id: keyof LiftWeights) {
		update(id, weights[id] + 2.5);
	}

	return (
		<main className="page-wrap flex flex-col gap-8 pt-14">
			<div>
				<h1 className="display-title text-3xl text-[var(--sea-ink)]">
					Starting weights
				</h1>
				<p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
					Pre-filled with defaults — update any you already know.
				</p>
			</div>

			<div className="flex flex-col gap-3">
				{LIFTS.map((lift, index) => (
					<div
						key={lift.id}
						className="island-shell rise-in rounded-2xl p-5 flex items-center justify-between gap-4"
						style={{ animationDelay: `${index * 40 + 80}ms` }}
					>
						<span className="font-semibold text-[var(--sea-ink)]">
							{lift.name}
						</span>

						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => decrement(lift.id)}
								className="size-9 rounded-full border border-[var(--line)] font-bold
                  text-[var(--sea-ink-soft)] cursor-pointer transition-all
                  hover:border-[var(--lagoon-deep)] hover:text-[var(--lagoon-deep)]"
							>
								−
							</button>

							<input
								type="number"
								min={0}
								step={lift.incrementKg}
								value={weights[lift.id]}
								onChange={(e) => update(lift.id, Number(e.target.value))}
								className="w-20 rounded-xl border border-[var(--line)] bg-transparent
                  px-2 py-1 text-center font-bold text-[var(--sea-ink)]
                  focus:outline-none focus:border-[var(--lagoon-deep)]"
							/>

							<span className="text-sm text-[var(--sea-ink-soft)]">kg</span>

							<button
								type="button"
								onClick={() => increment(lift.id)}
								className="size-9 rounded-full border border-[var(--line)] font-bold
                  text-[var(--sea-ink-soft)] cursor-pointer transition-all
                  hover:border-[var(--lagoon-deep)] hover:text-[var(--lagoon-deep)]"
							>
								+
							</button>
						</div>
					</div>
				))}
			</div>

			<div className="flex justify-between">
				<button
					type="button"
					onClick={onBack}
					className="text-sm text-[var(--sea-ink-soft)] cursor-pointer hover:text-[var(--sea-ink)] transition-colors"
				>
					← Back
				</button>
				<button
					type="button"
					onClick={() => onStart(weights)}
					className="island-shell rounded-xl px-8 py-3 font-semibold
            text-[var(--lagoon-deep)] cursor-pointer"
				>
					Start training →
				</button>
			</div>
		</main>
	);
}
