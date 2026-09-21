(() => {
  const baseWidth = 34;
  const baseHeight = 22;
  const machines = {
    primer: {
      id: "primer",
      file: "./primer.rle",
      padding: 48,
      title: "Primer: a prime-number machine",
      ready: "Primer is ready. Its first prime signal is due near generation 340.",
      reset: "Primer reset. Its first prime signal is due near generation 340.",
      story: "Primer sends a lightweight spaceship for prime number <i>N</i> at generation 120<i>N</i> + 100."
    },
    max: {
      id: "max",
      file: "./max.rle",
      padding: 260,
      title: "Max: a world-filling machine",
      ready: "Max is ready. Watch its striped frontier grow in every direction.",
      reset: "Max reset. Its population grows faster and faster as it fills space.",
      story: "Max is a spacefiller: its striped frontier spreads in all four directions, making its population grow quadratically."
    }
  };
  const neighborDeltas = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];
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
    const body = rle
      .split(/\r?\n/)
      .filter((line) => !line.startsWith("#") && !line.startsWith("x"))
      .join("");

    for (const token of body) {
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
    { id: "diehard", name: "Diehard", hint: "A long adventure", cells: [[0, 6], [1, 0], [1, 1], [2, 1], [2, 5], [2, 6], [2, 7]] },
    { id: "acorn", name: "Acorn", hint: "Seven cells, huge explosion", topology: "bounded", zoom: 34, note: "Acorn is ready with walls and a larger grid. Its full 5,206-generation story needs an infinite universe.", cells: cellsFromRle("bo5b$3bo3b$2o2b3o!") }
  ];

  const experiments = [
    {
      id: "lightweight-spaceship",
      name: "Lightweight spaceship",
      hint: "A traveling signal",
      rule: "B3/S23",
      cells: cellsFromRle("bo2bo$o4b$o3bo$4o!")
    },
    {
      id: "pulsar",
      name: "Pulsar",
      hint: "A three-step clock",
      rule: "B3/S23",
      cells: cellsFromRle("2b3o3b3o$13b$o4bobo4bo$o4bobo4bo$o4bobo4bo$2b3o3b3o$13b$2b3o3b3o$o4bobo4bo$o4bobo4bo$o4bobo4bo$13b$2b3o3b3o!")
    },
    {
      id: "pentadecathlon",
      name: "Pentadecathlon",
      hint: "A 15-step clock",
      rule: "B3/S23",
      cells: cellsFromRle("2bo4bo2b$2ob4ob2o$2bo4bo!")
    },
    {
      id: "gosper-gun",
      name: "Glider gun",
      hint: "A signal factory",
      rule: "B3/S23",
      cells: cellsFromRle("24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!")
    },
    {
      id: "signal-bounce",
      name: "Signal bounce",
      hint: "Two gliders change paths",
      rule: "B3/S23",
      cells: cellsFromRle("7bo$6bo20bo$6b3o17bo$26b3o7$23bo$b2o19b2o$obo19bobo$2bo!")
    },
    {
      id: "signal-eater-clock",
      name: "Signal eater clock",
      hint: "A catcher shapes a clock",
      rule: "B3/S23",
      cells: cellsFromRle("bo$bo$obo$bo$bo$bo5b2o$bo5bobo$obo6bo$bo7b2o$bo!")
    },
    {
      id: "not-gate",
      name: "NOT gate",
      hint: "A signal can cancel a signal",
      rule: "B3/S23",
      cells: cellsFromRle("42b2o$42b2o6$obo$b2o$bo$42b3o$41bo3bo$40bo5bo$40bo5bo$8bo34bo$9b2o30bo3bo$8b2o32b3o$43bo3$44b3o$44b3o$43bo3bo$37bobo$37b2o3b2o3b2o$38bo4$23bo$24b2o5bo$23b2o4b2o$30b2o2$44b2o$44b2o!")
    },
    {
      id: "and-not-gate",
      name: "AND-NOT gate",
      hint: "One signal passes when another is missing",
      rule: "B3/S23",
      cells: cellsFromRle("o19bo19bo19bo$2bo5bo12b2o5bo13bo5bo12b2o5bo$2o4bo13b2o4bo13b2o4b2o12b2o4b2o$7b2o18b2o18b2o18b2o5$7b2o18b2o18b2o18b2o$7bo19bo19bo19bo$8b3o17b3o17b3o17b3o$10bo19bo19bo19bo!")
    }
  ];

  const grid = document.querySelector("#life-grid");
  const ruleSelect = document.querySelector("#rule-select");
  const ruleDescription = document.querySelector("#rule-description");
  const ruleList = document.querySelector("#rule-list");
  const birthCounts = document.querySelector("#birth-counts");
  const survivalCounts = document.querySelector("#survival-counts");
  const customRulePreview = document.querySelector("#custom-rule-preview");
  const applyCustomRuleButton = document.querySelector("#apply-custom-rule");
  const patternPicker = document.querySelector("#pattern-picker");
  const experimentPicker = document.querySelector("#experiment-picker");
  const generation = document.querySelector("#generation");
  const population = document.querySelector("#population");
  const ruleBadge = document.querySelector("#rule-badge");
  const patternName = document.querySelector("#pattern-name");
  const status = document.querySelector("#play-status");
  const playButton = document.querySelector("#play-button");
  const speed = document.querySelector("#speed");
  const speedValue = document.querySelector("#speed-value");
  const zoom = document.querySelector("#zoom");
  const zoomValue = document.querySelector("#zoom-value");
  const gridViewport = document.querySelector("#grid-viewport");
  const topologyDescription = document.querySelector("#topology-description");
  const challengeScore = document.querySelector("#challenge-score");
  const challengeBest = document.querySelector("#challenge-best");
  const challengeButton = document.querySelector("#challenge-button");
  const challengeMessage = document.querySelector("#challenge-message");
  const challengeRuleName = document.querySelector("#challenge-rule-name");
  const challengeRuleId = document.querySelector("#challenge-rule-id");
  const primerLoadButton = document.querySelector("#primer-load-button");
  const maxLoadButton = document.querySelector("#max-load-button");
  const machineViewer = document.querySelector("#machine-viewer");
  const machineTitle = document.querySelector("#machine-title");
  const machineStory = document.querySelector("#machine-story");
  const machineCanvas = document.querySelector("#machine-canvas");
  const machineContext = machineCanvas.getContext("2d");
  const machineStatus = document.querySelector("#machine-status");
  const machineGeneration = document.querySelector("#machine-generation");
  const machinePopulation = document.querySelector("#machine-population");
  const machinePlayButton = document.querySelector("#machine-play-button");
  const machineResetButton = document.querySelector("#machine-reset-button");
  const machineSpeed = document.querySelector("#machine-speed");
  const machineSpeedValue = document.querySelector("#machine-speed-value");
  const colorControls = [
    { input: document.querySelector("#alive-color"), property: "--alive-cell", value: "#f35d51" },
    { input: document.querySelector("#dead-color"), property: "--dead-cell", value: "#1b2a54" },
    { input: document.querySelector("#space-color"), property: "--universe-space", value: "#101a3a" }
  ];
  const cellButtons = [];
  let living = new Set();
  let currentRule = rules[0];
  let currentTopology = "toroidal";
  let currentPattern = "Empty canvas";
  let currentGeneration = 0;
  let timer = null;
  let drawing = false;
  let drawValue = true;
  let challengeState = "ready";
  let challengeHistory = new Map();
  let challengeSeed = null;
  let challengeRule = null;
  let challengeBestScore = Number(window.localStorage.getItem("life-lab-best-score") || "0");
  let machineLiving = new Set();
  let machineSeed = new Set();
  let machineTimer = null;
  let machineIsLoaded = false;
  let machineGenerationCount = 0;
  let machineWidth = 540;
  let machineHeight = 390;
  let machineZoom = 1;
  let machineOffsetX = 0;
  let machineOffsetY = 0;
  let machineDragging = false;
  let machineDragPoint = null;
  let currentMachine = null;

  const maxTrackedChallengeStates = 2000;

  const pointKey = (row, col) => `${row}:${col}`;
  const wrap = (value, size) => (value % size + size) % size;
  const coordinates = (key) => key.split(":").map(Number);

  function ruleParts(rule) {
    const [birth, survival] = rule.id.substring(1).split("/S");
    return { birth: new Set([...birth].map(Number)), survival: new Set([...survival].map(Number)) };
  }

  function selectedCounts(container) {
    return [...container.querySelectorAll("button")]
      .filter((button) => button.getAttribute("aria-pressed") === "true")
      .map((button) => Number(button.dataset.count));
  }

  function customRule() {
    const birth = selectedCounts(birthCounts).join("");
    const survival = selectedCounts(survivalCounts).join("");
    const id = `B${birth}/S${survival}`;
    return {
      id,
      name: "Your own rule",
      accent: "#7157c7",
      description: "A rule you made for this visit. Try changing one number and watch what it does."
    };
  }

  function updateCustomRulePreview() {
    customRulePreview.textContent = customRule().id;
  }

  function selectCustomCounts(rule) {
    const { birth, survival } = ruleParts(rule);
    birthCounts.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", String(birth.has(Number(button.dataset.count)))));
    survivalCounts.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", String(survival.has(Number(button.dataset.count)))));
    updateCustomRulePreview();
  }

  function neighborPhrase(counts) {
    const values = [...counts];
    if (values.length === 9) return "any number of neighbors";
    if (values.length === 1) return `exactly ${values[0]} neighbor${values[0] === 1 ? "" : "s"}`;
    if (values.length === 2) return `either ${values[0]} or ${values[1]} neighbors`;
    return `one of ${values.slice(0, -1).join(", ")}, or ${values.at(-1)} neighbors`;
  }

  function ruleMechanics(rule) {
    const { birth, survival } = ruleParts(rule);
    const birthExplanation = birth.size === 0
      ? "Empty squares never wake up."
      : `Empty squares wake up with ${neighborPhrase(birth)}.`;
    const survivalExplanation = survival.size === 0
      ? "Living squares always turn off on the next step."
      : `Living squares stay on with ${neighborPhrase(survival)}.`;
    return `${birthExplanation} ${survivalExplanation}`;
  }

  function boardSignature() {
    return [...living].sort().join("|");
  }

  function resetChallenge(message = "Choose a pattern or draw your own seed, then start the challenge.") {
    challengeState = "ready";
    challengeHistory = new Map();
    challengeSeed = null;
    challengeRule = null;
    challengeMessage.textContent = message;
    challengeScore.textContent = "—";
    challengeBest.textContent = challengeBestScore.toLocaleString();
    challengeButton.disabled = false;
    challengeButton.textContent = "Start challenge";
  }

  function finishChallenge(message) {
    challengeState = "finished";
    challengeMessage.textContent = message;
    challengeButton.disabled = false;
    challengeButton.textContent = "Try this seed again";
    status.textContent = "Challenge complete";

    if (currentGeneration > challengeBestScore) {
      challengeBestScore = currentGeneration;
      window.localStorage.setItem("life-lab-best-score", String(challengeBestScore));
    }

    stop();
  }

  function checkChallenge() {
    if (challengeState !== "running") return false;

    if (living.size === 0) {
      finishChallenge(`Life ran out after ${currentGeneration.toLocaleString()} generations. Try another seed!`);
      return true;
    }

    const signature = boardSignature();
    const earlierGeneration = challengeHistory.get(signature);
    if (earlierGeneration !== undefined) {
      const period = currentGeneration - earlierGeneration;
      finishChallenge(`Loop found after ${currentGeneration.toLocaleString()} generations. It repeats every ${period} generation${period === 1 ? "" : "s"}, so this universe can live forever!`);
      return true;
    }

    if (challengeHistory.size >= maxTrackedChallengeStates) {
      challengeHistory = new Map([[signature, currentGeneration]]);
      challengeMessage.textContent = `Still going after ${currentGeneration.toLocaleString()} generations. The loop detector has started a fresh window.`;
      return false;
    }

    challengeHistory.set(signature, currentGeneration);
    return false;
  }

  function startChallenge() {
    if (living.size === 0) {
      challengeMessage.textContent = "Add some living squares first. A universe needs a seed!";
      return;
    }

    stop();
    if (challengeState === "finished" && challengeSeed !== null) {
      living = new Set(challengeSeed);
    } else {
      challengeSeed = new Set(living);
    }
    currentGeneration = 0;
    currentPattern = "Survival challenge";
    challengeState = "running";
    challengeRule = currentRule;
    challengeHistory = new Map([[boardSignature(), currentGeneration]]);
    challengeMessage.textContent = `The clock is running under ${challengeRule.id}. How long can your universe keep life going?`;
    challengeButton.disabled = true;
    challengeButton.textContent = "Challenge running";
    render();
    play();
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

  function advance(shouldRender = true) {
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
    const challengeFinished = checkChallenge();
    if (shouldRender || challengeFinished) render();
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
    const displayedChallengeRule = challengeRule ?? currentRule;
    challengeRuleName.textContent = displayedChallengeRule.name;
    challengeRuleId.textContent = displayedChallengeRule.id;
    challengeScore.textContent = challengeState === "ready" ? "—" : currentGeneration.toLocaleString();
    challengeBest.textContent = challengeBestScore.toLocaleString();
  }

  function setCell(row, col, alive) {
    const key = pointKey(row, col);
    if (alive) living.add(key); else living.delete(key);
    currentPattern = "Your own pattern";
    stop();
    resetChallenge("Your seed changed. Start a fresh challenge when you are ready.");
    render();
  }

  function fitPattern(maxRow, maxCol) {
    if (height > maxRow && width > maxCol) return;

    let fittedZoom = 50;
    for (let candidate = 34; candidate <= 220; candidate += 1) {
      const scale = candidate / 100;
      const candidateWidth = Math.max(12, Math.round(baseWidth / scale));
      const candidateHeight = Math.max(8, Math.round(baseHeight / scale));
      if (candidateWidth > maxCol && candidateHeight > maxRow) fittedZoom = candidate;
    }
    setZoom(fittedZoom);
  }

  function setTopology(topology) {
    currentTopology = topology;
    document.querySelectorAll(".topology-choice").forEach((button) => button.classList.toggle("selected", button.dataset.topology === topology));
    stop();
    resetChallenge("The edge changed. Start a fresh challenge for this universe.");
    topologyDescription.textContent = currentTopology === "bounded"
      ? "Beyond the edge is empty space. Travelers can fall apart at the wall."
      : "The left joins the right and the top joins the bottom. Travelers can wrap around.";
    status.textContent = currentTopology === "bounded" ? "Your universe has walls" : "Your universe wraps around";
  }

  function loadPattern(pattern) {
    const maxRow = Math.max(...pattern.cells.map(([row]) => row));
    const maxCol = Math.max(...pattern.cells.map(([, col]) => col));
    if (pattern.rule) applyRule(rules.find((rule) => rule.id === pattern.rule));
    if (pattern.topology) setTopology(pattern.topology);
    if (pattern.zoom) setZoom(pattern.zoom); else fitPattern(maxRow, maxCol);
    living = new Set();
    const rowStart = Math.floor((height - maxRow - 1) / 2);
    const colStart = Math.floor((width - maxCol - 1) / 2);
    pattern.cells.forEach(([row, col]) => living.add(pointKey(row + rowStart, col + colStart)));
    currentGeneration = 0;
    currentPattern = pattern.name;
    stop();
    resetChallenge(`${pattern.name} is ready. Start the challenge whenever you like.`);
    document.querySelectorAll(".pattern-card").forEach((card) => card.classList.toggle("selected", card.dataset.pattern === pattern.id));
    status.textContent = pattern.note ?? `${pattern.name} is ready`;
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
    resetChallenge("A surprise seed is ready. See how long it lasts!");
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
    const hertz = Number(speed.value);
    const interval = Math.max(16, Math.round(1000 / hertz));
    const renderEvery = Math.max(1, Math.ceil(hertz / 30));
    timer = window.setInterval(() => advance((currentGeneration + 1) % renderEvery === 0), interval);
    playButton.innerHTML = '<span aria-hidden="true">Ⅱ</span> Pause';
    playButton.setAttribute("aria-label", "Pause");
    status.textContent = "Your universe is evolving";
  }

  function applyRule(rule) {
    currentRule = rule;
    document.documentElement.style.setProperty("--accent", rule.accent);
    ruleSelect.value = rules.some((knownRule) => knownRule.id === rule.id) ? rule.id : "custom";
    ruleDescription.textContent = `${rule.id}: ${rule.description} ${ruleMechanics(rule)}`;
    document.querySelectorAll(".rule-list-item").forEach((item) => item.classList.toggle("selected", item.dataset.rule === rule.id));
    selectCustomCounts(rule);
    resetChallenge("The rules changed. Start a fresh challenge for this universe.");
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
    stop();
    resetChallenge("The grid changed. Start a fresh challenge for this universe.");
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
    const customOption = document.createElement("option");
    customOption.value = "custom";
    customOption.textContent = "Your own rule";
    ruleSelect.append(customOption);
    ruleSelect.addEventListener("change", () => applyRule(ruleSelect.value === "custom" ? customRule() : rules.find((rule) => rule.id === ruleSelect.value)));

    [birthCounts, survivalCounts].forEach((container) => {
      Array.from({ length: 9 }, (_, count) => count).forEach((count) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "count-button";
        button.dataset.count = String(count);
        button.textContent = String(count);
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => {
          button.setAttribute("aria-pressed", String(button.getAttribute("aria-pressed") !== "true"));
          updateCustomRulePreview();
        });
        container.append(button);
      });
    });

    applyCustomRuleButton.addEventListener("click", () => applyRule(customRule()));

    rules.forEach((rule) => {
      const { birth, survival } = ruleParts(rule);
      const item = document.createElement("li");
      item.className = "rule-list-item";
      item.dataset.rule = rule.id;
      item.innerHTML = `<button type="button"><strong>${rule.name}</strong><span class="rule-id">${rule.id}</span><span class="rule-story">${rule.description}</span><span><b>Wake up:</b> ${birth.size === 0 ? "never" : neighborPhrase(birth)}</span><span><b>Stay on:</b> ${survival.size === 0 ? "never" : neighborPhrase(survival)}</span></button>`;
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

  function machineKey(row, col) {
    return row * machineWidth + col;
  }

  function machineCoordinates(key) {
    return [Math.floor(key / machineWidth), key % machineWidth];
  }

  function machineBounds() {
    let minRow = machineHeight;
    let maxRow = 0;
    let minCol = machineWidth;
    let maxCol = 0;
    machineLiving.forEach((key) => {
      const [row, col] = machineCoordinates(key);
      minRow = Math.min(minRow, row);
      maxRow = Math.max(maxRow, row);
      minCol = Math.min(minCol, col);
      maxCol = Math.max(maxCol, col);
    });
    return { minRow, maxRow, minCol, maxCol };
  }

  function resizeMachineCanvas() {
    const pixelRatio = window.devicePixelRatio || 1;
    const cssWidth = Math.max(280, Math.floor(machineCanvas.clientWidth));
    const cssHeight = Math.round(cssWidth * 2 / 3);
    const pixelWidth = Math.round(cssWidth * pixelRatio);
    const pixelHeight = Math.round(cssHeight * pixelRatio);
    if (machineCanvas.width !== pixelWidth || machineCanvas.height !== pixelHeight) {
      machineCanvas.width = pixelWidth;
      machineCanvas.height = pixelHeight;
    }
    return { cssWidth, cssHeight, pixelRatio };
  }

  function renderMachine() {
    if (!machineIsLoaded) return;

    const { cssWidth, cssHeight, pixelRatio } = resizeMachineCanvas();
    machineContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    machineContext.clearRect(0, 0, cssWidth, cssHeight);
    machineContext.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--universe-space").trim();
    machineContext.fillRect(0, 0, cssWidth, cssHeight);

    const visibleMinCol = Math.max(0, Math.floor(-machineOffsetX / machineZoom) - 1);
    const visibleMaxCol = Math.min(machineWidth - 1, Math.ceil((cssWidth - machineOffsetX) / machineZoom) + 1);
    const visibleMinRow = Math.max(0, Math.floor(-machineOffsetY / machineZoom) - 1);
    const visibleMaxRow = Math.min(machineHeight - 1, Math.ceil((cssHeight - machineOffsetY) / machineZoom) + 1);

    if (machineZoom >= 7) {
      machineContext.strokeStyle = "rgba(255, 255, 255, .12)";
      machineContext.lineWidth = 1;
      machineContext.beginPath();
      for (let col = visibleMinCol; col <= visibleMaxCol + 1; col += 1) {
        const x = machineOffsetX + col * machineZoom;
        machineContext.moveTo(x, 0);
        machineContext.lineTo(x, cssHeight);
      }
      for (let row = visibleMinRow; row <= visibleMaxRow + 1; row += 1) {
        const y = machineOffsetY + row * machineZoom;
        machineContext.moveTo(0, y);
        machineContext.lineTo(cssWidth, y);
      }
      machineContext.stroke();
    }

    machineContext.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--alive-cell").trim();
    machineLiving.forEach((key) => {
      const [row, col] = machineCoordinates(key);
      if (row < visibleMinRow || row > visibleMaxRow || col < visibleMinCol || col > visibleMaxCol) return;
      const size = Math.max(1, machineZoom - (machineZoom >= 7 ? 1 : 0));
      machineContext.fillRect(machineOffsetX + col * machineZoom, machineOffsetY + row * machineZoom, size, size);
    });

    machineGeneration.textContent = machineGenerationCount.toLocaleString();
    machinePopulation.textContent = machineLiving.size.toLocaleString();
  }

  function fitMachine() {
    if (!machineIsLoaded) return;
    const { cssWidth, cssHeight } = resizeMachineCanvas();
    const { minRow, maxRow, minCol, maxCol } = machineBounds();
    const patternWidth = maxCol - minCol + 1;
    const patternHeight = maxRow - minRow + 1;
    machineZoom = Math.max(.45, Math.min((cssWidth - 32) / (patternWidth + 24), (cssHeight - 32) / (patternHeight + 24)));
    machineOffsetX = (cssWidth - patternWidth * machineZoom) / 2 - minCol * machineZoom;
    machineOffsetY = (cssHeight - patternHeight * machineZoom) / 2 - minRow * machineZoom;
    renderMachine();
  }

  function machineName() {
    return currentMachine?.title.split(":")[0] ?? "Machine";
  }

  function advanceMachine() {
    const neighborCounts = new Map();
    machineLiving.forEach((key) => {
      const [row, col] = machineCoordinates(key);
      neighborDeltas.forEach(([rowOffset, colOffset]) => {
        const neighborRow = row + rowOffset;
        const neighborCol = col + colOffset;
        if (neighborRow < 0 || neighborRow >= machineHeight || neighborCol < 0 || neighborCol >= machineWidth) return;
        const neighborKey = machineKey(neighborRow, neighborCol);
        neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) || 0) + 1);
      });
    });

    const next = new Set();
    neighborCounts.forEach((count, key) => {
      if (count === 3 || (count === 2 && machineLiving.has(key))) next.add(key);
    });
    machineLiving = next;
    machineGenerationCount += 1;
    machineStatus.textContent = `${machineName()} is running at generation ${machineGenerationCount.toLocaleString()}.`;
    renderMachine();
  }

  function stopMachine() {
    if (machineTimer !== null) window.clearInterval(machineTimer);
    machineTimer = null;
    machinePlayButton.innerHTML = '<span aria-hidden="true">▶</span> Play';
  }

  function playMachine() {
    if (machineTimer !== null) {
      stopMachine();
      machineStatus.textContent = `${machineName()} paused at generation ${machineGenerationCount.toLocaleString()}.`;
      return;
    }
    const hertz = Number(machineSpeed.value);
    machineTimer = window.setInterval(advanceMachine, Math.max(16, Math.round(1000 / hertz)));
    machinePlayButton.innerHTML = '<span aria-hidden="true">Ⅱ</span> Pause';
    machineStatus.textContent = `${machineName()} is running at ${hertz} Hz.`;
  }

  function resetMachine() {
    if (currentMachine === null) return;
    stopMachine();
    machineLiving = new Set(machineSeed);
    machineGenerationCount = 0;
    machineStatus.textContent = currentMachine.reset;
    fitMachine();
  }

  async function loadMachine(machine) {
    stop();
    stopMachine();
    machineIsLoaded = false;
    machineViewer.hidden = false;
    const loadButton = machine.id === "primer" ? primerLoadButton : maxLoadButton;
    loadButton.disabled = true;
    currentMachine = machine;
    machineTitle.textContent = machine.title;
    machineStory.innerHTML = machine.story;
    machineCanvas.setAttribute("aria-label", `${machineName()}, a zoomable Conway's Game of Life machine`);
    machineResetButton.textContent = `Reset ${machineName()}`;
    machineStatus.textContent = `Loading ${machineName().toLowerCase()}…`;
    try {
      const response = await window.fetch(machine.file);
      if (!response.ok) throw new Error(`${machineName()} pattern could not be loaded.`);
      const cells = cellsFromRle(await response.text());
      const maxRow = Math.max(...cells.map(([row]) => row));
      const maxCol = Math.max(...cells.map(([, col]) => col));
      const padding = machine.padding ?? 48;
      machineHeight = maxRow + (padding * 2) + 1;
      machineWidth = maxCol + (padding * 2) + 1;
      machineLiving = new Set(cells.map(([row, col]) => machineKey(row + padding, col + padding)));
      machineSeed = new Set(machineLiving);
      machineGenerationCount = 0;
      machineIsLoaded = true;
      machineStatus.textContent = machine.ready;
      fitMachine();
      machineViewer.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      machineStatus.textContent = `${machineName()} could not load. Please refresh and try again.`;
    } finally {
      loadButton.disabled = false;
    }
  }

  function setupControls() {
    document.querySelector("#play-button").addEventListener("click", play);
    document.querySelector("#step-button").addEventListener("click", () => { stop(); advance(); status.textContent = "One generation later"; });
    document.querySelector("#clear-button").addEventListener("click", () => { living = new Set(); currentGeneration = 0; currentPattern = "Empty canvas"; stop(); resetChallenge(); status.textContent = "A fresh empty universe"; document.querySelectorAll(".pattern-card").forEach((card) => card.classList.remove("selected")); render(); });
    document.querySelector("#random-button").addEventListener("click", randomize);
    speed.addEventListener("input", () => {
      speedValue.textContent = `${speed.value} Hz`;
      if (timer !== null) { stop(); play(); }
    });
    zoom.addEventListener("input", () => setZoom(zoom.value));
    document.querySelector("#zoom-reset-button").addEventListener("click", () => setZoom(100));
    document.querySelectorAll(".topology-choice").forEach((choice) => choice.addEventListener("click", () => {
      setTopology(choice.dataset.topology);
    }));
    colorControls.forEach((control) => control.input.addEventListener("input", () => {
      setColor(control, control.input.value);
      renderMachine();
    }));
    document.querySelector("#color-reset-button").addEventListener("click", () => {
      colorControls.forEach((control) => setColor(control, control.value));
      renderMachine();
      status.textContent = "Your original colors are back";
    });
    primerLoadButton.addEventListener("click", () => loadMachine(machines.primer));
    maxLoadButton.addEventListener("click", () => loadMachine(machines.max));
    machinePlayButton.addEventListener("click", playMachine);
    document.querySelector("#machine-step-button").addEventListener("click", () => {
      stopMachine();
      advanceMachine();
    });
    machineResetButton.addEventListener("click", resetMachine);
    document.querySelector("#machine-fit-button").addEventListener("click", fitMachine);
    document.querySelector("#machine-close-button").addEventListener("click", () => {
      stopMachine();
      machineViewer.hidden = true;
    });
    machineSpeed.addEventListener("input", () => {
      machineSpeedValue.textContent = `${machineSpeed.value} Hz`;
      if (machineTimer !== null) {
        stopMachine();
        playMachine();
      }
    });
    machineCanvas.addEventListener("wheel", (event) => {
      if (!machineIsLoaded) return;
      event.preventDefault();
      const bounds = machineCanvas.getBoundingClientRect();
      const cursorX = event.clientX - bounds.left;
      const cursorY = event.clientY - bounds.top;
      const worldX = (cursorX - machineOffsetX) / machineZoom;
      const worldY = (cursorY - machineOffsetY) / machineZoom;
      machineZoom = Math.min(36, Math.max(.35, machineZoom * (event.deltaY < 0 ? 1.18 : .85)));
      machineOffsetX = cursorX - worldX * machineZoom;
      machineOffsetY = cursorY - worldY * machineZoom;
      renderMachine();
    }, { passive: false });
    machineCanvas.addEventListener("pointerdown", (event) => {
      if (!machineIsLoaded) return;
      machineDragging = true;
      machineDragPoint = { x: event.clientX, y: event.clientY };
      machineCanvas.setPointerCapture(event.pointerId);
    });
    machineCanvas.addEventListener("pointermove", (event) => {
      if (!machineDragging || machineDragPoint === null) return;
      machineOffsetX += event.clientX - machineDragPoint.x;
      machineOffsetY += event.clientY - machineDragPoint.y;
      machineDragPoint = { x: event.clientX, y: event.clientY };
      renderMachine();
    });
    machineCanvas.addEventListener("pointerup", () => {
      machineDragging = false;
      machineDragPoint = null;
    });
    window.addEventListener("resize", () => renderMachine());
    challengeButton.addEventListener("click", startChallenge);
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
