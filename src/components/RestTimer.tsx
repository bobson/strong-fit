// RestTimer.tsx — only rerenders when seconds change
import { memo } from "react";

export const RestTimer = memo(function RestTimer({
	secondsRemaining,
	visible,
}: {
	secondsRemaining: number;
	visible: boolean;
}) {
	if (!visible) return null;

	const mins = Math.floor(secondsRemaining / 60);
	const secs = String(secondsRemaining % 60).padStart(2, "0");

	return (
		<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 island-shell rounded-2xl px-8 py-4 text-center min-w-40">
			<p className="island-kicker mb-1">Rest</p>
			<p className="text-4xl font-bold text-[var(--lagoon-deep)]">
				{mins}:{secs}
			</p>
		</div>
	);
});
