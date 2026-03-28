// SetCircle.tsx — owns only its own count, calls up for timer
import { useState } from "react";

interface SetCircleProps {
	onTimerStart: () => void;
	onTimerStop: () => void;
}

export default function SetCircle({
	onTimerStart,
	onTimerStop,
}: SetCircleProps) {
	const [count, setCount] = useState(5);
	const [firstTouch, setFirstTouch] = useState(false);

	function handleClick() {
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
		<button
			type="button"
			onClick={handleClick}
			className={`
        size-12 rounded-full border-2 font-bold text-sm
        flex items-center justify-center cursor-pointer
        transition-all duration-200
        ${
					firstTouch
						? "bg-[var(--lagoon)] border-[var(--lagoon)] text-[var(--foam)]"
						: "bg-transparent border-[var(--line)] text-[var(--sea-ink-soft)] hover:border-[var(--lagoon-deep)]"
				}
      `}
		>
			{count}
		</button>
	);
}
