import React from "react";

interface FinishModalProps {
	setShowConfirm: (show: boolean) => void;
	handleFinishWorkout: () => void;
}

const FinishModal = ({
	setShowConfirm,
	handleFinishWorkout,
}: FinishModalProps) => {
	return (
		<>
			{/* backdrop */}
			<div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />

			{/* modal */}
			<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
				<div className="island-shell rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
					<div>
						<h2 className="font-bold text-lg text-[var(--sea-ink)]">
							Finish Workout?
						</h2>
						<p className="text-sm text-[var(--sea-ink-soft)] mt-1">
							You haven't logged all sets. Incomplete lifts will have their
							weight decreased by 10% next session.
						</p>
					</div>

					<div className="flex gap-3">
						<button
							type="button"
							onClick={() => setShowConfirm(false)}
							className="flex-1 island-shell rounded-xl py-3 text-sm font-semibold
              text-[var(--sea-ink-soft)] cursor-pointer hover:border-[var(--lagoon-deep)]
              transition-all text-center"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={() => {
								setShowConfirm(false);
								handleFinishWorkout();
							}}
							className="flex-1 island-shell rounded-xl py-3 text-sm font-semibold
              text-[var(--lagoon-deep)] cursor-pointer hover:border-[var(--lagoon-deep)]
              transition-all text-center"
						>
							Finish
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default FinishModal;
