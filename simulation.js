// simulation.js
(function() {
  // --- DOM Element References ---
  const canvas = document.getElementById('micro-view-canvas');
  const ctx = canvas.getContext('2d');
  const moduleTabs = document.getElementById('module-tabs');
  const mstTabs = document.getElementById('mst-tabs');
  const mstContentArea = document.getElementById('mst-content-area');
  const labChallengesContainer = document.getElementById('lab-challenges');

  // Sliders and controls
  const sliders = [
    { block: document.getElementById('slider-1-block'), input: document.getElementById('inp-slider-1'), value: document.getElementById('slider-1-value'), label: document.querySelector('#slider-1-block label') },
    { block: document.getElementById('slider-2-block'), input: document.getElementById('inp-slider-2'), value: document.getElementById('slider-2-value'), label: document.querySelector('#slider-2-block label') },
    { block: document.getElementById('slider-3-block'), input: document.getElementById('inp-slider-3'), value: document.getElementById('slider-3-value'), label: document.querySelector('#slider-3-block label') },
    { block: document.getElementById('slider-4-block'), input: document.getElementById('inp-slider-4'), value: document.getElementById('slider-4-value'), label: document.querySelector('#slider-4-block label') },
  ];
  const categorySelector = document.getElementById('category-selector');

  // --- State Management ---
  const state = {
    activeScene: 0,
    activeMstTab: 'visual',
    isRunning: false,
    animationFrameId: null,
    // Scene-specific state will be added here
  };

  // --- Main Simulation Loop ---
  function simulationLoop() {
    try {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Delegate rendering to the active scene's function
      const sceneRenderFunction = window.sceneRenderers[state.activeScene];
      if (sceneRenderFunction) {
        sceneRenderFunction(ctx, canvas);
      }

      state.animationFrameId = requestAnimationFrame(simulationLoop);
    } catch (error) {
      console.error("Error in simulation loop:", error);
      // Stop the loop on error
      if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
      }
      state.isRunning = false;
    }
  }

  // --- Scene & Content Management ---

  // --- Scene-Specific Logic ---

  // Helper function to draw an atom with a 3D effect
  function drawAtom(ctx, x, y, radius, color) {
    const gradient = ctx.createRadialGradient(x - radius * 0.2, y - radius * 0.2, radius * 0.1, x, y, radius);
    gradient.addColorStop(0, 'rgba(255,255,255,0.7)');
    gradient.addColorStop(0.9, color);
    gradient.addColorStop(1, 'rgba(0,0,0,0.3)');

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  // --- Scene 1: Dalton's Postulates ---
  const scene1State = {
    particles: []
  };

  function setupScene1() {
    // Configure controls for Scene 1
    sliders.forEach(s => s.block.style.display = 'none');
    categorySelector.parentElement.style.display = 'none';

    // Initialize particles
    scene1State.particles = [
      // Monatomic (Helium)
      { type: 'mono', x: 50, y: 50, r: 15, color: '#FFD700' },
      { type: 'mono', x: 100, y: 300, r: 15, color: '#FFD700' },
      // Diatomic (Oxygen)
      { type: 'di', x: 200, y: 80, r: 20, color: '#ADD8E6' },
      // Polyatomic (Ozone)
      { type: 'poly', subtype: 'O3', x: 300, y: 200, r: 20, color: '#ADD8E6' },
      // Polyatomic (Phosphorus)
      { type: 'poly', subtype: 'P4', x: 100, y: 150, r: 22, color: '#FFA500' },
    ];
  }

  function renderScene1(ctx, canvas) {
    // Draw particles
    scene1State.particles.forEach(p => {
      if (p.type === 'mono') {
        drawAtom(ctx, p.x, p.y, p.r, p.color);
      } else if (p.type === 'di') {
        drawAtom(ctx, p.x - p.r, p.y, p.r, p.color);
        drawAtom(ctx, p.x + p.r, p.y, p.r, p.color);
      } else if (p.type === 'poly' && p.subtype === 'O3') {
        drawAtom(ctx, p.x, p.y - p.r, p.r, p.color);
        drawAtom(ctx, p.x - p.r * 0.866, p.y + p.r * 0.5, p.r, p.color);
        drawAtom(ctx, p.x + p.r * 0.866, p.y + p.r * 0.5, p.r, p.color);
      } else if (p.type === 'poly' && p.subtype === 'P4') {
        drawAtom(ctx, p.x, p.y - p.r, p.r, p.color);
        drawAtom(ctx, p.x - p.r, p.y, p.r, p.color);
        drawAtom(ctx, p.x + p.r, p.y, p.r, p.color);
        drawAtom(ctx, p.x, p.y + p.r, p.r, p.color);
      }
    });

    // Draw infographics
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text');
    ctx.font = '14px Poppins';
    ctx.fillText("Dalton’s Postulate 1: Matter is made of tiny, indivisible atoms.", 20, canvas.height - 60);
    ctx.fillText("Dalton’s Postulate 2: Atoms of the same element are identical.", 20, canvas.height - 40);
    ctx.fillText("Dalton’s Postulate 3: Atoms combine in whole-number ratios.", 20, canvas.height - 20);
  }

  // --- Scene 2: Laws of Chemical Combination ---
  const scene2State = {
    mode: 'conservation', // 'conservation' or 'proportion'
    reactants: [],
    products: [],
    scaleTilt: 0,
    reactionProgress: 0, // 0 to 1
  };

  function setupScene2() {
    sliders.forEach(s => s.block.style.display = 'none');
    categorySelector.parentElement.style.display = 'block';
    categorySelector.innerHTML = `
      <option value="conservation">Conservation of Mass</option>
      <option value="proportion">Constant Proportion</option>
    `;
    scene2State.mode = categorySelector.value;
    resetScene2();
  }

  function resetScene2() {
    scene2State.reactionProgress = 0;
    if (scene2State.mode === 'conservation') {
      scene2State.reactants = [
        { x: -100, y: -50, r: 15, color: '#4A90E2' }, // H2
        { x: -120, y: -50, r: 15, color: '#4A90E2' },
        { x: -80, y: -20, r: 20, color: '#D0021B' }, // O2
        { x: -120, y: -20, r: 20, color: '#D0021B' },
      ];
      scene2State.products = [];
    } else { // proportion
        scene2State.reactants = [];
        scene2State.products = [];
    }
  }

  function renderScene2(ctx, canvas) {
    if (scene2State.mode === 'conservation') {
      drawBalanceScale(ctx, canvas);

      if (state.isRunning && scene2State.reactionProgress < 1) {
          scene2State.reactionProgress += 0.01;
      }

      scene2State.reactants.forEach(p => {
        const x = canvas.width / 4 + p.x;
        const y = canvas.height / 2 + p.y - 50;
        drawAtom(ctx, x, y, p.r, p.color);
      });

      const p1x = canvas.width * 3/4 + (scene2State.reactants[0].x - 20) * (1-scene2State.reactionProgress);
      const p1y = canvas.height/2 - 50 + (scene2State.reactants[0].y)*(1-scene2State.reactionProgress);
      drawAtom(ctx, p1x, p1y, 15, '#4A90E2');
      const p2x = canvas.width * 3/4 + (scene2State.reactants[1].x + 20) * (1-scene2State.reactionProgress);
      const p2y = canvas.height/2 - 50 + (scene2State.reactants[1].y)*(1-scene2State.reactionProgress);
      drawAtom(ctx, p2x, p2y, 15, '#4A90E2');
      const p3x = canvas.width * 3/4 + (scene2State.reactants[2].x) * (1-scene2State.reactionProgress);
      const p3y = canvas.height/2 - 35 + (scene2State.reactants[2].y)*(1-scene2State.reactionProgress);
      drawAtom(ctx, p3x, p3y, 20, '#D0021B');

    } else { // Constant Proportion
        drawBeaker(ctx, canvas.width/4, canvas.height/2, 80, 100, "Sample 1: Small Beaker");
        drawBeaker(ctx, canvas.width * 3/4, canvas.height/2, 120, 150, "Sample 2: Large Beaker");

        // Draw H2O molecules
        drawAtom(ctx, canvas.width/4, canvas.height/2 + 20, 10, '#D0021B');
        drawAtom(ctx, canvas.width/4 - 10, canvas.height/2 + 30, 5, '#4A90E2');
        drawAtom(ctx, canvas.width/4 + 10, canvas.height/2 + 30, 5, '#4A90E2');

        drawAtom(ctx, canvas.width * 3/4, canvas.height/2 + 40, 10, '#D0021B');
        drawAtom(ctx, canvas.width * 3/4 - 10, canvas.height/2 + 50, 5, '#4A90E2');
        drawAtom(ctx, canvas.width * 3/4 + 10, canvas.height/2 + 50, 5, '#4A90E2');

        // Pie Charts
        drawPieChart(ctx, canvas.width/4, canvas.height - 80, 40, [
            { color: '#D0021B', percent: 8/9 }, { color: '#4A90E2', percent: 1/9 }
        ], "Mass Ratio: 8:1 (O:H)");
    }
  }

  function drawBeaker(ctx, x, y, w, h, label) {
    ctx.strokeStyle = '#607D8B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - w/2, y - h/2);
    ctx.lineTo(x - w/2, y + h/2);
    ctx.lineTo(x + w/2, y + h/2);
    ctx.lineTo(x + w/2, y - h/2);
    ctx.stroke();
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text');
    ctx.fillText(label, x, y - h/2 - 10);
  }

  function drawPieChart(ctx, x, y, r, data, label) {
    let startAngle = 0;
    data.forEach(slice => {
        ctx.fillStyle = slice.color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, r, startAngle, startAngle + Math.PI * 2 * slice.percent);
        ctx.closePath();
        ctx.fill();
        startAngle += Math.PI * 2 * slice.percent;
    });
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text');
    ctx.fillText(label, x, y + r + 15);
  }

  function drawBalanceScale(ctx, canvas) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Base
    ctx.beginPath();
    ctx.moveTo(centerX - 50, centerY + 100);
    ctx.lineTo(centerX + 50, centerY + 100);
    ctx.lineTo(centerX, centerY + 70);
    ctx.closePath();
    ctx.fillStyle = '#607D8B';
    ctx.fill();

    // Beam
    ctx.strokeStyle = '#37474F';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 20);
    ctx.lineTo(centerX, centerY + 80);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX - 150, centerY);
    ctx.lineTo(centerX + 150, centerY);
    ctx.stroke();

    // Pans
    ctx.beginPath();
    ctx.arc(centerX - 150, centerY + 50, 50, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX + 150, centerY + 50, 50, 0, Math.PI);
    ctx.stroke();
  }


  // --- Scene 3: Writing Chemical Symbols, Valency & Formulae ---
  const scene3State = {
    ions: [],
    draggedIon: null,
    offsetX: 0,
    offsetY: 0,
  };

  function setupScene3() {
    sliders.forEach(s => s.block.style.display = 'none');
    categorySelector.parentElement.style.display = 'none');

    scene3State.ions = [
      { id: 'Mg', x: 50, y: 50, r: 25, color: '#8E44AD', charge: 2, hands: [{x:25, y:0}, {x:-25, y:0}]},
      { id: 'Cl1', x: 50, y: 150, r: 20, color: '#27AE60', charge: -1, hands: [{x:20, y:0}] },
      { id: 'Cl2', x: 50, y: 250, r: 20, color: '#27AE60', charge: -1, hands: [{x:20, y:0}] },
      { id: 'Al', x: 250, y: 50, r: 28, color: '#3498DB', charge: 3, hands: [{x:28, y:0}, {x:-14, y:24}, {x:-14, y:-24}] },
      { id: 'O', x: 250, y: 150, r: 22, color: '#E67E22', charge: -2, hands: [{x:22, y:0}, {x:-22, y:0}] },
    ];
    scene3State.draggedIon = null;
  }

  function renderScene3(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw workspace
    const compoundArea = { x: 150, y: 300, w: 200, h: 100 };
    ctx.strokeStyle = '#95a5a6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(compoundArea.x, compoundArea.y, compoundArea.w, compoundArea.h);
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(149, 165, 166, 0.1)";
    ctx.fillRect(compoundArea.x, compoundArea.y, compoundArea.w, compoundArea.h);


    scene3State.ions.forEach(ion => {
      drawAtom(ctx, ion.x, ion.y, ion.r, ion.color);
      // Draw valency "hands" for visualization
      ion.hands.forEach(hand => {
          ctx.beginPath();
          ctx.moveTo(ion.x, ion.y);
          ctx.lineTo(ion.x + hand.x, ion.y + hand.y);
          ctx.stroke();
      });
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 16px Poppins';
      ctx.fillText(ion.id, ion.x, ion.y);
    });

     if (scene3State.draggedIon && scene3State.draggedIon.shake) {
        scene3State.draggedIon.x += Math.sin(Date.now() * 0.5) * 2;
        if (Date.now() > scene3State.draggedIon.shake) {
            scene3State.draggedIon.shake = null;
        }
    }
  }

  function handleCanvasMouseDown(e) {
    if (state.activeScene !== 2) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let i = scene3State.ions.length - 1; i >= 0; i--) {
      const ion = scene3State.ions[i];
      const dist = Math.hypot(mouseX - ion.x, mouseY - ion.y);
      if (dist < ion.r) {
        scene3State.draggedIon = ion;
        scene3State.offsetX = mouseX - ion.x;
        scene3State.offsetY = mouseY - ion.y;
        break;
      }
    }
  }

  function handleCanvasMouseMove(e) {
    if (state.activeScene !== 2 || !scene3State.draggedIon) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    scene3State.draggedIon.x = mouseX - scene3State.offsetX;
    scene3State.draggedIon.y = mouseY - scene3State.offsetY;
  }

  function handleCanvasMouseUp() {
    if (state.activeScene !== 2 || !scene3State.draggedIon) return;

    // Check if dropped in the "compound" area
    const compoundArea = { x: 150, y: 300, w: 200, h: 100 };
    if (
        scene3State.draggedIon.x > compoundArea.x &&
        scene3State.draggedIon.x < compoundArea.x + compoundArea.w &&
        scene3State.draggedIon.y > compoundArea.y &&
        scene3State.draggedIon.y < compoundArea.y + compoundArea.h
    ) {
        scene3State.draggedIon.inWorkspace = true;
    } else {
        scene3State.draggedIon.inWorkspace = false;
    }

    let totalCharge = 0;
    scene3State.ions.forEach(ion => {
        if (ion.inWorkspace) {
            totalCharge += ion.charge;
        }
    });

    if (totalCharge === 0 && scene3State.ions.some(ion => ion.inWorkspace)) {
        console.log("Valency balanced!");
        // Add a visual effect for success
    }

    scene3State.draggedIon = null;
  }


  // --- Scene 4: Molecular Mass, Formula Mass & Mole Concept ---
  const AVOGADRO = 6.022e23;
  const substances = {
    'H2O': { name: 'Water', molarMass: 18.015 },
    'CO2': { name: 'Carbon Dioxide', molarMass: 44.01 },
    'NaCl': { name: 'Sodium Chloride', molarMass: 58.44 },
  };

  const scene4State = {
    substance: 'H2O',
    molarMass: substances['H2O'].molarMass,
    mass: 50,
    moles: 0,
    particles: 0,
  };

  function calculateMoleConcept() {
    scene4State.moles = scene4State.mass / scene4State.molarMass;
    scene4State.particles = scene4State.moles * AVOGADRO;
  }

  function setupScene4() {
    // Configure controls
    sliders[0].block.style.display = 'flex';
    sliders[0].label.textContent = 'Mass (g)';
    sliders[0].input.min = 1;
    sliders[0].input.max = 200;
    sliders[0].input.value = scene4State.mass;
    sliders[0].value.textContent = scene4State.mass;

    sliders[1].block.style.display = 'none';
    sliders[2].block.style.display = 'none';
    sliders[3].block.style.display = 'none';

    categorySelector.parentElement.style.display = 'block';
    categorySelector.innerHTML = Object.keys(substances)
        .map(key => `<option value="${key}">${substances[key].name}</option>`)
        .join('');

    calculateMoleConcept();
  }

  function renderScene4(ctx, canvas) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw particle cloud
    const numParticlesToShow = Math.min(500, Math.log10(scene4State.particles + 1) * 20);
    for (let i = 0; i < numParticlesToShow; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height - 100); // Keep particles above the triangle text
        drawAtom(ctx, x, y, 2, '#95a5a6');
    }

    // Draw triangle
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 50); // Top
    ctx.lineTo(50, canvas.height - 50); // Bottom left
    ctx.lineTo(canvas.width - 50, canvas.height - 50); // Bottom right
    ctx.closePath();
    ctx.stroke();

    // Draw labels and values
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text');
    ctx.textAlign = 'center';
    ctx.font = 'bold 16px Poppins';

    // Moles (top)
    ctx.fillText('Moles', centerX, 30);
    ctx.fillText(scene4State.moles.toFixed(2) + ' mol', centerX, 70);

    // Mass (bottom left)
    ctx.textAlign = 'left';
    ctx.fillText('Mass', 30, canvas.height - 30);
    ctx.fillText(scene4State.mass.toFixed(2) + ' g', 60, canvas.height - 70);

    // Particles (bottom right)
    ctx.textAlign = 'right';
    ctx.fillText('Particles', canvas.width - 30, canvas.height - 30);
    ctx.fillText(scene4State.particles.toExponential(2), canvas.width - 60, canvas.height - 70);
  }

  // --- Scene 5: Stoichiometry Mini Lab ---
  const scene5State = {
    h2: 2, // Moles
    cl2: 2, // Moles
    hcl: 0,
    totalMass: 0,
  };

  function calculateMassesScene5() {
      const massH2 = scene5State.h2 * 2.016;
      const massCl2 = scene5State.cl2 * 70.906;
      const massHcl = scene5State.hcl * 36.461;
      scene5State.totalMass = massH2 + massCl2 + massHcl;
  }

  function setupScene5() {
    sliders[0].block.style.display = 'flex';
    sliders[0].label.textContent = 'H₂ Moles';
    sliders[0].input.min = 0;
    sliders[0].input.max = 10;
    sliders[0].input.value = 2; // Initial value

    sliders[1].block.style.display = 'flex';
    sliders[1].label.textContent = 'Cl₂ Moles';
    sliders[1].input.min = 0;
    sliders[1].input.max = 10;
    sliders[1].input.value = 2; // Initial value

    sliders[2].block.style.display = 'none';
    sliders[3].block.style.display = 'none';
    categorySelector.parentElement.style.display = 'none';

    resetScene5();
  }

  function resetScene5() {
    scene5State.h2 = parseFloat(sliders[0].input.value);
    scene5State.cl2 = parseFloat(sliders[1].input.value);
    scene5State.hcl = 0;
    calculateMassesScene5();
  }

  function renderScene5(ctx, canvas) {
      if(state.isRunning) {
        const limitingReagent = Math.min(scene5State.h2, scene5State.cl2) * 0.01; // Slow down reaction
        if(limitingReagent > 0) {
            scene5State.h2 -= limitingReagent;
            scene5State.cl2 -= limitingReagent;
            scene5State.hcl += limitingReagent * 2;
            calculateMassesScene5();
        }
      }
      // Digital Balance Display
      const balanceY = canvas.height - 50;
      ctx.fillStyle = '#333';
      ctx.fillRect(50, balanceY, canvas.width - 100, 40);
      ctx.fillStyle = '#FFF';
      ctx.font = '20px Poppins';
      ctx.textAlign = 'center';
      ctx.fillText(`${scene5State.totalMass.toFixed(2)} g`, canvas.width/2, balanceY + 25);

      // Particle visualization
      let yPos = 50;
      // H2
      for(let i=0; i<scene5State.h2; i++) {
        drawAtom(ctx, 50 + i*20, yPos, 8, '#4A90E2');
        drawAtom(ctx, 60 + i*20, yPos, 8, '#4A90E2');
      }
      // Cl2
      yPos += 40;
      for(let i=0; i<scene5State.cl2; i++) {
        drawAtom(ctx, 50 + i*25, yPos, 12, '#27AE60');
        drawAtom(ctx, 65 + i*25, yPos, 12, '#27AE60');
      }
      // HCl
      yPos += 50;
      for(let i=0; i<scene5State.hcl; i++) {
        drawAtom(ctx, 50 + i*30, yPos, 8, '#4A90E2');
        drawAtom(ctx, 65 + i*30, yPos, 12, '#27AE60');
      }
  }


  window.sceneResets = {
    1: resetScene2,
    2: setupScene3, // setup function doubles as reset
    3: setupScene4,
    4: resetScene5,
  }

  // --- Global Scene Registry ---
  window.sceneSetups = {
    0: setupScene1,
    1: setupScene2,
    2: setupScene3,
    3: setupScene4,
    4: setupScene5,
  };
  window.sceneRenderers = {
    0: renderScene1,
    1: renderScene2,
    2: renderScene3,
    3: renderScene4,
    4: renderScene5,
  };

  function updateScene() {
    console.log(`Switching to scene ${state.activeScene}`);

    // Update active tab visuals
    document.querySelectorAll('.module-tab').forEach((tab, index) => {
      tab.classList.toggle('active', index === state.activeScene);
    });

    // Run the setup for the current scene
    const setupFunction = window.sceneSetups[state.activeScene];
    if (setupFunction) {
      setupFunction();
    }

    // Update pedagogical content
    updatePedagogy();

    // Re-render the canvas for the new scene if simulation is paused
    if (!state.isRunning) {
        const sceneRenderFunction = window.sceneRenderers[state.activeScene];
        if (sceneRenderFunction) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            sceneRenderFunction(ctx, canvas);
        }
    }
  }

  function updatePedagogy() {
    const sceneContent = pedagogicalContent[state.activeScene];
    const mstContent = sceneContent.mst[state.activeMstTab];
    const challenges = sceneContent.challenges;

    let mstHtml = `<h3>${mstContent.heading}</h3><ul>`;
    mstContent.points.forEach(p => mstHtml += `<li>${p}</li>`);
    mstHtml += `</ul>`;
    mstContentArea.innerHTML = mstHtml;

    let challengesHtml = ``;
    challenges.forEach(c => {
      challengesHtml += `
        <div class="challenge ${c.type}">
          <span class="icon">${c.icon}</span>
          <p>${c.text}</p>
        </div>
      `;
    });
    labChallengesContainer.innerHTML = challengesHtml;
  }

  const pedagogicalContent = [
    { // Scene 1: Dalton's Postulates
        mst: {
            visual: {
                heading: "What You See",
                points: [
                    "Atoms appear as tiny, distinct spheres.",
                    "Some elements exist as single atoms (monatomic, like Helium).",
                    "Other elements pair up to form diatomic molecules (like O₂).",
                    "Some form even larger polyatomic structures (like Ozone O₃ or Phosphorus P₄)."
                ]
            },
            analogy: {
                heading: "Mental Model",
                points: [
                    "An atom is like a fundamental LEGO brick.",
                    "A molecule is a specific model built from those LEGO bricks.",
                    "Different elements are like different colored LEGO bricks."
                ]
            },
            cause: {
                heading: "Why It Happens",
                points: [
                    "Matter is not continuous; it's made of discrete particles as Dalton proposed.",
                    "Atoms combine because they seek stable electron configurations, a concept Dalton's model didn't explain but is the underlying reason."
                ]
            },
            model: {
                heading: "The Rules",
                points: [
                    "All matter is composed of atoms.",
                    "Atoms of a given element are identical in mass and properties.",
                    "Atoms cannot be subdivided, created, or destroyed.",
                    "Atoms of different elements combine in simple whole-number ratios to form chemical compounds."
                ]
            },
            fix: {
                heading: "Fixing Misconceptions",
                points: [
                    "Atoms are not flat circles; they are three-dimensional spheres.",
                    "While Dalton thought atoms were indivisible, we now know they are made of protons, neutrons, and electrons.",
                    "The lines between atoms in diagrams are not physical sticks; they represent chemical bonds (forces)."
                ]
            }
        },
        challenges: [
            { type: 'observe', icon: 'OBSERVE', text: 'Notice that atoms of the same element have the same size and color, illustrating one of Dalton’s key postulates.' }
        ]
    },
    { // Scene 2: Laws of Chemical Combination
        mst: {
            visual: {
                heading: "What You See",
                points: [
                    "A balance scale stays perfectly level, showing mass is the same before and after a reaction.",
                    "Reactant particles are rearranged to form new product particles.",
                    "No matter how much water you form, the ratio of Hydrogen to Oxygen atoms is always 2:1."
                ]
            },
            analogy: {
                heading: "Mental Model",
                points: [
                    "Conservation of Mass is like shuffling a deck of cards. The number of cards doesn't change, just their order.",
                    "Constant Proportion is like a fixed recipe: A sandwich always requires two slices of bread and one slice of cheese. The ratio is constant."
                ]
            },
            cause: {
                heading: "Why It Happens",
                points: [
                    "Mass is conserved because chemical reactions only rearrange atoms; no atoms are created or destroyed.",
                    "Compounds have constant proportions because each molecule is identical. Every H₂O molecule has two H atoms and one O atom, fixing the mass ratio."
                ]
            },
            model: {
                heading: "The Rules",
                points: [
                    "<b>Law of Conservation of Mass:</b> Mass in an isolated system is neither created nor destroyed by chemical reactions.",
                    "<b>Law of Constant Proportion:</b> A given chemical compound always contains its component elements in fixed ratio (by mass)."
                ]
            },
            fix: {
                heading: "Fixing Misconceptions",
                points: [
                    "This law applies to mass, not volume or moles. The volume can change during a reaction.",
                    "Constant proportion does not apply to mixtures. Saltwater can have any ratio of salt to water."
                ]
            }
        },
        challenges: [
            { type: 'observe', icon: 'OBSERVE', text: 'Watch how reactant particles rearrange into product particles while the total mass bar stays unchanged, proving mass conservation.' },
            { type: 'compare', icon: 'COMPARE', text: 'Compare samples of copper oxide formed under different conditions and verify that the Cu:O mass ratio remains constant.' }
        ]
    },
     { // Scene 3: Symbols & Formulae
        mst: {
            visual: {
                heading: "What You See",
                points: [
                    "Valency 'blocks' or 'hands' represent the combining power of an atom.",
                    "Positive and negative ions snap together when their valencies balance.",
                    "A correct chemical formula lights up when the charge is neutral (e.g., Mg²⁺ and two Cl⁻ make MgCl₂)."
                ]
            },
            analogy: {
                heading: "Mental Model",
                points: [
                    "Valency is the number of 'hands' an atom has to bond with others.",
                    "Writing a formula is like solving a puzzle: the pieces must fit perfectly with no gaps.",
                    "Ions are like people wanting to hold hands to form a stable group."
                ]
            },
            cause: {
                heading: "Why It Happens",
                points: [
                    "Valency arises from an atom's need to achieve a stable electron configuration, usually by gaining, losing, or sharing electrons.",
                    "Compounds form when the total positive charge from cations equals the total negative charge from anions, resulting in a neutral entity."
                ]
            },
            model: {
                heading: "The Rules",
                points: [
                    "Write the symbols of the cation (positive ion) and anion (negative ion).",
                    "Write the valency (charge) of each ion.",
                    "Use the 'cross-multiplication' method: the numerical value of the charge on each ion becomes the subscript of the other.",
                    "Simplify the ratio of subscripts if possible."
                ]
            },
            fix: {
                heading: "Fixing Misconceptions",
                points: [
                    "Valency is not a subscript; it is the rule that determines the subscript.",
                    "O is an atom; O₂ is a molecule. Na is an atom; Na⁺ is an ion. The symbol tells you what it is.",
                    "The subscript '1' is never written (e.g., we write NaCl, not Na₁Cl₁)."
                ]
            }
        },
        challenges: [
            { type: 'experiment', icon: 'EXPERIMENT', text: 'Use valency tiles to construct correct chemical formulae for compounds like Aluminum Oxide and Sodium Sulfate.' }
        ]
    },
    { // Scene 4: Mole Concept
        mst: {
            visual: {
                heading: "What You See",
                points: [
                    "A triangle shows the direct relationships between mass, moles, and the number of particles.",
                    "As you increase the mass of a substance on the slider, the cloud of particles becomes denser.",
                    "A 'mole' is represented as a huge collection of particles (6.022 x 10²³)."
                ]
            },
            analogy: {
                heading: "Mental Model",
                points: [
                    "A mole is just a number, like 'a dozen' means 12.",
                    "A chemist's dozen is the mole: 6.022 x 10²³.",
                    "Molar mass is like the 'weight of one dozen' of a particular item. A dozen elephants weighs more than a dozen ants."
                ]
            },
            cause: {
                heading: "Why It Happens",
                points: [
                    "Atoms are too tiny and numerous to count individually, so we need a unit (the mole) to group them into a manageable number.",
                    "The mole connects the microscopic world (atomic mass units) to the macroscopic world (grams)."
                ]
            },
            model: {
                heading: "The Rules",
                points: [
                    "<span class='equation-row'><span class='math-var'>1 mol</span> = <span class='math-var'>6.022×10²³</span> particles</span>",
                    "<span class='equation-row'><span class='math-var mv-rate'>n</span> = <span class='math-var'>m</span> / <span class='math-var'>M</span> (moles = mass / molar mass)</span>",
                    "<span class='equation-row'>Particles = <span class='math-var mv-rate'>n</span> × <span class='math-var'>Nₐ</span></span>"
                ]
            },
            fix: {
                heading: "Fixing Misconceptions",
                points: [
                    "A mole is a count, not a mass. One mole of hydrogen has a different mass than one mole of oxygen.",
                    "Molecular mass is the mass of one molecule (in amu), while molar mass is the mass of one mole of that substance (in g/mol)."
                ]
            }
        },
        challenges: [
            { type: 'analyze', icon: 'ANALYZE', text: 'Given a mass of any compound, calculate moles → number of molecules → number of atoms, documenting each step.' }
        ]
    },
    { // Scene 5: Stoichiometry Lab
        mst: {
            visual: {
                heading: "What You See",
                points: [
                    "Colored reactant spheres combine in fixed ratios to form product molecules.",
                    "If you add too much of one reactant, the extra particles are left over and do not react.",
                    "The digital balance shows that the total mass before the reaction is exactly equal to the total mass after."
                ]
            },
            analogy: {
                heading: "Mental Model",
                points: [
                    "A chemical equation is a recipe. H₂ + Cl₂ → 2HCl means '1 molecule of H₂ and 1 molecule of Cl₂ makes 2 molecules of HCl.'",
                    "The limiting reagent is the ingredient you run out of first when making sandwiches. If you have 10 bread slices but only 3 cheese slices, you can only make 3 sandwiches. Cheese is the limiting reagent."
                ]
            },
            cause: {
                heading: "Why It Happens",
                points: [
                    "Reactions happen in fixed mole ratios because molecules themselves combine in fixed whole-number ratios.",
                    "A reaction stops once one of the reactants is completely used up (the limiting reagent)."
                ]
            },
            model: {
                heading: "The Rules",
                points: [
                    "A balanced chemical equation gives the mole ratio of reactants and products.",
                    "The reactant that produces the least amount of product is the limiting reagent.",
                    "Mass is always conserved, even if some reactants are left over."
                ]
            },
            fix: {
                heading: "Fixing Misconceptions",
                points: [
                    "The 'bigger' molecule (by mass) is not necessarily the one in excess.",
                    "Just because there's leftover reactant doesn't mean the law of conservation of mass is violated. The leftover mass is accounted for."
                ]
            }
        },
        challenges: [
             { type: 'challenge', icon: 'CHALLENGE', text: 'Explain why CO and CO₂ are different compounds, using both the Law of Constant Proportion and the Law of Multiple Proportions.' }
        ]
    }
  ];

  // --- Event Listeners ---
  function setupEventListeners() {
    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('mouseup', handleCanvasMouseUp);
    canvas.addEventListener('mouseleave', handleCanvasMouseUp); // Also end drag if mouse leaves canvas

    moduleTabs.addEventListener('click', (e) => {
      if (e.target.classList.contains('module-tab')) {
        const sceneIndex = parseInt(e.target.dataset.scene, 10);
        if (state.activeScene !== sceneIndex) {
          state.activeScene = sceneIndex;
          updateScene();
        }
      }
    });

    mstTabs.addEventListener('click', (e) => {
        if (e.target.classList.contains('mst-tab')) {
            state.activeMstTab = e.target.dataset.mst;
            document.querySelectorAll('.mst-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.mst === state.activeMstTab);
            });
            updatePedagogy();
        }
    });

    sliders.forEach((slider, index) => {
        slider.input.addEventListener('input', () => {
            slider.value.textContent = slider.input.value;
            if (state.activeScene === 3) {
                scene4State.mass = parseFloat(slider.input.value);
                calculateMoleConcept();
            } else if (state.activeScene === 4) {
                if(index === 0) scene5State.h2 = parseFloat(slider.input.value);
                if(index === 1) scene5State.cl2 = parseFloat(slider.input.value);
                if(!state.isRunning) setupScene5(); // Recalculate masses if paused
            }
        });
    });

    categorySelector.addEventListener('change', () => {
        if (state.activeScene === 3) {
            scene4State.substance = categorySelector.value;
            scene4State.molarMass = substances[scene4State.substance].molarMass;
            calculateMoleConcept();
        } else if (state.activeScene === 1) {
            scene2State.mode = categorySelector.value;
            resetScene2();
        }
    });

    document.getElementById('btn-run').addEventListener('click', () => {
        if (!state.isRunning) {
            state.isRunning = true;
            simulationLoop();
            console.log('Simulation started');
        }
    });

    document.getElementById('btn-pause').addEventListener('click', () => {
        if (state.isRunning) {
            state.isRunning = false;
            cancelAnimationFrame(state.animationFrameId);
            console.log('Simulation paused');
        }
    });

    document.getElementById('btn-reset').addEventListener('click', () => {
        console.log('Simulation reset for scene', state.activeScene);
        const resetFunction = window.sceneResets[state.activeScene];
        if (resetFunction) {
            resetFunction();
        }
        // Re-render the canvas for the new scene if simulation is paused
        if (!state.isRunning) {
            const sceneRenderFunction = window.sceneRenderers[state.activeScene];
            if (sceneRenderFunction) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                sceneRenderFunction(ctx, canvas);
            }
        }
    });
  }


  // --- Initialization ---
  function init() {
    console.log('Initializing simulation...');
    setupEventListeners();
    updateScene(); // Set up the initial scene

    // Start paused
    const sceneRenderFunction = window.sceneRenderers[state.activeScene] || (() => {});
    sceneRenderFunction(ctx, canvas);
  }

  // The script is loaded dynamically, so we run init directly.
  init();

})();
