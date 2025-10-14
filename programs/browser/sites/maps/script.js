/* ============================================================
   MAP ENGINE - mouse-centric zoom / infinite world / variable LOD sizes
   ============================================================ */

const app = document.getElementById("app");
const worldEl = document.getElementById("world");
const layersEl = document.getElementById("layers");
const poisEl = document.getElementById("pois");
const markerEl = document.getElementById("marker");
const viewStat = document.getElementById("viewStat");
const markerStat = document.getElementById("markerStat");
const presetButtons = document.getElementById("presetButtons");
const scaleBar = document.getElementById("scaleBar");
const scaleRight = document.getElementById("scaleRight");
const scaleLabel = document.getElementById("scaleLabel");

let CONFIG = null;
let POIS = [];

let scenePath = "";

let limitMovementToWorld = null;
let debug = false;
let debugLods = false;

function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode') === 'true';
    let scene = urlParams.get('scene');

    const paramLimit = urlParams.get('limitMovementToWorld');
    // Keep "null" for later definition by config.json in boot()
    if (paramLimit === 'true')  limitMovementToWorld = true;
    if (paramLimit === 'false') limitMovementToWorld = false;

    if(darkMode) gebi('body').classList.add('dark');
    if(scene) scenePath = `./data/${scene}`;
    
    // Start the map generation
    boot();
}

async function boot() {
  try {
    const [cfg, pts] = await Promise.all([
      fetch(`${scenePath}/config.json`).then((r) => r.json()),
      fetch(`${scenePath}/points.json`)
        .then((r) => r.json())
        .catch(() => []),
    ]);
    CONFIG = normalizeConfig(cfg);
    POIS = pts;
    await preloadAllImages(CONFIG);
    setForceTypeSearch();
    collectLayerTypes();
    initWorld();
    enableDebugClick();
    renderPresets(CONFIG.presets.length ? CONFIG.presets : [{"label": "Initial view", "x": CONFIG.initialView.x, "y": CONFIG.initialView.y, "z": CONFIG.initialView.z}]);
    renderPOIs(POIS);
    // get limitMovementToWorld from cionfig.json if no URL param for it is set
    if(limitMovementToWorld === null) limitMovementToWorld = CONFIG.limitMovementToWorld;
  } catch (e) {
    console.error("Boot failed:", e);
    alert("Boot failed - see console.");
  }
}

/* ---------- helpers ---------- */
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function normalizeConfig(cfg) {
  const out = { ...cfg };
  out.lods = [...(cfg.lods || [])].sort(
    (a, b) => (a.maxZ ?? Infinity) - (b.maxZ ?? Infinity)
  );
  let last = 0;
  out.lods.forEach((l) => {
    l.minZ = last;
    if (typeof l.maxZ !== "number") l.maxZ = Infinity;
    last = l.maxZ;
  });
  return out;
}

async function preloadAllImages(cfg) {
  const urls = new Set();
  cfg.lods.forEach((lod) => lod.layers.forEach((layer) => urls.add(layer.url)));
  await Promise.all(
    [...urls].map(
      (url) =>
        new Promise((res) => {
          const img = new Image();
          img.onload = () => res();
          img.onerror = () => {
            console.warn("❌ image missing", url);
            res();
          };
          img.src = `${scenePath}/assets/${url}`;
        })
    )
  );
  console.log("✅ all images preloaded");
}

function setForceTypeSearch() {
  let input = gebi('search');
  if(CONFIG.forceType.length > 0) {
    input.setAttribute("onkeydown", `forceType(event, this, '${CONFIG.forceType}', function () { gebi('search').value = ''; flyToPreset(1); }, true)`);
  } else {
    input.setAttribute(
      "onkeydown",
      "if(event.key === 'Enter'){ gebi('search').value=''; flyToPreset(1); }"
    );
  }
}

/* ---------- camera ---------- */
let camera = { x: 0, y: 0, z: 1 };
let marker = { x: 0, y: 0 };
let isDragging = false;
let dragStart = null;
let anim = null;
let currentLodIndex = -1;

