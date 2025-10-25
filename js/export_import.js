// export_import.js
// Build TXT / CSV snapshots, trigger downloads, preview export,
// and import from CSV back into state.

import { LANES, LANE_ORDER } from "../data/values.js";
import {
  state,
  selection,
  getDateStamp,
  replaceStateFromImport,
  clampSelection
} from "./state.js";
import { highlightSelection, showExportBox, renderBoard } from "./render.js";

// ---------- PREVIEW EXPORT (key 'e') ----------

export function buildTextSnapshotForPreview() {
  let out = [];
  LANE_ORDER.forEach(laneId => {
    const laneCfg = LANES.find(l => l.id === laneId);
    out.push(laneCfg.title.toUpperCase());
    state[laneId].forEach((card, idx) => {
      const rank = idx + 1;
      out.push(`${rank}. ${card.name} — ${card.desc}`);
    });
    out.push("");
  });
  return out.join("\n");
}

export function previewExport() {
  const text = buildTextSnapshotForPreview();
  showExportBox(text);

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
}

// ---------- DOWNLOAD EXPORTS ----------

function csvEscape(str) {
  const safe = String(str).replace(/"/g, '""');
  return `"${safe}"`;
}

export function buildTxtSnapshot() {
  let lines = [];
  LANE_ORDER.forEach(laneId => {
    const laneCfg = LANES.find(l => l.id === laneId);
    lines.push(laneCfg.title.toUpperCase());
    state[laneId].forEach((card, idx) => {
      const rank = idx + 1;
      lines.push(`${rank}. ${card.name} — ${card.desc}`);
    });
    lines.push("");
  });
  return lines.join("\n");
}

export function buildCsvSnapshot() {
  let rows = ["lane,rank,name,description"];
  LANE_ORDER.forEach(laneId => {
    const arr = state[laneId];
    arr.forEach((card, idx) => {
      const rank = idx + 1;
      rows.push(
        `${csvEscape(laneId)},${csvEscape(rank)},${csvEscape(card.name)},${csvEscape(card.desc)}`
      );
    });
  });
  return rows.join("\n");
}

function downloadBlob(filename, text, mime) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportTxtDownload() {
  const stamp = getDateStamp();
  const txt = buildTxtSnapshot();
  downloadBlob(`values_export_${stamp}.txt`, txt, "text/plain");
}

export function exportCsvDownload() {
  const stamp = getDateStamp();
  const csv = buildCsvSnapshot();
  downloadBlob(`values_export_${stamp}.csv`, csv, "text/csv");
}

// ---------- IMPORT (.csv) ----------

// minimal CSV reader that supports quotes and commas
function splitCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          // escaped quote
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        out.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
  }

  out.push(cur);
  return out;
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) return [];

  const headers = splitCsvLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    if (cols.length === 1 && cols[0] === "") continue;
    let rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h.trim()] = cols[idx] !== undefined ? cols[idx] : "";
    });
    rows.push(rowObj);
  }

  return rows;
}

// Build the new state object from CSV rows and replace current state.
export function importFromCsvText(csvText) {
  // Build { laneId: [ {name, desc}... ], ... } from CSV rows
  const rows = parseCsv(csvText);

  // We'll stage per-lane [{rank, card}, ...] then sort
  const laneMaps = {};
  LANE_ORDER.forEach(lid => (laneMaps[lid] = []));

  rows.forEach(r => {
    const laneId = (r.lane || "").trim();
    const rank = parseInt(r.rank || "0", 10);
    const name = r.name || "";
    const desc = r.description || "";

    if (!laneMaps[laneId]) laneMaps[laneId] = [];
    laneMaps[laneId].push({
      rank: isNaN(rank) ? 9999 : rank,
      card: { name, desc }
    });
  });

  // sort by rank and build final buckets
  const newBuckets = {};
  Object.keys(laneMaps).forEach(laneId => {
    laneMaps[laneId].sort((a,b) => a.rank - b.rank);
    newBuckets[laneId] = laneMaps[laneId].map(entry => entry.card);
  });

  // apply into global state
  replaceStateFromImport(newBuckets);

  // after import, rerender
  renderBoard();
  clampSelection();
  highlightSelection();
}

// exposed helper for main.js file input
export function importFromFile(file) {
  const reader = new FileReader();
  reader.onload = evt => {
    const text = evt.target.result;
    importFromCsvText(text);
  };
  reader.readAsText(file);
}