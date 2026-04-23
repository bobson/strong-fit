import { PROGRAM_SCHEMES } from "program";
import type { ProgramScheme } from "types";

export default function ProgramSetup({
	program,
	onChange,
	onNext,
}: {
	program: ProgramScheme;
	onChange: (p: ProgramScheme) => void;
	onNext: () => void;
}) {
	return (
		<main className="page-wrap flex flex-col items-center gap-8 pt-20">
			<h1 className="display-title text-3xl text-[var(--sea-ink)]">
				Choose your program
			</h1>

			<div className="flex gap-4">
				{(Object.keys(PROGRAM_SCHEMES) as ProgramScheme[]).map((p) => (
					<button
						key={p}
						type="button"
						onClick={() => onChange(p)}
						className={`
              island-shell rounded-2xl px-10 py-6 text-2xl font-bold cursor-pointer
              transition-all duration-200
              ${
								program === p
									? "border-[var(--lagoon-deep)] text-[var(--lagoon-deep)] shadow-[0_0_0_1px_var(--lagoon-deep)]"
									: "text-[var(--sea-ink-soft)]"
							}
            `}
					>
						{p}
					</button>
				))}
			</div>

			<button
				type="button"
				onClick={onNext}
				className="island-shell rounded-xl px-8 py-3 font-semibold text-[var(--lagoon-deep)] cursor-pointer"
			>
				Next →
			</button>
		</main>
	);
}
