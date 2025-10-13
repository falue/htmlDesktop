#!/usr/bin/env python3
import sys, os
from PIL import Image
import json

TILE_SIZE = 800

def tile_image(image_path):
    # Open image
    im = Image.open(image_path).convert("RGBA")
    w, h = im.size
    basename = os.path.splitext(os.path.basename(image_path))[0]
    outdir = os.path.join(os.path.dirname(image_path), f"{basename}_tiles")
    os.makedirs(outdir, exist_ok=True)

    tiles = []
    tile_index = 1

    # Compute number of tiles in x/y
    x_tiles = (w + TILE_SIZE - 1) // TILE_SIZE
    y_tiles = (h + TILE_SIZE - 1) // TILE_SIZE

    for ty in range(y_tiles):
        for tx in range(x_tiles):
            offsetX = tx * TILE_SIZE
            offsetY = ty * TILE_SIZE

            # Compute crop box within source
            crop_box = (
                offsetX,
                offsetY,
                min(offsetX + TILE_SIZE, w),
                min(offsetY + TILE_SIZE, h)
            )
            tile = im.crop(crop_box)

            # If not full size, paste into transparent 800x800
            if tile.size != (TILE_SIZE, TILE_SIZE):
                full_tile = Image.new("RGBA", (TILE_SIZE, TILE_SIZE), (0, 0, 0, 0))
                full_tile.paste(tile, (0, 0))
                tile = full_tile

            tile_filename = f"{basename}-{tile_index:02d}.png"
            tile.save(os.path.join(outdir, tile_filename))

            tiles.append({
                "url": tile_filename,
                "type": "base",
                "width": TILE_SIZE,
                "height": TILE_SIZE,
                "offsetX": offsetX,
                "offsetY": offsetY
            })

            tile_index += 1

    # Write JSON file next to the tiles
    json_path = os.path.join(outdir, f"{basename}_tiles.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(tiles, f, indent=2, ensure_ascii=False)

    print(f"✅ Created {len(tiles)} tiles and JSON descriptor:\n{json_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python tile_image.py input_image.png")
        sys.exit(1)
    tile_image(sys.argv[1])
