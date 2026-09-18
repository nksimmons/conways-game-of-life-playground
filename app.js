(() => {
  const baseWidth = 34;
  const baseHeight = 22;
  let width = baseWidth;
  let height = baseHeight;
  const rules = [
    { id: "B3/S23", name: "Conway's Life", accent: "#f35d51", description: "The famous original. It grows gliders, blinkers, and surprisingly busy little worlds." },
    { id: "B36/S23", name: "HighLife", accent: "#e27d28", description: "Like Conway's Life, but six neighbors can also create a new cell." },
    { id: "B2/S", name: "Seeds", accent: "#cc4d9c", description: "Living cells always fade. New cells are born with exactly two neighbors." },
    { id: "B3/S012345678", name: "Life without Death", accent: "#68943b", description: "Once a cell is alive, it stays alive. Watch your drawing turn into an ink blot." },
    { id: "B3678/S34678", name: "Day & Night", accent: "#4d83d5", description: "A balanced rule where empty and full spaces have a mysterious symmetry." },
    { id: "B368/S245", name: "Morley", accent: "#7c63c8", description: "A lively rule with traveling patterns and lots of changing shapes." },
    { id: "B36/S125", name: "2x2", accent: "#16a48a", description: "A rule that loves blocky shapes and little two-by-two building bricks." },
    { id: "B35678/S5678", name: "Diamoeba", accent: "#d75b75", description: "Big diamond-like borders ripple and breathe as they evolve." },
    { id: "B3/S12", name: "Flock", accent: "#2585a8", description: "Cells can survive with just one neighbor, so patterns fly apart in new ways." },
    { id: "B34/S34", name: "34 Life", accent: "#ad7a2c", description: "Three or four neighbors is the magic number for both birth and survival." }
  ];

  function cellsFromRle(rle) {
    const cells = [];
    let row = 0;
    let col = 0;
    let digits = "";

    for (const token of rle) {
      if (token >= "0" && token <= "9") {
        digits += token;
        continue;
      }

      const run = Number(digits || "1");
      digits = "";

      if (token === "o") {
        for (let offset = 0; offset < run; offset += 1) cells.push([row, col + offset]);
        col += run;
      } else if (token === "b") {
        col += run;
      } else if (token === "$") {
        row += run;
        col = 0;
      } else if (token === "!") {
        break;
      }
    }

    return cells;
  }

  const patterns = [
    { id: "glider", name: "Glider", hint: "A tiny spaceship", cells: [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]] },
    { id: "blinker", name: "Blinker", hint: "Flips forever", cells: [[0, 0], [0, 1], [0, 2]] },
    { id: "block", name: "Block", hint: "Stays still", cells: [[0, 0], [0, 1], [1, 0], [1, 1]] },
    { id: "toad", name: "Toad", hint: "A two-step dance", cells: [[0, 1], [0, 2], [0, 3], [1, 0], [1, 1], [1, 2]] },
    { id: "rpentomino", name: "R-pentomino", hint: "Small, then wild", cells: [[0, 1], [0, 2], [1, 0], [1, 1], [2, 1]] },
    { id: "diehard", name: "Diehard", hint: "A long adventure", cells: [[0, 6], [1, 0], [1, 1], [2, 1], [2, 5], [2, 6], [2, 7]] }
  ];

  const experiments = [
    {
      id: "pulsar",
      name: "Pulsar",
      hint: "A three-step clock",
      rule: "B3/S23",
      cells: cellsFromRle("2b3o3b3o$13b$o4bobo4bo$o4bobo4bo$o4bobo4bo$2b3o3b3o$13b$2b3o3b3o$o4bobo4bo$o4bobo4bo$o4bobo4bo$13b$2b3o3b3o!")
    },
    {
      id: "gosper-gun",
      name: "Glider gun",
      hint: "A signal factory",
      rule: "B3/S23",
      cells: cellsFromRle("24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!")
    }
  ];

  const grid = document.querySelector("#life-grid");
  const ruleSelect = document.querySelector("#rule-select");
  const ruleDescription = document.querySelector("#rule-description");
  const ruleList = document.querySelector("#rule-list");
  const patternPicker = document.querySelector("#pattern-picker");
  const experimentPicker = document.querySelector("#experiment-picker");
  const generation = document.querySelector("#generation");
  const population = document.querySelector("#population");
  const ruleBadge = document.querySelector("#rule-badge");
  const patternName = document.querySelector("#pattern-name");
  const status = document.querySelector("#play-status");
  const playButton = document.querySelector("#play-button");
  const speed = document.querySelector("#speed");
  const zoom = document.querySelector("#zoom");
  const zoomValue = document.querySelector("#zoom-value");
  const gridViewport = document.querySelector("#grid-viewport");
  const topologyDescription = document.querySelector("#topology-description");
  const colorControls = [
    { input: document.querySelector("#alive-color"), property: "--alive-cell", value: "#f35d51" },
    { input: document.querySelector("#dead-color"), property: "--dead-cell", value: "#1b2a54" },
    { input: document.querySelector("#space-color"), property: "--universe-space", value: "#101a3a" }
  ];
  const cellButtons = [];
  let living = new Set();
  let currentRule = rules[0];
  let currentTopology = "bounded";
  let currentPattern = "Empty canvas";
  let currentGeneration = 0;
  let timer = null;
  let drawing = false;
  let drawValue = true;

  const pointKey = (row, col) => `${row}:${col}`;
  const wrap = (value, size) => (value % size + size) % size;
  const coordinates = (key) => key.split(":").map(Number);

  function ruleParts(rule) {
    const [birth, survival] = rule.id.substring(1).split("/S");
    return { birth: new Set([...birth].map(Number)), survival: new Set([...survival].map(Number)) };
  }

  function neighborCounts(counts) {
    return counts.size === 0 ? "never" : [...counts].join(", ");
  }

  function countNeighbors(row, col) {
    let neighbors = 0;
    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
        if (rowOffset === 0 && colOffset === 0) continue;
        let neighborRow = row + rowOffset;
        let neighborCol = col + colOffset;
        if (currentTopology === "toroidal") {
          neighborRow = wrap(neighborRow, height);
          neighborCol = wrap(neighborCol, width);
        } else if (neighborRow < 0 || neighborRow >= height || neighborCol < 0 || neighborCol >= width) {
          continue;
        }
        if (living.has(pointKey(neighborRow, neighborCol))) neighbors += 1;
      }
    }
    return neighbors;
  }

  function advance() {
    const next = new Set();
    const { birth, survival } = ruleParts(currentRule);
    for (let row = 0; row < height; row += 1) {
      for (let col = 0; col < width; col += 1) {
        const alive = living.has(pointKey(row, col));
        const neighbors = countNeighbors(row, col);
        if ((alive && survival.has(neighbors)) || (!alive && birth.has(neighbors))) next.add(pointKey(row, col));
      }
    }
    living = next;
    currentGeneration += 1;
    render();
  }

  function render() {
    cellButtons.forEach((cell) => {
      const alive = living.has(cell.dataset.key);
      cell.classList.toggle("alive", alive);
      cell.setAttribute("aria-pressed", String(alive));
      cell.setAttribute("aria-label", `Row ${Number(cell.dataset.row) + 1}, column ${Number(cell.dataset.col) + 1}: ${alive ? "alive" : "dead"}`);
    });
    generation.textContent = currentGeneration.toLocaleString();
    population.textContent = living.size.toLocaleString();
    ruleBadge.textContent = currentRule.id;
    patternName.textContent = currentPattern;
  }

  function setCell(row, col, alive) {
    const key = pointKey(row, col);
    if (alive) living.add(key); else living.delete(key);
    currentPattern = "Your own pattern";
    stop();
    render();
  }

  function fitPattern(maxRow, maxCol) {
    if (height > maxRow && width > maxCol) return;

    let fittedZoom = 50;
    for (let candidate = 50; candidate <= 220; candidate += 10) {
      const scale = candidate / 100;
      const candidateWidth = Math.max(12, Math.round(baseWidth / scale));
      const candidateHeight = Math.max(8, Math.round(baseHeight / scale));
      if (candidateWidth > maxCol && candidateHeight > maxRow) fittedZoom = candidate;
    }
    setZoom(fittedZoom);
  }

  function loadPattern(pattern) {
    const maxRow = Math.max(...pattern.cells.map(([row]) => row));
    const maxCol = Math.max(...pattern.cells.map(([, col]) => col));
    if (pattern.rule) applyRule(rules.find((rule) => rule.id === pattern.rule));
    fitPattern(maxRow, maxCol);
    living = new Set();
    const rowStart = Math.floor((height - maxRow - 1) / 2);
    const colStart = Math.floor((width - maxCol - 1) / 2);
    pattern.cells.forEach(([row, col]) => living.add(pointKey(row + rowStart, col + colStart)));
    currentGeneration = 0;
    currentPattern = pattern.name;
    stop();
    document.querySelectorAll(".pattern-card").forEach((card) => card.classList.toggle("selected", card.dataset.pattern === pattern.id));
    status.textContent = `${pattern.name} is ready`;
    render();
  }

  function randomize() {
    living = new Set();
    for (let row = 0; row < height; row += 1) {
      for (let col = 0; col < width; col += 1) {
        if (Math.random() < .26) living.add(pointKey(row, col));
      }
    }
    currentGeneration = 0;
    currentPattern = "A surprise universe";
    stop();
    document.querySelectorAll(".pattern-card").forEach((card) => card.classList.remove("selected"));
    status.textContent = "A surprise is unfolding";
    render();
  }

  function stop() {
    if (timer !== null) window.clearInterval(timer);
    timer = null;
    playButton.innerHTML = '<span aria-hidden="true">▶</span> Play';
    playButton.setAttribute("aria-label", "Play");
  }

  function play() {
    if (timer !== null) {
      stop();
      status.textContent = "Paused. Take a closer look.";
      return;
    }
    const interval = Math.round(1200 / Number(speed.value));
    timer = window.setInterval(advance, interval);
    playButton.innerHTML = '<span aria-hidden="true">Ⅱ</span> Pause';
    playButton.setAttribute("aria-label", "Pause");
    status.textContent = "Your universe is evolving";
  }

  function applyRule(rule) {
    currentRule = rule;
    document.documentElement.style.setProperty("--accent", rule.accent);
    ruleSelect.value = rule.id;
    ruleDescription.textContent = `${rule.id}: ${rule.description}`;
    document.querySelectorAll(".rule-list-item").forEach((item) => item.classList.toggle("selected", item.dataset.rule === rule.id));
    status.textContent = `${rule.name} is now in charge`;
    render();
  }

  function setZoom(value) {
    const percentage = Number(value);
    const scale = percentage / 100;
    const nextWidth = Math.max(12, Math.round(baseWidth / scale));
    const nextHeight = Math.max(8, Math.round(baseHeight / scale));

    zoom.value = String(percentage);
    zoomValue.textContent = `${nextWidth} × ${nextHeight} squares`;

    if (nextWidth === width && nextHeight === height) return;

    const rowShift = Math.floor((nextHeight - height) / 2);
    const columnShift = Math.floor((nextWidth - width) / 2);
    const resizedLiving = new Set();
    living.forEach((key) => {
      const [row, col] = coordinates(key);
      const nextRow = row + rowShift;
      const nextCol = col + columnShift;
      if (nextRow >= 0 && nextRow < nextHeight && nextCol >= 0 && nextCol < nextWidth) {
        resizedLiving.add(pointKey(nextRow, nextCol));
      }
    });

    width = nextWidth;
    height = nextHeight;
    living = resizedLiving;
    setupGrid();
    render();
    gridViewport.scrollLeft = 0;
    gridViewport.scrollTop = 0;
  }

  function setColor(control, value) {
    control.input.value = value;
    document.documentElement.style.setProperty(control.property, value);
  }

  function setupGrid() {
    grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    grid.style.aspectRatio = `${width} / ${height}`;
    grid.replaceChildren();
    cellButtons.length = 0;
    for (let row = 0; row < height; row += 1) {
      for (let col = 0; col < width; col += 1) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "cell";
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);
        cell.dataset.key = pointKey(row, col);
        cell.addEventListener("pointerdown", (event) => {
          event.preventDefault();
          drawing = true;
          drawValue = !living.has(cell.dataset.key);
          setCell(row, col, drawValue);
        });
        cell.addEventListener("pointerenter", () => {
          if (drawing) setCell(row, col, drawValue);
        });
        cellButtons.push(cell);
        grid.append(cell);
      }
    }
    window.addEventListener("pointerup", () => { drawing = false; });
  }

  function setupRules() {
    rules.forEach((rule) => {
      const option = document.createElement("option");
      option.value = rule.id;
      option.textContent = `${rule.name}  ·  ${rule.id}`;
      ruleSelect.append(option);
    });
    ruleSelect.addEventListener("change", () => applyRule(rules.find((rule) => rule.id === ruleSelect.value)));

    rules.forEach((rule) => {
      const { birth, survival } = ruleParts(rule);
      const item = document.createElement("li");
      item.className = "rule-list-item";
      item.dataset.rule = rule.id;
      item.innerHTML = `<button type="button"><strong>${rule.name}</strong><span class="rule-id">${rule.id}</span><span>Born: ${neighborCounts(birth)}</span><span>Survives: ${neighborCounts(survival)}</span></button>`;
      item.querySelector("button").addEventListener("click", () => applyRule(rule));
      ruleList.append(item);
    });
  }

  function setupPatterns() {
    function addPatternCard(pattern, picker, isExperiment) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = isExperiment ? "pattern-card experiment-card" : "pattern-card";
      button.dataset.pattern = pattern.id;
      button.innerHTML = `<strong>${pattern.name}</strong><span>${pattern.hint}</span>`;
      button.addEventListener("click", () => loadPattern(pattern));
      picker.append(button);
    }

    patterns.forEach((pattern) => addPatternCard(pattern, patternPicker, false));
    experiments.forEach((experiment) => addPatternCard(experiment, experimentPicker, true));
  }

  function setupControls() {
    document.querySelector("#play-button").addEventListener("click", play);
    document.querySelector("#step-button").addEventListener("click", () => { stop(); advance(); status.textContent = "One generation later"; });
    document.querySelector("#clear-button").addEventListener("click", () => { living = new Set(); currentGeneration = 0; currentPattern = "Empty canvas"; stop(); status.textContent = "A fresh empty universe"; document.querySelectorAll(".pattern-card").forEach((card) => card.classList.remove("selected")); render(); });
    document.querySelector("#random-button").addEventListener("click", randomize);
    speed.addEventListener("input", () => { if (timer !== null) { stop(); play(); } });
    zoom.addEventListener("input", () => setZoom(zoom.value));
    document.querySelector("#zoom-reset-button").addEventListener("click", () => setZoom(100));
    document.querySelectorAll(".topology-choice").forEach((choice) => choice.addEventListener("click", () => {
      currentTopology = choice.dataset.topology;
      document.querySelectorAll(".topology-choice").forEach((button) => button.classList.toggle("selected", button === choice));
      topologyDescription.textContent = currentTopology === "bounded"
        ? "Beyond the edge is empty space. Travelers can fall apart at the wall."
        : "The left joins the right and the top joins the bottom. Travelers can wrap around.";
      status.textContent = currentTopology === "bounded" ? "Your universe has walls" : "Your universe wraps around";
    }));
    colorControls.forEach((control) => control.input.addEventListener("input", () => setColor(control, control.input.value)));
    document.querySelector("#color-reset-button").addEventListener("click", () => {
      colorControls.forEach((control) => setColor(control, control.value));
      status.textContent = "Your original colors are back";
    });
    window.addEventListener("keydown", (event) => {
      if (event.target.matches("input, select, button")) return;
      if (event.code === "Space") { event.preventDefault(); play(); }
      if (event.key.toLowerCase() === "n") { stop(); advance(); }
    });
  }

  setupGrid();
  setupRules();
  setupPatterns();
  setupControls();
  applyRule(currentRule);
  loadPattern(patterns[0]);
})();
