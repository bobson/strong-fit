// SetCircle.tsx — owns only its own count, calls up for timer

import { useState } from "react";
import { useLongPress } from "#/hooks/useLongPress";

interface SetCircleProps {
	onTimerStart: () => void;
	onTimerStop: () => void;
	onDelete: () => void;
}

export default function SetCircle({
	onTimerStart,
	onTimerStop,
	onDelete,
}: SetCircleProps) {
	const [count, setCount] = useState(5);
	const [firstTouch, setFirstTouch] = useState(false);
	// menu for delete button
	const [menuOpen, setMenuOpen] = useState(false);

	const longPress = useLongPress(() => setMenuOpen(true));

	function handleClick() {
		if (menuOpen) return; // don't count if menu is open

		onTimerStart();

		if (firstTouch) {
			if (count === 0) {
				setFirstTouch(false);
				setCount(5);
				onTimerStop();
			} else {
				setCount((c) => c - 1);
			}
		} else {
			setFirstTouch(true);
		}
	}

	return (
		<div className="relative">
			<button
				type="button"
				onClick={handleClick}
				{...longPress}
				className={`
          size-12 rounded-full border-2 font-bold text-sm
          flex items-center justify-center cursor-pointer
          transition-all duration-200 select-none
          ${
						firstTouch
							? "bg-[var(--lagoon)] border-[var(--lagoon)] text-[var(--foam)]"
							: "bg-transparent border-[var(--line)] text-[var(--sea-ink-soft)] hover:border-[var(--lagoon-deep)]"
					}
        `}
			>
				{count}
			</button>

			{menuOpen && (
				<>
					{/* backdrop to close menu */}
					<button
						type="button"
						className="fixed inset-0 z-40"
						onClick={() => setMenuOpen(false)}
					></button>
					<div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-50 island-shell rounded-xl p-1 min-w-32 flex flex-col">
						<button
							type="button"
							onClick={() => {
								onDelete();
								setMenuOpen(false);
							}}
							className="px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer text-left transition-colors"
						>
							Delete set
						</button>
						<button
							type="button"
							onClick={() => setMenuOpen(false)}
							className="px-4 py-2 text-sm font-semibold text-[var(--sea-ink-soft)] hover:bg-[var(--line)] rounded-lg cursor-pointer text-left transition-colors"
						>
							Cancel
						</button>
					</div>
				</>
			)}
		</div>
	);
}
