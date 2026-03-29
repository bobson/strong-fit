import { Link } from "@tanstack/react-router";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
			<nav className="page-wrap flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-3 sm:py-4">
				<Link
					to="/"
					className="nav-link"
					activeProps={{ className: "nav-link is-active" }}
				>
					Home
				</Link>
				<ThemeToggle />
				<button
					type="button"
					onClick={() => {
						localStorage.clear();
						window.location.reload();
					}}
				>
					Reset
				</button>
			</nav>
		</header>
	);
}
