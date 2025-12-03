// simulation.js
// Lesson: Chemical Kinetics: Rate, Order, Mechanism & Temperature Dependence
// Model 4: Full Multi-Scene Kinetics Engine (Canvas API Implementation)

(function() {
  'use strict';

  // --- CONFIGURATION & CONSTANTS ---
  const CONFIG = {
    R: 8.314, // Gas constant in J·mol⁻¹·K⁻¹
    DEFAULT_Ea: 75000, // Nominal Activation Energy in J·mol⁻¹
    DEFAULT_A: 1e10, // Pre-exponential factor (s⁻¹ for 1st order)
    colors: {
      reactant: '#ff6b6b',
      product: '#48dbfb',
      catalyst: '#feca57',
      light: {
        text: '#0b2545',
        grid: '#e3f2fd'
      },
      dark: {
        text: '#E2E8F0',
        grid: '#4A5568'
      }
    }
  };

  // --- PEDAGOGICAL CONTENT (MST & LAB CHALLENGES) ---
  const BLOOM_GUIDES = {
    1: [
      { level: 'observe', tag: 'Observe', text: 'Observe how the concentration–time graph becomes flatter with time and describe how this shows that the average rate of reaction decreases as reactants are consumed.' },
      { level: 'compare', tag: 'Compare', text: 'Compare the instantaneous rate at t=0s with the average rate over the first 10s. Why are they different?' },
      { level: 'experiment', tag: 'Experiment', text: 'Find a temperature that makes the initial rate for a first-order reaction approximately 0.05 mol·L⁻¹·s⁻¹.' },
      { level: 'analyze', tag: 'Analyze', text: 'Why does the rate change over time for first and second-order reactions but not for a zero-order reaction?' },
      { level: 'challenge', tag: 'Challenge', text: 'If the instantaneous rate is `d[R]/dt`, use the graph to estimate the time it takes for the rate to halve.' }
    ],
    2: [
      { level: 'observe', tag: 'Observe', text: 'Set the order to 1. Double the initial concentration [R]₀. How does the initial rate change?' },
      { level: 'compare', tag: 'Compare', text: 'Compare the effect of doubling [R]₀ for a first-order vs. a second-order reaction. Which has a greater impact on the initial rate?' },
      { level: 'experiment', tag: 'Experiment', text: 'Using the bimolecular reaction, set the order for [A] to 1 and [B] to 1. Find a combination of concentrations that gives a rate of ~0.1 mol·L⁻¹·s⁻¹.' },
      { level: 'analyze', tag: 'Analyze', text: 'From the rate vs. concentration graph, explain how you can determine the order of the reaction just by looking at the shape of the line.' },
      { level: 'challenge', tag: 'Challenge', text: 'A reaction is `A + B -> C`. Experimentally, the rate does not change when you alter [B]. What is the order with respect to B? What does this imply?' }
    ],
    3: [
        { level: 'observe', tag: 'Observe', text: 'For a first-order reaction, measure the half-life (t½) starting at [R]₀ = 2.0. Then, let the reaction run until [R]₀ = 1.0 and measure the new t½. What do you notice?' },
        { level: 'compare', tag: 'Compare', text: 'Compare zero-order and first-order plots to explain how their half-lives behave differently when the initial concentration is doubled.' },
        { level: 'experiment', tag: 'Experiment', text: 'Adjust temperature to get a first-order half-life of exactly 10 seconds.' },
        { level: 'analyze', tag: 'Analyze', text: 'Why is the concept of half-life less useful for second-order reactions compared to first-order reactions?' },
        { level: 'challenge', tag: 'Challenge', text: 'A substance has a half-life of 20s. How long will it take for 75% of the substance to decay if the reaction is first-order?' }
    ],
    4: [
        { level: 'observe', tag: 'Observe', text: 'Increase the temperature. Watch the reaction coordinate diagram and the Arrhenius plot. What changes in each?' },
        { level: 'compare', tag: 'Compare', text: 'Activate the catalyst. Compare the activation energy (Ea) with and without the catalyst. How does this affect the rate constant k?' },
        { level: 'experiment', tag: 'Experiment', text: 'Using the sliders for concentration and temperature, design two different sets of conditions that give approximately the same reaction rate and justify your choice using rate laws and the Arrhenius equation.' },
        { level: 'analyze', tag: 'Analyze', text: 'Explain the meaning of the slope in the Arrhenius plot (ln k vs 1/T) and how it relates to the activation energy.' },
        { level: 'challenge', tag: 'Challenge', text: 'A catalyst increases the rate of the forward reaction. What effect does it have on the rate of the reverse reaction? Why?' }
    ],
    5: [
        { level: 'observe', tag: 'Observe', text: 'Increase temperature and watch the "Micro View". How does the speed and collision frequency of particles change?' },
        { level: 'compare', tag: 'Compare', text: 'Compare the "Total Collisions" to "Effective Collisions". What factors control the fraction of effective collisions?' },
        { level: 'experiment', tag: 'Experiment', text: 'Set a low "Orientation Factor". How does this affect the reaction rate? What kind of molecules might this represent?' },
        { level: 'analyze', tag: 'Analyze', text: 'From a given data table or graph, determine the order of the reaction and calculate the rate constant and half-life, explaining each step of your reasoning.' },
        { level: 'challenge', tag: 'Challenge', text: 'Propose a plausible mechanism with a rate-determining step for the simulated reaction and argue whether the experimental rate law is consistent with your mechanism.' }
    ]
  };

  const MST_CONTENT = {
    visual: {
        title: "Visual Decoding",
        1: "A concentration–time graph for R → P, with secants (average rate) and a tangent (instantaneous rate) that becomes steeper at the start and flatter as reactants are used up.",
        2: "A 'rate vs [A]' graph where slope changes with order; highlight that rate = k[A]ˣ[B]ʸ is obtained from experiment, not from stoichiometric coefficients.",
        3: "For zero order, a straight line [R] vs t; for first order, a straight line ln[R] vs t; show t½ on the graph and how it changes (zero order) or stays constant (first order).",
        4: "Potential energy diagrams with and without catalyst, and an Arrhenius plot (ln k vs 1/T) with a straight line whose slope is –Ea/R.",
        5: "A particle view where only some collisions (correct orientation + E ≥ Ea) are highlighted as 'effective collisions', linked to the rate expression Rate = Z_AB P e⁻ᴱᵃ/ᴿᵀ."
    },
    analogy: {
        title: "Real-World Analogies",
        1: "<strong>Average vs. instantaneous rate:</strong> Like measuring the average speed of a car over a whole trip versus looking at the speedometer at one instant.",
        2: "<strong>Order vs. molecularity:</strong> Order is how strongly each ingredient affects a dish's taste (experimental), while molecularity is how many ingredients are in one step.",
        3: "<strong>Half-life:</strong> Like repeatedly cutting a chocolate bar in half—each cut takes the same time for a first-order reaction, no matter the remaining piece.",
        4: "<strong>Activation energy:</strong> Reactants must climb an 'energy hill' (Ea) to become products, like a cyclist needing energy to cross a mountain pass.",
        5: "<strong>Rate-determining step:</strong> In traffic, the slowest, most congested segment controls travel time, just as the slowest step controls the overall reaction rate."
    },
    cause: {
        title: "Cause & Effect",
        1: "As the reaction proceeds, [reactant] decreases, so the average rate falls with time; the instantaneous rate is obtained when Δt → 0 (slope of the tangent).",
        2: "Higher concentration leads to more frequent effective collisions; we summarize this in the rate law <span class='equation'>Rate = k[A]ˣ[B]ʸ</span>, where x + y is the order.",
        3: "Zero-order reactions have a rate independent of concentration, while first-order reactions have a rate proportional to [R], causing different graph shapes and half-life behaviours.",
        4: "Raising temperature increases the fraction of molecules with E ≥ Ea, increasing k. Catalysts lower Ea by providing an alternate path, changing k but not ΔG.",
        5: "Only collisions with correct orientation and energy become products; the steric factor P (<1) accounts for orientation, especially in complex molecules."
    },
    model: {
        title: "The Physics Model",
        1: "<strong>Rate definitions:</strong> Average rate = –Δ[R]/Δt; Instantaneous rate = –d[R]/dt (slope of tangent).",
        2: "<strong>Rate law:</strong> <span class='equation'>Rate = k[A]ˣ[B]ʸ</span>, order = x + y. The units of k depend on the overall order.",
        3: "<strong>Integrated Rate Equations:</strong><br>• Zero order: <span class='equation'>[R] = [R]₀ – kt; t½ = [R]₀ / 2k</span><br>• First order: <span class='equation'>ln[R] = ln[R]₀ – kt; t½ = 0.693/k</span>",
        4: "<strong>Arrhenius Equation:</strong> <span class='equation'>k = A e⁻ᴱᵃ/ᴿᵀ</span>. A graph of ln k vs 1/T is a straight line with slope –Ea/R.",
        5: "<strong>Collision Theory:</strong> <span class='equation'>Rate = Z_AB P e⁻ᴱᵃ/ᴿᵀ</span>, where Z_AB is collision frequency and P is the steric factor."
    },
    fix: {
        title: "Fixing Misconceptions",
        1: "Order is not taken from stoichiometric coefficients; it must be found experimentally from rate data.",
        2: "Molecularity applies only to a single elementary step and is always a whole number (1, 2 or 3); it is not defined for overall complex reactions.",
        3: "Half-life is not always constant. It depends on [R]₀ for zero-order and second-order reactions, but is constant for first-order reactions.",
        4: "Catalysts do not increase temperature; they lower activation energy and provide an alternate pathway, without changing ΔG or the equilibrium constant.",
        5: "Not all collisions lead to products; only properly oriented collisions with energy ≥ Ea are effective and contribute to the rate."
    }
  };

  // --- SCENE DEFINITIONS ---
  const SCENES = {
    1: { name: "Measuring Reaction Rate", svg: `<canvas id="scene-canvas-1"></canvas>` },
    2: { name: "Rate Law, Order & Molecularity", svg: `<canvas id="scene-canvas-2"></canvas>` },
    3: { name: "Integrated Rate Laws & Half-Life", svg: `<div id="scene-3-graphs" class="dual-view" style="display:flex; width:100%; height:100%; gap:10px;"></div>` },
    4: { name: "Temperature, Arrhenius Plot & Catalyst", svg: `<div class="dual-view" style="display:flex; width:100%; height:100%; gap:10px;"><div id="scene-4-pe-diagram" class="half-panel" style="flex:1;position:relative;"><canvas></canvas></div><div id="scene-4-arrhenius-plot" class="half-panel" style="flex:1;position:relative;"><canvas></canvas></div></div>` },
    5: { name: "Collision Theory & Reaction Mechanism", svg: `<canvas id="scene-canvas-5"></canvas><div id="s5-counters" style="position:absolute; top:10px; right:10px; background:rgba(0,0,0,0.5); color:white; padding:5px; border-radius:5px; font-size:0.8em;"></div>` }
  };

  // --- APPLICATION STATE ---
  const state = {
    scene: 1,
    temp: 30,      // in Celsius
    order: 1,
    catalyst: 0,   // 0-5 strength
    concentrationA: 1.0, // mol·L⁻¹
    concentrationB: 1.0, // mol·L⁻¹
    orientationFactor: 0.5,
    reactionType: 'unimolecular',
    running: false,
    simTime: 0,
    k: 0, rate: 0, halfLife: 0,
    initialConcentration: 1.0,
    concentrationHistory: []
  };

  let animFrame;
  let particles = [];
  let collisionCounters = { total: 0, effective: 0 };

  // --- DOM ELEMENT REFERENCES ---
   const els = {
    stage: document.getElementById('scene-stage'),
    tabContent: document.getElementById('tab-content'),
    chillBadge: document.getElementById('chill-badge'),
    guideContent: document.getElementById('guide-content'),
    inpTemp: document.getElementById('inp-temp'),
    valTemp: document.getElementById('val-temp'),
    inpHumidity: document.getElementById('inp-humidity'),
    inpWind: document.getElementById('inp-wind'),
    valWind: document.getElementById('val-wind'),
    inpArea: document.getElementById('inp-area'),
    valArea: document.getElementById('val-area'),
    inpLiquid: document.getElementById('inp-liquid'),
    outEvap: document.getElementById('out-evap'),
    outCool: document.getElementById('out-cool'),
    btnRun: document.getElementById('btn-run'),
    btnPause: document.getElementById('btn-pause'),
    btnReset: document.getElementById('btn-reset'),
    lblArea: document.querySelector('.lbl-area'),
    lblWind: document.querySelector('.lbl-wind'),
  };

  // --- CORE SIMULATION LOGIC ---
  function calculateKinetics() {
    const T_K = state.temp + 273.15;
    // Note: Catalyst slider is repurposed in Scene 5, so Ea_eff is intentionally not used there.
    const Ea_eff = CONFIG.DEFAULT_Ea - (state.catalyst * 1000);

    if (state.scene === 5) {
        // Use Collision Theory model for Scene 5
        const Z0 = 1e10; // Base collision frequency factor from prompt
        const T_ref = 298.15; // Standard temp for scaling
        const Z = Z0 * Math.sqrt(T_K / T_ref) * state.concentrationA;
        const P = state.orientationFactor;
        const arrheniusFactor = Math.exp(-CONFIG.DEFAULT_Ea / (CONFIG.R * T_K)); // Use default Ea
        state.rate = Z * P * arrheniusFactor;

        // Derive a pseudo-k for display consistency
        state.k = state.concentrationA > 0 ? state.rate / state.concentrationA : 0;
        state.halfLife = state.k > 0 ? 0.693 / state.k : Infinity;

    } else {
        // Use standard Arrhenius-based rate law for all other scenes
        state.k = CONFIG.DEFAULT_A * Math.exp(-Ea_eff / (CONFIG.R * T_K));

        let conc = state.concentrationA;
        if(!state.running) { // For pre-rendering and static display
            conc = state.initialConcentration;
        }

        switch(String(state.order)) {
            case '0': state.rate = state.k; break;
            case '0.5': state.rate = conc > 0 ? state.k * Math.sqrt(conc) : 0; break;
            case '1': state.rate = state.k * conc; break;
            case '2': state.rate = state.k * Math.pow(conc, 2); break;
            default: state.rate = 0;
        }
        if (state.reactionType === 'bimolecular') {
            state.rate = state.k * state.concentrationA * state.concentrationB;
        }

        if (state.k > 0) {
            switch(String(state.order)) {
                case '0': state.halfLife = state.initialConcentration / (2 * state.k); break;
                case '1': state.halfLife = 0.693 / state.k; break;
                case '2': state.halfLife = state.initialConcentration > 0 ? 1 / (state.k * state.initialConcentration) : Infinity; break;
                default: state.halfLife = Infinity;
            }
        } else {
            state.halfLife = Infinity;
        }
    }
  }

  // --- UI UPDATE LOGIC ---
  function updateUI() {
    els.valTemp.innerText = state.temp;
    els.valArea.innerText = state.initialConcentration.toFixed(2);

    if (state.scene === 2 && state.reactionType === 'bimolecular') {
        els.lblArea.innerHTML = `[A]₀ (<span id="val-area">${state.concentrationA.toFixed(2)}</span> mol·L⁻¹)`;
        els.lblWind.innerHTML = `[B]₀ (<span id="val-wind">${state.concentrationB.toFixed(2)}</span> mol·L⁻¹)`;
        els.valWind.innerText = state.concentrationB.toFixed(2);
    } else if (state.scene === 5) {
        els.lblWind.innerHTML = `Orientation Factor P (<span id="val-wind">${state.orientationFactor.toFixed(2)}</span>)`;
        els.valWind.innerText = state.orientationFactor.toFixed(2);
    } else {
        els.lblArea.innerHTML = `Initial [R]₀ (<span id="val-area">${state.initialConcentration.toFixed(2)}</span> mol·L⁻¹)`;
        els.lblWind.innerHTML = `Catalyst Strength (<span id="val-wind">${state.catalyst}</span>)`;
        els.valWind.innerText = state.catalyst;
    }

    els.outEvap.innerText = state.rate > 0 ? state.rate.toExponential(2) : '0.00';
    els.outCool.innerText = `k=${state.k.toExponential(2)} | t½=${state.halfLife.toFixed(1)}s`;

    const drawingFunction = window[`drawScene${state.scene}`];
    if (typeof drawingFunction === 'function') {
        drawingFunction();
    }
  }

  // --- SCENE RENDERING & MANAGEMENT ---
  function renderScene() {
    els.stage.innerHTML = SCENES[state.scene].svg;

    const guides = BLOOM_GUIDES[state.scene] || [];
     els.guideContent.innerHTML = `<ul class="guide-list">
      ${guides.map(g => `<li class="guide-item bloom-${g.level.toLowerCase()}" data-level="${g.level.toLowerCase()}">
          <strong class="bloom-tag ${g.level.toLowerCase()}">${g.tag}</strong>
          <span class="guide-text">${g.text}</span>
      </li>`).join('')}
    </ul>`;

    // Add click listener for the 'experiment' challenge
    const experimentChallenge = els.guideContent.querySelector('.guide-item[data-level="experiment"]');
    if (experimentChallenge) {
        experimentChallenge.addEventListener('click', () => handleExperimentClick(state.scene));
    }

    if (state.scene === 2 && state.reactionType === 'bimolecular') {
        Object.assign(els.inpWind, { min: 0.05, max: 2.0, step: 0.05, value: state.concentrationB });
    } else if (state.scene === 5) {
        Object.assign(els.inpWind, { min: 0.01, max: 1.0, step: 0.01, value: state.orientationFactor });
    } else {
        Object.assign(els.inpWind, { min: 0, max: 5, step: 1, value: state.catalyst });
    }

    resetSimulation();
  }

  function updateTabs() {
    const activeTab = document.querySelector('.tabs .tab-btn.active').dataset.tab;
    const contentData = MST_CONTENT[activeTab];
    if (!contentData) return;

    const sceneContent = contentData[state.scene] || "Select a scene to see content.";
    let content = `<h4>${contentData.title}</h4><ul><li>${sceneContent}</li></ul>`;

    if (state.scene === 2 && activeTab === 'model') {
       content += generateRateTable();
    }
    els.tabContent.innerHTML = content;
  }

   function generateRateTable() {
      let table = `<br><strong>Sample Data:</strong><table id="s2-rate-table" style="width:100%; text-align:center;"><thead><tr><th>[R] (mol·L⁻¹)</th><th>Rate (mol·L⁻¹·s⁻¹)</th></tr></thead><tbody>`;
      for (let i = 1; i <= 4; i++) {
          const conc = (state.initialConcentration * i / 2);
          let rate;
           switch(state.order) {
                case 0: rate = state.k; break;
                case 0.5: rate = state.k * Math.sqrt(conc); break;
                case 1: rate = state.k * conc; break;
                case 2: rate = state.k * Math.pow(conc, 2); break;
                default: rate = 0;
            }
          table += `<tr><td>${conc.toFixed(2)}</td><td>${rate.toExponential(2)}</td></tr>`;
      }
      table += '</tbody></table>';
      return table;
  }

  // --- ANIMATION & SIMULATION CONTROL ---
  function highlightControl(el) {
      el.classList.add('control-highlight');
      setTimeout(() => el.classList.remove('control-highlight'), 700);
  }

  function handleExperimentClick(scene) {
    switch (scene) {
        case 1:
            // "Find a temperature that makes the initial rate for a first-order reaction..."
            state.order = 1;
            els.inpHumidity.value = '1';
            highlightControl(els.inpHumidity);
            resetSimulation();
            break;
        case 2:
            // "Using the bimolecular reaction, set the order for [A] to 1 and [B] to 1..."
            state.reactionType = 'bimolecular';
            state.order = 2; // Overall order
            els.inpLiquid.value = 'bimolecular';
            els.inpHumidity.value = '2'; // Sync UI dropdown
            highlightControl(els.inpLiquid);
            highlightControl(els.inpHumidity);
            renderScene(); // Rerender scene for bimolecular setup
            break;
        case 3:
            // "Adjust temperature to get a first-order half-life of exactly 10 seconds."
            state.order = 1;
            els.inpHumidity.value = '1';
            highlightControl(els.inpHumidity);
            resetSimulation();
            break;
        case 4:
            // "Using the sliders for concentration and temperature, design two different sets..."
            // No specific setup needed, just reset to a clean state.
            resetSimulation();
            break;
        case 5:
            // "Set a low 'Orientation Factor'..."
            state.orientationFactor = 0.1;
            els.inpWind.value = '0.1';
            highlightControl(els.inpWind);
            resetSimulation();
            break;
    }
  }

  function resetSimulation() {
    state.running = false;
    state.simTime = 0;
    state.concentrationA = state.initialConcentration;
    state.concentrationHistory = []; // Clear history for pre-rendering
    els.btnRun.disabled = false;
    els.btnPause.disabled = true;
    els.chillBadge.hidden = true;
    if (animFrame) cancelAnimationFrame(animFrame);
    calculateKinetics();
    if(state.scene === 1) preRenderScene1();
    updateUI();
  }

  function animLoop() {
    if (!state.running) {
        if(state.scene === 5) {
             window.drawScene5();
             animFrame = requestAnimationFrame(animLoop);
        }
        return;
    }

    state.simTime += 0.1;
    const t = state.simTime, R0 = state.initialConcentration, k = state.k;
    let currentConc;

    switch(state.order) {
        case 0: currentConc = R0 - k * t; break;
        case 1: currentConc = R0 * Math.exp(-k * t); break;
        case 2: currentConc = 1 / (1/R0 + k * t); break;
        case 0.5: {
            const lastConc = state.concentrationA > 0 ? state.concentrationA : R0;
            currentConc = lastConc - k * Math.sqrt(lastConc) * 0.1;
            break;
        }
        default: currentConc = state.concentrationA;
    }
    state.concentrationA = Math.max(0, currentConc);
    state.concentrationHistory.push({time: state.simTime, conc: state.concentrationA});

    if (state.concentrationA <= 0.001) {
        state.running = false;
        els.btnRun.disabled = true;
        els.btnPause.disabled = true;
        els.chillBadge.hidden = false;
    }

    calculateKinetics();
    updateUI();
    animFrame = requestAnimationFrame(animLoop);
  }

  // --- CANVAS DRAWING HELPERS ---
  function setupCanvas(canvasId, xLabel, yLabel) {
    let canvas = document.getElementById(canvasId);
    if (canvas && canvas.tagName !== 'CANVAS') {
      canvas = canvas.querySelector('canvas');
    }
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const theme = document.documentElement.dataset.theme || 'light';
    const themeColors = CONFIG.colors[theme];

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = canvas.width - margin.left - margin.right;
    const height = canvas.height - margin.top - margin.bottom;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = themeColors.text;
    ctx.strokeStyle = themeColors.grid;

    if(xLabel || yLabel) {
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top);
        ctx.lineTo(margin.left, margin.top + height);
        ctx.lineTo(margin.left + width, margin.top + height);
        ctx.stroke();

        ctx.font = '12px Poppins';
        ctx.textAlign = 'center';
        if(xLabel) ctx.fillText(xLabel, margin.left + width / 2, canvas.height - 10);
        ctx.save();
        ctx.rotate(-Math.PI / 2);
        if(yLabel) ctx.fillText(yLabel, -canvas.height / 2, margin.left - 30);
        ctx.restore();
    }
    return { ctx, width, height, margin, themeColors };
  }

  // --- SCENE-SPECIFIC DRAWING FUNCTIONS ---
  function preRenderScene1() {
      const xMax = state.halfLife > 0.1 && isFinite(state.halfLife) ? Math.max(30, 2.5 * state.halfLife) : 30;
      state.concentrationHistory = [];
      for (let t = 0; t <= xMax; t+= 0.2) {
           let conc;
           const R0 = state.initialConcentration, k = state.k;
           switch(state.order) {
               case 0: conc = R0 - k * t; break;
               case 1: conc = R0 * Math.exp(-k * t); break;
               case 2: conc = 1 / (1/R0 + k * t); break;
               case 0.5: conc = Math.pow(Math.sqrt(R0) - 0.5 * k * t, 2); break; // Integrated form
               default: conc = R0;
           }
           state.concentrationHistory.push({time: t, conc: Math.max(0,conc)});
           if (conc <= 0) break;
      }
  }

  window.drawScene1 = function() {
    const graph = setupCanvas('scene-canvas-1', 'Time (s)', '[R] (mol/L)');
    if (!graph) return;
    const { ctx, width, height, margin } = graph;

    const xMax = state.halfLife > 0.1 && isFinite(state.halfLife) ? Math.max(30, 2.5 * state.halfLife) : 30;
    const yMax = state.initialConcentration;

    ctx.beginPath();
    state.concentrationHistory.forEach((point, i) => {
        const x = margin.left + (point.time / xMax) * width;
        const y = margin.top + height - (point.conc / yMax) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = CONFIG.colors.reactant;
    ctx.lineWidth = 2;
    ctx.stroke();

    if (state.concentrationHistory.length > 5) {
        const p1_idx = Math.floor(state.concentrationHistory.length / 4);
        const p2_idx = Math.floor(state.concentrationHistory.length * 3 / 4);
        const p1 = state.concentrationHistory[p1_idx];
        const p2 = state.concentrationHistory[p2_idx];

        const p1_x = margin.left + (p1.time / xMax) * width;
        const p1_y = margin.top + height - (p1.conc / yMax) * height;
        const p2_x = margin.left + (p2.time / xMax) * width;
        const p2_y = margin.top + height - (p2.conc / yMax) * height;

        ctx.strokeStyle = 'rgba(255, 255, 0, 0.7)';
        ctx.beginPath();
        ctx.moveTo(p1_x, p1_y);
        ctx.lineTo(p2_x, p2_y);
        ctx.stroke();

        let inst_rate;
        switch(state.order) {
            case 0: inst_rate = state.k; break;
            case 0.5: inst_rate = state.k * Math.sqrt(p1.conc); break;
            case 1: inst_rate = state.k * p1.conc; break;
            case 2: inst_rate = state.k * Math.pow(p1.conc, 2); break;
            default: inst_rate = 0;
        }
        const slope = -inst_rate / (yMax / height) * (xMax / width);
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.moveTo(p1_x - 40, p1_y - 40 * slope);
        ctx.lineTo(p1_x + 40, p1_y + 40 * slope);
        ctx.stroke();
    }
  };

  window.drawScene2 = function() {
    const graph = setupCanvas('scene-canvas-2', '[R] (mol/L)', 'Rate (mol·L⁻¹·s⁻¹)');
    if (!graph) return;
    const { ctx, width, height, margin } = graph;

    const xMax = state.initialConcentration * 1.5;
    let yMax = 1;

    const points = Array.from({length:101}, (_,i) => {
        const conc = (i/100) * xMax;
        let rate;
        switch(state.order) {
            case 0: rate = state.k; break;
            case 0.5: rate = state.k * Math.sqrt(conc); break;
            case 1: rate = state.k * conc; break;
            case 2: rate = state.k * Math.pow(conc, 2); break;
            default: rate = 0;
        }
        return {conc, rate};
    });

    yMax = Math.max(...points.map(p => p.rate), 0.01);

    ctx.beginPath();
    points.forEach((p, i) => {
        const x = margin.left + (p.conc / xMax) * width;
        const y = margin.top + height - (p.rate / yMax) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = CONFIG.colors.product;
    ctx.stroke();
  };

  window.drawScene3 = function() {
      const container = document.getElementById('scene-3-graphs');
      container.innerHTML = `<canvas id="s3-c1"></canvas><canvas id="s3-c2"></canvas><canvas id="s3-c3"></canvas>`;

      const plotTypes = [
          { key: 'conc', title: '[R] vs t' },
          { key: 'ln', title: 'ln[R] vs t' },
          { key: 'inv', title: '1/[R] vs t' }
      ];

      const xMax = state.halfLife > 0.1 && isFinite(state.halfLife) ? Math.max(30, 2.5 * state.halfLife) : 30;
      const timePoints = Array.from({length: 51}, (_, i) => (i/50) * xMax);

      plotTypes.forEach((type, i) => {
          const graph = setupCanvas(`s3-c${i+1}`, 'Time (s)', type.title);
          if(!graph) return;
          const { ctx, width, height, margin } = graph;

          const R0 = state.initialConcentration;
          const k = state.k;

          const points = timePoints.map(t => {
              const conc = (state.order === 0) ? R0 - k*t : (state.order === 1) ? R0 * Math.exp(-k*t) : 1 / (1/R0 + k*t);
              if (conc <= 0) return null;
              if (type.key === 'ln') return Math.log(conc);
              if (type.key === 'inv') return 1/conc;
              return conc;
          }).filter(p => p !== null);

          if (points.length === 0) return;
          const yMax = Math.max(...points);
          const yMin = Math.min(...points);

          ctx.beginPath();
          points.forEach((p, j) => {
              const x = margin.left + (timePoints[j] / xMax) * width;
              const y = margin.top + height - ((p - yMin) / (yMax - yMin)) * height;
              if (j === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
          });
          ctx.strokeStyle = CONFIG.colors.catalyst;
          ctx.stroke();
      });
  };

  window.drawScene4 = function() {
    const pe = setupCanvas('scene-4-pe-diagram', 'Reaction Coordinate', 'PE');
    if (pe) {
        const { ctx, width, height, margin } = pe;
        const drawCurve = (Ea, color) => {
            ctx.beginPath();
            ctx.moveTo(margin.left, margin.top + height * 0.8);
            ctx.bezierCurveTo(
                margin.left + width * 0.3, margin.top + height * 0.8 - Ea,
                margin.left + width * 0.7, margin.top + height * 0.8 - Ea,
                margin.left + width, margin.top + height * 0.4
            );
            ctx.strokeStyle = color;
            ctx.stroke();
        };
        drawCurve(height * 0.6, CONFIG.colors.reactant);
        if (state.catalyst > 0) {
            const Ea_eff_h = height * 0.6 * ( (CONFIG.DEFAULT_Ea - state.catalyst * 1000) / CONFIG.DEFAULT_Ea);
            drawCurve(Ea_eff_h, CONFIG.colors.catalyst);
        }
    }
    const arr = setupCanvas('scene-4-arrhenius-plot', '1/T (K⁻¹)', 'ln(k)');
    if (arr) {
        const { ctx, width, height, margin } = arr;
        const temps = [280, 290, 300, 310, 320, 330, 340, 350];
        const points = temps.map(T => {
            const k = CONFIG.DEFAULT_A * Math.exp(-CONFIG.DEFAULT_Ea / (CONFIG.R * T));
            return { x: 1/T, y: Math.log(k) };
        });
        const xMin = Math.min(...points.map(p => p.x)), xMax = Math.max(...points.map(p => p.x));
        const yMin = Math.min(...points.map(p => p.y)), yMax = Math.max(...points.map(p => p.y));

        ctx.beginPath();
        points.forEach((p, i) => {
           const x = margin.left + width - (((p.x - xMin) / (xMax - xMin)) * width);
           const y = margin.top + height - (((p.y - yMin) / (yMax - yMin)) * height);
           if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
           ctx.fillRect(x-2, y-2, 4, 4);
        });
        ctx.strokeStyle = CONFIG.colors.product;
        ctx.stroke();
    }
  };

  window.drawScene5 = function() {
    const graph = setupCanvas('scene-canvas-5', null, null);
    if (!graph) return;
    const { ctx, width, height, margin } = graph;

    if (particles.length === 0) {
        const numParticles = Math.floor(state.initialConcentration * 40);
        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * width + margin.left,
                y: Math.random() * height + margin.top,
                vx: (Math.random() - 0.5) * (state.temp / 10),
                vy: (Math.random() - 0.5) * (state.temp / 10),
                radius: 4,
                type: 'reactant'
            });
        }
        collisionCounters = { total: 0, effective: 0 };
    }

    particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < margin.left || p.x > width + margin.left) { p.x = Math.max(margin.left, Math.min(p.x, width+margin.left)); p.vx *= -1; }
        if (p.y < margin.top || p.y > height + margin.top) { p.y = Math.max(margin.top, Math.min(p.y, height+margin.top)); p.vy *= -1; }

        for (let j = i + 1; j < particles.length; j++) {
            const other = particles[j];
            const dist = Math.hypot(p.x - other.x, p.y - other.y);
            if (dist < p.radius + other.radius && p.type === 'reactant' && other.type === 'reactant') {
                collisionCounters.total++;
                const kineticEnergy = 0.5 * (p.vx**2 + p.vy**2 + other.vx**2 + other.vy**2);
                const effectiveEa = (CONFIG.DEFAULT_Ea / CONFIG.R) / 1000;
                if (kineticEnergy > effectiveEa && Math.random() < state.orientationFactor) {
                    collisionCounters.effective++;
                    p.type = other.type = 'product';
                }
            }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fillStyle = p.type === 'reactant' ? CONFIG.colors.reactant : CONFIG.colors.product;
        ctx.fill();
    });

    document.getElementById('s5-counters').innerHTML = `
      <span>Total Collisions: ${collisionCounters.total}</span> |
      <span>Effective Collisions: ${collisionCounters.effective}</span>`;
  };

  // --- INITIALIZATION ---
  function init() {
    els.inpTemp.addEventListener('input', e => { state.temp = parseFloat(e.target.value); if(!state.running) resetSimulation(); });
    els.inpHumidity.addEventListener('change', e => { state.order = parseFloat(e.target.value); resetSimulation(); });
    els.inpLiquid.addEventListener('change', e => { state.reactionType = e.target.value; renderScene(); });
    els.inpArea.addEventListener('input', e => {
        state.initialConcentration = parseFloat(e.target.value);
        if(!state.running) {
             state.concentrationA = state.initialConcentration;
             resetSimulation();
        }
    });
    els.inpWind.addEventListener('input', e => {
        const val = parseFloat(e.target.value);
        if (state.scene === 2 && state.reactionType === 'bimolecular') state.concentrationB = val;
        else if (state.scene === 5) state.orientationFactor = val;
        else state.catalyst = parseInt(val);
        if(!state.running) resetSimulation();
    });

    els.btnRun.addEventListener('click', () => {
      if (!state.running) {
        if (state.simTime <= 0.01) {
            state.concentrationA = state.initialConcentration;
            state.concentrationHistory = [{time: 0, conc: state.concentrationA}];
        }
        state.running = true;
        els.btnRun.disabled = true; els.btnPause.disabled = false;
        els.chillBadge.hidden = true;
        if(state.scene === 5) particles = [];
        animFrame = requestAnimationFrame(animLoop);
      }
    });
    els.btnPause.addEventListener('click', () => { state.running = false; els.btnRun.disabled = false; els.btnPause.disabled = true; });
    els.btnReset.addEventListener('click', renderScene);

    document.querySelectorAll('.scene-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const target = e.target.closest('.scene-btn');
        document.querySelector('.scene-btn.active').classList.remove('active');
        target.classList.add('active');
        state.scene = parseInt(target.dataset.scene);
        if(state.scene === 5) animFrame = requestAnimationFrame(animLoop);
        renderScene();
        updateTabs();
      });
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        document.querySelector('.tab-btn.active').classList.remove('active');
        e.target.classList.add('active');
        updateTabs();
      });
    });

    renderScene();
    updateTabs();
  }

  init();
})();
