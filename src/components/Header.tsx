import { Link } from "@tanstack/react-router";
import { useAuth } from "#/context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
	const { user, signOut } = useAuth();
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
				{user && (
					<div className="flex items-center gap-3">
						{user.user_metadata?.avatar_url ? (
							<img
								src={user.user_metadata.avatar_url}
								alt="avatar"
								className="size-8 rounded-full border border-[var(--line)]"
							/>
						) : (
							<div
								className="size-8 rounded-full border border-[var(--line)] bg-[var(--lagoon)]/20
        flex items-center justify-center text-xs font-bold text-[var(--lagoon-deep)]"
							>
								{user.email?.[0].toUpperCase()}
							</div>
						)}
						<button
							type="button"
							onClick={signOut}
							className="text-xs font-semibold text-[var(--sea-ink-soft)]
        hover:text-[var(--sea-ink)] cursor-pointer transition-colors"
						>
							Sign out
						</button>
					</div>
				)}
			</nav>
		</header>
	);
}
