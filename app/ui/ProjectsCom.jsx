"use client";

import { useEffect, useRef, useState } from "react";

const projects = [
  {
    title: "FlexOrder E2E Automation",
    src: "/flexOrder.mp4",
    description:
      "Built a Playwright/TypeScript E2E automation framework with a Dockerized WordPress environment and a GitHub Actions CI/CD pipeline (auto-triggered per plugin commit) for a WooCommerce–Google Sheets order-sync plugin.",
    stack: "Playwright · TypeScript · Docker · GitHub Actions",
  },
  {
    title: "Traffic Flow Prediction",
    src: "/TraficPrediction.mp4",
    description:
      "Built and compared LSTM, GRU, and Stacked Auto-Encoder (SAE) deep learning models to forecast short-term freeway traffic flow from Caltrans PeMS 5-minute sensor data, achieving R² ≈ 0.94 with an RMSE of ~9.6 vehicles.",
    stack: "Python · Keras / TensorFlow · scikit-learn",
  },
  {
    title: "FlexOrder E2E Automation",
    src: "/flexOrder.mp4",
    description:
      "Built a Playwright/TypeScript E2E automation framework with a Dockerized WordPress environment and a GitHub Actions CI/CD pipeline (auto-triggered per plugin commit) for a WooCommerce–Google Sheets order-sync plugin.",
    stack: "Playwright · TypeScript · Docker · GitHub Actions",
  },
  {
    title: "Traffic Flow Prediction",
    src: "/TraficPrediction.mp4",
    description:
      "Built and compared LSTM, GRU, and Stacked Auto-Encoder (SAE) deep learning models to forecast short-term freeway traffic flow from Caltrans PeMS 5-minute sensor data, achieving R² ≈ 0.94 with an RMSE of ~9.6 vehicles.",
    stack: "Python · Keras / TensorFlow · scikit-learn",
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// --- Cylinder layout -------------------------------------------------------
const COUNT = projects.length;
const RADIUS = 7; // radius of the hollow cylinder
const STEP = (Math.PI * 2) / COUNT; // angle between panel centers
const GAP = 0.05; // small gap (radians, ~3°) between neighbouring videos
const PANEL_ARC = STEP - GAP; // videos nearly fill the whole ring
const PANEL_HEIGHT = (RADIUS * PANEL_ARC) / (16 / 9); // keeps videos 16:9 on the curve

const ProjectsCom = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRef = useRef(null);
  const progressBarRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sceneUnavailable, setSceneUnavailable] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const container = canvasRef.current;
    if (!section || !container) return;

    let cancelled = false;
    let sceneRequested = false;
    let cleanupScene = () => {};
    const startScene = async () => {
      const THREE = await import("three");
      if (cancelled) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let renderer;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: false,
        powerPreference: isMobile ? "low-power" : "high-performance",
      });
    } catch (error) {
      console.error("Could not initialize the 3D projects scene.", error);
      setSceneUnavailable(true);
      return;
    }

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5)
    );
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#080d18");
    scene.fog = new THREE.Fog("#080d18", RADIUS * 0.9, RADIUS * 2.4);

    // Frame the complete cylinder from outside, looking toward its center.
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    const cameraDirection = new THREE.Vector3(0.35, 0.28, -1).normalize();
    const cameraTarget = new THREE.Vector3(0, 0, 0);
    const cameraBaseRotation = new THREE.Euler();

    // The whole cylinder lives in this group; scrolling rotates it on Y.
    const ring = new THREE.Group();
    scene.add(ring);

    const videos = [];
    const textures = [];
    const materials = [];
    const geometries = [];

    const panels = projects.map((project, index) => {
      const video = document.createElement("video");
      video.src = project.src;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "none";
      video.crossOrigin = "anonymous";
      video.setAttribute("aria-hidden", "true");
      video.addEventListener("error", () => {
        console.error(`Could not load the ${project.title} project video.`);
      });
      videos.push(video);

      const texture = new THREE.VideoTexture(video);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      textures.push(texture);

      // Cylinder angle θ maps to (x = sin θ, z = cos θ). Panel i is centered at θ = i * STEP.
      const centerAngle = index * STEP;
      const geometry = new THREE.CylinderGeometry(
        RADIUS,
        RADIUS,
        PANEL_HEIGHT,
        48,
        1,
        true,
        centerAngle - PANEL_ARC / 2,
        PANEL_ARC
      );
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        toneMapped: false,
        fog: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      ring.add(mesh);

      geometries.push(geometry);
      materials.push(material);
      return { mesh, material };
    });

    let scrollProgress = 0;
    let displayedProgress = 0;
    let animationFrame = 0;
    let isVisible = false;
    let previousFrameTime = performance.now();
    let previousActiveIndex = -1;

    const updateScroll = () => {
      const scrollableDistance = section.offsetHeight - window.innerHeight;
      scrollProgress =
        scrollableDistance > 0
          ? clamp(-section.getBoundingClientRect().top / scrollableDistance, 0, 1)
          : 0;

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${scrollProgress})`;
      }
      if (progressBarRef.current) {
        progressBarRef.current.setAttribute(
          "aria-valuenow",
          String(Math.round(scrollProgress * 100))
        );
      }
    };

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;

      const aspect = width / height;
      camera.aspect = aspect;
      const verticalHalfFov = THREE.MathUtils.degToRad(camera.fov / 2);
      const horizontalHalfFov = Math.atan(
        Math.tan(verticalHalfFov) * aspect
      );
      const limitingHalfFov = Math.min(verticalHalfFov, horizontalHalfFov);
      const cylinderBounds = Math.hypot(RADIUS, PANEL_HEIGHT / 2);
      const distance = (cylinderBounds / Math.sin(limitingHalfFov)) * 1.12;
      camera.position.copy(cameraDirection).multiplyScalar(distance);
      camera.lookAt(cameraTarget);
      cameraBaseRotation.copy(camera.rotation);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      updateScroll();
    };

    const render = () => {
      if (!isVisible) {
        animationFrame = 0;
        return;
      }

      animationFrame = window.requestAnimationFrame(render);
      const now = performance.now();
      if (now - previousFrameTime < 1000 / 30) return;
      const deltaTime = Math.min((now - previousFrameTime) / 1000, 0.05);
      previousFrameTime = now;

      displayedProgress = reducedMotion
        ? scrollProgress
        : THREE.MathUtils.damp(displayedProgress, scrollProgress, 6, deltaTime);

      // Float index in [0, COUNT - 1]; rotating the ring by φ moves angle θ → θ + φ,
      // so φ = π - f * STEP brings panel f to the front (θ = π, i.e. -Z).
      const rawIndex = displayedProgress * (COUNT - 1);
      // Dwell: each video rests at the front for the middle ~50% of its scroll
      // segment, then eases quickly to the next one.
      const base = Math.min(Math.floor(rawIndex), COUNT - 1);
      const t = rawIndex - base;
      const k = clamp((t - 0.25) / 0.5, 0, 1);
      const floatIndex = base + k * k * (3 - 2 * k);
      ring.rotation.y = Math.PI - floatIndex * STEP;

      const activeCardIndex = Math.round(floatIndex);

      panels.forEach((panel, index) => {
        const distance = Math.abs(index - floatIndex);
        const focus = clamp(1 - distance, 0, 1);
        panel.mesh.visible = true;
        const brightness = THREE.MathUtils.lerp(0.65, 1, focus);
        panel.material.color.setScalar(brightness);
      });

      // Subtle idle sway so the scene feels alive
      if (!reducedMotion) {
        camera.rotation.x =
          cameraBaseRotation.x + Math.sin(now * 0.0006) * 0.012;
        camera.rotation.y =
          cameraBaseRotation.y + Math.sin(now * 0.0004) * 0.015;
      }

      if (activeCardIndex !== previousActiveIndex) {
        previousActiveIndex = activeCardIndex;
        setActiveIndex(activeCardIndex);
      }

      renderer.render(scene, camera);
    };

    const onContextLost = (event) => {
      event.preventDefault();
      console.error("The device lost the WebGL context for the projects scene.");
      window.cancelAnimationFrame(animationFrame);
      setSceneUnavailable(true);
    };

    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", resize);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        previousFrameTime = performance.now();
        videos.forEach((video, index) => {
          video.play().catch((error) => {
            if (error.name !== "AbortError") {
              console.error(
                `Could not play the ${projects[index].title} video.`,
                error
              );
            }
          });
        });
        if (!animationFrame) animationFrame = window.requestAnimationFrame(render);
      } else {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        previousActiveIndex = -1;
        videos.forEach((video) => video.pause());
      }
    });
    visibilityObserver.observe(section);
    resize();
    displayedProgress = scrollProgress;

    cleanupScene = () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", resize);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      videos.forEach((video) => {
        video.pause();
        video.removeAttribute("src");
        video.load();
      });
      textures.forEach((texture) => texture.dispose());
      materials.forEach((material) => material.dispose());
      geometries.forEach((geometry) => geometry.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
    };

    const requestScene = () => {
      if (sceneRequested) return;
      const bounds = section.getBoundingClientRect();
      if (
        bounds.top > window.innerHeight + 200 ||
        bounds.bottom < -200
      ) {
        return;
      }

      sceneRequested = true;
      sceneLoader.disconnect();
      window.removeEventListener("scroll", requestScene);
      window.removeEventListener("resize", requestScene);
      startScene().catch((error) => {
        console.error("Could not load the 3D projects scene.", error);
        setSceneUnavailable(true);
      });
    };
    const sceneLoader = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) requestScene();
    }, { rootMargin: "200px" });
    sceneLoader.observe(section);
    window.addEventListener("scroll", requestScene, { passive: true });
    window.addEventListener("resize", requestScene);
    requestScene();

    return () => {
      cancelled = true;
      sceneLoader.disconnect();
      window.removeEventListener("scroll", requestScene);
      window.removeEventListener("resize", requestScene);
      cleanupScene();
    };
  }, []);

  return (
    <section
    id="projects"
      ref={sectionRef}
      aria-labelledby="projects-heading"
      className="relative w-full bg-[#080d18] text-white"
      style={{ height: `${(COUNT + 1) * 100}dvh` }}
    >
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        {!sceneUnavailable && (
          <div
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-x-0 top-[14%] h-[46%] md:inset-y-0 md:left-[34%] md:right-0 md:h-full"
          />
        )}

        {sceneUnavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#080d18] px-5 pt-20 md:left-[24%] md:w-[76%]">
            <video
              key={projects[activeIndex].src}
              src={projects[activeIndex].src}
              autoPlay
              muted
              loop
              playsInline
              className="w-full max-w-5xl"
            />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#080d18]/45 via-transparent to-[#080d18]/85 text-white md:bg-none">
          <header className="absolute left-5 top-16 sm:left-10 sm:top-20 lg:left-[6vw]">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.22em] text-blue-300">
              Selected work
            </p>
            <h2
              id="projects-heading"
              className="text-[clamp(1rem,4vw,3rem)] font-semibold leading-none tracking-[-0.07em]"
            >
              Projects<span className="text-blue-400">.</span>
            </h2>
          </header>

          <div className="absolute inset-x-0 bottom-5 flex flex-col gap-5 px-5 sm:bottom-8 sm:px-10 md:bottom-auto md:left-[6vw] md:right-auto md:top-1/2 md:w-[min(31vw,27rem)] md:-translate-y-1/2 md:px-0">
            {projects.map((project, index) => {
              const isActive = index === activeIndex;

              return (
                <article
                  key={`${project.src}-${index}`}
                  aria-hidden={!isActive}
                  className={`transition-[opacity,transform] duration-700 ease-out ${
                    isActive
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none absolute translate-y-4 opacity-0"
                  }`}
                >
                  <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-blue-300 sm:text-xs">
                    Project {String(index + 1).padStart(2, "0")} /{" "}
                    {String(projects.length).padStart(2, "0")}
                  </p>
                  <h3 className="max-w-3xl text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl md:text-[clamp(1.7rem,3vw,2.7rem)]">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-sm sm:leading-6">
                    {project.description}
                  </p>
                  <p className="mt-3 font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.12em] text-blue-200/75 sm:text-[0.7rem]">
                    {project.stack}
                  </p>
                </article>
              );
            })}

            <div
              ref={progressBarRef}
              role="progressbar"
              aria-label="Project showcase progress"
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-px w-full overflow-hidden bg-white/20"
            >
              <div
                ref={progressRef}
                className="h-full origin-left bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.9)]"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-slate-500">
              Scroll to explore
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsCom;