// keyboard.js
// All keyboard bindings. Lowercase = "send card / stay".
// Uppercase = "jump focus". h/H/l/L follow the spec we defined.

import {
  moveSelection,
  reorderSelection,
  sendToTopOfLane,
  sendToBottomOfLane,
  sendCurrentCardToLaneNoFollow,
  jumpFocusToLaneTop,
  sendCardToNeighborStay,
  sendCardToNeighborFollow,
  shuffleUnsorted,
  clampSelection
} from "./state.js";

import {
  previewExport
} from "./export_import.js";

import {
  highlightSelection
} from "./render.js";

export function attachKeyboardShortcuts() {
  window.addEventListener("keydown", e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    switch (e.key) {
      // navigation within current lane
      case "j":
        e.preventDefault();
        moveSelection(+1);
        clampSelection();
        highlightSelection();
        break;
      case "k":
        e.preventDefault();
        moveSelection(-1);
        clampSelection();
        highlightSelection();
        break;

      // reorder within lane
      case "J": // Shift+j
        e.preventDefault();
        reorderSelection(+1);
        clampSelection();
        highlightSelection();
        break;
      case "K": // Shift+k
        e.preventDefault();
        reorderSelection(-1);
        clampSelection();
        highlightSelection();
        break;
      case "g":
        e.preventDefault();
        sendToTopOfLane();
        clampSelection();
        highlightSelection();
        break;
      case "G": // Shift+g
        e.preventDefault();
        sendToBottomOfLane();
        clampSelection();
        highlightSelection();
        break;

      // classify lowercase (send, stay)
      case "c":
        e.preventDefault();
        sendCurrentCardToLaneNoFollow("core");
        clampSelection();
        highlightSelection();
        break;
      case "i":
        e.preventDefault();
        sendCurrentCardToLaneNoFollow("important");
        clampSelection();
        highlightSelection();
        break;
      case "n":
        e.preventDefault();
        sendCurrentCardToLaneNoFollow("nice");
        clampSelection();
        highlightSelection();
        break;
      case "x":
        e.preventDefault();
        sendCurrentCardToLaneNoFollow("not");
        clampSelection();
        highlightSelection();
        break;
      case "u":
        e.preventDefault();
        sendCurrentCardToLaneNoFollow("unsorted");
        clampSelection();
        highlightSelection();
        break;

      // uppercase = jump focus to lane (no card move)
      case "C": // Shift+c
        e.preventDefault();
        jumpFocusToLaneTop("core");
        clampSelection();
        highlightSelection();
        break;
      case "I": // Shift+i
        e.preventDefault();
        jumpFocusToLaneTop("important");
        clampSelection();
        highlightSelection();
        break;
      case "N": // Shift+n
        e.preventDefault();
        jumpFocusToLaneTop("nice");
        clampSelection();
        highlightSelection();
        break;
      case "X": // Shift+x
        e.preventDefault();
        jumpFocusToLaneTop("not");
        clampSelection();
        highlightSelection();
        break;
      case "U": // Shift+u
        e.preventDefault();
        jumpFocusToLaneTop("unsorted");
        clampSelection();
        highlightSelection();
        break;

      // neighbor moves
      case "h":
        e.preventDefault();
        sendCardToNeighborStay(-1); // send left, stay
        clampSelection();
        highlightSelection();
        break;
      case "l":
        e.preventDefault();
        sendCardToNeighborStay(+1); // send right, stay
        clampSelection();
        highlightSelection();
        break;
      case "H": // Shift+h
        e.preventDefault();
        sendCardToNeighborFollow(-1); // send left and follow
        clampSelection();
        highlightSelection();
        break;
      case "L": // Shift+l
        e.preventDefault();
        sendCardToNeighborFollow(+1); // send right and follow
        clampSelection();
        highlightSelection();
        break;

      // shuffle unsorted
      case "r":
        e.preventDefault();
        shuffleUnsorted();
        clampSelection();
        highlightSelection();
        break;

      // export preview box
      case "e":
        e.preventDefault();
        previewExport();
        break;

      default:
        break;
    }
  });
}