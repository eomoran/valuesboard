// dragdrop.js
// Mouse drag & drop behavior. We "follow the card" on drop.

import { state, selection, clampSelection } from "./state.js";
import { highlightSelection } from "./render.js";

let draggedCardName = null;
let draggedFromLane = null;

export function onDragStart(e) {
  const cardEl = e.currentTarget;
  draggedCardName = cardEl.dataset.valuename;
  draggedFromLane = findLaneForCard(draggedCardName);
  e.dataTransfer.effectAllowed = "move";

  requestAnimationFrame(() => {
    cardEl.classList.add("dragging");
  });

  // sync selection to the dragged card
  const laneId = findLaneForCard(draggedCardName);
  const idx = state[laneId].findIndex(c => c.name === draggedCardName);
  selection.laneId = laneId;
  selection.index = idx;
  clampSelection();
  highlightSelection();
}

export function onDragEnd(e) {
  const cardEl = e.currentTarget;
  cardEl.classList.remove("dragging");
  draggedCardName = null;
  draggedFromLane = null;
}

export function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

export function onDrop(e) {
  e.preventDefault();
  const laneEl = e.currentTarget;
  const targetLane = laneEl.dataset.lane;
  if (!draggedCardName || !targetLane) return;
  if (draggedFromLane === targetLane) return;

  // remove from old lane
  const idx = state[draggedFromLane].findIndex(c => c.name === draggedCardName);
  if (idx === -1) return;
  const [card] = state[draggedFromLane].splice(idx, 1);

  // add to new lane
  state[targetLane].push(card);

  // follow card
  selection.laneId = targetLane;
  selection.index = state[targetLane].length - 1;

  clampSelection();
  highlightSelection();
}

export function findLaneForCard(cardName) {
  for (const laneId of Object.keys(state)) {
    const idx = state[laneId].findIndex(c => c.name === cardName);
    if (idx !== -1) return laneId;
  }
  return null;
}