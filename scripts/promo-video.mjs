/**
 * EDEKA Energie — Promo Video Script
 * Erzeugt eine .webm-Videodatei via Playwright.
 * Läuft auf: http://localhost:3000
 *
 * Usage: node scripts/promo-video.mjs
 */

import { chromium } from "playwright";
import { existsSync, mkdirSync } from "fs";

const BASE = "http://localhost:3000";
const OUT_DIR = "promo";
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR);

// ─── Helpers ────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function smoothScroll(page, from, to, durationMs = 1200) {
  const steps = Math.max(20, Math.round(durationMs / 30));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const y = from + (to - from) * ease;
    await page.evaluate((sy) => window.scrollTo({ top: sy }), Math.round(y));
    await sleep(durationMs / steps);
  }
}

/**
 * Click the first VISIBLE element matching `selector`.
 * Tries all matches in DOM order and clicks the first that isVisible().
 * Falls back to .click() (which will timeout) if none found.
 */
async function clickVisible(page, selector, waitMs = 700) {
  const all = page.locator(selector);
  const count = await all.count();
  for (let i = 0; i < count; i++) {
    const el = all.nth(i);
    if (await el.isVisible()) {
      await el.click();
      await sleep(waitMs);
      return;
    }
  }
  // Fallback — will surface a clear timeout error
  await all.first().click({ timeout: 5000 });
  await sleep(waitMs);
}

// ─── Main ────────────────────────────────────────────────────────────────────

const browser = await chromium.launch({ headless: true });

// ═══════════════════════════════════════════════════════
//  TAKE 1 — Mobile (390 × 844)
// ═══════════════════════════════════════════════════════
console.log("🎬 Recording mobile take…");

