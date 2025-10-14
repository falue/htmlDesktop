# 🎬 Map Prop Engine – Quick Reference

# URL parameters
```
darkMode              sets darkMode
scene                 defines where assets, config and points are coming from ("data/{scene}/...")
limitMovementToWorld  inhibit moving out of the world space. overwrites this setting from config.json.
```

## `config.json` Structure
Defines map geometry, zoom limits, and image layers per zoom level (LOD).

```json
{
    "worldWidth": 10000,
    "worldHeight": 10000,
    "initialView": { "x": 2048, "y": 2048, "z": 0.25 },
    "marker": { "display": true, "x": 2200, "y": 1800, "angle": 45 },
    "minZoom": 0.05,
    "maxZoom": 4,
    "forceType": "Mallorca",
    "limitMovementToWorld": true,
    "scaleAtZoom1": 1.5,  // = real-world units per pixel at z=1 (e.g., metersPerPixelAtZ1). 
    "lods": [
      {
        "maxZ": 0.3,
        "grid": { "size": 200, "color": "rgba(255,0,0,.5)" },
        "layers": [
          { "url": "sat_low.png", "type": "base", "width": 2028, "height": 1488, "offsetX": 0, "offsetY": 0 },
          { "url": "sat_low.png", "type": "base", "width": 2028, "height": 1488, "offsetX": 2028, "offsetY": 0 },
          { "url": "roads_low.svg", "type": "overlay", "width": 1600, "height": 900, "offsetX": 0, "offsetY": 0 }
        ]
      },
      {
        "maxZ": 0.9,
        "grid": { "size": 100, "color": "rgba(0,255,0,.5)" },
        "layers": [
          { "url": "sat_mid.png", "type": "base", "width": 2448, "height": 1530, "offsetX": 0, "offsetY": 0 },
          { "url": "roads_mid.svg", "type": "overlay", "width": 1600, "height": 900, "offsetX": 500, "offsetY": 0 }
        ]
      },
      {
        "maxZ": 99,
        "grid": { "size": 50, "color": "rgba(0,128,255,.5)" },
        "layers": [
          { "url": "sat_hi.png", "type": "base", "width": 2640, "height": 1588, "offsetX": 0, "offsetY": 0 },
          { "url": "roads_hi.svg", "type": "overlay", "width": 1600, "height": 900, "offsetX": 0, "offsetY": 0 }
        ]
      }
    ],
    "presets": [
      { "label": "HQ Gate", "x": 1800, "y": 1800, "z": 0.5 },
      { "label": "Warehouse", "x": 3100, "y": 2100, "z": 0.8 },
      { "label": "Main Sq.", "x": 2048, "y": 2048, "z": 1.2 }
    ]
  }
```

## Scaling map images
Width & height needs the same proportions as the imgs, but no necessarily be the dimensions of the img.
So an image can be 1000 x 1000px wide but be defined as 666 x 666px to scale it down.

Use the bolt-button and the debug button to see the images all at once.
Find the correct X/Y position and offset of these lods by using the dev tools of your browser.
Adjust for left/right and fill those as offsets X/Y.

## Find POIs
if in debug mode, right click on the world to see X/Y/Z of that point.
This also copies a valid json object to your clipboard for isnerting into `points.json`.

### 🔹 Fields
| Key | Description |
|-----|--------------|
| `worldWidth`, `worldHeight` | total world pixel size (sets coordinate system) |
| `minZoom`, `maxZoom` | zoom limits |
| `initialView` | starting camera position |
| `initialMarker` | marker position (stays constant size) |
| `scaleAtZoom1` | meters per pixel at zoom = 1 (for scale bar) |
| `forceType` | If not empty, this is the text that gets force-typed into the search bar. On enter, you fly to saved preset nr 1 (or to initialView if no presets defined). |
| `limitMovementToWorld` | Don't go out of bounds (outside worldWidth/height) |
| `presets` | optional named camera positions (fly-to these by pressing 1...x on keyboard) |
| `lods` | list of image sets per zoom range |
| `grid` | optional debug grid for that LOD |
| `layers` | individual image/SVG files to draw |

Each `layer` has:
- `url`: path to image or SVG  
- `type`: category (used for toggling on/off)  
- `width` / `height`: native pixel dimensions  
- `offsetX` / `offsetY`: optional placement offset  

---

## 📍 `points.json` (POIs)

Defines interactive points of interest (icons, text, tooltips, actions).

```json
[
  {
    "tooltip": "This is videocam 1234123-A",
    "icon": "videocam",
    "x": 666,
    "y": 333,
    "minZ": 0.4,
    "maxZ": 2.5,
    "size": 2,
    "iconClasses": "",
    "iconStyles": "",
    "text": "Lorem Ipsum",
    "action": ""
  },
  {
    "tooltip": "This is videocam 1234123-B",
    "icon": "location_pin",
    "x": 999,
    "y": 333,
    "minZ": 0,
    "maxZ": 4,
    "size": 2,
    "pointClasses": "red text-shadow--white noBox",
    "iconStyles": "",
    "text": "",
    "action": "alert('cam A - AAAAA')"
  }
  ]

```

Hint: Add class `noBox` to a poi so thers no box around it. The bottom center of the icon is then at the defined point.

| Key | Meaning |
|-----|----------|
| `x`, `y` | world coordinates |
| `icon` | emoji or short text |
| `size` | relative size (1 = 10 px base) |
| `minZ` / `maxZ` | visible zoom range |
| `iconClasses` / `iconStyles` | optional CSS styling |
| `action` | JS snippet to execute on click |


## 🧩 Grids

Each LOD can define its own grid overlay:
```json
"grid": { "size": 100, "color": "rgba(255,255,255,0.2)" }
```
- **Size**: grid cell spacing in world pixels  
- **Color**: any CSS color. if no color is set, it is not rendered for that LOD.
