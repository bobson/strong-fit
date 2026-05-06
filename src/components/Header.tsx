import { useState } from "react";
import { useAuth } from "#/context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
	const { user, signOut } = useAuth();
	const [menuOpen, setMenuOpen] = useState(false);

	// get first letter of name or email
	const name = user?.user_metadata?.full_name as string | undefined;
	const initial = name
		? name[0].toUpperCase()
		: (user?.email?.[0].toUpperCase() ?? "?");

	return (
		<header
			className="fixed top-0 left-0 right-0 z-30"
			style={{
				background: "var(--header-bg)",
				backdropFilter: "blur(8px)",
				borderBottom: "1px solid var(--line)",
			}}
		>
			<div className="page-wrap flex items-center justify-between h-14">
				<span className="display-title font-bold text-lg text-[var(--sea-ink)]">
					Strong Fit
				</span>

				<div className="flex items-center gap-3">
					<ThemeToggle />

					{user && (
						<div className="relative">
							<button
								type="button"
								onClick={() => setMenuOpen((prev) => !prev)}
								className="size-9 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)]
                  flex items-center justify-center cursor-pointer
                  hover:border-[var(--lagoon-deep)] transition-all"
							>
								<span className="text-sm font-bold text-[var(--lagoon-deep)]">
									{initial}
								</span>
							</button>

							{menuOpen && (
								<>
									<button
										type="button"
										aria-label="Close menu"
										className="fixed inset-0 z-40 cursor-default"
										onClick={() => setMenuOpen(false)}
									/>
									<div className="absolute right-0 top-11 z-50 island-shell rounded-xl p-1 min-w-44">
										<p className="px-3 py-2 text-xs text-[var(--sea-ink-soft)] border-b border-[var(--line)] truncate">
											{name ?? user.email}
										</p>
										<button
											type="button"
											onClick={() => {
												signOut();
												setMenuOpen(false);
											}}
											className="w-full text-left px-3 py-2 text-sm font-semibold
                        text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer
                        transition-colors"
										>
											Sign out
										</button>
									</div>
								</>
							)}
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
