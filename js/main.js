// main.js
// Boots the app, wires buttons, ties modules together.
// This is the only file loaded directly in index.html.

import { initState, resetBoard, shuffleUnsorted, clampSelection } from "./state.js";
import { renderBoard, highlightSelection } from "./render.js";
import {
  previewExport,
  exportTxtDownload,
  exportCsvDownload,
  importFromFile
} from "./export_import.js";
import { attachKeyboardShortcuts } from "./keyboard.js";

function $(sel) {
  return document.querySelector(sel);
}

function wireButtons() {
  const exportBtn = $("#exportBtn");
  const exportTxtBtn = $("#exportTxtBtn");
  const exportCsvBtn = $("#exportCsvBtn");
  const shuffleBtn = $("#shuffleBtn");
  const clearBtn = $("#clearBtn");
  const importBtn = $("#importBtn");
  const importFileInput = $("#importFileInput");

  exportBtn.addEventListener("click", previewExport);
  exportTxtBtn.addEventListener("click", exportTxtDownload);
  exportCsvBtn.addEventListener("click", exportCsvDownload);

  shuffleBtn.addEventListener("click", () => {
    shuffleUnsorted();
    clampSelection();
    highlightSelection();
  });

  clearBtn.addEventListener("click", () => {
    resetBoard();
    renderBoard();
    clampSelection();
    highlightSelection();
    // hide preview box after reset
    const exportBox = $("#exportBox");
    if (exportBox) {
      exportBox.style.display = "none";
      exportBox.textContent = "";
    }
  });

  importBtn.addEventListener("click", () => {
    importFileInput.value = "";
    importFileInput.click();
  });

  importFileInput.addEventListener("change", () => {
    const file = importFileInput.files && importFileInput.files[0];
    if (!file) return;
    importFromFile(file);
  });
}

// boot
initState();
renderBoard();
clampSelection();
highlightSelection();
wireButtons();
attachKeyboardShortcuts();