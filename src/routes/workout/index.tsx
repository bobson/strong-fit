import { createFileRoute } from "@tanstack/react-router";
import type { WorkoutLabel } from "types";

export const Route = createFileRoute("/workout/")({
	validateSearch: (search: Record<string, unknown>) => ({
		label: (search.label as WorkoutLabel) ?? "A",
	}),
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/workout/"!</div>;
}
