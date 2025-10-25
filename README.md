# Personal Values Board

A fast, keyboard-driven values sorting tool you can run locally in your browser.  
No build step, no backend, no tracking.

---

## How to Run

1. Clone or copy this repository.
2. Run `python3 -m http.server 8000` in the folder containing this repo.
3. Open 'http://localhost:8000' in a modern browser (Chrome, Safari, Firefox, Edge).  


That's it.

---

## What This Does

You start with a deck of personal values (e.g., ACCEPTANCE, GROWTH, HEALTH).  
You classify each card into one of five lanes:

- **Core / Non-negotiable**  
- **Important**  
- **Nice to have**  
- **Not important**  
- **Unsorted**  

You can reorder inside each lane to express priority.

You can export that setup (as `.txt` or `.csv`) and later import it to continue refining.

This is useful for reflection, coaching, therapy prep, performance reviews, relationship talks, etc.

---

## Keyboard Controls

### Navigation
- `j` — Move selection **down** within the current lane.
- `k` — Move selection **up** within the current lane.

### Classify Card (Send and Stay)
- `c` — Send to **Core**.
- `i` — Send to **Important**.
- `n` — Send to **Nice to Have**.
- `x` — Send to **Not Important**.
- `u` — Send to **Unsorted**.

After sending, you remain in the same lane, and the next card becomes active — an **inbox triage** style.

### Jump Focus (Uppercase, No Card Move)
- `C` — Jump focus to **Core**.
- `I` — Jump focus to **Important**.
- `N` — Jump focus to **Nice**.
- `X` — Jump focus to **Not Important**.
- `U` — Jump focus to **Unsorted**.

### Send to Neighbor Lane
- `h` — Send card one lane **left**, stay here.
- `l` — Send card one lane **right**, stay here.
- `H` — Send card one lane **left** and **follow** it.
- `L` — Send card one lane **right** and **follow** it.

> Lowercase = send (stay). Uppercase = move (follow).

### Reorder Within the Focused Lane
- `J` — Move card **down** one slot.
- `K` — Move card **up** one slot.
- `g` — Send card to the **top** of the lane.
- `G` — Send card to the **bottom** of the lane.

### Other
- `r` — Shuffle the **Unsorted** lane.
- `e` — Preview export in the UI and copy to clipboard.

---

## Mouse Support

- You can still **drag and drop** cards between lanes.
- When you drop a card in a new lane, focus follows it automatically.

---

## Export / Import

### Export `.txt`
Generates a human-readable summary grouped by lane.  
Each lane’s order (1., 2., 3., etc.) is preserved.  
Downloads as `values_export_YYYYMMDD.txt`.

### Export `.csv`
Generates machine-friendly rows:

```csv
lane,rank,name,description
core,1,HONESTY,to be honest and truthful
important,1,GROWTH,to keep changing and growing
```

Downloads as `values_export_YYYYMMDD.csv`.

The CSV format is also what you can import.

### Import `.csv`
1. Click **Import .csv** and choose a file you previously exported.
2. The board will be restored:
   - Cards return to their lanes.
   - Order inside lanes is preserved by `rank`.
   - Selection starts at **Unsorted** (or the first non-empty lane).

This means you can:
- Work for a while.
- Export.
- Come back later and re-import to continue refining.

---

## File Layout

```
index.html          # Markup and app container
css/style.css       # Dark theme and layout
data/values.js      # The values list, lane config, and order
js/state.js         # App state and logic (selection, moving cards, etc.)
js/render.js        # DOM rendering and highlighting
js/keyboard.js      # Keyboard bindings
js/dragdrop.js      # Drag-and-drop behavior
js/export_import.js # Export (.txt/.csv), preview, import (.csv)
js/main.js          # Bootstraps everything, wires buttons
```

---

## No Build Step

All JavaScript uses **native ES modules**.  

The browser loads `js/main.js` with `type="module"`, which imports all other modules.  
You can open `index.html` directly or serve the folder with any static server.

---

## Roadmap Ideas

- Add **localStorage autosave** (avoid manual export/import).
- Add ability to **create custom cards**.
- Allow **renaming or recoloring lanes**.
- Add **lane notes** (why this is Core right now).

---

## License / Use

You can use this personally, with clients, or in workshops.  
If you publish it, credit is appreciated but not required.