const mobileCtx = await browser.newContext({
  recordVideo: { dir: OUT_DIR, size: { width: 390, height: 844 } },
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const mob = await mobileCtx.newPage();

// ── SCENE 1: Dashboard ──────────────────────────────
console.log("  Scene 1: Dashboard");
await mob.goto(BASE, { waitUntil: "networkidle" });
await sleep(600);

// Let entry animations fire
await sleep(1200);

// Achievement Toast slides in at 900ms — let it show fully
await sleep(1000);

// Slow scroll: hero → NavTeaser → Streak
await smoothScroll(mob, 0, 480, 1600);
await sleep(700);

// Streak card visible
await smoothScroll(mob, 480, 950, 1400);
await sleep(600);

// KPI grid
await smoothScroll(mob, 950, 1450, 1300);
await sleep(800);

// AreaBreakdown + Insights
await smoothScroll(mob, 1450, 2050, 1400);
await sleep(700);

// Snap back to top
await smoothScroll(mob, 2050, 0, 900);
await sleep(600);

// ── SCENE 2: Verlauf ─────────────────────────────────
console.log("  Scene 2: Verlauf");
await clickVisible(mob, 'a[href="/verlauf"]');
await sleep(1000);

// Tab switching — Monat → Jahr → Woche
await clickVisible(mob, 'button:has-text("Monat")', 900);
await clickVisible(mob, 'button:has-text("Jahr")', 900);
await clickVisible(mob, 'button:has-text("Woche")', 800);

// Scroll to chart
await smoothScroll(mob, 0, 350, 1000);
await sleep(600);

// Area filter toggle — show interactivity
await clickVisible(mob, 'button:has-text("Backstation")', 750);
await clickVisible(mob, 'button:has-text("Kühlung")', 750);
await clickVisible(mob, 'button:has-text("Alle Bereiche")', 700);

// Scroll to heatmap
await smoothScroll(mob, 350, 1050, 1500);
await sleep(500);
await smoothScroll(mob, 1050, 1600, 1200);
await sleep(800);

// Back up
await smoothScroll(mob, 1600, 0, 900);
await sleep(500);

// ── SCENE 3: Bestenliste ─────────────────────────────
console.log("  Scene 3: Bestenliste");
await clickVisible(mob, 'a[href="/bestenliste"]');
await sleep(1300);

// OwnRankCard hero visible
await sleep(700);

// Scroll to leaderboard
await smoothScroll(mob, 0, 560, 1400);
await sleep(500);

// Scroll slowly through top positions
await smoothScroll(mob, 560, 1100, 1500);
await sleep(500);

// Our yellow "Du" row
await smoothScroll(mob, 1100, 1450, 1000);
await sleep(800);

// Scroll to achievements
await smoothScroll(mob, 1450, 2200, 1800);
await sleep(1000);

// ── FINALE: Back to Dashboard ────────────────────────
console.log("  Finale: Dashboard fly-back");
await clickVisible(mob, 'a[href="/"]');
await sleep(2000); // Hold on hero

await mobileCtx.close();
console.log("  ✅ Mobile take done");

// ═══════════════════════════════════════════════════════
//  TAKE 2 — Desktop (1440 × 900) — sidebar + multi-col
// ═══════════════════════════════════════════════════════
console.log("🎬 Recording desktop take…");

const deskCtx = await browser.newContext({
  recordVideo: { dir: OUT_DIR, size: { width: 1440, height: 900 } },
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const desk = await deskCtx.newPage();

// ── Dashboard ───────────────────────────────────────
console.log("  Scene 1: Dashboard desktop");
await desk.goto(BASE, { waitUntil: "networkidle" });
await sleep(1400);

// Hover over TopRankTeaser CTA for hover state
await desk.locator('text=Zur Bestenliste').hover();
await sleep(600);

await smoothScroll(desk, 0, 350, 1200);
await sleep(700);
await smoothScroll(desk, 350, 750, 1200);
await sleep(600);
await smoothScroll(desk, 750, 1200, 1100);
await sleep(700);
await smoothScroll(desk, 1200, 0, 800);
await sleep(500);

// ── Verlauf ─────────────────────────────────────────
console.log("  Scene 2: Verlauf desktop");
await clickVisible(desk, 'a[href="/verlauf"]');
await sleep(1200);

await clickVisible(desk, 'button:has-text("Tag")', 800);
await clickVisible(desk, 'button:has-text("Monat")', 800);
await clickVisible(desk, 'button:has-text("Woche")', 700);

await clickVisible(desk, 'button:has-text("Backstation")', 700);
await clickVisible(desk, 'button:has-text("Alle Bereiche")', 700);

await smoothScroll(desk, 0, 600, 1400);
await sleep(600);
await smoothScroll(desk, 600, 1200, 1300);
await sleep(800);
await smoothScroll(desk, 1200, 0, 800);
await sleep(400);

// ── Bestenliste ──────────────────────────────────────
console.log("  Scene 3: Bestenliste desktop");
await clickVisible(desk, 'a[href="/bestenliste"]');
await sleep(1200);

await smoothScroll(desk, 0, 500, 1400);
await sleep(500);
await smoothScroll(desk, 500, 1100, 1300);
await sleep(600);

// Region filter — use exact button text (N=Nord, S=Süd)
await clickVisible(desk, 'button:has-text("S")', 700);
await clickVisible(desk, 'button:has-text("Alle")', 700);

await smoothScroll(desk, 1100, 2000, 1600);
await sleep(900);
await smoothScroll(desk, 2000, 0, 900);
await sleep(500);

// Finale back to Dashboard
await clickVisible(desk, 'a[href="/"]');
await sleep(1800);

await deskCtx.close();
await browser.close();

console.log("\n✅ All takes recorded!");
console.log(`📁 Videos saved to: ./${OUT_DIR}/`);
console.log("   Look for two .webm files — mobile + desktop takes.");
console.log("\n💡 To convert to MP4 (if ffmpeg available):");
console.log('   ffmpeg -i promo/mobile.webm -c:v libx264 -pix_fmt yuv420p promo/edeka-promo-mobile.mp4');
