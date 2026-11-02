"use client";

import dynamic from "next/dynamic";

const HomeThreeSceneCanvas = dynamic(() => import("./HomeThreeSceneCanvas"), {
  ssr: false,
  loading: () => (
    <div className="h-[300vh] w-full">
      <div className="sticky top-0 flex h-dvh w-full items-end justify-center overflow-hidden bg-[#080d18]">
        <div
          aria-hidden="true"
          className="mb-[12vh] h-28 w-56 rounded-[50%] bg-blue-400/10 blur-2xl sm:h-40 sm:w-80"
        />
        <p className="absolute bottom-8 font-mono text-xs tracking-widest text-slate-400">
          LOADING INTERACTIVE SCENE
        </p>
      </div>
    </div>
  ),
});

const HomeThreeScene = ({ onReady }) => (
  <HomeThreeSceneCanvas onReady={onReady} />
);

export default HomeThreeScene;
