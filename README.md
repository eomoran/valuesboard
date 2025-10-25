Personal Values Board

A fast, keyboard-driven values sorting tool you can run locally in your browser.
No build step, no backend, no tracking.

⸻

How to run
	1.	Clone / copy this repo.
	2.	Open index.html in a modern browser (Chrome, Safari, Firefox, Edge).
You don’t need a server.

That’s it.

⸻

What this does

You start with a deck of personal values (ACCEPTANCE, GROWTH, HEALTH, etc.).
You classify each card into one of five lanes:
	•	Core / Non-negotiable
	•	Important
	•	Nice to have
	•	Not important
	•	Unsorted

You can reorder inside each lane to express priority.

You can export that setup (as .txt or .csv) and later import it to continue refining.

This is useful for reflection, coaching, therapy prep, performance reviews, relationship talks, etc.

⸻

Keyboard controls

Navigation
	•	j = move selection down within the current lane
	•	k = move selection up within the current lane

Classify card (send it away, STAY here, auto-advance)
	•	c = send to Core
	•	i = send to Important
	•	n = send to Nice to have
	•	x = send to Not important
	•	u = send to Unsorted

After sending, you keep working in the same lane, and the next card becomes active.
This is “inbox triage” style.

Jump focus (UPPERCASE, no card move)
	•	C = jump focus to Core
	•	I = jump focus to Important
	•	N = jump focus to Nice
	•	X = jump focus to Not important
	•	U = jump focus to Unsorted

This is “now I want to groom this lane.”

Send to neighbor lane
	•	h = send card one lane to the LEFT, stay here
	•	l = send card one lane to the RIGHT, stay here
	•	H = send card one lane LEFT and FOLLOW it (selection moves with it)
	•	L = send card one lane RIGHT and FOLLOW it

So lowercase is “toss it over, keep working here,” uppercase is “move me with it.”

Reorder within the focused lane
	•	J (Shift+j) = move this card down one slot
	•	K (Shift+k) = move this card up one slot
	•	g = send this card to the top of this lane
	•	G (Shift+g) = send this card to the bottom

This is for ranking inside a lane, especially Core.

Other
	•	r = shuffle the Unsorted lane
	•	e = preview an export in the UI and copy it to clipboard

⸻

Mouse support
	•	You can still drag and drop cards between lanes.
	•	When you drop a card in a new lane, focus will follow it to that lane.

⸻

Export / Import

Export .txt

Generates a human-readable summary grouped by lane.
The 1., 2., 3. order in each lane is preserved.
Downloads as values_export_YYYYMMDD.txt.

Export .csv

Generates machine-friendly rows like:

lane,rank,name,description
core,1,HONESTY,to be honest and truthful
important,1,GROWTH,to keep changing and growing
...

Downloads as values_export_YYYYMMDD.csv.

The CSV format is also what you can import.

Import .csv
	•	Click “Import .csv”, choose a CSV you exported earlier.
	•	The board will be restored:
	•	Cards go back to their lanes.
	•	Order inside lanes is restored based on rank.
	•	Selection will start at Unsorted (or the first non-empty lane).

This means you can:
	•	Work for a while.
	•	Export.
	•	Come back later, re-import, keep refining.

⸻

File layout
	•	index.html – markup and app container
	•	css/style.css – dark theme + layout
	•	data/values.js – the values list, lane config, lane order
	•	js/state.js – app state and logic (selection, moving cards, reordering, etc.)
	•	js/render.js – DOM rendering + highlighting
	•	js/keyboard.js – all keyboard bindings
	•	js/dragdrop.js – drag-and-drop behavior
	•	js/export_import.js – export (.txt/.csv), preview, import (.csv)
	•	js/main.js – bootstraps everything, wires buttons

⸻

No build step

All JS is native ES modules.

The browser loads js/main.js with type="module", and that file imports the other modules.
You can just open index.html directly, or serve the folder with any static server.

⸻

Roadmap ideas
	•	localStorage autosave (so you don’t have to manually export/import between sessions)
	•	ability to add your own custom cards
	•	ability to rename/recolor lanes from the UI
	•	per-lane notes / reflections (why is this Core for me right now?)

⸻

License / Use

You can use this personally, with clients, or in workshops.
If you publish it, credit is appreciated but not required.