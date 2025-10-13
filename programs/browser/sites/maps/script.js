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

function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode') === 'true';
    let scene = urlParams.get('scene');

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
    renderPresets(CONFIG.presets || []);
    renderPOIs(POIS);
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
  if(CONFIG.forceType.length > 0) {
    let input = gebi('search');
    input.setAttribute("onkeydown", `forceType(event, this, '${CONFIG.forceType}', function () { gebi('search').value = ''; flyToPreset(1); }, true)`);
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
  updateGridThickness(camera.z);
  // keep marker constant size (like POI)
    if (markerEl) {
        const inv = 1 / camera.z;
        markerEl.style.transform = `scale(${inv})`;
        markerEl.style.transformOrigin = "center bottom";
    }
}

function updateGridThickness(z) {
    const grids = layersEl.querySelectorAll(".grid");
    grids.forEach(g => {
      const gsize = parseFloat(g.dataset.baseGridSize || 100);
      const gcol  = g.dataset.gridColor || "rgba(255,255,255,.15)";
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
/* function renderLayersForLod(idx) {
    cl(idx);
    layersEl.innerHTML = "";  // this erases the complete
    if (idx < 0) return;
    const lod = CONFIG.lods[idx];
  
    // Create background grid (fills entire world space)
    const gridDiv = document.createElement("div");
    gridDiv.className = "grid";
    gridDiv.style.position = "absolute";
    gridDiv.style.left = "0";
    gridDiv.style.top = "0";
    gridDiv.style.width = CONFIG.worldWidth + "px";
    gridDiv.style.height = CONFIG.worldHeight + "px";
    gridDiv.style.pointerEvents = "none";
  
    if (lod.grid) {
      const gsize = lod.grid.size || 100;
      const gcol = lod.grid.color || "rgba(255,255,255,.15)";
      gridDiv.style.backgroundImage =
        `linear-gradient(to right, ${gcol} .5vw, transparent .5vw),
         linear-gradient(to bottom, ${gcol} .5vw, transparent .5vw)`;
      gridDiv.style.backgroundSize = `${gsize}px ${gsize}px`;
      gridDiv.style.backgroundPosition = "0 0";
    }
  
    layersEl.appendChild(gridDiv);
  
    // Draw LOD image layers above grid
    lod.layers.forEach(layer => {
      const img = document.createElement("img");
      img.className = "layer-img";
      img.src = `${scenePath}/assets/${layer.url}`;
      img.alt = layer.type || "layer";
      img.decoding = "async";
      img.loading = "eager";
  
      // Keep aspect ratio
      if (layer.width) img.width = layer.width;
      if (layer.height) img.height = layer.height;
      if (layer.offsetX) img.style.left = layer.offsetX + "px";
      if (layer.offsetY) img.style.top = layer.offsetY + "px";
  
      layersEl.appendChild(img);
    });

    applyLayerFilters();
  } */
  
function renderLayersForLod(idx) {
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
      const gcol = lod.grid.color || "rgba(255,255,255,.15)";
      gridDiv.dataset.baseGridSize = gsize;
      gridDiv.dataset.gridColor = gcol;
      gridDiv.style.backgroundImage =
        `linear-gradient(to right, ${gcol} .5vw, transparent .5vw),
         linear-gradient(to bottom, ${gcol} .5vw, transparent .5vw)`;
      gridDiv.style.backgroundSize = `${gsize}px ${gsize}px`;
      gridDiv.style.backgroundPosition = "0 0";
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

  // Clamp zoom before applying
  const nz = clamp(z * factor, CONFIG.minZoom, CONFIG.maxZoom);

  // If we're already at a limit, abort
  if (nz === z) return;

  // Compute world coords under cursor
  const worldX = (sx - rect.left - app.clientWidth / 2) / z + x;
  const worldY = (sy - rect.top - app.clientHeight / 2) / z + y;

  // Keep the cursor position stable in screen space
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
    if (!isNaN(num) && CONFIG.presets && num >= 1 && num <= CONFIG.presets.length) {
      e.preventDefault();
      /* const p = CONFIG.presets[num - 1];
      if (p) flyTo(p.x, p.y, p.z); */
      flyToPreset(num);
    }
  });

  
function flyToPreset(presetIndex) {
    const p = CONFIG.presets[presetIndex - 1];
    if (p) flyTo(p.x, p.y, p.z);

}