function setCamera(x, y, z) {
  if (limitMovementToWorld) {
    const vw = app.clientWidth / z;
    const vh = app.clientHeight / z;
    const halfW = vw / 2;
    const halfH = vh / 2;

    // handle case: view larger than world
    const worldW = CONFIG.worldWidth;
    const worldH = CONFIG.worldHeight;

    if (vw >= worldW) x = worldW / 2;
    else x = clamp(x, halfW, worldW - halfW);

    if (vh >= worldH) y = worldH / 2;
    else y = clamp(y, halfH, worldH - halfH);
  }

  camera.x = x;
  camera.y = y;
  camera.z = z;

  const tx = app.clientWidth / 2 - x * z;
  const ty = app.clientHeight / 2 - y * z;
  worldEl.style.transform = `translate(${tx}px,${ty}px) scale(${z})`;

  refreshLodIfNeeded();
  updateStats();
  updateScale();
  updatePOIVisibility();
  updateGridThickness(z);

  if (markerEl) {
    const inv = 1 / z;
    markerEl.style.transform = `scale(${inv})`;
    markerEl.style.transformOrigin = "center bottom";
  }
}


function updateGridThickness(z) {
    const grids = layersEl.querySelectorAll(".grid");
    grids.forEach(g => {
      if(!g.dataset.gridColor.length) return;
      const gsize = parseFloat(g.dataset.baseGridSize || 100);
      const gcol  = g.dataset.gridColor;
      // line thickness inversely proportional to zoom
      const line = 1 / z;  // 1 px at z=1
      g.style.backgroundImage =
        `linear-gradient(to right, ${gcol} ${line}px, transparent ${line}px),
         linear-gradient(to bottom, ${gcol} ${line}px, transparent ${line}px)`;
      // spacing in world units - zoomed along with the map
      g.style.backgroundSize = `${gsize}px ${gsize}px`;
    });
  }
  

function getLodIndexForZ(z) {
  return CONFIG.lods.findIndex((l) => z >= l.minZ && z < l.maxZ);
}

function refreshLodIfNeeded() {
  const idx = getLodIndexForZ(camera.z);
  if (idx !== currentLodIndex) {
    currentLodIndex = idx;
    renderLayersForLod(idx);
  }
}

/* ---------- rendering ---------- */
function renderLayersForLod(idx) {
  if(debugLods) return;
  cl("render LOD:", idx);
  if (idx < 0) return;
  const lod = CONFIG.lods[idx];

  // --- Remove higher LODs when zooming out ---
  layersEl.querySelectorAll(".lod-group").forEach(g => {
    const n = parseInt(g.dataset.lodIndex, 10);
    if (n > idx) g.remove();
  });

  // --- Hide all existing grids ---
  layersEl.querySelectorAll(".grid").forEach(g => (g.style.display = "none"));

  // --- Reuse existing grid or create if missing ---
  let gridDiv = layersEl.querySelector(`.grid[data-lod-index="${idx}"]`);
  if (!gridDiv) {
    gridDiv = document.createElement("div");
    gridDiv.className = "grid";
    gridDiv.dataset.lodIndex = idx;
    Object.assign(gridDiv.style, {
      position: "absolute",
      left: "0",
      top: "0",
      width: CONFIG.worldWidth + "px",
      height: CONFIG.worldHeight + "px",
      pointerEvents: "none",
      zIndex: 666,
    });

    if (lod.grid) {
      const gsize = lod.grid.size || 100;
      const gcol = lod.grid.color ?? "rgba(255,255,255,.15)";
    
      // --- skip rendering grid if color string is empty ---
      if (!gcol || gcol.trim().length === 0) {
        gridDiv.dataset.gridColor = "";
        gridDiv.style.display = "none";
      } else {
        gridDiv.dataset.baseGridSize = gsize;
        gridDiv.dataset.gridColor = gcol;
        gridDiv.style.backgroundImage =
          `linear-gradient(to right, ${gcol} .5vw, transparent .5vw),
           linear-gradient(to bottom, ${gcol} .5vw, transparent .5vw)`;
        gridDiv.style.backgroundSize = `${gsize}px ${gsize}px`;
        gridDiv.style.backgroundPosition = "0 0";
      }
    }

    layersEl.appendChild(gridDiv);
    cl("created grid for LOD", idx);
  }

  // --- show the active grid only ---
  gridDiv.style.display = "block";

  // --- Skip if this LOD group is already rendered ---
  if (layersEl.querySelector(`.lod-group[data-lod-index="${idx}"]`)) {
    cl("LOD already rendered, skipping re-add:", idx);
    return;
  }

  // --- Create a container for this LOD’s images ---
  const group = document.createElement("div");
  group.className = "lod-group";
  group.dataset.lodIndex = idx;
  Object.assign(group.style, {
    position: "absolute",
    left: "0",
    top: "0",
    width: CONFIG.worldWidth + "px",
    height: CONFIG.worldHeight + "px",
    zIndex: idx,
    pointerEvents: "none",
  });

  // --- Place each image exactly at its offset ---
  lod.layers.forEach(layer => {
    const img = document.createElement("img");
    img.className = "layer-img";
    img.src = `${scenePath}/assets/${layer.url}`;
    img.alt = layer.type || "layer";
    img.decoding = "async";
    img.loading = "eager";

    Object.assign(img.style, {
      position: "absolute",
      left: (layer.offsetX || 0) + "px",
      top: (layer.offsetY || 0) + "px",
      width: (layer.width || 800) + "px",
      height: (layer.height || 800) + "px",
      pointerEvents: "none",
    });

    group.appendChild(img);
  });

  layersEl.appendChild(group);
  applyLayerFilters();
}

  
  

