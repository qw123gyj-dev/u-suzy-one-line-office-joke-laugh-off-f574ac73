// One-Line Office Joke Laugh-Off — entry program (program/v1, Node 22, stdlib only).
// Writes the one office joke to $MAKEFUN_OUTPUT_DIR/entry.txt
// (fallback /output/entry.txt), then reads it back and verifies the bytes.
// Gates enforced before writing: exactly one line, one sentence, 1 to
// MAX_CHARS characters, not only white space, no leading/trailing space.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 200;

// Rewrite: the first draft leaned on the printer-jam cliche, which the
// judge's brief explicitly punishes as stale. The new line keeps the same
// shape — one office detail, one twist — but lands on a fresher, more
// specific image: the open-plan office as accidental surround sound.
const JOKE =
  "HR said the open-plan office encourages collaboration, which is how I learned Dave's entire divorce settlement in surround sound.";

// The entry must be exactly one line: no newline (or carriage return)
// anywhere, so the file is a single line of text.
if (JOKE.includes("\n") || JOKE.includes("\r")) {
  throw new Error("Joke must be exactly one line with no newline character");
}

const trimmed = JOKE.trim();
if (trimmed.length === 0) {
  throw new Error("Joke must not be empty or only white space");
}
if (trimmed.length > MAX_CHARS) {
  throw new Error(
    `Joke must be at most ${MAX_CHARS} characters, got ${trimmed.length}`,
  );
}
if (trimmed !== JOKE) {
  throw new Error("Joke must not have leading or trailing white space");
}
const terminators = JOKE.match(/[.!?]/g) ?? [];
if (terminators.length !== 1 || !JOKE.endsWith(".")) {
  throw new Error(
    `Joke must be exactly one sentence ending in a single period, got ${terminators.length} terminator(s)`,
  );
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, JOKE, "utf8");

const back = readFileSync(outPath, "utf8");
if (back !== JOKE) {
  throw new Error("Verification failed: entry.txt does not match the joke");
}

const wordCount = JOKE.split(/\s+/).filter(Boolean).length;

console.log(`Wrote ${outPath}: ${JOKE}`);
console.log(
  `Characters: ${JOKE.length}, words: ${wordCount}, sentences: 1`,
);
