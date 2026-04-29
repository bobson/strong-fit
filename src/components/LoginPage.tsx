import { useState } from "react";
import { useAuth } from "#/context/AuthContext";

export function LoginPage() {
	const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			if (isSignUp) {
				await signUpWithEmail(email, password);
			} else {
				await signInWithEmail(email, password);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	async function handleGoogle() {
		setError("");
		try {
			await signInWithGoogle();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		}
	}

	return (
		<main className="page-wrap flex flex-col items-center justify-center min-h-screen gap-8">
			<div className="island-shell rounded-2xl p-8 w-full max-w-sm flex flex-col gap-6">
				<div>
					<h1 className="display-title text-3xl text-[var(--sea-ink)]">
						Strong Fit
					</h1>
					<p className="text-sm text-[var(--sea-ink-soft)] mt-1">
						{isSignUp ? "Create your account" : "Welcome back"}
					</p>
				</div>

				{/* Google */}
				<button
					type="button"
					onClick={handleGoogle}
					className="island-shell rounded-xl px-4 py-3 flex items-center justify-center gap-3
            font-semibold text-sm text-[var(--sea-ink)] cursor-pointer
            hover:border-[var(--lagoon-deep)] transition-all"
				>
					<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
						<path
							fill="#4285F4"
							d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
						/>
						<path
							fill="#34A853"
							d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
						/>
						<path
							fill="#FBBC05"
							d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
						/>
						<path
							fill="#EA4335"
							d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
						/>
					</svg>
					Continue with Google
				</button>

				<div className="flex items-center gap-3">
					<div className="flex-1 h-px bg-[var(--line)]" />
					<span className="text-xs text-[var(--sea-ink-soft)]">or</span>
					<div className="flex-1 h-px bg-[var(--line)]" />
				</div>

				{/* Email form */}
				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3
              text-sm font-medium text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)]/50
              focus:outline-none focus:border-[var(--lagoon-deep)]"
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3
              text-sm font-medium text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)]/50
              focus:outline-none focus:border-[var(--lagoon-deep)]"
					/>

					{error && <p className="text-sm text-red-500">{error}</p>}

					<button
						type="submit"
						disabled={loading}
						className="island-shell rounded-xl px-4 py-3 font-semibold text-sm
              text-[var(--lagoon-deep)] cursor-pointer transition-all
              hover:border-[var(--lagoon-deep)] disabled:opacity-50"
					>
						{loading ? "Loading..." : isSignUp ? "Create account" : "Sign in"}
					</button>
				</form>

				<button
					type="button"
					onClick={() => setIsSignUp((prev) => !prev)}
					className="text-xs text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] cursor-pointer transition-colors"
				>
					{isSignUp
						? "Already have an account? Sign in"
						: "Don't have an account? Sign up"}
				</button>
			</div>
		</main>
	);
}
