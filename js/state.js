// state.js
// Owns the app's data model and all "rules of motion"
// (selection, moving cards, reordering, etc.)

import { RAW_VALUES, LANES, LANE_ORDER } from "../data/values.js";

export let state = {}; // { laneId: [ {name, desc}, ... ], ... }
export let selection = { laneId: "unsorted", index: 0 };

// ---------- helpers ----------

// Fisher-Yates shuffle
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// simple YYYYMMDD string, used for export filenames
export function getDateStamp() {
  const d = new Date();
  const yr = d.getFullYear().toString();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return yr + mo + da;
}

// ---------- init / reset ----------

export function initState() {
  state = {};
  LANES.forEach(l => (state[l.id] = []));
  const shuffled = RAW_VALUES.slice();
  shuffle(shuffled);
  shuffled.forEach(([name, desc]) => {
    state.unsorted.push({ name, desc });
  });
  selection = { laneId: "unsorted", index: 0 };
}

export function resetBoard() {
  initState();
}

// ---------- selection safety ----------

export function clampSelection() {
  const arr = state[selection.laneId];
  if (!arr || arr.length === 0) {
    // prefer unsorted if it has anything
    if (state.unsorted.length > 0) {
      selection.laneId = "unsorted";
      selection.index = 0;
      return;
    }
    // else first non-empty lane
    for (const lid of LANE_ORDER) {
      if (state[lid].length > 0) {
        selection.laneId = lid;
        selection.index = 0;
        return;
      }
    }
    // else everything's empty
    selection.index = 0;
    return;
  }

  if (selection.index < 0) selection.index = 0;
  if (selection.index >= arr.length) {
    selection.index = arr.length - 1;
  }
}

// ---------- navigation (no movement of cards) ----------

export function moveSelection(delta) {
  selection.index += delta;
  clampSelection();
}

// ---------- lane reordering / priority grooming ----------

export function reorderSelection(delta) {
  // Shift+J / Shift+K behavior
  const lane = selection.laneId;
  const arr = state[lane];
  if (!arr || arr.length === 0) return;
  const idx = selection.index;
  const newIdx = idx + delta;
  if (newIdx < 0 || newIdx >= arr.length) return;

  const tmp = arr[idx];
  arr[idx] = arr[newIdx];
  arr[newIdx] = tmp;
  selection.index = newIdx;
}

export function sendToTopOfLane() {
  const lane = selection.laneId;
  const arr = state[lane];
  if (!arr || arr.length === 0) return;
  const idx = selection.index;
  if (idx <= 0) return;
  const [card] = arr.splice(idx, 1);
  arr.unshift(card);
  selection.index = 0;
}

export function sendToBottomOfLane() {
  const lane = selection.laneId;
  const arr = state[lane];
  if (!arr || arr.length === 0) return;
  const idx = selection.index;
  if (idx === arr.length - 1) return;
  const [card] = arr.splice(idx, 1);
  arr.push(card);
  selection.index = arr.length - 1;
}

// ---------- pluck / classify behaviors ----------

// pluck current card from current lane,
// adjust selection to "next card" in same lane
// return that card
export function pluckCurrentCardStayHere() {
  const lane = selection.laneId;
  const arr = state[lane];
  if (!arr || arr.length === 0) return null;
  const idx = selection.index;
  if (idx < 0 || idx >= arr.length) return null;

  const [card] = arr.splice(idx, 1);

  // after removing the card:
  // attempt to keep same index (auto-advance)
  if (idx >= arr.length) {
    selection.index = arr.length - 1;
  } else {
    selection.index = idx;
  }
  if (selection.index < 0) selection.index = 0;

  clampSelection();
  return { card, fromLane: lane };
}

// lowercase classify: send card to target lane, do NOT follow
export function sendCurrentCardToLaneNoFollow(targetLaneId) {
  const plucked = pluckCurrentCardStayHere();
  if (!plucked) return;
  state[targetLaneId].push(plucked.card);
}

// uppercase jump: just move focus
export function jumpFocusToLaneTop(laneId) {
  const arr = state[laneId];
  if (!arr || arr.length === 0) return;
  selection.laneId = laneId;
  selection.index = 0;
}

// neighbor lane helpers

function neighborLaneId(offset) {
  const currentIdx = LANE_ORDER.indexOf(selection.laneId);
  if (currentIdx === -1) return null;
  const newIdx = currentIdx + offset;
  if (newIdx < 0 || newIdx >= LANE_ORDER.length) return null;
  return LANE_ORDER[newIdx];
}

// h/l: send to adjacent lane, stay in current lane
export function sendCardToNeighborStay(offset) {
  const targetLane = neighborLaneId(offset);
  if (!targetLane) return;
  const plucked = pluckCurrentCardStayHere();
  if (!plucked) return;
  state[targetLane].push(plucked.card);
}

// H/L: send to adjacent lane and FOLLOW it
export function sendCardToNeighborFollow(offset) {
  const targetLane = neighborLaneId(offset);
  if (!targetLane) return;

  const lane = selection.laneId;
  const arr = state[lane];
  if (!arr || arr.length === 0) return;
  const idx = selection.index;
  if (idx < 0 || idx >= arr.length) return;

  const [card] = arr.splice(idx, 1);
  state[targetLane].push(card);

  selection.laneId = targetLane;
  selection.index = state[targetLane].length - 1;
  clampSelection();
}

// ---------- shuffle unsorted ----------

export function shuffleUnsorted() {
  shuffle(state.unsorted);
  if (selection.laneId === "unsorted") {
    if (selection.index >= state.unsorted.length) {
      selection.index = state.unsorted.length - 1;
    }
    if (selection.index < 0) selection.index = 0;
  }
}

// ---------- import/export support needs ----------

// For import: replace entire state from parsed data
export function replaceStateFromImport(newStateBuckets) {
  // newStateBuckets is { laneId: [ {name, desc}, ...], ... }
  LANES.forEach(l => {
    state[l.id] = newStateBuckets[l.id] || [];
  });

  // set selection
  if (state.unsorted.length > 0) {
    selection.laneId = "unsorted";
    selection.index = 0;
  } else {
    // first non-empty lane
    for (const lid of LANE_ORDER) {
      if (state[lid].length > 0) {
        selection.laneId = lid;
        selection.index = 0;
        return;
      }
    }
    selection.laneId = "unsorted";
    selection.index = 0;
  }
}