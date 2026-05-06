import { useEffect } from "react";

export function ServiceWorkerRegister() {
	useEffect(() => {
		// only register in production — dev server breaks with SW
		if (import.meta.env.PROD && "serviceWorker" in navigator) {
			navigator.serviceWorker.register("/sw.js").catch(console.error);
		}
	}, []);

	return null;
}
