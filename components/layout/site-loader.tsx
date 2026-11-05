"use client";

import { useEffect, useState } from "react";

/** localStorage flag set once a visitor has seen the loader. */
export const LOADER_SEEN_KEY = "sh_loader_seen";

/** The whole loader, from first paint to gone. */
const TOTAL_MS = 1000;

/**
 * Runs in <head> before the first paint. Marks <html data-loader="skip"> for
 * anyone who should not see the loader (repeat visitors, reduced motion, any
 * route other than the homepage, or storage that can't be read), so the CSS
 * hides it before it is ever drawn: no flash.
 */
export const LOADER_HEAD_SCRIPT = `(function(){var s=1;try{s=location.pathname!=="/"||!!localStorage.getItem("${LOADER_SEEN_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}if(s)document.documentElement.setAttribute("data-loader","skip")})();`;

/**
 * First-visit intro on the homepage: the logo animation over a progress bar
 * that counts to 100%. All the timing is CSS (see `#site-loader` in
 * globals.css), so it runs from the first paint and finishes at 1s whether or
 * not the video or the JavaScript has loaded. It is an overlay: the page is
 * already in the DOM underneath it.
 */
export function SiteLoader() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    // Already hidden by CSS (display: none), so there is nothing to time.
    if (html.dataset.loader === "skip") return;
    let cancelled = false;
    const finish = () => {
      if (cancelled) return;
      try {
        localStorage.setItem(LOADER_SEEN_KEY, "1");
      } catch {
        /* storage blocked: the head script will skip it next time anyway */
      }
      html.setAttribute("data-loader", "skip");
      setGone(true);
    };

    // The CSS fade is the clock (it started at first paint), so wait for it
    // to finish rather than timing it again here. If hydration came late it
    // has already finished and this resolves at once.
    const fade = document
      .getElementById("site-loader")
      ?.getAnimations?.()
      .find((a) => (a as CSSAnimation).animationName === "loader-out");
    let timer = 0;
    if (fade) fade.finished.then(finish, finish);
    else timer = window.setTimeout(finish, Math.max(0, TOTAL_MS - performance.now()));

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      id="site-loader"
      aria-hidden="true"
      // Pure black to match the video's own background, so its edges vanish.
      // Above the navbar (z-40), below the custom cursor (z-100).
      className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-black"
    >
      <video
        src="/loader.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="w-[min(80vw,420px)]"
      />
      <div className="mt-6 w-[min(64vw,300px)]">
        <div className="relative h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="loader-bar absolute inset-0 origin-left rounded-full bg-accent" />
          {/* A light glint that runs along the bar while it fills. */}
          <div className="loader-glint absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </div>
        <p className="mt-3 text-center font-condensed text-2xl tabular-nums text-accent">
          <span className="loader-count" />%
        </p>
      </div>
    </div>
  );
}
