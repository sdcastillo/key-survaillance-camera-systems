import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const book = await readFile(new URL("../book.md", import.meta.url), "utf8");
const evidence = JSON.parse(
  await readFile(new URL("../data/evidence.json", import.meta.url), "utf8"),
);

function unique(values, label) {
  assert.equal(new Set(values).size, values.length, `Duplicate ${label} found`);
}

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
unique(ids, "HTML id");

const fragments = [...html.matchAll(/\bhref=["']#([^"']+)["']/g)].map(
  (match) => decodeURIComponent(match[1]),
);
for (const fragment of fragments) {
  assert.ok(ids.includes(fragment), `Broken internal link: #${fragment}`);
}

const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
for (const image of images) {
  assert.match(image, /\balt=["'][^"']+["']/i, `Image needs descriptive alt text: ${image}`);
}

const claims = new Map(evidence.claims.map((claim) => [claim.id, claim]));
unique([...claims.keys()], "evidence claim id");
const sources = new Map(evidence.sources.map((source) => [source.id, source]));
unique([...sources.keys()], "evidence source id");

const pageClaimIds = [
  ...html.matchAll(/\bdata-claim-id="([^"]+)"/g),
].map((match) => match[1]);
unique(pageClaimIds, "page claim id");
for (const id of pageClaimIds) {
  assert.ok(claims.has(id), `Missing structured evidence record for ${id}`);
}
for (const claim of evidence.claims) {
  assert.ok(pageClaimIds.includes(claim.id), `Evidence record is not displayed: ${claim.id}`);
  assert.ok(claim.sourceIds.length > 0, `Claim has no source: ${claim.id}`);
  for (const sourceId of claim.sourceIds) {
    const source = sources.get(sourceId);
    assert.ok(source, `Unknown source ${sourceId} for ${claim.id}`);
    assert.ok(
      html.includes(`href="${source.url}"`),
      `Source is not linked in the page: ${source.url}`,
    );
  }
}

for (const source of evidence.sources) {
  assert.match(source.url, /^https:\/\/\S+$/, `Invalid source URL: ${source.id}`);
  assert.ok(source.checkedOn, `Source review date missing: ${source.id}`);
}

const publicContent = `${html}\n${book}`;
assert.doesNotMatch(
  publicContent,
  /(?:<<<<<<<|=======|>>>>>>>)/,
  "Merge-conflict markers remain in published content",
);
assert.doesNotMatch(
  html,
  /\{\{\s*(?:TODO|FIXME|PLACEHOLDER)[^}]*\}\}|<!--\s*(?:TODO|FIXME|PLACEHOLDER)/i,
  "Unresolved template markup remains",
);
assert.doesNotMatch(publicContent, /admin256/i, "Published shared credential remains");
assert.doesNotMatch(
  publicContent,
  /(?:set up|configure)\s+port forwarding on the router/i,
  "Unsafe direct port-forwarding instructions remain",
);
assert.doesNotMatch(
  publicContent,
  /Port.?forward Hub WAN to 443/i,
  "Unsafe direct hub port-forwarding instruction remains",
);
assert.doesNotMatch(
  publicContent,
  /first three segments should match/i,
  "Oversimplified subnet instruction remains",
);
assert.doesNotMatch(
  publicContent,
  /Hub FW[^.\n]{0,20}x\.x/i,
  "Firmware placeholder remains",
);

for (const section of [
  "editorial-transparency",
  "flock-alpr",
  "privacy-oversight",
  "technical-corrections",
  "installation-manual",
  "site-privacy",
]) {
  assert.ok(ids.includes(section), `Required section is missing: ${section}`);
}

console.log(
  `Content checks passed: ${ids.length} unique IDs, ${fragments.length} internal links, ` +
    `${images.length} images, ${claims.size} sourced claims.`,
);
