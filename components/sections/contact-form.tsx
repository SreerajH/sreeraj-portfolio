"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const EMAIL = "hsreeraj4@gmail.com";
/** Web3Forms access key. Without it the form falls back to the visitor's mail app. */
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

const PROJECT_TYPES = [
  "Website",
  "Mobile app",
  "UI/UX design",
  "Design + build",
  "Something else",
];

type Status = "idle" | "sending" | "sent" | "error";

const FIELD =
  "w-full rounded-xl border border-border-hair bg-bg/80 px-4 py-3 text-sm text-text placeholder:text-text-dim transition-colors focus:border-accent focus:outline-none";
const LABEL =
  "mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-text-muted";

export function ContactForm({ className }: { className?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [type, setType] = useState(PROJECT_TYPES[0]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    // Bots fill every field; people never see this one.
    if (data.get("botcheck")) return;

    if (!WEB3FORMS_KEY) {
      const subject = `${type} enquiry from ${name}`;
      const body = `${message}\n\n${name}\n${email}`;
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New ${type.toLowerCase()} enquiry from ${name}`,
          from_name: "Portfolio contact form",
          name,
          email,
          project_type: type,
          message,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setStatus("sent");
      form.reset();
      setType(PROJECT_TYPES[0]);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div
      className={cn(
        "relative rounded-3xl border border-border-hair bg-bg-elev/85 p-6 backdrop-blur-md md:p-8",
        className,
      )}
    >
      {/* The moving border light: a soft blurred glow under a crisp line.
          The blur sits on a wrapper so it applies after the ring's mask. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-80 blur-md"
      >
        <span
          className="beam-ring absolute inset-0 rounded-[inherit]"
          style={{ "--beam-width": "3px" } as CSSProperties}
        />
      </span>
      <span
        aria-hidden="true"
        className="beam-ring pointer-events-none absolute -inset-px rounded-[inherit]"
      />
      {status === "sent" ? (
        <div
          className="flex min-h-[420px] flex-col items-start justify-center"
          aria-live="polite"
        >
          <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-[#0A0A0A]">
            <Check className="h-5 w-5" />
          </span>
          <h3 className="font-serif text-3xl tracking-tight text-text">
            Message sent.
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-muted">
            Thanks for reaching out. I&apos;ll read it properly and get back to
            you soon.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="nav-link mt-8 text-sm font-medium text-text"
          >
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div>
            <h3 className="font-serif text-3xl tracking-tight text-text">
              Start a project
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              A few details and I&apos;ll take it from there.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="cf-name" className={LABEL}>
                Name
              </label>
              <input
                id="cf-name"
                name="name"
                required
                autoComplete="name"
                placeholder="Your name"
                className={FIELD}
              />
            </div>
            <div>
              <label htmlFor="cf-email" className={LABEL}>
                Email
              </label>
              <input
                id="cf-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className={FIELD}
              />
            </div>
          </div>

          <fieldset>
            <legend className={LABEL}>What do you need?</legend>
            <div className="flex flex-wrap gap-2">
              {PROJECT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  aria-pressed={type === t}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                    type === t
                      ? "border-accent bg-accent text-[#0A0A0A]"
                      : "border-border-hair text-text-muted hover:border-text-muted hover:text-text",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="cf-message" className={LABEL}>
              Message
            </label>
            <textarea
              id="cf-message"
              name="message"
              required
              rows={4}
              placeholder="Tell me about the project, your goals and when you'd like to launch."
              className={cn(FIELD, "resize-none")}
            />
          </div>

          <input
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#0A0A0A] transition-colors hover:bg-text disabled:opacity-70"
            >
              {status === "sending" ? (
                <>
                  Sending
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  Send message
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
            {status === "error" ? (
              <p className="text-sm text-text-muted" aria-live="polite">
                That didn&apos;t go through. Email me at{" "}
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  {EMAIL}
                </a>
                .
              </p>
            ) : null}
          </div>
        </form>
      )}
    </div>
  );
}
