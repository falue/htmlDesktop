let colors = [
    "#638c52",  // Green
    "#e55845",  // Red
    "#b0752c",  // Orange
    "#46659d",  // Blue
    "#c086ef",  // Lilac
    "#a43f4a"   // darkRed
];

let colorsTransparent = [
    "rgba(99, 140, 82, .5)",
    "rgba(229, 88, 69, .5)",
    "rgba(176, 117, 44, .5)",
    "rgba(70, 101, 157, .5)",
    "rgba(192, 134, 239, .5)",
    "rgba(164, 63, 74, .5)"
]

/* let techwords = [
"field", "suppression", "temporal mis-match", "utility", "anomalies", "temporal", "losses", "opaque", "fragmentation", "utility", "adapter", "hard-wired", "fusion", "flux fiber", "external", "alignment", "intermittent", "inductance", "power", "index", "storage", "impedance", "capacity", "refraction", "amplitude"
] */

let techwords = ["CPU usage",
    "Memory usage",
    "GPU utilization",
    "GPU memory",
    "Network send",
    "Network receive",
    "Neuron count",
    "compression rate",
    "memory expansion rate",
    "logic amount",
    "logic complexity",
    "CPU cores",
    "GPU memory",
    "max. GPU memory bandwith",
    "GPU tensor cores",
    "memory usage",
    "CPU usage",
    "Memory usage",
    "GPU utilization",
    "GPU memory",
    "FPS",
    "ms",
    "RHI",
    "Texture memory 2D",
    "Vertex buffer memory",
    "Structured buffer memory",
    "Ray Tracing Acceleration Structury memory",
    "Uniform buffer memory",
    "Pixel buffer memory",
]

// createChart(data[i].width, data[i].height, "canvas-"+createUniqueId(), data[i].target, data[i]);


/* CHARTS! */
function createChart(width, height, canvasId, targetId, data) {
    let canvas = document.createElement("canvas");
    canvas.style.width = width || "100%";
    canvas.style.height = height || "100%";
    canvas.id = canvasId;
    gebi(targetId).appendChild(canvas);
    new Chart(canvasId, data);
}