/* ---------- POIs ---------- */
let POI_ELEMENTS = [];

function renderPOIs(points) {
  poisEl.innerHTML = "";
  POI_ELEMENTS = [];

  points.forEach(p => {
    const el = document.createElement("div");
    el.className = "poi pointer " + (p.pointClasses || "");
    el.style.cssText = p.iconStyles || "";
    el.style.left = p.x + "px";
    el.style.top = p.y + "px";
    el.title = p.tooltip || "";

    const icon = document.createElement("i");
    icon.className = "material-icons icon";
    icon.style.fontSize = (p.size ? p.size * 10 : 14) + "px";
    icon.textContent = p.icon || "•";
    el.appendChild(icon);

    if (p.text) {
      const label = document.createElement("div");
      label.className = "label";
      label.textContent = p.text;
      el.appendChild(label);
    }
    if (p.action) {
      el.addEventListener("click", () => {
      try {
        // evaluate the string as code
        new Function(p.action)();
      } catch (err) {
        console.warn("POI action failed:", err);
      }
    });
    }

    // Store for dynamic visibility updates
    POI_ELEMENTS.push({ el, minZ: p.minZ ?? 0, maxZ: p.maxZ ?? Infinity });

    poisEl.appendChild(el);
  });

  updatePOIVisibility();
}

function updatePOIVisibility() {
    const z = camera.z;
    POI_ELEMENTS.forEach(poi => {
      // Visibility range check
      const visible = z >= poi.minZ && z <= poi.maxZ;
      poi.el.style.display = visible ? "inline-flex" : "none";
  
      // Constant screen size: invert the world scale
      if (visible) {
        const inv = 1 / z;
        poi.el.style.transform = `translate(-50%, -100%) scale(${inv})`;
        poi.el.style.transformOrigin = "right bottom";
      }
    });
  }
  

/* ---------- UI feedback ---------- */
/* ---------- layer type toggles ---------- */
let LAYER_TYPES = new Set();
let LAYER_FILTERS = {};

function collectLayerTypes() {
  LAYER_TYPES = new Set();
  CONFIG.lods.forEach(lod => lod.layers.forEach(layer => {
    if (layer.type) LAYER_TYPES.add(layer.type);
  }));
  LAYER_FILTERS = Object.fromEntries([...LAYER_TYPES].map(t => [t, true]));
  renderLayerToggles();
}

function renderLayerToggles() {
  const container = document.getElementById("layerToggles");  // || createLayerTogglePanel();
  container.innerHTML = "";
  LAYER_TYPES.forEach(type => {
    const btn = document.createElement("button");
    btn.className = "btn small active";
    btn.textContent = type;
    btn.dataset.type = type;
    btn.onclick = () => {
      LAYER_FILTERS[type] = !LAYER_FILTERS[type];
      // btn.style.opacity = LAYER_FILTERS[type] ? "1" : "0.4";
      btn.classList.toggle("active");
      applyLayerFilters();
    };
    container.appendChild(btn);
  });
}

