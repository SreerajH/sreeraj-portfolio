import { cn } from "@/lib/utils";

const LETTERS = "Loading".split("");

/**
 * "Loading", lit one letter at a time over a striped wash of colour that
 * sweeps left and right. Keyframes (ll-*) live in globals.css.
 */
export default function LoadingLines({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-[90px] select-none items-center justify-center px-6 font-sans text-[2.2rem] font-semibold tracking-wide text-text",
        className,
      )}
    >
      {LETTERS.map((letter, i) => (
        <span
          key={i}
          className="ll-letter relative z-[2] inline-block animate-[ll-letter_4s_linear_infinite] opacity-0"
          style={{ animationDelay: `${0.1 + i * 0.105}s` }}
        >
          {letter}
        </span>
      ))}

      {/* Colour wash, cut into thin vertical lines by the mask. */}
      <div className="absolute inset-0 z-[1] [mask:repeating-linear-gradient(90deg,transparent_0,transparent_6px,black_7px,black_8px)]">
        <div className="absolute inset-0 animate-[ll-sweep_2s_infinite_alternate_cubic-bezier(0.6,0.8,0.5,1),ll-fade_4s_infinite] [background-image:radial-gradient(circle_at_50%_50%,#c8ff00_0%,transparent_50%),radial-gradient(circle_at_45%_45%,#ffffff_0%,transparent_45%),radial-gradient(circle_at_55%_55%,#4fd1ff_0%,transparent_45%),radial-gradient(circle_at_45%_55%,#c8ff00_0%,transparent_45%),radial-gradient(circle_at_55%_45%,#b98cff_0%,transparent_45%)] [mask:radial-gradient(circle_at_50%_50%,transparent_0%,transparent_10%,black_25%)]" />
      </div>
    </div>
  );
}
