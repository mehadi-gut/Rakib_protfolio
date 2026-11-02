"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

gsap.registerPlugin(useGSAP);

const LoaderCom = ({ onComplete, ready }) => {
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const readyRef = useRef(ready);
  const finishRef = useRef(null);

  useEffect(() => {
    readyRef.current = ready;
    finishRef.current?.();
  }, [ready]);

  useGSAP(
    () => {
      const progress = { value: 0 };
      const panels = gsap.utils.toArray(".loader-panel", containerRef.current);
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      let progressComplete = false;
      let exitStarted = false;

      const finishWhenReady = () => {
        if (!progressComplete || !readyRef.current || exitStarted) return;
        exitStarted = true;
        gsap.to(panels, {
          yPercent: (index) => (index % 2 === 0 ? -100 : 100),
          duration: reducedMotion ? 0.1 : 0.7,
          stagger: reducedMotion ? 0 : 0.05,
          ease: "power3.inOut",
          onComplete,
        });
      };
      finishRef.current = finishWhenReady;

      gsap.to(progress, {
        value: 100,
        duration: reducedMotion ? 0.1 : 0.5,
        ease: "power1.inOut",
        onUpdate: () => {
          if (progressRef.current) {
            progressRef.current.textContent = `${Math.round(progress.value)}`;
          }
        },
        onComplete: () => {
          progressComplete = true;
          finishWhenReady();
        },
      });

      return () => {
        finishRef.current = null;
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[100] flex h-dvh w-full overflow-hidden  bg-black text-white"
    >
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          aria-hidden="true"
          className={`loader-panel loader-panel-${index} h-full flex-1 bg-[#080d18]`}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div
          
          className=" w-fit h-fit "
        >
          <span className="text-[clamp(4rem,16vw,10rem)] font-extrabold leading-none tracking-[-0.08em] px-1 tabular-nums" ref={progressRef}>0</span><span className="text-[clamp(1rem,6vw,3rem)] px-3 font-extrabold text-white/60">%</span>
        </div>
      </div>
      <p className="pointer-events-none absolute bottom-7 left-6 z-10 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-white/60 sm:bottom-9 sm:left-10">
        Rakibul Islam · Portfolio
      </p>
      <p className="pointer-events-none absolute bottom-7 right-6 z-10 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-white/60 sm:bottom-9 sm:right-10">
        Loading
      </p>
    </div>
  );
};

export default LoaderCom;