function applyLayerFilters() {
  const imgs = layersEl.querySelectorAll("img.layer-img");
  imgs.forEach(img => {
    const t = img.alt;
    img.style.display = LAYER_FILTERS[t] ? "block" : "none";
  });
}

function debugShowAllLods() {
  if(debugLods) {
    alert("reload to go to normal mode :)");
    return;
  }
  console.warn("🧩 Debug: showing all LODs simultaneously");

  // Zoom fully out so the entire world is visible
  limitMovementToWorld = false;
  const z =  CONFIG.minZoom;
  CONFIG.minZoom = -666;
  CONFIG.maxZoom = 666;
  setCamera(CONFIG.worldWidth / 2, CONFIG.worldHeight / 2, z);

  // Clear any previous debug state
  layersEl.innerHTML = "";

  // Define color palette per LOD
  const colors = [
    "#e74c3c", // red
    "#f1c40f", // yellow
    "#2ecc71", // green
    "#3498db", // blue
    "#9b59b6", // purple
    "#e67e22", // orange
    "#1abc9c", // teal
  ];

  CONFIG.lods.forEach((lod, i) => {
    renderLayersForLod(i); // render as normal

    // Apply borders to each image inside this LOD
    let currentLodContainer = layersEl.querySelectorAll(`.lod-group[data-lod-index="${i}"]`)[0];
    currentLodContainer.style.boxShadow = "inset 0 0 0 10px magenta";
    const imgs = layersEl.querySelectorAll(`.lod-group[data-lod-index="${i}"] img.layer-img`);
    imgs.forEach(img => {
      img.style.outline = `15px solid ${colors[i % colors.length]}`;
      // img.style.outlineOffset = `-${i}px`; // slight offset so stacked borders are visible
      img.title = `LOD ${i}`;
      img.style.opacity = `0.66`;
      let imgName = `LOD ${i}:` + img.src.slice(img.src.lastIndexOf('/') + 1);
      // img.dataset["src"] = imgName;
      let nameTag = document.createElement("div"); 
      nameTag.innerHTML = imgName;
      nameTag.classList.add("nameTagDebug");
      nameTag.style.left = img.style.left;
      nameTag.style.top = (parseInt(img.style.top) + i * 60) + "px";
      currentLodContainer.appendChild(nameTag);
    });

    // Optionally tint or label grids
    const grid = layersEl.querySelector(`.grid[data-lod-index="${i}"]`);
    if (grid) {
      grid.style.opacity = 0.1;
      grid.title = `Grid for LOD ${i}`;
    }
  });

  debugLods = true;
  console.log("✅ All LODs rendered with colored borders for debugging.");
}

function enableDebugClick() {
  const debugPois = document.getElementById("debugPois");
  app.addEventListener("contextmenu", (e) => {
    if (!debug) {
      return
    }
    e.preventDefault(); // prevent browser right-click menu

    // get world coordinates under cursor
    const rect = app.getBoundingClientRect();
    const worldX = (e.clientX - rect.left - app.clientWidth / 2) / camera.z + camera.x;
    const worldY = (e.clientY - rect.top - app.clientHeight / 2) / camera.z + camera.y;
    const worldZ = camera.z;

    // format nicely
    const line = document.createElement("div");
    line.textContent = `X=${worldX.toFixed(1)}  Y=${worldY.toFixed(1)}  Z=${worldZ.toFixed(3)}`;
    line.style.fontFamily = "monospace";
    line.style.fontSize = "12px";
    line.style.padding = "2px 4px";
    line.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
    line.style.color = "lime";

    debugPois.append(line); // newest last
    console.log("🟣 Debug POI", worldX, worldY, worldZ);

    // --- copy POI JSON to clipboard ---
    const poi = {
      tooltip: "",
      icon: "location_pin",
      x: worldX.toFixed(1),
      y: worldY.toFixed(1),
      minZ: CONFIG.minZoom,
      maxZ: CONFIG.maxZoom,
      size: 2,
      pointClasses: "red text-shadow--white noBox",
      iconStyles: "",
      text: "",
      action: "alert('cam A - AAAAA')"
    };

    const poiStr = JSON.stringify(poi, null, 4);
    navigator.clipboard.writeText(poiStr).then(() => {
      console.log("📋 copied POI to clipboard", poi);
    });
  });
}


