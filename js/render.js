// render.js
// DOM rendering and visual updates only.

import { LANES } from "../data/values.js";
import { state, selection } from "./state.js";
import {
  clampSelection
} from "./state.js"; // used indirectly after some ops
import {
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop
} from "./dragdrop.js";

const boardElSelector = "#board";
const exportBoxSelector = "#exportBox";

export function renderBoard() {
  const board = document.querySelector(boardElSelector);
  board.innerHTML = "";

  LANES.forEach(lane => {
    const laneEl = createLaneEl(lane);
    board.appendChild(laneEl);
  });

  // fill initial cards
  LANES.forEach(lane => {
    renderLane(lane.id);
  });
}

function createLaneEl(lane) {
  const laneEl = document.createElement("div");
  laneEl.className = "lane";
  laneEl.dataset.lane = lane.id;
  laneEl.addEventListener("dragover", onDragOver);
  laneEl.addEventListener("drop", onDrop);

  const headerEl = document.createElement("div");
  headerEl.className = "lane-header";

  const titleRow = document.createElement("div");
  titleRow.className = "lane-title-row";

  const titleEl = document.createElement("div");
  titleEl.className = "lane-title";

  const dotEl = document.createElement("div");
  dotEl.className = "dot";
  dotEl.style.backgroundColor = lane.color;

  const textEl = document.createElement("div");
  textEl.textContent = lane.title;

  titleEl.appendChild(dotEl);
  titleEl.appendChild(textEl);

  const countEl = document.createElement("div");
  countEl.className = "lane-count";
  countEl.dataset.countFor = lane.id;

  titleRow.appendChild(titleEl);
  titleRow.appendChild(countEl);

  const descEl = document.createElement("div");
  descEl.className = "lane-desc";
  descEl.textContent = lane.desc;

  headerEl.appendChild(titleRow);
  headerEl.appendChild(descEl);

  const bodyEl = document.createElement("div");
  bodyEl.className = "lane-body";
  bodyEl.dataset.bodyFor = lane.id;

  laneEl.appendChild(headerEl);
  laneEl.appendChild(bodyEl);
  return laneEl;
}

export function renderLane(laneId) {
  const bodyEl = document.querySelector(`.lane-body[data-body-for="${laneId}"]`);
  const countEl = document.querySelector(`.lane-count[data-count-for="${laneId}"]`);
  if (!bodyEl || !countEl) return;

  bodyEl.innerHTML = "";

  const cards = state[laneId];
  cards.forEach((card, idx) => {
    const cardEl = document.createElement("div");
    cardEl.className = "value-card";
    cardEl.draggable = true;
    cardEl.dataset.valuename = card.name;

    cardEl.addEventListener("dragstart", onDragStart);
    cardEl.addEventListener("dragend", onDragEnd);
    cardEl.addEventListener("click", () => {
      selection.laneId = laneId;
      selection.index = idx;
      clampSelection();
      highlightSelection(); // re-render with new active card
    });

    if (selection.laneId === laneId && selection.index === idx) {
      cardEl.classList.add("active-card");
    }

    const nameEl = document.createElement("div");
    nameEl.className = "value-name";
    nameEl.textContent = card.name;

    const descEl = document.createElement("div");
    descEl.className = "value-desc";
    descEl.textContent = card.desc;

    cardEl.appendChild(nameEl);
    cardEl.appendChild(descEl);

    bodyEl.appendChild(cardEl);
  });

  countEl.textContent = cards.length + " cards";
}

// Re-render lanes and scroll currently selected card into view
export function highlightSelection() {
  // re-render all lanes to update highlighting
  LANES.forEach(l => renderLane(l.id));

  const laneBody = document.querySelector(`.lane-body[data-body-for="${selection.laneId}"]`);
  if (!laneBody) return;
  const cards = laneBody.querySelectorAll(".value-card");
  if (selection.index >= 0 && selection.index < cards.length) {
    cards[selection.index].scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

// Used by previewExport() to show text in the <pre>
export function showExportBox(text) {
  const exportBox = document.querySelector(exportBoxSelector);
  exportBox.textContent = text;
  exportBox.style.display = "block";
}