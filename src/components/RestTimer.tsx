// RestTimer.tsx — only rerenders when seconds change
import { memo } from "react";

export const RestTimer = memo(function RestTimer({
	secondsRemaining,
	visible,
	onClose,
}: {
	secondsRemaining: number;
	visible: boolean;
	onClose: () => void;
}) {
	if (!visible) return null;

	const mins = Math.floor(secondsRemaining / 60);
	const secs = String(secondsRemaining % 60).padStart(2, "0");

	return (
		<div className="flex justify-center sticky bottom-20">
			<div className="island-shell rounded-2xl px-4 py-2 flex items-center gap-4">
				<p className="island-kicker text-xs">Rest</p>
				<p className="text-lg font-bold text-[var(--lagoon-deep)] tabular-nums">
					{mins}:{secs}
				</p>
				<button
					type="button"
					onClick={onClose}
					aria-label="Close timer"
					className="size-6 rounded-full border border-[var(--line)] flex items-center
          justify-center text-[var(--sea-ink-soft)] hover:border-[var(--lagoon-deep)]
          hover:text-[var(--lagoon-deep)] cursor-pointer transition-all text-xs font-bold"
				>
					✕
				</button>
			</div>
		</div>
	);
});
