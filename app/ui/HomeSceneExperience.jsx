"use client";

import { useCallback, useState } from "react";
import HomeThreeScene from "./HomeThreeScene";
import LoaderCom from "./LoaderCom";

const HomeSceneExperience = () => {
  const [sceneReady, setSceneReady] = useState(false);
  const [loaderFinished, setLoaderFinished] = useState(false);
  const handleSceneReady = useCallback(() => setSceneReady(true), []);
  const handleLoaderComplete = useCallback(
    () => setLoaderFinished(true),
    [],
  );

  return (
    <>
      <HomeThreeScene onReady={handleSceneReady} />
      {!loaderFinished && (
        <LoaderCom
          ready={sceneReady}
          onComplete={handleLoaderComplete}
        />
      )}
    </>
  );
};

export default HomeSceneExperience;
