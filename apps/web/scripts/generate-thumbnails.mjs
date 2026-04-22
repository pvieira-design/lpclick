// Generate WebP thumbnails for all "historia" video submissions and store
// the resulting URL back into form_submissions.payload.thumbnailUrl.
//
// Run from apps/web:
//   node --env-file=.env --env-file=.env.local scripts/generate-thumbnails.mjs
//
// Requires: ffmpeg + cwebp in PATH, NEON_DATABASE_URL, BLOB_READ_WRITE_TOKEN.

import { spawn } from "node:child_process";
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";

const sql = neon(process.env.NEON_DATABASE_URL);

// ffmpeg seeks to t=1s, grabs one frame at width 720 as PNG on stdout, then
// cwebp re-encodes it to WebP at quality 80. Two-step pipe because the
// homebrew ffmpeg build does not include libwebp.
function extractWebp(videoUrl) {
  return new Promise((resolvePromise, reject) => {
    const ff = spawn("ffmpeg", [
      "-ss", "1",
      "-i", videoUrl,
      "-vframes", "1",
      "-vf", "scale=720:-2",
      "-f", "image2pipe",
      "-vcodec", "png",
      "-",
    ], { stdio: ["ignore", "pipe", "pipe"] });

    const cw = spawn("cwebp", ["-q", "80", "-quiet", "-o", "-", "--", "-"], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    ff.stdout.pipe(cw.stdin);

    const chunks = [];
    cw.stdout.on("data", (c) => chunks.push(c));

    let ffErr = "";
    let cwErr = "";
    ff.stderr.on("data", (d) => { ffErr += d.toString(); });
    cw.stderr.on("data", (d) => { cwErr += d.toString(); });

    let ffCode = null;
    let cwCode = null;
    const settle = () => {
      if (ffCode === null || cwCode === null) return;
      if (ffCode !== 0) return reject(new Error(`ffmpeg exited ${ffCode}\n${ffErr.slice(-400)}`));
      if (cwCode !== 0) return reject(new Error(`cwebp exited ${cwCode}\n${cwErr.slice(-400)}`));
      resolvePromise(Buffer.concat(chunks));
    };
    ff.on("close", (code) => { ffCode = code; settle(); });
    cw.on("close", (code) => { cwCode = code; settle(); });
    ff.on("error", reject);
    cw.on("error", reject);
  });
}

async function processOne(id, videoUrl) {
  const buf = await extractWebp(videoUrl);
  const blob = await put(`thumbnails/${id}.webp`, buf, {
    access: "public",
    contentType: "image/webp",
    cacheControlMaxAge: 31536000,
    allowOverwrite: true,
    addRandomSuffix: false,
  });
  await sql`
    UPDATE form_submissions
    SET payload = jsonb_set(payload, '{thumbnailUrl}', to_jsonb(${blob.url}::text))
    WHERE id = ${id}
  `;
  return { url: blob.url, sizeKb: (buf.length / 1024).toFixed(1) };
}

async function main() {
  if (!process.env.NEON_DATABASE_URL) throw new Error("NEON_DATABASE_URL not set");
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN not set");

  const rows = await sql`
    SELECT id, payload->>'videoUrl' AS video_url
    FROM form_submissions
    WHERE form_type = 'historia'
      AND payload->>'videoUrl' IS NOT NULL
      AND (payload->>'thumbnailUrl' IS NULL OR payload->>'thumbnailUrl' = '')
    ORDER BY created_at DESC
  `;

  console.log(`Found ${rows.length} submissions needing thumbnails`);
  if (rows.length === 0) return;

  let ok = 0;
  let fail = 0;
  for (let i = 0; i < rows.length; i++) {
    const { id, video_url } = rows[i];
    const tag = `[${i + 1}/${rows.length}] ${id}`;
    try {
      console.log(`${tag} processing...`);
      const result = await processOne(id, video_url);
      console.log(`${tag} OK  ${result.sizeKb}KB  ${result.url}`);
      ok++;
    } catch (err) {
      console.error(`${tag} FAIL  ${err.message}`);
      fail++;
    }
  }

  console.log(`\nDone: ${ok} ok, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
