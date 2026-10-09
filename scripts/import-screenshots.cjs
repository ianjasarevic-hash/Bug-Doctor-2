const sharp = require("sharp");
const path = require("path");

// Map of source jpeg → canonical destination name in public/screenshots/.
// Identified by looking at each image:
//   contests.png    — "Put your skills to the test" + Live/Upcoming/Past tabs + history
//   workspace.png   — IDE: assignment | code editor | AI assistant | terminal
//   problems.png    — "Explore problems" grid with search and filters
//   profile.png     — Max · 147 / 12,840 / Staff / 18 days · 12-month activity grid
//   dashboard.png   — "Good morning, Max" + live contests + pick up where you left off + recommended + progress
//   problem-detail.png — "Payment retries disappear" + assignment + incident log + 7 acceptance checks + Resume
const SRC = "C:/Users/ianja/Desktop/Bug.DR";
const DST = "C:/Users/ianja/bugdr-site/public/screenshots";

const map = [
  ["WhatsApp Image 2026-10-09 at 10.27.04 (2).jpeg", "contests.png"],
  ["WhatsApp Image 2026-10-09 at 10.27.04 (3).jpeg", "workspace.png"],
  ["WhatsApp Image 2026-10-09 at 10.27.04.jpeg", "problems.png"],
  ["WhatsApp Image 2026-10-09 at 10.27.05.jpeg", "profile.png"],
  ["WhatsApp Image 2026-10-09 at 10.27.03.jpeg", "dashboard.png"],
  ["WhatsApp Image 2026-10-09 at 10.27.04 (1).jpeg", "problem-detail.png"],
];

(async () => {
  for (const [src, dst] of map) {
    const inPath = path.join(SRC, src);
    const outPath = path.join(DST, dst);
    const meta = await sharp(inPath).png().toFile(outPath);
    console.log(`OK  ${dst}  ${meta.width}x${meta.height}  ${(meta.size / 1024).toFixed(0)} KB`);
  }
})();