function updateStats() {
  viewStat.textContent = `${camera.x.toFixed(1)} / ${camera.y.toFixed(
    1
  )} / ${camera.z.toFixed(3)}`;
  markerStat.textContent = `${marker.x.toFixed(1)} / ${marker.y.toFixed(
    1
  )} / ${camera.z.toFixed(3)}`;
}

/* Scale bar logic:
   CONFIG.scaleAtZoom1 = real-world units per pixel at z=1 (e.g., metersPerPixelAtZ1)
   If you prefer "units per 100 px", set scalePerPixelAtZ1 = value/100.
*/
function updateScale(){
    if (typeof CONFIG.scaleAtZoom1 !== 'number' || CONFIG.scaleAtZoom1 <= 0) {
      scaleLabel.textContent = 'Scale';
      return;
    }
    const metersPerPixel = CONFIG.scaleAtZoom1 / camera.z; // more zoom => fewer meters per pixel
    const maxBarPx = 240; // UI width budget
    const targetReal = metersPerPixel * maxBarPx;
  
    // Round to "pleasant" numbers
    const nice = niceRound(targetReal);
    const barPx = nice / metersPerPixel;
  
    scaleBar.style.width = `${barPx}px`;
    scaleRight.textContent = formatMeters(nice);
    scaleLabel.textContent = `${formatMeters(metersPerPixel)} per pixel @ z=${camera.z.toFixed(2)}`;
  }
  function niceRound(x){
    const pow10 = Math.pow(10, Math.floor(Math.log10(x)));
    const n = x / pow10;
    const steps = [1, 2, 5, 10];
    const step = steps.find(s => n <= s) ?? 10;
    return step * pow10;
  }
  function formatMeters(m){
    if (m >= 1000) return (m/1000).toFixed((m%1000)?1:0) + ' km';
    if (m >= 1) return Math.round(m) + ' m';
    return Math.round(m*100) / 100 + ' m';
  }

/* ---------- interaction ---------- */
document.getElementById("centerBtn").onclick = () =>
  flyTo(CONFIG.initialView.x, CONFIG.initialView.y, CONFIG.initialView.z);
document.getElementById("zoomIn").onclick = () => stepZoom(1.2);
document.getElementById("zoomOut").onclick = () => stepZoom(1 / 1.2);

app.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return;
  isDragging = true;
  app.classList.add("grabbing");
  dragStart = {
    screenX: e.clientX,
    screenY: e.clientY,
    camX: camera.x,
    camY: camera.y,
  };
});
window.addEventListener("mouseup", () => {
  isDragging = false;
  app.classList.remove("grabbing");
});
window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const dx = e.clientX - dragStart.screenX;
  const dy = e.clientY - dragStart.screenY;
  setCamera(
    dragStart.camX - dx / camera.z,
    dragStart.camY - dy / camera.z,
    camera.z
  );
});
app.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const factor = Math.pow(1.2, -e.deltaY / 100);
    zoomAboutCursor(factor, e.clientX, e.clientY);
  },
  { passive: false }
);

/* zoom centered on cursor */
function zoomAboutCursor(factor, sx, sy) {
  const rect = app.getBoundingClientRect();
  const { x, y, z } = camera;
  let nz = z * factor;
  nz = clamp(nz, CONFIG.minZoom, CONFIG.maxZoom);

  if (limitMovementToWorld) {
    const minZoomToFitWidth  = app.clientWidth  / CONFIG.worldWidth;
    const minZoomToFitHeight = app.clientHeight / CONFIG.worldHeight;
    // must satisfy both ⇒ take the larger one
    const minZoom = Math.max(minZoomToFitWidth, minZoomToFitHeight);
    nz = Math.max(nz, minZoom);
  }

  // If we're already at a limit, abort
  if (nz === z) return;

  // Compute world coords under cursor
  const worldX = (sx - rect.left - app.clientWidth / 2) / z + x;
  const worldY = (sy - rect.top - app.clientHeight / 2) / z + y;

  // Keep cursor fixed
  const nx = worldX - (sx - rect.left - app.clientWidth / 2) / nz;
  const ny = worldY - (sy - rect.top - app.clientHeight / 2) / nz;

  setCamera(nx, ny, nz);
}

