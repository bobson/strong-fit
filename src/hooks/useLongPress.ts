// useLongPress.ts
import { useRef } from "react";

export function useLongPress(onLongPress: () => void, delay = 500) {
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	function start() {
		timerRef.current = setTimeout(onLongPress, delay);
	}

	function cancel() {
		if (timerRef.current) clearTimeout(timerRef.current);
	}

	return {
		onMouseDown: start,
		onMouseUp: cancel,
		onMouseLeave: cancel,
		onTouchStart: start,
		onTouchEnd: cancel,
	};
}
