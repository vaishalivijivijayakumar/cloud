// simulation.js
// Lesson: Atoms & Molecules (NCERT Class 9, Chapter 3)
// Model 4: Full Multi-Scene Concept Engine

(function() {
'use strict';

// --- CONFIGURATION & CONSTANTS ---
const CONFIG = {
colors: {
reactant: '#ff6b6b',
product: '#48dbfb',
helper: '#feca57',
text: '#E2E8F0',
grid: '#4A5568'
}
};

// --- PEDAGOGICAL CONTENT (MST & LAB CHALLENGES) ---
const BLOOM_GUIDES = {
1: [
{ level: 'remember', tag: 'Observe', text: 'Observe the ignition tube in open and closed conditions and note how the total mass reading changes or stays the same before and after the reaction.' },
{ level: 'understand', tag: 'Compare', text: 'Compare the mass readings for the open system and the closed system and decide in which case the law of conservation of mass clearly holds.' },
{ level: 'apply', tag: 'Experiment', text: 'Adjust the amounts of reactant solutions X and Y and predict whether the total mass after reaction will still match the total mass before reaction in the closed system.' },
{ level: 'analyze', tag: 'Analyze', text: 'Explain why the cork and closed ignition tube are essential to demonstrate that mass is neither created nor destroyed during a chemical reaction.' },
{ level: 'evaluate', tag: 'Challenge', text: 'A student observes a small decrease in mass after heating a mixture in an open beaker. Use the simulation to argue whether this violates the law of conservation of mass.' }
],
2: [
{ level: 'remember', tag: 'Observe', text: 'Observe how different samples of water still show the same H:O mass ratio, even when the total mass of the sample changes.' },
{ level: 'understand', tag: 'Compare', text: 'Compare the mass ratios for water and ammonia and explain how each compound has its own fixed ratio by mass.' },
{ level: 'apply', tag: 'Experiment', text: 'Change the amount of hydrogen or oxygen and see when a pure sample of water can form and when an element is left over as excess.' },
{ level: 'analyze', tag: 'Analyze', text: 'Use the mass-ratio data in the table to justify that compounds have a definite proportion by mass, even if prepared in different ways.' },
{ level: 'evaluate', tag: 'Challenge', text: 'Given two samples that claim to be the same compound, use the simulated mass ratios to decide whether both are truly the same substance.' }
],
3: [
{ level: 'remember', tag: 'Observe', text: 'Zoom in on a piece of matter and observe how it can be represented as a collection of extremely small atoms, each with its own symbol.' },
{ level: 'understand', tag: 'Compare', text: 'Compare modern symbols such as H, He, Na and Cl and distinguish between correct use of capital and small letters versus incorrect forms.' },
{ level: 'apply', tag: 'Experiment', text: 'Build simple collections of atoms and label them using the NCERT symbols and approximate atomic masses from the periodic table.' },
{ level: 'analyze', tag: 'Analyze', text: 'Explain why chemists use relative atomic mass based on the carbon-12 standard instead of measuring atomic masses directly in grams.' },
{ level: 'evaluate', tag: 'Challenge', text: 'Decide whether a given symbol is valid or invalid (for example, NA vs Na) and justify your reasoning using the symbol rules.' }
],
4: [
{ level: 'remember', tag: 'Observe', text: 'Observe how atoms join to form molecules of elements (like O₂, P₄) and molecules of compounds (like H₂O, CO₂) in the particle view.' },
{ level: 'understand', tag: 'Compare', text: 'Compare atomicity for different molecules and classify them as monoatomic, diatomic, triatomic or polyatomic using the simulation table.' },
{ level: 'apply', tag: 'Experiment', text: 'Create your own molecules on the workspace and let the simulation tell you whether it is a molecule of an element or of a compound.' },
{ level: 'analyze', tag: 'Analyze', text: 'Use the ion view to distinguish cations, anions and polyatomic ions, and explain why polyatomic ions act as a single charged unit.' },
{ level: 'evaluate', tag: 'Challenge', text: 'Given some formulas like NH₄⁺, SO₄²⁻ and NO₃⁻, argue which of them are polyatomic ions and how they behave in a compound.' }
],
5: [
{ level: 'remember', tag: 'Observe', text: 'Observe how the simulation builds chemical formulae from ions using valency and then calculates molecular or formula unit mass by adding atomic masses.' },
{ level: 'understand', tag: 'Compare', text: 'Compare molecular mass for covalent molecules with formula unit mass for ionic compounds and explain why different terms are used.' },
{ level: 'apply', tag: 'Experiment', text: 'Use the criss-cross rule in the formula builder to write correct formulas such as MgCl₂ and Ca(OH)₂ and then compute their masses.' },
{ level: 'analyze', tag: 'Analyze', text: 'Analyse how valency and charge help decide the ratio of ions in compounds like Al₂(SO₄)₃ and predict what happens if the brackets around a polyatomic ion are omitted.' },
{ level: 'evaluate', tag: 'Challenge', text: 'From a case-based mass calculation involving water or sodium chloride, decide whether the student has used atomic masses and subscripts correctly, and correct any mistakes.' }
]
};

const MST_CONTENT = {
visual: {
title: "Visual",
1: "Show the NCERT ignition-tube Activity 3.1 with solutions of X and Y inside a sealed tube on a balance to compare total mass before and after reaction, and contrast with an open system where mass can escape.",
2: "Show bar diagrams or “ratio strips” for different samples of water and ammonia to visualise constant mass ratios (H:O = 1:8 and N:H = 14:3) even when the sample size changes.",
3: "Show a zoom sequence from a visible chunk of matter down to individual atoms (~10⁻¹⁰ m) and overlay modern symbols (H, He, Na, Cl) and a small table of relative atomic masses based on 1 u = 1/12 mass of a carbon–12 atom.",
4: "Show particles combining to form molecules of elements (O₂, P₄, S₈) and molecules of compounds (H₂O, CO₂, NH₃) with labels for atomicity, plus a toggle to view cations, anions and polyatomic ions such as SO₄²⁻ and NH₄⁺.",
5: "Show a formula-building workspace where students combine ions using valency, brackets and the criss-cross rule to obtain formulas like MgCl₂, Ca(OH)₂ and Al₂(SO₄)₃, and a mass calculator that adds atomic masses to compute molecular and formula unit mass."
},
analogy: {
title: "Analogy",
1: "Like a LEGO model being taken apart and rebuilt—if no bricks are lost or added, the total number (and mass) of bricks stays the same before and after.",
2: "Like a fixed recipe for a drink—if you double both sugar and water, the taste stays the same because the ratio of ingredients is unchanged.",
3: "Like pixels on a screen or tiny tiles in a mosaic—individually too small to see, but together forming every picture and object.",
4: "A molecule is like a team of players in the same jersey (neutral group), while ions are players holding a + or – sign, which affects how they line up and pair with others.",
5: "Like working out the total cost or weight of items in a shopping basket by multiplying “cost/weight of one piece” by “number of pieces” for each type and then adding."
},
cause: {
title: "Cause",
1: "As long as a reaction is carried out in a closed system, any gas or product formed is trapped, so the total mass of reactants must equal the total mass of products; any apparent mass change usually comes from an open system or loss to surroundings.",
2: "Compounds such as water and ammonia consist of atoms in fixed whole-number ratios (H₂O has 2 H and 1 O, NH₃ has 1 N and 3 H), so the mass ratios H:O = 1:8 and N:H = 14:3 remain constant for all pure samples.",
3: "Atoms are extremely small, so chemists define 1 atomic mass unit (1 u) as 1/12 of the mass of a carbon–12 atom and express relative atomic masses by comparing different atoms to this standard.",
4: "Atoms combine to form molecules and ions according to their valency; the number of atoms in a molecule (atomicity) and the presence of charge on ions determine how these species behave in chemical reactions.",
5: "Chemical formulae encode both the kinds of atoms present and their numbers; molecular mass or formula unit mass is obtained by summing the relative atomic masses for all atoms indicated by the subscripts in the formula."
},
model: {
title: "Model",
1: "<strong>Law of Chemical Combination (Conservation of Mass):</strong> In a chemical reaction carried out in a closed container, total mass of reactants = total mass of products; atoms are rearranged but their total number is unchanged.",
2: "<strong>Law of Constant Proportions:</strong> In a chemical substance, elements are always present in definite proportions by mass, for example water always has H:O = 1:8 and ammonia always has N:H = 14:3.",
3: "<strong>Atom and Atomic Mass:</strong> An atom is the smallest particle of an element that may or may not take part independently in a reaction; 1 u is defined as 1/12 the mass of a carbon–12 atom and relative atomic mass compares the mass of an atom to this standard.",
4: "<strong>Molecules, Atomicity and Ions:</strong> A molecule is the smallest particle of a substance capable of independent existence and showing all its properties; atomicity is the number of atoms in a molecule (monoatomic, diatomic, triatomic, etc.); ions are charged species (cations and anions), including polyatomic ions like SO₄²⁻ and NH₄⁺ that behave as single units.",
5: "<strong>Chemical Formulae and Mass:</strong> Valency (combining capacity) is used to construct chemical formulae by balancing the total positive and negative charges (using the criss-cross rule and brackets for multiple polyatomic ions); molecular mass and formula unit mass are obtained by adding the relative atomic masses of all atoms present in the molecule or formula unit."
},
fix: {
title: "Fix",
1: "Atoms are not created or destroyed in ordinary chemical reactions; they are only rearranged, so the law of conservation of mass is not violated when an experiment is performed in a truly closed system.",
2: "Molecules do not always contain exactly two atoms; there are monoatomic molecules (He, Ar), diatomic molecules (O₂, N₂) and polyatomic molecules (P₄, S₈).",
3: "Polyatomic ions are not simple mixtures of atoms; they are groups of atoms joined by chemical bonds that carry a net charge and move as a single charged species.",
4: "Valency is the combining capacity of an element and is related to, but not necessarily equal to, the numerical charge on its ions; in formula writing valency tells how many atoms or ions combine to give a neutral compound.",
5: "Molecular mass and formula unit mass are not different methods for different textbooks; molecular mass is used for molecules (often covalent compounds), while formula unit mass is used for ionic solids like NaCl, even though both are calculated from the same atomic masses."
}
};

// --- SCENE DEFINITIONS ---
const SCENES = {
1: { name: "Law of Conservation of Mass", svg: `<canvas id="scene-canvas-1"></canvas>` },
2: { name: "Law of Constant Proportions", svg: `<canvas id="scene-canvas-2"></canvas><div id="s2-table-container"></div>` },
3: { name: "Atoms, Symbols & Atomic Mass", svg: `<div id="scene-3-graphs" class="dual-view" style="flex-direction: row; gap: 5px;"></div>` },
4: { name: "Molecules, Atomicity & Ions", svg: `<canvas id="scene-canvas-4"></canvas>` },
5: { name: "Formula Writing & Mass", svg: `<canvas id="scene-canvas-5"></canvas><div id="s5-counters"></div>` }
};

// --- APPLICATION STATE ---
const state = {
scene: 1,
paramA: 30, // generic system condition / zoom / intensity
mode: 1, // scenario mode selector
component1: 1.0, // amount or count
component2: 0, // second component
representation: 'unimolecular',
running: false,
simTime: 0,
history: []
};

let animFrame;
let particles = [];

// --- DOM ELEMENT REFERENCES ---
const els = {
stage: document.getElementById('scene-stage'),
particles: document.getElementById('particle-layer'),
tabContent: document.getElementById('tab-content'),
thermReadout: document.querySelector('.therm-readout'),
thermLiquid: document.getElementById('therm-liquid'),
chillBadge: document.getElementById('chill-badge'),
scopeLens: document.getElementById('scope-lens'),
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
lblTemp: document.querySelector('.lbl-temp')
};

// --- UI UPDATE LOGIC ---
function updateVisuals() {
els.valTemp.innerText = state.paramA;
els.valArea.innerText = state.component1.toFixed(2);
els.valWind.innerText = state.component2.toFixed(2);

// --- Dynamic UI Control Alignment ---
const humOptions = els.inpHumidity.options;
// Hide all dropdown options by default, show them as needed
for (let i = 0; i < humOptions.length; i++) { humOptions[i].style.display = 'none'; }

if (state.scene === 1) {
  els.lblTemp.innerHTML = `System Agitation (<span id="val-temp">${state.paramA}</span>)`;
  els.lblArea.innerHTML = `Mass of Solution X (<span id="val-area">${state.component1.toFixed(2)}</span> g)`;
  els.lblWind.innerHTML = `Mass of Solution Y (<span id="val-wind">${state.component2.toFixed(2)}</span> g)`;
  humOptions[0].style.display = 'block';
  humOptions[1].style.display = 'block';
  humOptions[0].textContent = 'Open System';
  humOptions[1].textContent = 'Closed System';
  if(state.mode > 0.25) els.inpHumidity.value = 0.5; else els.inpHumidity.value = 0;

} else if (state.scene === 2) {
  els.lblTemp.innerHTML = `Sample Temperature (<span id="val-temp">${state.paramA}</span>)`;
  els.lblArea.innerHTML = `Mass of Element 1 (e.g., H) (<span id="val-area">${state.component1.toFixed(2)}</span> g)`;
  els.lblWind.innerHTML = `Mass of Element 2 (e.g., O/N) (<span id="val-wind">${state.component2.toFixed(2)}</span> g)`;
  humOptions[0].style.display = 'block';
  humOptions[1].style.display = 'block';
  humOptions[0].textContent = 'Water (H₂O)';
  humOptions[1].textContent = 'Ammonia (NH₃)';
  if(state.mode > 0.25) els.inpHumidity.value = 0.5; else els.inpHumidity.value = 0;


} else if (state.scene === 3) {
  els.lblTemp.innerHTML = `Zoom Level (<span id="val-temp">${state.paramA}</span>)`;
  els.lblArea.innerHTML = `Number of Atoms (<span id="val-area">${Math.round(state.component1)}</span>)`;
  els.lblWind.innerHTML = `(Not Used)`;
  els.inpArea.min = 5; els.inpArea.max = 25; els.inpArea.step = 1;

} else if (state.scene === 4) {
  els.lblTemp.innerHTML = `Molecule Scale (<span id="val-temp">${state.paramA}</span>)`;
  els.lblArea.innerHTML = `(Not Used)`;
  els.lblWind.innerHTML = `Select Molecule/Ion (<span id="val-wind">${Math.round(state.component2)}</span>)`;
  els.inpWind.min = 0; els.inpWind.max = 4; els.inpWind.step = 1;

} else if (state.scene === 5) {
  els.lblTemp.innerHTML = `(Not Used)`;
  els.lblArea.innerHTML = `Select Cation (<span id="val-area">${state.component1.toFixed(2)}</span>)`;
  els.lblWind.innerHTML = `Select Anion (<span id="val-wind">${Math.round(state.component2)}</span>)`;
  els.inpWind.min = 0; els.inpWind.max = 3; els.inpWind.step = 1;
}

// Restore default slider ranges if not in a scene that overrides them
if (state.scene !== 3) {
  els.inpArea.min = 0.05; els.inpArea.max = 2.0; els.inpArea.step = 0.05;
}
if (state.scene < 4) {
  els.inpWind.min = 0; els.inpWind.max = 5; els.inpWind.step = 1;
}


// simple derived quantities for the readouts (keep as is, scene logic handles it)
if (state.scene === 1) {
  // This is handled by drawScene1 now
} else if (state.scene === 2) {
  const ratio = state.component2 === 0 ? 0 : state.component1 / state.component2;
  els.outEvap.innerText = ratio.toFixed(2);
  els.outCool.innerText = `User Ratio`;
} else if (state.scene === 3) {
  els.outEvap.innerText = `${state.component1.toFixed(0)} atoms`;
  els.outCool.innerText = `Atomic sizes ~10⁻¹⁰ m; masses in u based on C-12.`;
} else if (state.scene === 4) {
  els.outEvap.innerText = `${state.component1.toFixed(0)}-atom molecule`;
  els.outCool.innerText = `Check: element vs compound, neutral molecule vs ion.`;
} else if (state.scene === 5) {
  els.outEvap.innerText = `${(state.component1 + state.component2).toFixed(0)} particles`;
  els.outCool.innerText = `Use valency → formula → sum of atomic masses.`;
}

const fillPercent = Math.min(100, Math.max(5, state.paramA));
els.thermLiquid.style.height = `${fillPercent}%`;

const drawingFunction = window[`drawScene${state.scene}`];
if (typeof drawingFunction === 'function') {
  drawingFunction();
}


}

// --- SCENE RENDERING & MANAGEMENT ---
function renderScene() {
els.stage.innerHTML = SCENES[state.scene].svg;
const guides = BLOOM_GUIDES[state.scene] || [];
els.guideContent.innerHTML = `<ul class="guide-list"> ${guides.map(g => `<li class="guide-item"><span class="bloom-tag ${g.level}">${g.tag}</span><span class="guide-text">${g.text}</span></li>`).join('')} </ul>`;

resetSimulation();


}

function updateTabs() {
const activeTab = document.querySelector('.tabs .tab-btn.active').dataset.tab;
const contentData = MST_CONTENT[activeTab];
if (!contentData) return;

let content = `<h4>${contentData.title}</h4><ul><li>${contentData[state.scene]}</li></ul>`;
els.tabContent.innerHTML = content;


}

// --- ANIMATION & SIMULATION CONTROL ---
function resetSimulation() {
state.running = false;
state.simTime = 0;
state.history = [];
els.btnRun.disabled = false;
els.btnPause.disabled = true;
els.chillBadge.hidden = true;
if (animFrame) cancelAnimationFrame(animFrame);
updateVisuals();
}

function animLoop() {
if (!state.running) return;

state.simTime += 0.05;
state.history.push({ time: state.simTime, a: state.component1, b: state.component2 });

if (state.simTime > 10) {
  state.running = false;
  els.btnRun.disabled = true;
  els.btnPause.disabled = true;
  els.chillBadge.hidden = false;
}

updateVisuals();
animFrame = requestAnimationFrame(animLoop);


}

// --- SCENE-SPECIFIC DRAWING HELPERS ---
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

const margin = {
  top: canvas.height * 0.15,
  right: canvas.width * 0.05,
  bottom: canvas.height * 0.2,
  left: canvas.width * 0.15
};
const width = Math.max(1, canvas.width - margin.left - margin.right);
const height = Math.max(1, canvas.height - margin.top - margin.bottom);

ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = CONFIG.colors.text;
const fontSize = Math.max(8, Math.floor(canvas.width / 50));
ctx.font = `${fontSize}px Poppins`;

ctx.beginPath();
ctx.moveTo(margin.left, margin.top);
ctx.lineTo(margin.left, margin.top + height);
ctx.lineTo(margin.left + width, margin.top + height);
ctx.strokeStyle = CONFIG.colors.grid;
ctx.stroke();

ctx.textAlign = 'center';
ctx.fillText(xLabel, margin.left + width / 2, canvas.height - margin.bottom / 2);
ctx.save();
ctx.rotate(-Math.PI / 2);
ctx.fillText(yLabel, -canvas.height / 2, margin.left / 2.5);
ctx.restore();

return { ctx, width, height, margin, canvas };


}

// --- SCENE 1: Conservation of Mass (weighing balance view) ---
window.drawScene1 = function() {
const setup = setupCanvas('scene-canvas-1', 'Experiment: Conservation of Mass', '');
if (!setup) return;
const { ctx, width, height, margin, canvas } = setup;

const totalMass = state.component1 + state.component2;
const isClosedSystem = state.mode !== 0;
// In an open system (mode 0), some mass escapes if the reaction is running/finished.
const massLoss = (!isClosedSystem && state.simTime > 0) ? totalMass * 0.15 : 0;
const finalMass = totalMass - massLoss;

// Base dimensions
const baseY = margin.top + height;
const baseHeight = height * 0.1;
const baseWidth = width * 0.6;
const baseTop = baseY - baseHeight;
const centerX = margin.left + width / 2;

// Draw Base
ctx.fillStyle = '#334155'; // A slate color for the base
ctx.fillRect(centerX - baseWidth / 2, baseTop, baseWidth, baseHeight);
ctx.strokeStyle = CONFIG.colors.grid;
ctx.strokeRect(centerX - baseWidth / 2, baseTop, baseWidth, baseHeight);

// Draw Fulcrum (pillar)
const pillarWidth = width * 0.05;
const pillarHeight = height * 0.3;
ctx.fillStyle = '#475569';
ctx.fillRect(centerX - pillarWidth / 2, baseTop - pillarHeight, pillarWidth, pillarHeight);

// Draw Balance Beam
const beamY = baseTop - pillarHeight;
const beamWidth = width * 0.8;
const beamHeight = height * 0.03;
const tiltAngle = (totalMass - finalMass) / totalMass * 0.1; // Small angle for tilt

ctx.save();
ctx.translate(centerX, beamY);
ctx.rotate(tiltAngle);
ctx.fillStyle = '#64748b';
ctx.fillRect(-beamWidth / 2, -beamHeight / 2, beamWidth, beamHeight);
ctx.restore();

// Pan and Flask position
const panX = centerX - beamWidth * 0.35;
const panY = beamY - height * 0.05;

ctx.save();
ctx.translate(centerX, beamY);
ctx.rotate(tiltAngle);

// Draw string to pan
ctx.strokeStyle = '#94a3b8';
ctx.beginPath();
ctx.moveTo(-beamWidth * 0.35, 0);
ctx.lineTo(-beamWidth * 0.35, height * 0.08);
ctx.stroke();

// Draw Pan
const panRadius = width * 0.15;
ctx.fillStyle = '#475569';
ctx.beginPath();
ctx.arc(-beamWidth * 0.35, height * 0.08 + panRadius, panRadius, Math.PI, 0);
ctx.fill();

// Draw Conical Flask
const flaskBottomY = height * 0.08 + panRadius;
const flaskHeight = height * 0.3;
const flaskWidth = width * 0.18;
ctx.fillStyle = 'rgba(225, 235, 255, 0.2)'; // Glass effect
ctx.strokeStyle = '#94a3b8';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(-beamWidth * 0.35 - flaskWidth / 2, flaskBottomY);
ctx.lineTo(-beamWidth * 0.35 - flaskWidth / 4, flaskBottomY - flaskHeight);
ctx.lineTo(-beamWidth * 0.35 + flaskWidth / 4, flaskBottomY - flaskHeight);
ctx.lineTo(-beamWidth * 0.35 + flaskWidth / 2, flaskBottomY);
ctx.closePath();
ctx.fill();
ctx.stroke();

// Draw liquid inside
const liquidHeight = flaskHeight * 0.4 * (finalMass / (totalMass || 1));
const liquidColor = state.simTime > 1 ? CONFIG.colors.product : CONFIG.colors.reactant;
ctx.fillStyle = liquidColor;
ctx.beginPath();
ctx.moveTo(-beamWidth * 0.35 - flaskWidth / 2 + 5, flaskBottomY-2);
ctx.lineTo(-beamWidth * 0.35 - flaskWidth/3.5, flaskBottomY-liquidHeight);
ctx.lineTo(-beamWidth * 0.35 + flaskWidth/3.5, flaskBottomY-liquidHeight);
ctx.lineTo(-beamWidth * 0.35 + flaskWidth/2 - 5, flaskBottomY-2);
ctx.closePath();
ctx.fill();


// Draw Cork if closed system
if (isClosedSystem) {
ctx.fillStyle = '#8c6d46';
ctx.fillRect(-beamWidth * 0.35 - flaskWidth / 8, flaskBottomY - flaskHeight - 10, flaskWidth / 4, 10);
} else if (state.simTime > 1) { // Escaping gas if open system and reaction ran
ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
for (let i = 0; i < 5; i++) {
ctx.beginPath();
ctx.arc(
-beamWidth * 0.35 + (Math.random() - 0.5) * 15,
flaskBottomY - flaskHeight - 15 - Math.random() * 20,
3 + Math.random() * 3, 0, 2 * Math.PI
);
ctx.fill();
}
}

ctx.restore();

// Update mass readout text element (not on canvas)
els.outEvap.innerText = finalMass.toFixed(2);
els.outCool.innerText = isClosedSystem ? 'Closed System' : 'Open System';
};

// --- SCENE 2: Constant Proportions (ratio strips view) ---
window.drawScene2 = function() {
const setup = setupCanvas('scene-canvas-2', 'Compound Samples', 'Mass Composition');
if (!setup) return;
const { ctx, width, height, margin } = setup;

const compounds = {
water: { name: 'Water (H₂O)', el1: 'H', el2: 'O', ratio: 1 / 8, color1: '#ff6b6b', color2: '#48dbfb' },
ammonia: { name: 'Ammonia (NH₃)', el1: 'H', el2: 'N', ratio: 3 / 14, color1: '#ff6b6b', color2: '#feca57' }
};

const selected = state.mode < 0.5 ? 'water' : 'ammonia';
const compound = compounds[selected];
const totalRatio = 1 + compound.ratio;

// --- Draw Static Samples ---
ctx.textAlign = 'left';
ctx.fillStyle = CONFIG.colors.text;
ctx.fillText('Reference Samples:', margin.left, margin.top - 10);
const barHeight = height * 0.1;
for (let i = 0; i < 3; i++) {
const y = margin.top + i * (barHeight + 15);
const sampleWidth = width * (0.5 + i * 0.15);
const w1 = sampleWidth * (compound.ratio / totalRatio);
const w2 = sampleWidth * (1 / totalRatio);

// Draw ratio strip
ctx.fillStyle = compound.color1;
ctx.fillRect(margin.left, y, w1, barHeight);
ctx.fillStyle = compound.color2;
ctx.fillRect(margin.left + w1, y, w2, barHeight);
}

// --- Draw Interactive Experiment ---
const m1_in = state.component1; // Mass of H
const m2_in = state.component2; // Mass of O or N

let m1_used, m2_used, excessEl, excessMass;
const currentRatio = m1_in / m2_in;

if (currentRatio < compound.ratio) { // m1 is limiting
m1_used = m1_in;
m2_used = m1_in / compound.ratio;
excessEl = compound.el2;
excessMass = m2_in - m2_used;
} else { // m2 is limiting
m2_used = m2_in;
m1_used = m2_in * compound.ratio;
excessEl = compound.el1;
excessMass = m1_in - m1_used;
}
const compoundMass = m1_used + m2_used;

ctx.textAlign = 'left';
ctx.fillStyle = CONFIG.colors.text;
ctx.fillText('Your Experiment:', margin.left, margin.top + height * 0.5 - 10);

// Draw the resulting compound strip
const experimentY = margin.top + height * 0.5;
const maxWidth = width;
const compoundWidth = (compoundMass / (m1_in + m2_in)) * maxWidth;
const w1_exp = compoundWidth * (compound.ratio / totalRatio);
const w2_exp = compoundWidth * (1 / totalRatio);

ctx.fillStyle = '#2d3748';
ctx.fillText(`Compound Formed: ${compound.name} (${compoundMass.toFixed(2)} g)`, margin.left, experimentY - 5);
ctx.fillStyle = compound.color1;
ctx.fillRect(margin.left, experimentY + 15, w1_exp, barHeight);
ctx.fillStyle = compound.color2;
ctx.fillRect(margin.left + w1_exp, experimentY + 15, w2_exp, barHeight);

// Draw the excess
if (excessMass > 0.01) {
const excessWidth = (excessMass / (m1_in + m2_in)) * maxWidth;
ctx.fillStyle = '#2d3748';
ctx.fillText(`Excess Reactant: ${excessEl} (${excessMass.toFixed(2)} g)`, margin.left, experimentY + barHeight + 35);
ctx.fillStyle = (excessEl === compound.el1) ? compound.color1 : compound.color2;
ctx.fillRect(margin.left, experimentY + barHeight + 50, excessWidth, barHeight);
}

// Update the external table/readout
const container = document.getElementById('s2-table-container');
if (container) {
container.innerHTML = `
<div class="calc-breakdown">
<span>Input ${compound.el1}:</span> <span class="cb-val">${m1_in.toFixed(2)} g</span>
<span>Input ${compound.el2}:</span> <span class="cb-val">${m2_in.toFixed(2)} g</span>
<hr style="grid-column: 1 / -1; border-color: var(--color-border);">
<span>${compound.name} formed:</span> <span class="cb-val">${compoundMass.toFixed(2)} g</span>
<span>Excess ${excessEl}:</span> <span class="cb-val">${excessMass.toFixed(2)} g</span>
</div>
`;
}
};

// --- SCENE 3: Atoms & Symbols (zoom sequence + table) ---
window.drawScene3 = function() {
const container = document.getElementById('scene-3-graphs');
if (!container) return;
container.innerHTML = `<canvas id="s3-c1"></canvas><canvas id="s3-c2"></canvas>`;

// Left Panel: Zoom Sequence
const zoomSetup = setupCanvas('s3-c1', 'Zoom Scale', 'Matter → Atoms');
if (zoomSetup) {
const { ctx, width, height, margin } = zoomSetup;
const zoomLevel = state.paramA / 100; // 0.1 to 1.0

// 1. Bulk Matter
ctx.fillStyle = '#64748b';
ctx.fillRect(margin.left, margin.top, width * 0.4, height * 0.6);
ctx.fillStyle = CONFIG.colors.text;
ctx.fillText('Matter', margin.left + width * 0.2, margin.top + height * 0.6 + 15);

// 2. Zoom line/arrow
ctx.strokeStyle = CONFIG.colors.helper;
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(margin.left + width * 0.4, margin.top + height * 0.3);
ctx.lineTo(margin.left + width * 0.6, margin.top + height * 0.3);
ctx.lineTo(margin.left + width * 0.6, margin.top);
ctx.stroke();

// 3. Atomic View
const atomRadius = 2 + zoomLevel * 8;
const numAtoms = Math.floor(state.component1);
ctx.fillStyle = CONFIG.colors.product;
for (let i = 0; i < numAtoms; i++) {
const row = Math.floor(i / 5);
const col = i % 5;
const x = margin.left + width * 0.65 + col * atomRadius * 2.5;
const y = margin.top + atomRadius + row * atomRadius * 2.5;
if (y < margin.top + height) {
ctx.beginPath();
ctx.arc(x, y, atomRadius, 0, 2 * Math.PI);
ctx.fill();
}
}
ctx.fillText('Atoms', margin.left + width * 0.8, margin.top + height + 15);
}

// Right Panel: Symbol Table
const tableSetup = setupCanvas('s3-c2', 'Selected Elements', 'Symbol & Mass');
if (tableSetup) {
const { ctx, width, height, margin } = tableSetup;
const elements = [
{ name: 'Hydrogen', symbol: 'H', mass: '1.008 u' },
{ name: 'Oxygen', symbol: 'O', mass: '16.00 u' },
{ name: 'Sodium', symbol: 'Na', mass: '22.99 u' },
{ name: 'Chlorine', symbol: 'Cl', mass: '35.45 u' },
{ name: 'Carbon', symbol: 'C', mass: '12.01 u (Standard)' }
];
const rowHeight = height / (elements.length + 1);

// Draw table headers
ctx.font = `bold ${Math.max(8, Math.floor(width / 28))}px Poppins`;
ctx.fillStyle = CONFIG.colors.text;
ctx.textAlign = 'left';
ctx.fillText('Symbol', margin.left + width * 0.05, margin.top + rowHeight / 2);
ctx.fillText('Mass (u)', margin.left + width * 0.4, margin.top + rowHeight / 2);

// Draw table rows
ctx.font = `${Math.max(8, Math.floor(width / 30))}px Poppins`;
elements.forEach((el, i) => {
const y = margin.top + (i + 1.2) * rowHeight;
ctx.fillStyle = i === 4 ? CONFIG.colors.helper : CONFIG.colors.text; // Highlight Carbon
ctx.fillText(el.symbol, margin.left + width * 0.05, y);
ctx.fillText(el.mass, margin.left + width * 0.4, y);
});
}
};

// --- SCENE 4: Molecules, Atomicity & Ions (structured view) ---
window.drawScene4 = function() {
const setup = setupCanvas('scene-canvas-4', 'Particle View', 'Molecules & Ions');
if (!setup) return;
const { ctx, width, height, margin } = setup;

const structures = [
{ name: 'Oxygen (O₂)', type: 'Element', atomicity: 'Diatomic', atoms: [{ el: 'O', x: -10, y: 0 }, { el: 'O', x: 10, y: 0 }] },
{ name: 'Water (H₂O)', type: 'Compound', atomicity: 'Triatomic', atoms: [{ el: 'O', x: 0, y: 0 }, { el: 'H', x: -12, y: 10 }, { el: 'H', x: 12, y: 10 }] },
{ name: 'Phosphorus (P₄)', type: 'Element', atomicity: 'Polyatomic', atoms: [{ el: 'P', x: 0, y: -15 }, { el: 'P', x: -15, y: 5 }, { el: 'P', x: 15, y: 5 }, { el: 'P', x: 0, y: 10 }] },
{ name: 'Sodium Ion (Na⁺)', type: 'Ion', atomicity: 'Monoatomic', atoms: [{ el: 'Na', x: 0, y: 0, charge: '+1' }] },
{ name: 'Sulfate Ion (SO₄²⁻)', type: 'Ion', atomicity: 'Polyatomic', atoms: [{ el: 'S', x: 0, y: 0 }, { el: 'O', x: 0, y: -18 }, { el: 'O', x: 0, y: 18 }, { el: 'O', x: -18, y: 0 }, { el: 'O', x: 18, y: 0 }], charge: '-2' }
];

const atomColors = { 'H': '#e2e8f0', 'O': '#ff6b6b', 'P': '#feca57', 'Na': '#48dbfb', 'S': '#f97316' };
const index = Math.min(structures.length - 1, Math.floor(state.component2));
const structure = structures[index];

const centerX = margin.left + width / 2;
const centerY = margin.top + height / 2;
const scale = state.paramA / 25; // Use slider to scale the molecule drawing

ctx.strokeStyle = '#64748b'; // Bond color
ctx.lineWidth = 2;
ctx.beginPath();
// Simple bonding logic: connect everything to the first atom for polyatomics
if (structure.atoms.length > 1) {
const first = structure.atoms[0];
for (let i = 1; i < structure.atoms.length; i++) {
const current = structure.atoms[i];
ctx.moveTo(centerX + first.x * scale, centerY + first.y * scale);
ctx.lineTo(centerX + current.x * scale, centerY + current.y * scale);
}
}
ctx.stroke();

// Draw atoms
structure.atoms.forEach(atom => {
ctx.fillStyle = atomColors[atom.el] || '#fff';
ctx.beginPath();
ctx.arc(centerX + atom.x * scale, centerY + atom.y * scale, 8 * (scale/2), 0, 2 * Math.PI);
ctx.fill();
ctx.strokeStyle = '#1e293b';
ctx.stroke();
// Draw symbol inside atom
ctx.fillStyle = '#1e293b';
ctx.font = `bold ${6 * (scale/2)}px Poppins`;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(atom.el, centerX + atom.x * scale, centerY + atom.y * scale);
});

// Draw charge for ions
if (structure.type === 'Ion') {
ctx.fillStyle = structure.charge.includes('+') ? '#48dbfb' : '#ff6b6b';
ctx.font = `bold ${16 * (scale/3)}px Poppins`;
ctx.fillText(structure.charge, centerX + 30 * scale, centerY - 30 * scale);
}

// Update text readouts
els.outEvap.innerText = structure.name;
els.outCool.innerText = `${structure.type} / ${structure.atomicity}`;
};

// --- SCENE 5: Formula & Mass (interactive formula builder) ---
window.drawScene5 = function() {
const setup = setupCanvas('scene-canvas-5', 'Formula Builder', 'Criss-Cross Rule');
if (!setup) return;
const { ctx, width, height, margin } = setup;

const CATIONS = [
{ name: 'Sodium', symbol: 'Na', charge: 1, mass: 23.0 },
{ name: 'Calcium', symbol: 'Ca', charge: 2, mass: 40.1 },
{ name: 'Aluminum', symbol: 'Al', charge: 3, mass: 27.0 },
{ name: 'Ammonium', symbol: 'NH₄', charge: 1, mass: 18.0, poly: true }
];
const ANIONS = [
{ name: 'Chloride', symbol: 'Cl', charge: 1, mass: 35.5 },
{ name: 'Oxide', symbol: 'O', charge: 2, mass: 16.0 },
{ name: 'Hydroxide', symbol: 'OH', charge: 1, mass: 17.0, poly: true },
{ name: 'Sulfate', symbol: 'SO₄', charge: 2, mass: 96.1, poly: true }
];

// Map slider values to ion indices
const catIndex = Math.floor(state.component1 / 2.0 * (CATIONS.length -1));
const anIndex = Math.min(ANIONS.length - 1, Math.floor(state.component2));

const cation = CATIONS[catIndex];
const anion = ANIONS[anIndex];

// Criss-cross logic
const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const commonDivisor = gcd(cation.charge, anion.charge);
const subCat = anion.charge / commonDivisor;
const subAn = cation.charge / commonDivisor;

// Build formula string
let formula = '';
formula += cation.poly && subCat > 1 ? `(${cation.symbol})` : cation.symbol;
if (subCat > 1) formula += subCat;
formula += anion.poly && subAn > 1 ? `(${anion.symbol})` : anion.symbol;
if (subAn > 1) formula += subAn;

const totalMass = cation.mass * subCat + anion.mass * subAn;

// --- Drawing on Canvas ---
const yPos = margin.top + height / 2;
const x1 = margin.left + width * 0.2;
const x2 = margin.left + width * 0.8;
ctx.font = `bold ${Math.max(12, width/20)}px Poppins`;
ctx.textAlign = 'center';

// Draw Cation
ctx.fillStyle = CONFIG.colors.product;
ctx.fillText(`${cation.symbol}${cation.charge}+`, x1, yPos - 30);
// Draw Anion
ctx.fillStyle = CONFIG.colors.reactant;
ctx.fillText(`${anion.symbol}${anion.charge}-`, x2, yPos - 30);

// Draw criss-cross arrows
ctx.strokeStyle = CONFIG.colors.helper;
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(x1 + 20, yPos - 20);
ctx.lineTo(x2 - 10, yPos + 20);
ctx.moveTo(x2 - 20, yPos - 20);
ctx.lineTo(x1 + 10, yPos + 20);
ctx.stroke();

// Draw resulting subscripts
ctx.fillStyle = CONFIG.colors.text;
ctx.font = `bold ${Math.max(10, width/25)}px Poppins`;
ctx.fillText(subAn, x1 + 20, yPos + 25);
ctx.fillText(subCat, x2 - 20, yPos + 25);


// --- Update external info panel ---
const container = document.getElementById('s5-counters');
if (container) {
container.innerHTML = `
<div class="live-equation-container">
<div class="equation-row">
<span class="math-var mv-conc">${cation.name}</span> + <span class="math-var mv-rate">${anion.name}</span> → <span class="math-var mv-k">${formula}</span>
</div>
<div class="calc-breakdown">
<span>Formula Mass:</span>
<span class="cb-val">${totalMass.toFixed(2)} u</span>
<span>Calculation:</span>
<span class="cb-val">(${cation.mass.toFixed(1)}×${subCat}) + (${anion.mass.toFixed(1)}×${subAn})</span>
</div>
</div>`;
}
};

// --- RESPONSIVE CANVAS ENGINE ---
function debounce(func, wait) {
let timeout;
return function executedFunction(...args) {
const later = () => {
clearTimeout(timeout);
func(...args);
};
clearTimeout(timeout);
timeout = setTimeout(later, wait);
};
}

function makeCanvasResponsive() {
const debouncedRedraw = debounce(() => {
if (!state.running) {
updateVisuals();
}
}, 100);
window.addEventListener('resize', debouncedRedraw);
}

// --- INITIALIZATION ---
function init() {
// Input Listeners
els.inpTemp.addEventListener('input', e => {
state.paramA = parseFloat(e.target.value);
if (!state.running) resetSimulation();
});
els.inpHumidity.addEventListener('change', e => {
state.mode = parseFloat(e.target.value);
if (!state.running) resetSimulation();
});
els.inpLiquid.addEventListener('change', e => {
state.representation = e.target.value;
renderScene();
updateTabs();
});
els.inpArea.addEventListener('input', e => {
state.component1 = parseFloat(e.target.value);
if (!state.running) resetSimulation();
});
els.inpWind.addEventListener('input', e => {
state.component2 = parseFloat(e.target.value);
if (!state.running) resetSimulation();
});

// Button Listeners
els.btnRun.addEventListener('click', () => {
  if (state.simTime <= 0.01) {
    state.history = [];
  }
  state.running = true;
  els.btnRun.disabled = true;
  els.btnPause.disabled = false;
  els.chillBadge.hidden = true;
  animFrame = requestAnimationFrame(animLoop);
});
els.btnPause.addEventListener('click', () => {
  state.running = false;
  els.btnRun.disabled = false;
  els.btnPause.disabled = true;
});
els.btnReset.addEventListener('click', renderScene);

// Tab and Scene Listeners
document.querySelectorAll('.scene-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const target = e.target.closest('.scene-btn');
    document.querySelector('.scene-btn.active').classList.remove('active');
    target.classList.add('active');
    state.scene = parseInt(target.dataset.scene, 10);
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

// Initial Setup
makeCanvasResponsive();
renderScene();
updateTabs();


}

init();
})();