/* infinite boundaries → no clamping anywhere */
function flyTo(tx, ty, tz, ms = 900) {
  if (anim) cancelAnimationFrame(anim);
  const sx = camera.x,
    sy = camera.y,
    sz = camera.z;
  const start = performance.now();
  const ease = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  function frame(now) {
    const t = Math.min(1, (now - start) / ms);
    const k = ease(t);
    setCamera(sx + (tx - sx) * k, sy + (ty - sy) * k, sz + (tz - sz) * k);
    if (t < 1) anim = requestAnimationFrame(frame);
  }
  anim = requestAnimationFrame(frame);
}

function stepZoom(f) {
  const cx = app.clientWidth / 2;
  const cy = app.clientHeight / 2;
  zoomAboutCursor(f, cx, cy);
}

function renderPresets(presets) {
  console.log(presets);
  const presetButtons = document.getElementById("presetButtons");
  presetButtons.innerHTML = "";
  (presets || []).forEach((p, i) => {
    const b = document.createElement("button");
    b.className = "btn small";
    b.textContent = `${i + 1}. ${p.label || `Preset ${i + 1}`}`;
    b.title = `Fly to ${p.label || ""} (${i + 1})`;
    b.onclick = () => flyTo(p.x, p.y, p.z);
    presetButtons.appendChild(b);
  });
  if(presets.length) {
    gebi('kbdMax').innerHTML = `1${presets.length > 1 ? '…' + presets.length : ''}`;
  } else {
    presetButtons.innerHTML = "No presets saved in config.json";
  }
}

/* ---------- init ---------- */
function initWorld() {
  camera = { ...CONFIG.initialView };
  marker = { ...CONFIG.marker };
  if(marker.display) {
    markerEl.style.left = marker.x + "px";
    markerEl.style.top = marker.y + "px";
    document.documentElement.style.setProperty("--markerAngle", marker.angle + "deg");
  } else {
    hide('marker');
  }
  setCamera(camera.x, camera.y, camera.z);

  // --- INITIAL LOD PRELOAD: draw all lower LODs once ---
  const idx = getLodIndexForZ(camera.z);
  for (let i = 0; i <= idx; i++) {
    if (!layersEl.querySelector(`.lod-group[data-lod-index="${i}"]`)) {
      renderLayersForLod(i);
    }
  }

  // set current lod tracker
  currentLodIndex = idx;

  cl("Initial load: rendered all LODs up to", idx);
}

window.addEventListener("resize", () =>
  setCamera(camera.x, camera.y, camera.z)
);

window.addEventListener("keydown", (e) => {
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," ","+","-"].includes(e.key)) e.preventDefault();
  
    const stepBase = 60;
    const step = (e.shiftKey ? 3 : 1) * (stepBase / camera.z);
  
    if (e.key === "ArrowUp")   setCamera(camera.x, camera.y - step, camera.z);
    if (e.key === "ArrowDown") setCamera(camera.x, camera.y + step, camera.z);
    if (e.key === "ArrowLeft") setCamera(camera.x - step, camera.y, camera.z);
    if (e.key === "ArrowRight")setCamera(camera.x + step, camera.y, camera.z);
    if (e.key === "+") stepZoom(1.2);
    if (e.key === "-") stepZoom(1/1.2);
  });
  
  // numeric keys 1-9: fly to preset
window.addEventListener("keydown", (e) => {
    const num = parseInt(e.key, 10);
    if (!isNaN(num) && CONFIG.presets && num >= 1) {
      e.preventDefault();
      /* const p = CONFIG.presets[num - 1];
      if (p) flyTo(p.x, p.y, p.z); */
      flyToPreset(num);
    }
  });

  
function flyToPreset(presetIndex) {
    const p = CONFIG.presets[presetIndex - 1];
    if (p) {
      flyTo(p.x, p.y, p.z);
    } else {
      flyTo(CONFIG.initialView.x, CONFIG.initialView.y, CONFIG.initialView.z);
    }

}