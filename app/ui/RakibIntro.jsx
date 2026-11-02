"use client";

import Image from "next/image";


const RakibIntro = () => {

  

  return (
    <section
      aria-labelledby="intro-title"
      className="pointer-events-none absolute left-0 top-0 z-10 flex min-h-dvh w-full  items-center px-4 pb-8 pt-20 sm:px-8 sm:pb-10 sm:pt-24 lg:px-[8vw]"
    >
      <div className="intro-panel pointer-events-auto relative w-full max-w-[42rem] overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/70 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:rounded-[1.75rem] sm:bg-white/[0.88] sm:p-9 lg:p-11">
        <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />

        <div className="relative">
          <div className="mb-7 flex items-center justify-between gap-4">
            <p className="intro-eyebrow flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
              <span className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.12)]" />
              Quality engineering · SDET
            </p>
            <div className="intro-avatar relative h-[4.25rem] w-[3.5rem] shrink-0 overflow-hidden rounded-2xl border-2 border-white shadow-lg sm:h-[5.25rem] sm:w-[4.25rem]">
              <Image
                src="/rakib.png"
                alt="Rakibul Islam"
                fill
                sizes="(max-width: 640px) 56px, 68px"
                className="object-cover"
                preload
              />
            </div>
          </div>

          <h1
            id="intro-title"
            className="mb-4 text-[clamp(3.4rem,10vw,6.6rem)] font-semibold leading-[0.88] tracking-[-0.075em] text-slate-950"
          >
            <span className="block overflow-hidden pb-2">
              <span className="intro-title-line block">Rakibul</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="intro-title-line block text-blue-700">Islam.</span>
            </span>
          </h1>

          <p className="intro-role mb-3 text-sm font-semibold tracking-wide text-slate-700 sm:text-base">
            QA Engineer <span className="px-1 text-blue-600">/</span> Test Automation
            <span className="px-1 text-blue-600">/</span> SDET
          </p>
          <p className="intro-description max-w-[34rem] text-sm leading-7 text-slate-600 sm:text-base">
            I help teams ship dependable software through thoughtful testing,
            practical automation, and a sharp eye for the details that matter.
          </p>

          <div className="intro-actions mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-slate-950 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
            >
              Explore my work
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
              >
                <path
                  d="M3.5 10h13m0 0-5-5m5 5-5 5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
            <span className="text-xs font-medium tracking-wide text-slate-500">
              Scroll to see quality in action
            </span>
          </div>

          <div className="intro-tools mt-7 flex flex-wrap gap-2 border-t border-slate-200/80 pt-5">
            {["Playwright", "API testing", "CI/CD"].map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-600"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RakibIntro;
