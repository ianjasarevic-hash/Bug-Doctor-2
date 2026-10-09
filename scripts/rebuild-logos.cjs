// Rebuild the bug.dr logo set from `Primary lockup@2x.png` on Desktop.
//
// Source: C:\Users\ianja\Desktop\Bug.DR\Primary lockup@2x.png
//   - 2400x1280, RGBA, alpha channel present
//   - The outer padding is RGB=#151618 (brand `bg`) painted with alpha=0,
//     so on a dark page it composites invisibly. We treat alpha as the
//     ground truth and trim everything with alpha<128 as background.
//
// Targets (all PNG, RGBA, no opaque background):
//   public/logos/primary-lockup.png  -- bug + wordmark, tight horizontal crop
//   public/logos/app-icon.png        -- bug mascot only, padded to a square
//   app/icon.png                     -- same square, for the Next.js favicon
//
// Run from project root: `node scripts/rebuild-logos.cjs`

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SRC = process.env.NEW_LOGO ||
  "C:/Users/ianja/Desktop/Bug.DR/Primary lockup@2x.png";

const ALPHA_THRESHOLD = 128; // anything below this counts as background
const APP_ICON_SIZE = 512; // final square size for the favicon / app icon

async function findContentBounds(src) {
  // Decode once, then walk rows/cols to find the tight opaque box.
  const img = sharp(src);
  const meta = await img.metadata();
  const { data, info } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let top = height, bottom = -1, left = width, right = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * channels + 3];
      if (a >= ALPHA_THRESHOLD) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }
  if (bottom < top || right < left) {
    throw new Error("no opaque pixels found in source image");
  }
  return { left, top, right, height: bottom - top + 1, fullWidth: width, fullHeight: height, channels };
}

// Find the largest vertical column-gap (full-height run of background)
// inside the content rectangle. That's where the bug icon ends and the
// wordmark starts, so we can split the lockup into two pieces.
function findSplitColumn(raster, bounds) {
  const { left, top, right, height, channels, fullWidth } = bounds;
  let bestStart = -1, bestLen = 0;
  let curStart = -1, curLen = 0;
  for (let x = left; x <= right; x++) {
    let allBg = true;
    for (let y = top; y < top + height; y++) {
      const a = raster[(y * fullWidth + x) * channels + 3];
      if (a >= ALPHA_THRESHOLD) { allBg = false; break; }
    }
    if (allBg) {
      if (curStart === -1) { curStart = x; curLen = 1; }
      else curLen++;
      if (curLen > bestLen) { bestLen = curLen; bestStart = curStart; }
    } else {
      curStart = -1; curLen = 0;
    }
  }
  return { start: bestStart, length: bestLen };
}

(async () => {
  if (!fs.existsSync(SRC)) {
    console.error("source not found:", SRC);
    process.exit(1);
  }
  const bounds = await findContentBounds(SRC);
  console.log("content bounds:", bounds);

  // 1) tight horizontal lockup
  const lockupBuf = await sharp(SRC)
    .extract({
      left: bounds.left,
      top: bounds.top,
      width: bounds.right - bounds.left + 1,
      height: bounds.height,
    })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const lockupPath = path.join("public", "logos", "primary-lockup.png");
  fs.writeFileSync(lockupPath, lockupBuf);
  const lockupMeta = await sharp(lockupBuf).metadata();
  console.log("wrote", lockupPath, lockupMeta.width + "x" + lockupMeta.height);

  // 2) split off the bug icon for app-icon
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const split = findSplitColumn(data, bounds);
  if (split.start < 0 || split.length < 8) {
    console.warn("could not find a clear column gap between bug and wordmark; " +
      "skipping app-icon. detected:", split);
  } else {
    // include a few transparent columns on each side of the gap to keep
    // the mascot isolated without eating into the wordmark.
    const bugRight = split.start - 1;
    const bugWidth = bugRight - bounds.left + 1;
    const bugHeight = bounds.height;

    const bugBuf = await sharp(SRC)
      .extract({
        left: bounds.left,
        top: bounds.top,
        width: bugWidth,
        height: bugHeight,
      })
      .png({ compressionLevel: 9 })
      .toBuffer();

    // Square up the bug for app-icon use: extend on the short axis with
    // transparent padding so the final canvas is square and centers it.
    const bugMeta = await sharp(bugBuf).metadata();
    const square = Math.max(bugMeta.width, bugMeta.height);
    const padLeft = Math.round((square - bugMeta.width) / 2);
    const padTop = Math.round((square - bugMeta.height) / 2);
    const squareBuf = await sharp(bugBuf)
      .extend({
        top: padTop,
        left: padLeft,
        right: square - bugMeta.width - padLeft,
        bottom: square - bugMeta.height - padTop,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toBuffer();

    // Resize to the target square size at the end.
    const finalBug = await sharp(squareBuf)
      .resize(APP_ICON_SIZE, APP_ICON_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toBuffer();

    const appIconPath = path.join("public", "logos", "app-icon.png");
    fs.writeFileSync(appIconPath, finalBug);
    console.log("wrote", appIconPath, APP_ICON_SIZE + "x" + APP_ICON_SIZE);

    const faviconPath = path.join("app", "icon.png");
    fs.writeFileSync(faviconPath, finalBug);
    console.log("wrote", faviconPath, APP_ICON_SIZE + "x" + APP_ICON_SIZE);
  }
})().catch((e) => { console.error(e); process.exit(1); });
