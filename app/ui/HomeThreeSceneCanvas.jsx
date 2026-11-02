"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* ---------- small helpers ---------- */
const std = (color, o = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0, ...o });

function add(parent, geo, mat, pos = [0, 0, 0], rot = [0, 0, 0]) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos);
  m.rotation.set(...rot);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
const limb = (parent, r, mat) => add(parent, new THREE.CylinderGeometry(r, r, 1, 16), mat);
const UP = new THREE.Vector3(0, 1, 0);
function setLimb(mesh, a, b) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  mesh.position.copy(a).addScaledVector(dir, 0.5);
  mesh.scale.set(1, len, 1);
  mesh.quaternion.setFromUnitVectors(UP, dir.normalize());
}

/* ---------- code typed on the monitor ---------- */
const CODE = [
  'import { test, expect } from "@playwright/test";',
  "",
  'test("checkout total is calculated", async ({ page }) => {',
  '  await page.goto("/cart");',
  '  await page.getByRole("button", { name: "Add item" }).click();',
  '  const total = page.locator("[data-test=total]");',
  "  // expected 49.98 but the page shows 50.00",
  '  await expect(total).toHaveText("$49.98");',
  "});",
];
const TOKEN =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(import|from|const|async|await|export|default|return)\b|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*)(?=\()/g;
const COL = { fg: "#e6edf3", comment: "#8b949e", string: "#a5d6ff", kw: "#ff7b72", num: "#79c0ff", fn: "#d2a8ff" };
function tokenize(line) {
  const out = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    if (m.index > last) out.push([line.slice(last, m.index), COL.fg]);
    const c = m[1] ? COL.comment : m[2] ? COL.string : m[3] ? COL.kw : m[4] ? COL.num : COL.fn;
    out.push([m[0], c]);
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push([line.slice(last), COL.fg]);
  return out;
}

function makeScreen(isMobile) {
  const W = 2048, H = 1130;
  const canvas = document.createElement("canvas");
  canvas.width = W / 2;
  canvas.height = H / 2;
  const ctx = canvas.getContext("2d");
  ctx.scale(0.5, 0.5);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  const codeX = isMobile ? 105 : 380;
  const FS = isMobile
    ? Math.min(
        46,
        Math.floor(
          (W - codeX - 48) /
            (Math.max(...CODE.map((line) => line.length)) * 0.6)
        )
      )
    : 38;
  const LH = isMobile ? 64 : 60;
  const FONT = `${FS}px Menlo, Consolas, "DejaVu Sans Mono", monospace`;
  const UI = `${isMobile ? 30 : 26}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  const total = CODE.join("\n").length;
  const cycle = total + 110;
  const top = isMobile ? 170 : 190;

  const draw = (t) => {
    const typed = Math.min(total, Math.floor((t * 17) % cycle));
    ctx.fillStyle = "#0d1117"; ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#161b22"; ctx.fillRect(0, 0, W, 64);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(40 + i * 34, 32, 10, 0, Math.PI * 2); ctx.fill();
    });
    ctx.font = UI;
    ctx.fillStyle = "#0d1117"; ctx.fillRect(320, 12, 300, 52);
    ctx.fillStyle = "#e6edf3"; ctx.fillText("checkout.spec.js", 346, 46);
    ctx.fillStyle = "#8b949e"; ctx.fillText("login.spec.js", 660, 46);

    if (!isMobile) {
      ctx.fillStyle = "#0f141b"; ctx.fillRect(0, 64, 290, H - 64 - 52);
      ctx.fillStyle = "#8b949e"; ctx.font = "bold 22px system-ui, sans-serif";
      ctx.fillText("EXPLORER", 24, 110);
      ctx.font = UI;
      ctx.fillText("v tests", 24, 160);
      ctx.fillStyle = "#e6edf3"; ctx.fillRect(0, 186, 290, 44);
      ctx.fillStyle = "#0d1117"; ctx.fillText("   checkout.spec.js", 24, 218);
      ctx.fillStyle = "#c9d1d9"; ctx.fillText("   login.spec.js", 24, 268);
      ctx.fillText("   search.spec.js", 24, 316);
      ctx.fillText("   profile.spec.js", 24, 364);
      ctx.fillStyle = "#8b949e"; ctx.fillText("playwright.config.js", 24, 420);
    }

    ctx.font = FONT;
    const cw = ctx.measureText("M").width;
    let remaining = typed, curLine = 0, curCol = 0;
    for (let i = 0; i < CODE.length; i++) {
      if (remaining < 0) break;
      const line = CODE[i];
      const y = top + i * LH;
      ctx.fillStyle = "#484f58";
      ctx.fillText(String(i + 1).padStart(2, " "), isMobile ? 36 : 300, y);
      const show = Math.min(line.length, remaining);
      let consumed = 0, x = codeX;
      for (const [text, color] of tokenize(line)) {
        const take = Math.min(text.length, show - consumed);
        if (take <= 0) break;
        ctx.fillStyle = color;
        ctx.fillText(text.slice(0, take), x, y);
        x += take * cw;
        consumed += take;
      }
      if (remaining <= line.length) { curLine = i; curCol = remaining; }
      remaining -= line.length + 1;
    }
    if (Math.floor(t * 2) % 2 === 0 || typed < total) {
      ctx.fillStyle = "#58a6ff";
      ctx.fillRect(codeX + curCol * cw, top + curLine * LH - FS + 6, 4, FS + 10);
    }

    if (typed >= total) {
      const py = 770;
      ctx.fillStyle = "#161b22"; ctx.fillRect(290, py, W - 290, H - py - 52);
      ctx.fillStyle = "#8b949e"; ctx.font = "bold 22px system-ui, sans-serif";
      ctx.fillText("TEST RESULTS", 320, py + 44);
      ctx.font = "30px Menlo, Consolas, monospace";
      const rows = [
        ["#2ea043", "login with valid credentials", "passed"],
        ["#2ea043", "search returns results", "passed"],
        ["#f85149", "checkout total is calculated", 'expected "$49.98", received "$50.00"'],
      ];
      rows.forEach(([c, name, info], i) => {
        const y = py + 100 + i * 52;
        ctx.fillStyle = c; ctx.beginPath(); ctx.arc(334, y - 10, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#c9d1d9"; ctx.fillText(name, 366, y);
        ctx.fillStyle = c; ctx.fillText(info, 1000, y);
      });
    }

    ctx.fillStyle = "#1f6feb"; ctx.fillRect(0, H - 52, W, 52);
    ctx.fillStyle = "#ffffff"; ctx.font = "24px system-ui, sans-serif";
    ctx.fillText(`Ln ${curLine + 1}, Col ${curCol + 1}     Spaces: 2     JavaScript     Playwright Test`, 24, H - 16);

    tex.needsUpdate = true;
  };
  draw(0);
  return { tex, draw };
}

/* ---------- component ---------- */
const HomeThreeSceneCanvas = ({ onReady }) => {
  const rootRef = useRef(null);
  const mountRef = useRef(null);
  const hintRef = useRef(null);
  const capRef = useRef(null);
  const readyCallbackRef = useRef(onReady);
  const [sceneUnavailable, setSceneUnavailable] = useState(false);

  useEffect(() => {
    readyCallbackRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    let hasReportedReady = false;
    const reportReady = () => {
      if (hasReportedReady) return;
      hasReportedReady = true;
      readyCallbackRef.current?.();
    };

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        powerPreference: isMobile ? "low-power" : "high-performance",
      });
    } catch (error) {
      console.error("Could not initialize the 3D scene renderer.", error);
      const fallbackFrame = window.requestAnimationFrame(() => {
        setSceneUnavailable(true);
        reportReady();
      });
      return () => window.cancelAnimationFrame(fallbackFrame);
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.display = "block";
    renderer.shadowMap.enabled = !isMobile;
    if (!isMobile) renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    const onContextLost = (event) => {
      event.preventDefault();
      console.error("The device lost the WebGL context for the 3D scene.");
      renderer.setAnimationLoop(null);
      setSceneUnavailable(true);
      reportReady();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#080d18");
    let pmrem;
    if (!isMobile) {
      pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environmentIntensity = 0.4;
    }

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.05,
      100
    );

    /* ----- lights ----- */
    scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x3a2f2a, 0.8));
    const light = new THREE.DirectionalLight(0xfff1dd, 2.2);
    light.position.set(4, 6, 4);
    light.castShadow = !isMobile;
    if (!isMobile) light.shadow.mapSize.set(1024, 1024);
    Object.assign(light.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 0.5, far: 15 });
    light.shadow.bias = -0.0004;
    light.shadow.normalBias = 0.02;
    scene.add(light);
    const fill = new THREE.DirectionalLight('#0000ff', 0.7);
    fill.position.set(-4, 3, 2);
    scene.add(fill);
    const screenGlow = new THREE.PointLight('#0000ff', 3.5, 4, 2);
    screenGlow.position.set(0, 1.3, -0.05);
    scene.add(screenGlow);
    const lampLight = new THREE.SpotLight('#000ff', 14, 3.5, 0.6, 0.6, 2);
    lampLight.position.set(-0.5, 1.32, 0.1);
    lampLight.target.position.set(-0.2, 0.77, 0.3);
    lampLight.castShadow = !isMobile;
    if (!isMobile) lampLight.shadow.mapSize.set(512, 512);
    lampLight.shadow.bias = -0.0005;
    scene.add(lampLight, lampLight.target);
    const rgbLight = new THREE.PointLight('#000ff', 1.2, 1.6, 2);
    rgbLight.position.set(0.8, 1.0, 0.25);
    scene.add(rgbLight);

    /* ----- room ----- */
    const noShadow = (m) => { m.castShadow = false; return m; };
    const roomSurface = std("#080d18", {
      roughness: 0.95,
      side: THREE.DoubleSide,
    });
    noShadow(add(scene, new THREE.PlaneGeometry(10, 10), roomSurface, [0, 0, 0], [-Math.PI / 2, 0, 0]));
    noShadow(add(scene, new THREE.PlaneGeometry(10, 5), roomSurface, [0, 2.5, -1.3]));
    noShadow(add(scene, new THREE.PlaneGeometry(10, 5), roomSurface, [5, 2.5, 3.7], [0, Math.PI / 2, 0]));
    noShadow(add(scene, new THREE.CircleGeometry(1.2, 48), std('#ffffff10', { roughness: 1, transparent: true, opacity: 0.063, depthWrite: false }), [0, 0.005, 0.7], [-Math.PI / 2, 0, 0]));

    /* ----- desk ----- */
    const wood = std(0x9a6b45, { roughness: 0.55 });
    const metal = std(0x2b2f36, { roughness: 0.4, metalness: 0.6 });
    add(scene, new THREE.BoxGeometry(2.2, 0.05, 0.9), wood, [0, 0.745, 0]);
    [[-1.05, -0.4], [1.05, -0.4], [-1.05, 0.4], [1.05, 0.4]].forEach(([x, z]) =>
      add(scene, new THREE.BoxGeometry(0.06, 0.72, 0.06), metal, [x, 0.36, z]));
    add(scene, new THREE.BoxGeometry(0.9, 0.004, 0.4), std(0x14171c, { roughness: 0.95 }), [0, 0.772, 0.28]);

    /* ----- monitor ----- */
    const dark = std('#080808', { roughness: 0.35, metalness: 0.4 });
    add(scene, new THREE.CylinderGeometry(0.15, 0.17, 0.02, 32), dark, [0, 0.78, -0.25]);
    add(scene, new THREE.BoxGeometry(0.05, 0.3, 0.03), dark, [0, 0.92, -0.3]);
    add(scene, new THREE.BoxGeometry(1.0, 0.585, 0.04), dark, [0, 1.3, -0.28]);
    const { tex, draw } = makeScreen(isMobile);
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.94, 0.52),
      new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
    );
    screen.position.set(0, 1.3, -0.259);
    scene.add(screen);

    /* ----- desktop tower with RGB fans ----- */
    add(scene, new THREE.BoxGeometry(0.22, 0.46, 0.45), std(0x101216, { roughness: 0.4, metalness: 0.5 }), [0.8, 1.0, -0.12]);
    const fanMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xff00ff, emissiveIntensity: 1.6 });
    [1.12, 1.0, 0.88].forEach((y) => {
      noShadow(add(scene, new THREE.TorusGeometry(0.05, 0.008, 8, 28), fanMat, [0.8, y, 0.107]));
      add(scene, new THREE.CylinderGeometry(0.012, 0.012, 0.006, 12), dark, [0.8, y, 0.106], [Math.PI / 2, 0, 0]);
    });
    add(scene, new THREE.CylinderGeometry(0.012, 0.012, 0.01, 16),
      new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x39ff88, emissiveIntensity: 2 }),
      [0.8, 1.215, 0.105], [Math.PI / 2, 0, 0]);
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(0.42, 0.42),
      new THREE.MeshPhysicalMaterial({ color: 0x0a0c10, transparent: true, opacity: 0.35, roughness: 0.1, metalness: 0.2 })
    );
    glass.position.set(0.911, 1.0, -0.12);
    glass.rotation.y = Math.PI / 2;
    scene.add(glass);
    noShadow(add(scene, new THREE.BoxGeometry(0.01, 0.34, 0.01), fanMat, [0.9, 1.0, 0.09]));

    /* ----- keyboard + mouse ----- */
    add(scene, new THREE.BoxGeometry(0.5, 0.025, 0.18), std(0x20242b), [0, 0.7825, 0.3]);
    const keys = new THREE.InstancedMesh(new THREE.BoxGeometry(0.028, 0.008, 0.028), std(0x3a4150), 56);
    const d = new THREE.Object3D();
    let n = 0;
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 14; c++) {
        d.position.set(-0.23 + c * 0.0355, 0.799, 0.24 + r * 0.04);
        d.updateMatrix();
        keys.setMatrixAt(n++, d.matrix);
      }
    keys.castShadow = true;
    scene.add(keys);
    const mouse = add(scene, new THREE.SphereGeometry(0.035, 16, 12), std(0x20242b), [0.38, 0.785, 0.32]);
    mouse.scale.set(0.8, 0.45, 1.25);

    /* ----- props ----- */
    add(scene, new THREE.CylinderGeometry(0.04, 0.04, 0.09, 24), std(0xf5f5f5), [-0.55, 0.815, 0.25]);
    add(scene, new THREE.TorusGeometry(0.025, 0.007, 8, 16), std(0xf5f5f5), [-0.505, 0.815, 0.25]);
    add(scene, new THREE.BoxGeometry(0.075, 0.01, 0.15), std(0x111318), [0.62, 0.775, 0.3], [0, 0.3, 0]);
    const phoneScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.065, 0.135),
      new THREE.MeshBasicMaterial({ color: 0x4aa3ff, toneMapped: false })
    );
    phoneScreen.position.set(0.62, 0.7805, 0.3);
    phoneScreen.rotation.set(-Math.PI / 2, 0, -0.3);
    scene.add(phoneScreen);
    add(scene, new THREE.CylinderGeometry(0.1, 0.11, 0.03, 24), metal, [-0.85, 0.785, -0.1]);
    const lampBase = new THREE.Vector3(-0.85, 0.8, -0.1);
    const lampElbow = new THREE.Vector3(-0.75, 1.15, -0.05);
    const lampHead = new THREE.Vector3(-0.5, 1.38, 0.1);
    setLimb(limb(scene, 0.012, metal), lampBase, lampElbow);
    setLimb(limb(scene, 0.012, metal), lampElbow, lampHead);
    add(scene, new THREE.ConeGeometry(0.1, 0.14, 24, 1, true), std(0xe8e8e8, { side: THREE.DoubleSide }), [-0.5, 1.38, 0.1]);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), new THREE.MeshBasicMaterial({ color: 0xfff2c9 }));
    bulb.position.set(-0.5, 1.32, 0.1);
    scene.add(bulb);

    /* ----- chair ----- */
    const chairMat = std(0x23272e, { roughness: 0.8 });
    add(scene, new THREE.BoxGeometry(0.52, 0.08, 0.52), chairMat, [0, 0.5, 0.8]);
    add(scene, new THREE.BoxGeometry(0.5, 0.6, 0.07), chairMat, [0, 0.88, 1.03], [0.08, 0, 0]);
    add(scene, new THREE.CylinderGeometry(0.03, 0.03, 0.3, 12), metal, [0, 0.3, 0.8]);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      add(scene, new THREE.BoxGeometry(0.3, 0.035, 0.045), metal, [Math.cos(a) * 0.15, 0.09, 0.8 + Math.sin(a) * 0.15], [0, -a, 0]);
      add(scene, new THREE.SphereGeometry(0.035, 12, 12), chairMat, [Math.cos(a) * 0.3, 0.04, 0.8 + Math.sin(a) * 0.3]);
    }

    /* ----- the person ----- */
    const person = new THREE.Group();
    scene.add(person);
    const skin = std(0xc08a62, { roughness: 0.7 });
    const hoodie = std(0x17191d, { roughness: 0.92 });
    const jeans = std(0x8fb6d8, { roughness: 0.9 });
    const shoe = std(0x8a4a22, { roughness: 0.55 });
    const hairMat = std(0x0e0c0b, { roughness: 0.85 });
    const whiteMat = std(0xf2f2f2, { roughness: 0.8 });
    const watchMat = std(0xb8bcc4, { roughness: 0.3, metalness: 0.8 });

    const torso = add(person, new THREE.CapsuleGeometry(0.2, 0.35, 8, 20), hoodie, [0, 0.98, 0.82], [-0.12, 0, 0]);
    torso.scale.set(1.15, 1, 0.75);
    add(person, new THREE.CylinderGeometry(0.05, 0.055, 0.1, 12), skin, [0, 1.38, 0.78]);
    const hood = add(person, new THREE.SphereGeometry(0.11, 16, 12), hoodie, [0, 1.36, 0.89]);
    hood.scale.set(1.35, 0.7, 0.9);
    [-1, 1].forEach((s) =>
      add(person, new THREE.CylinderGeometry(0.006, 0.006, 0.15, 6), whiteMat, [s * 0.04, 1.2, 0.662], [-0.1, 0, 0]));

    [-1, 1].forEach((s) => {
      const hip = new THREE.Vector3(s * 0.11, 0.62, 0.8);
      const knee = new THREE.Vector3(s * 0.11, 0.62, 0.4);
      const ankle = new THREE.Vector3(s * 0.11, 0.1, 0.45);
      setLimb(limb(person, 0.08, jeans), hip, knee);
      setLimb(limb(person, 0.065, jeans), knee, ankle);
      add(person, new THREE.SphereGeometry(0.08, 12, 12), jeans, knee.toArray());
      add(person, new THREE.BoxGeometry(0.11, 0.07, 0.26), shoe, [s * 0.11, 0.035, 0.37]);
    });

    const elbows = [], forearms = [], hands = [];
    [-1, 1].forEach((s) => {
      const shoulder = new THREE.Vector3(s * 0.25, 1.2, 0.8);
      const elbow = new THREE.Vector3(s * 0.3, 0.9, 0.62);
      elbows.push(elbow);
      setLimb(limb(person, 0.055, hoodie), shoulder, elbow);
      const off = new THREE.Vector3(s * 0.052, 0.012, 0);
      setLimb(limb(person, 0.011, whiteMat), shoulder.clone().add(off), elbow.clone().add(off));
      add(person, new THREE.SphereGeometry(0.06, 12, 12), hoodie, shoulder.toArray());
      add(person, new THREE.SphereGeometry(0.055, 12, 12), hoodie, elbow.toArray());
      const fa = limb(person, 0.045, hoodie);
      forearms.push(fa);
      const fs = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 1, 8), whiteMat);
      fs.position.set(s * 0.046, 0, 0);
      fa.add(fs);
      const hnd = add(person, new THREE.SphereGeometry(0.05, 12, 12), skin);
      hands.push(hnd);
      if (s === -1) {
        const strap = new THREE.Mesh(new THREE.TorusGeometry(0.047, 0.008, 8, 20), std(0x2a2a2e, { roughness: 0.6 }));
        strap.position.set(0, 0, 0.075);
        const face = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.01, 0.04), watchMat);
        face.position.set(0, 0.05, 0.075);
        hnd.add(strap, face);
      }
    });

    const head = new THREE.Group();
    head.position.set(0, 1.5, 0.74);
    person.add(head);
    add(head, new THREE.SphereGeometry(0.14, 32, 24), skin);
    add(head, new THREE.SphereGeometry(0.147, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.36), hairMat, [0, 0.012, 0.012]);
    add(head, new THREE.SphereGeometry(0.147, 32, 16, -Math.PI * 0.1, Math.PI * 1.2, 0, Math.PI * 0.62), hairMat, [0, 0.012, 0.012]);
    const quiff = add(head, new THREE.SphereGeometry(0.1, 20, 14), hairMat, [0.012, 0.125, -0.045]);
    quiff.scale.set(1.15, 0.55, 1.05);
    quiff.rotation.x = -0.25;
    [-1, 1].forEach((s) => {
      add(head, new THREE.SphereGeometry(0.016, 12, 12), std(0x111111), [s * 0.05, 0.02, -0.128]);
      add(head, new THREE.BoxGeometry(0.05, 0.01, 0.01), hairMat, [s * 0.05, 0.05, -0.122], [0, 0, -s * 0.1]);
      const ear = add(head, new THREE.SphereGeometry(0.025, 10, 10), skin, [s * 0.14, 0, 0.005]);
      ear.scale.set(0.5, 1, 0.8);
    });
    add(head, new THREE.SphereGeometry(0.018, 12, 12), skin, [0, -0.01, -0.14]);
    /* ----- camera path (scroll driven) ----- */
    const END_DIST = 0.72; // metres from the screen at the end of the scroll
    const END = new THREE.Vector3(0, 1.3, -0.259 + END_DIST);
    const T0 = new THREE.Vector3(0, 1.0, 0.3);
    const T1 = new THREE.Vector3(0, 1.3, -0.259);
    const lookAt = new THREE.Vector3();
    let mobileStartFov = camera.fov;
    let mobileEndFov = camera.fov;
    let curve = null;

    const fit = () => {
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      const aspect = w / h;
      if (isMobile && aspect < 0.8) {
        T0.set(0, 1.3, -0.259);
      } else {
        T0.set(0, 1.0, 0.3);
      }
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5)
      );
      renderer.setSize(w, h);
      camera.aspect = aspect;
      // widen the lens on tall screens so the whole monitor still fits at the end
      mobileEndFov = THREE.MathUtils.clamp(
        (2 * Math.atan(0.5 / (END_DIST * aspect)) * 180) / Math.PI,
        40,
        aspect < 0.8 ? 115 : 85
      );
      mobileStartFov = isMobile && aspect < 0.8 ? 60 : mobileEndFov;
      camera.fov = isMobile ? mobileStartFov : mobileEndFov;
      camera.updateProjectionMatrix();
      END.z = -0.259 + END_DIST;
      const k = aspect < 1 ? (isMobile ? 0.8 : 1.25) : 1;
      curve = new THREE.CatmullRomCurve3(
        isMobile && aspect < 0.8
          ? [
              new THREE.Vector3(0.55, 1.55, 2.65),
              new THREE.Vector3(0.55, 1.5, 1.8),
              new THREE.Vector3(0.2, 1.4, 1.05),
              new THREE.Vector3(0.08, 1.34, END.z + 0.3),
              END.clone(),
            ]
          : [
              new THREE.Vector3(2.8 * k, 1.8, 2.6 * k),
              new THREE.Vector3(1.5 * k, 1.6, 1.7 * k),
              new THREE.Vector3(0.65, 1.5, 0.95),
              new THREE.Vector3(0.35, 1.38, END.z + 0.3),
              END.clone(),
            ]
      );
    };
    fit();

    const ease = (x) => x * x * (3 - 2 * x);

    /* ----- scroll ----- */
    let targetProgress = 0;
    let currentProgress = 0;
    const onScroll = () => {
      targetProgress = THREE.MathUtils.clamp(
        window.scrollY / (window.innerHeight * 2),
        0,
        1
      );
      if (hintRef.current) hintRef.current.style.opacity = String(Math.max(0, 1 - targetProgress * 8));
      if (capRef.current) capRef.current.style.opacity = String(THREE.MathUtils.clamp((targetProgress - 0.85) / 0.15, 0, 1));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ----- loop ----- */
    const clock = new THREE.Clock();
    let lastDraw = 0;
    let lastRender = Number.NEGATIVE_INFINITY;
    const renderFrame = (now) => {
      if (now - lastRender < 1000 / 30) return;
      lastRender = now;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      currentProgress += (targetProgress - currentProgress) * (1 - Math.exp(-dt * 6));
      const e = ease(currentProgress);
      if (isMobile && camera.fov !== mobileEndFov) {
        camera.fov = THREE.MathUtils.lerp(mobileStartFov, mobileEndFov, e);
        camera.updateProjectionMatrix();
      }
      curve.getPointAt(e, camera.position);
      lookAt.lerpVectors(T0, T1, e);
      camera.lookAt(lookAt);

      hands.forEach((hnd, i) => {
        const s = i === 0 ? -1 : 1;
        hnd.position.set(
          s * 0.12 + Math.sin(t * 9 + i * 2) * 0.012,
          0.83 + Math.max(0, Math.sin(t * 13 + i * 1.7)) * 0.012,
          0.35 + Math.sin(t * 5 + i) * 0.02
        );
        setLimb(forearms[i], elbows[i], hnd.position);
      });
      torso.scale.y = 1 + Math.sin(t * 1.6) * 0.01;
      head.rotation.y = Math.sin(t * 0.6) * 0.06;
      head.rotation.x = 0.1 + Math.sin(t * 0.9) * 0.02;
      fanMat.emissive.setHSL((t * 0.12) % 1, 1, 0.5);
      rgbLight.color.copy(fanMat.emissive);

      if (t - lastDraw > 0.08) { draw(t); lastDraw = t; }
      renderer.render(scene, camera);
      reportReady();
    };

    let visibilityObserver;
    if ("IntersectionObserver" in window && rootRef.current) {
      visibilityObserver = new IntersectionObserver(([entry]) => {
        renderer.setAnimationLoop(entry.isIntersecting ? renderFrame : null);
      });
      visibilityObserver.observe(rootRef.current);
    } else {
      renderer.setAnimationLoop(renderFrame);
    }

    const onResize = () => fit();
    window.addEventListener("resize", onResize);
    renderFrame(performance.now());

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      renderer.setAnimationLoop(null);
      visibilityObserver?.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      scene.traverse((o) => {
        if (o.isMesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        }
      });
      tex.dispose();
      pmrem?.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    // 300vh track: scroll progress = scrollY / (innerHeight * 2)
    <div ref={rootRef} className="h-[300vh] w-full">
       
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        <div ref={mountRef} className="h-full w-full" />
        {sceneUnavailable && (
          <div
            role="status"
            className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-5 bg-[#080d18] px-6 text-center"
          >
            <div className="relative h-56 w-44 overflow-hidden rounded-3xl shadow-xl sm:h-72 sm:w-56">
              <Image
                src="/rakib.png"
                alt="Portrait of Rakibul Islam"
                fill
                sizes="(max-width: 640px) 176px, 224px"
                className="object-cover"
                priority
              />
            </div>
            <p className="max-w-xs text-sm font-medium text-slate-300">
              3D preview isn&apos;t available on this device. Try a browser with WebGL enabled.
            </p>
          </div>
        )}
        <p
          ref={hintRef}
          className="pointer-events-none absolute inset-x-0 bottom-6 m-0 text-center font-mono text-xs tracking-widest text-zinc-500"
        >
          SCROLL TO ZOOM INTO THE MONITOR
        </p>
        <p
          ref={capRef}
          className="pointer-events-none absolute bottom-2 left-4 m-0 font-mono text-xs text-white opacity-0 [text-shadow:0_1px_6px_#000]"
        >
          checkout.spec.js · 1 failing test
        </p>
      </div>
    </div>
  );
};

export default HomeThreeSceneCanvas;