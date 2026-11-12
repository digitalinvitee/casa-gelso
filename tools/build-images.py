#!/usr/bin/env python3
"""
Casa Gelso responsive image builder.

Regenerates every optimised image the site serves (assets/img/) from the
original masters, which stay untouched in assets/teaser, assets/reveal and
assets/logo. Run it after replacing or adding a photograph:

    python3 tools/build-images.py

Requires Pillow with AVIF support (Pillow >= 11.3):  pip install "pillow>=11.3"

What it does, per image:
  - applies the camera's EXIF orientation (several masters are stored rotated),
  - resizes with Lanczos to each width the page's srcset lists,
  - writes AVIF (primary) and WebP (fallback) at quality settings that are
    visually lossless at 1:1 for this photography,
  - writes one progressive JPEG where the page needs a universal <img src>.

If you add a width here, add the matching srcset entry in index.html.
"""
from pathlib import Path
import sys

try:
    from PIL import Image, ImageOps, features
except ImportError:
    sys.exit("Pillow is required:  pip install 'pillow>=11.3'")

if not features.check("avif"):
    sys.exit("This Pillow build has no AVIF support. Upgrade it:  pip install -U 'pillow>=11.3'")

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img"

AVIF_QUALITY = 62
WEBP_QUALITY = 84
JPEG_QUALITY = 84

# name: (master, widths, fallback-jpeg width or None)
PHOTOS = {
    "teaser/01-shoe":             ("assets/teaser/01-shoe.jpg",             [640, 800, 1023], None),
    "teaser/02-heart-bag":        ("assets/teaser/02-heart-bag.jpg",        [640, 800, 1023], None),
    "teaser/03-black-dress":      ("assets/teaser/03-black-dress.jpg",      [640, 800, 924],  None),
    "teaser/04-black-gold-dress": ("assets/teaser/04-black-gold-dress.jpg", [640, 800, 1179], None),
    "teaser/05-red-suit":         ("assets/teaser/05-red-suit.jpg",         [640, 800, 1179], None),
    "cover/cover4":               ("assets/reveal/cover4.png",              [640, 1122],      1122),
    "ad/add1":                    ("assets/reveal/add1.JPG",                [480, 800, 1200, 1600], 1200),
    "ad/add2":                    ("assets/reveal/add2.JPG",                [480, 800, 1200, 1600], 1200),
    "ad/add3":                    ("assets/reveal/add3.JPG",                [480, 800, 1200, 1600], 1200),
    "ad/add4":                    ("assets/reveal/add4.JPG",                [480, 800, 1200, 1600], 1200),
    "ad/add5":                    ("assets/reveal/add5.JPG",                [480, 800, 1200, 1600], 1200),
}

# name: (master, width), transparent logos saved as WebP
LOGOS = {
    "logo/monogram-wine-240":  ("assets/logo/monogram-wine.png", 240),
    "logo/lockup-wine-720":    ("assets/logo/lockup-wine.png", 720),
    "logo/monogram-ivory-160": ("assets/logo/monogram-ivory.webp", 160),
}


def resized(im, width):
    if width >= im.width:
        return im
    return im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)


def build_photos():
    for name, (master, widths, fallback) in PHOTOS.items():
        im = ImageOps.exif_transpose(Image.open(ROOT / master)).convert("RGB")
        (OUT / name).parent.mkdir(parents=True, exist_ok=True)
        for w in widths:
            r = resized(im, w)
            r.save(OUT / f"{name}-{w}.avif", quality=AVIF_QUALITY, speed=4)
            r.save(OUT / f"{name}-{w}.webp", quality=WEBP_QUALITY, method=6)
        if fallback:
            resized(im, fallback).save(OUT / f"{name}-{fallback}.jpg", quality=JPEG_QUALITY,
                                       optimize=True, progressive=True)
        print(f"  {name:28s} {', '.join(map(str, widths))}")


def build_logos():
    for name, (master, width) in LOGOS.items():
        r = resized(Image.open(ROOT / master).convert("RGBA"), width)
        (OUT / name).parent.mkdir(parents=True, exist_ok=True)
        r.save(OUT / f"{name}.webp", quality=90, method=6)
        print(f"  {name}")

    # Favicons from the wine monogram: transparent 32px, ivory-backed 180px.
    mark = Image.open(ROOT / "assets/logo/monogram-wine.png").convert("RGBA")
    side = max(mark.size)
    for size, ground in ((32, (0, 0, 0, 0)), (180, (243, 238, 229, 255))):
        canvas = Image.new("RGBA", (side, side), ground)
        canvas.paste(mark, ((side - mark.width) // 2, (side - mark.height) // 2), mark)
        canvas.resize((size, size), Image.LANCZOS).save(OUT / f"logo/favicon-{size}.png", optimize=True)
    print("  logo/favicon-32, logo/favicon-180")


if __name__ == "__main__":
    print("Building responsive images in", OUT.relative_to(ROOT))
    build_photos()
    build_logos()
    print("Done.")
