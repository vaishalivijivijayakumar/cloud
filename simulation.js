// simulation.js
// Lesson: Chemical Kinetics: Rate, Order, Mechanism & Temperature Dependence

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const CONFIG = {
        R: 8.314, // Gas constant in J·mol⁻¹·K⁻¹
        DEFAULT_A: 1e10, // Arrhenius pre-exponential factor (s⁻¹ for 1st order)
        DEFAULT_EA: 75000, // Default activation energy in J·mol⁻¹
        MAX_TIME: 120, // Max simulation time in seconds for graphs
        TIME_STEP: 0.1, // Time step for simulation loop and numeric integration
        CATALYST_EFFECT_MULTIPLIER: 1000, // J·mol⁻¹ reduction per catalyst strength unit
        THERMOMETER_SCALE_FACTOR: 1e7, // Visual scaling for thermometer
        COLLISION_PROBABILITY_SCALE_FACTOR: 1e8, // Visual scaling for collision probability
    };

    // --- EDUCATIONAL CONTENT ---
    const LAB_CHALLENGES = [
        { level: 'observe', tag: 'Observe', text: 'Observe how the concentration–time graph becomes flatter with time and describe how this shows that the average rate of reaction decreases as reactants are consumed.' },
        { level: 'compare', tag: 'Compare', text: 'Compare zero-order and first-order plots to explain how their half-lives behave differently when the initial concentration is doubled.' },
        { level: 'experiment', tag: 'Experiment', text: 'Using the sliders for concentration and temperature, design two different sets of conditions that give approximately the same reaction rate and justify your choice using rate laws and the Arrhenius equation.' },
        { level: 'analyze', tag: 'Analyze', text: 'From a given data table or graph, determine the order of the reaction and calculate the rate constant and half-life, explaining each step of your reasoning.' },
        { level: 'challenge', tag: 'Challenge', text: 'Propose a plausible mechanism with a rate-determining step for the simulated reaction and argue whether the experimental rate law is consistent with your mechanism.' }
    ];

    const MST_CONTENT = {
        visual: `<h4>Visual</h4>
            <ul class="mst-list">
                <li><strong>Scene 1:</strong> Show a concentration–time graph for R → P, with secants (average rate) and a tangent (instantaneous rate) that becomes steeper at the start and flatter as reactants are used up.</li>
                <li><strong>Scene 2:</strong> Show a “rate vs [A]” graph where slope changes with order; highlight that rate = k[A]ˣ[B]ʸ is obtained from experiment, not from stoichiometric coefficients.</li>
                <li><strong>Scene 3:</strong> For zero order, a straight line [R] vs t; for first order, straight line ln[R] vs t and log([R]₀/[R]) vs t; show t½ on the graph and how it changes (zero order) or stays constant (first order).</li>
                <li><strong>Scene 4:</strong> Show potential energy diagrams with and without catalyst, and an Arrhenius plot (ln k vs 1/T) with a straight line whose slope is –Ea/R.</li>
                <li><strong>Scene 5:</strong> Use a particle view where only some collisions (correct orientation + E ≥ Ea) are highlighted as “effective collisions”, linked to the rate expression Rate = Z_AB P e⁻ᴱᵃ/ᴿᵀ.</li>
            </ul>`,
        analogy: `<h4>Analogy</h4>
            <ul class="mst-list">
                <li><strong>Average vs instantaneous rate:</strong> Like measuring the average speed of a car over a whole trip versus looking at the speedometer at one instant.</li>
                <li><strong>Order vs molecularity:</strong> Order is like how strongly each ingredient affects the taste of a dish (experimental), while molecularity is simply how many ingredients are put together in one simple step.</li>
                <li><strong>Activation energy:</strong> Reactants must climb a “hill” (Ea) before rolling down to products, just like cyclists needing enough energy to cross a mountain pass.</li>
                <li><strong>Rate-determining step:</strong> In a multi-link traffic route, the slowest, most congested segment controls the total travel time, just as the slowest step controls the overall rate.</li>
                <li><strong>Half-life:</strong> Like repeatedly cutting a chocolate bar in half—each cut takes the same time for a first-order reaction, no matter how small the remaining piece.</li>
            </ul>`,
        cause: `<h4>Cause</h4>
             <ul class="mst-list">
                <li>As the reaction proceeds, [reactant] decreases, so the average rate falls with time; the instantaneous rate is obtained when Δt → 0 (slope of the tangent).</li>
                <li>Higher concentration leads to more frequent effective collisions; experimentally we summarize this in the rate law Rate = k[A]ˣ[B]ʸ, where x + y is the order and may be fractional or zero.</li>
                <li>Zero-order reactions have rate independent of concentration (e.g., surface-saturated catalysts), while first-order reactions have rate proportional to [R]; this causes different shapes of [R] vs t and different half-life behaviour.</li>
                <li>Raising temperature increases the fraction of molecules with E ≥ Ea and therefore increases k; catalysts lower Ea by providing an alternate path, changing k but not ΔG or equilibrium constant.</li>
                <li>Only collisions with correct orientation and energy become products; steric factor P (<1) accounts for orientation, especially in complex molecules.</li>
            </ul>`,
        model: `<h4>Model</h4>
            <ul class="mst-list">
                <li><strong>Rate definitions:</strong> Average rate = –Δ[R]/Δt or +Δ[P]/Δt; Instantaneous rate = –d[R]/dt or +d[P]/dt (slope of tangent).</li>
                <li><strong>Rate law:</strong> Rate = k[A]ˣ[B]ʸ, order = x + y, units of k depend on order (e.g., s⁻¹ for first order, mol L⁻¹ s⁻¹ for zero order).</li>
                <li><strong>Integrated rate equations:</strong><br>– Zero order: [R] = [R]₀ – kt, t½ = [R]₀ / 2k<br>– First order: ln[R] = ln[R]₀ – kt; k = (2.303/t) log([R]₀/[R]), t½ = 0.693/k (independent of [R]₀).</li>
                <li><strong>Temperature dependence (Arrhenius):</strong> k = A e⁻ᴱᵃ/ᴿᵀ; graph of ln k vs 1/T is a straight line with slope –Ea/R; an increase of 10 °C often roughly doubles k.</li>
                <li><strong>Collision theory:</strong> Rate = Z_AB P e⁻ᴱᵃ/ᴿᵀ; Z_AB = collision frequency, P = steric factor; connects molecular collisions to macroscopic rate.</li>
            </ul>`,
        fix: `<h4>Fix (Misconceptions)</h4>
            <ul class="mst-list">
                <li>Order is not taken from stoichiometric coefficients; it must be found experimentally from rate data.</li>
                <li>Molecularity applies only to a single elementary step and is always a whole number (1, 2 or 3); it is not defined for overall complex reactions.</li>
                <li>Catalysts do not increase temperature; they lower activation energy and provide an alternate pathway, without changing ΔG or equilibrium constant.</li>
                <li>Half-life is not always dependent on initial concentration: it depends on [R]₀ for zero-order reactions, but is constant for first-order reactions.</li>
                <li>Not all collisions lead to products; only properly oriented collisions with energy ≥ Ea are effective and contribute to the rate.</li>
            </ul>`,
    };

    // --- SCENE DEFINITIONS ---
    const SCENES = {
        1: { name: "Measuring Reaction Rate", svg: `<svg class="sim-svg" viewBox="0 0 400 300"><g class="axes"><path d="M40 250 L380 250" stroke="currentColor" stroke-width="1"/><path d="M40 250 L40 20" stroke="currentColor" stroke-width="1"/><text x="210" y="270" text-anchor="middle" font-size="12">Time (s)</text><text x="20" y="135" text-anchor="middle" transform="rotate(-90 20 135)" font-size="12">[R] (mol·L⁻¹)</text></g><path id="conc-curve" fill="none" stroke="#0078ff" stroke-width="2"/><line id="secant-line" stroke="#e67e22" stroke-width="1.5" stroke-dasharray="4"/><line id="tangent-line" stroke="#e74c3c" stroke-width="1.5"/><circle id="secant-p1" r="3" fill="#e67e22"/><circle id="secant-p2" r="3" fill="#e67e22"/><circle id="tangent-p" r="3" fill="#e74c3c"/></svg>` },
        2: { name: "Rate Law, Order & Molecularity", svg: `<svg class="sim-svg" viewBox="0 0 400 300"><g class="axes"><path d="M40 250 L380 250" stroke="currentColor" stroke-width="1"/><path d="M40 250 L40 20" stroke="currentColor" stroke-width="1"/><text x="210" y="270" text-anchor="middle" font-size="12">[R] (mol·L⁻¹)</text><text x="20" y="135" text-anchor="middle" transform="rotate(-90 20 135)" font-size="12">Rate (mol·L⁻¹·s⁻¹)</text></g><path id="rate-law-curve" fill="none" stroke="#2ecc71" stroke-width="2"/><foreignObject x="50" y="30" width="300" height="200"><div id="s2-table-container"></div></foreignObject></svg>` },
        3: { name: "Integrated Rate Laws & Half-Life", svg: `<div class="dual-view" style="width:100%; height:100%; display:flex; gap:10px;"><svg viewBox="0 0 130 130" class="half-panel" id="graph-zero-order"><g class="axes"><path d="M15 110 L120 110" stroke="currentColor"/><path d="M15 110 L15 10" stroke="currentColor"/><text x="67" y="125" font-size="8" text-anchor="middle">t</text><text x="5" y="60" font-size="8" transform="rotate(-90 5 60)">[R]</text></g><path id="plot-zero" fill="none" stroke-width="2"/></svg><svg viewBox="0 0 130 130" class="half-panel" id="graph-first-order"><g class="axes"><path d="M15 110 L120 110" stroke="currentColor"/><path d="M15 110 L15 10" stroke="currentColor"/><text x="67" y="125" font-size="8" text-anchor="middle">t</text><text x="5" y="60" font-size="8" transform="rotate(-90 5 60)">ln[R]</text></g><path id="plot-first" fill="none" stroke-width="2"/></svg><svg viewBox="0 0 130 130" class="half-panel" id="graph-second-order"><g class="axes"><path d="M15 110 L120 110" stroke="currentColor"/><path d="M15 110 L15 10" stroke="currentColor"/><text x="67" y="125" font-size="8" text-anchor="middle">t</text><text x="5" y="60" font-size="8" transform="rotate(-90 5 60)">1/[R]</text></g><path id="plot-second" fill="none" stroke-width="2"/></svg></div>` },
        4: { name: "Temperature, Arrhenius Plot & Catalyst", svg: `<div class="dual-view" style="width:100%; height:100%; display:flex; gap:10px;"><svg viewBox="0 0 200 150" class="half-panel"><text x="100" y="15" font-size="8" text-anchor="middle">Reaction Coordinate</text><path id="ea-path" d="M20,120 C 40,120 60,30 100,30 C 140,30 160,100 180,100" fill="none" stroke="#3498db" stroke-width="2"/><path id="ea-path-cat" d="M20,120 C 40,120 60,60 100,60 C 140,60 160,100 180,100" fill="none" stroke="#9b59b6" stroke-width="2" stroke-dasharray="3" visibility="hidden"/></svg><svg viewBox="0 0 200 150" class="half-panel"><g class="axes"><path d="M20 130 L180 130" stroke="currentColor"/><path d="M20 130 L20 10" stroke="currentColor"/><text x="100" y="145" font-size="8" text-anchor="middle">1/T (K⁻¹)</text><text x="10" y="70" font-size="8" transform="rotate(-90 10 70)">ln(k)</text></g><path id="arrhenius-line" fill="none" stroke="#e74c3c" stroke-width="2"/><circle id="arrhenius-point" r="3" fill="#e74c3c"/></svg></div>` },
        5: { name: "Collision Theory & Reaction Mechanism", svg: `<div id="collision-box" style="width:100%; height:100%; border:1px solid currentColor; position:relative; overflow:hidden;"></div><div style="position:absolute; bottom:5px; left:5px; font-size:10px;">Collisions: <span id="total-collisions">0</span> | Effective: <span id="effective-collisions">0</span></div>` }
    };

    // --- DOM ELEMENT CACHE ---
    const els = {
        stage: document.getElementById('scene-stage'), tabContent: document.getElementById('tab-content'), guideContent: document.getElementById('guide-content'),
        thermReadout: document.getElementById('therm-val'), thermLiquid: document.getElementById('therm-liquid'), inpTemp: document.getElementById('inp-temp'), valTemp: document.getElementById('val-temp'),
        inpHumidity: document.getElementById('inp-humidity'), valHum: document.getElementById('val-hum'), inpWind: document.getElementById('inp-wind'), valWind: document.getElementById('val-wind'),
        inpArea: document.getElementById('inp-area'), valArea: document.getElementById('val-area'), inpLiquid: document.getElementById('inp-liquid'), outEvap: document.getElementById('out-evap'),
        outCool: document.getElementById('out-cool'), btnRun: document.getElementById('btn-run'), btnPause: document.getElementById('btn-pause'), btnReset: document.getElementById('btn-reset'),
    };

    // --- APPLICATION STATE ---
    let state = {}; let animFrame; let particles = [];
    function setDefaultState() { state = { scene: 1, temp: 30, concentration: 1.0, order: 1, catalyst: 0, mechanism: 'unimolecular', running: false, time: 0, k: 0, reactionRate: 0, halfLife: 0, currentConcentration: 1.0, totalCollisions: 0, effectiveCollisions: 0 }; }

    // --- CORE KINETICS CALCULATIONS ---
    function mapSliderToOrder(value) { if (value <= 25) return 0; if (value <= 55) return 0.5; if (value <= 80) return 1; return 2; }
    function calculateKinetics() {
        const T_K = state.temp + 273.15;
        const catalystEffect = (state.scene === 5) ? 0 : state.catalyst;
        const Ea_effective = CONFIG.DEFAULT_EA - (catalystEffect * CONFIG.CATALYST_EFFECT_MULTIPLIER);
        state.k = CONFIG.DEFAULT_A * Math.exp(-Ea_effective / (CONFIG.R * T_K));
        const conc = state.running ? state.currentConcentration : state.concentration; state.reactionRate = state.k * Math.pow(Math.max(0, conc), state.order); if (isNaN(state.reactionRate)) state.reactionRate = 0;
        switch (state.order) { case 0: state.halfLife = state.concentration / (2 * state.k || 1); break; case 1: state.halfLife = 0.693 / (state.k || 1); break; case 2: state.halfLife = 1 / ((state.k || 1) * state.concentration); break; default: state.halfLife = Infinity; break; }
    }
    function getConcentrationAtTime(t, order, R0, k) {
        switch (order) {
            case 0: return Math.max(0, R0 - k * t); case 1: return R0 * Math.exp(-k * t); case 2: return 1 / (1 / R0 + k * t);
            case 0.5: let conc = R0; for (let i = 0; i < t; i += CONFIG.TIME_STEP) { conc -= k * Math.sqrt(conc) * CONFIG.TIME_STEP; if (conc < 0) return 0; } return conc; default: return R0;
        }
    }

    // --- SCENE RENDERING & ANIMATION ---
    function renderScene() {
        els.stage.innerHTML = SCENES[state.scene].svg; cancelAnimationFrame(animFrame);
        if (state.scene === 5) initParticles();
        drawActiveScene(); updateLabChallenges(); updateTabs();
    }
    function drawActiveScene() {
        if (!els.stage.firstChild) return; switch (state.scene) { case 1: drawScene1(); break; case 2: drawScene2(); break; case 3: drawScene3(); break; case 4: drawScene4(); break; case 5: break; }
    }
    function drawScene1() {
        const R0 = state.concentration, k = state.k, order = state.order, T_MAX = CONFIG.MAX_TIME; let points = []; for (let t = 0; t <= T_MAX; t += 2) { const conc = getConcentrationAtTime(t, order, R0, k); const x = 40 + (t / T_MAX) * 340, y = 250 - (conc / R0) * 230; points.push(`${x},${y}`); }
        els.stage.querySelector('#conc-curve').setAttribute('d', 'M' + points.join(' L')); const t1 = 10, t2 = 40, t0 = 20; const c1 = getConcentrationAtTime(t1, order, R0, k), c2 = getConcentrationAtTime(t2, order, R0, k), c0 = getConcentrationAtTime(t0, order, R0, k);
        const p1 = { x: 40 + (t1 / T_MAX) * 340, y: 250 - (c1 / R0) * 230 }, p2 = { x: 40 + (t2 / T_MAX) * 340, y: 250 - (c2 / R0) * 230 }, p0 = { x: 40 + (t0 / T_MAX) * 340, y: 250 - (c0 / R0) * 230 };
        const secant = els.stage.querySelector('#secant-line'); secant.setAttribute('x1', p1.x); secant.setAttribute('y1', p1.y); secant.setAttribute('x2', p2.x); secant.setAttribute('y2', p2.y);
        const rate_t0 = k * Math.pow(c0, order); const slope = (-rate_t0 / R0) * (230 / (340/T_MAX)); const len = 40; const p_tan1 = { x: p0.x - len, y: p0.y + slope * len }, p_tan2 = { x: p0.x + len, y: p0.y - slope * len };
        const tangent = els.stage.querySelector('#tangent-line'); tangent.setAttribute('x1', p_tan1.x); tangent.setAttribute('y1', p_tan1.y); tangent.setAttribute('x2', p_tan2.x); tangent.setAttribute('y2', p_tan2.y);
    }
    function drawScene2() {
        const k = state.k, order = state.order, R_MAX = state.concentration; let points = []; for (let r = 0; r <= R_MAX; r += R_MAX / 50) { const rate = k * Math.pow(r, order); const x = 40 + (r / R_MAX) * 340; const y = 250 - (rate / (k * Math.pow(R_MAX, order) || 1)) * 230; if (isFinite(x) && isFinite(y)) points.push(`${x},${y}`); }
        els.stage.querySelector('#rate-law-curve').setAttribute('d', 'M' + points.join(' L')); let tableHTML = `<table id="s2-rate-table"><thead><tr><th>[R] (M)</th><th>Rate (M/s)</th></tr></thead><tbody>`; for (let i = 1; i <= 4; i++) { const conc = (R_MAX / 4) * i; const rate = k * Math.pow(conc, order); tableHTML += `<tr><td>${conc.toFixed(2)}</td><td>${rate.toExponential(2)}</td></tr>`; } tableHTML += `</tbody></table>`; els.stage.querySelector('#s2-table-container').innerHTML = tableHTML;
    }
    function drawScene3() {
        const R0 = state.concentration, k = state.k, T_MAX = CONFIG.MAX_TIME; const plots = [{ id: '#plot-zero', order: 0, getY: c => c }, { id: '#plot-first', order: 1, getY: c => Math.log(c) }, { id: '#plot-second', order: 2, getY: c => 1 / c }];
        plots.forEach(p => { let points = []; let yMin = p.getY(getConcentrationAtTime(T_MAX, p.order, R0, k)); let yMax = p.getY(R0); for (let t = 0; t <= T_MAX; t += 5) { const conc = getConcentrationAtTime(t, p.order, R0, k); if (conc <= 0) continue; const yVal = p.getY(conc); const x = 15 + (t / T_MAX) * 105; const y = 110 - ((yVal - yMin) / (yMax - yMin || 1)) * 100; points.push(`${x},${y}`); } const path = els.stage.querySelector(p.id); if(path) { path.setAttribute('d', 'M' + points.join(' L')); path.style.stroke = (p.order === state.order) ? '#2ecc71' : '#3498db'; } });
    }
    function drawScene4() {
        const catPath = els.stage.querySelector('#ea-path-cat'); if(catPath) catPath.style.visibility = state.catalyst > 0 ? 'visible' : 'hidden'; const T_min = 273.15 + 10, T_max = 273.15 + 60, Ea = CONFIG.DEFAULT_EA;
        const k_min = CONFIG.DEFAULT_A * Math.exp(-Ea / (CONFIG.R * T_min)), k_max = CONFIG.DEFAULT_A * Math.exp(-Ea / (CONFIG.R * T_max)); const lnk_min = Math.log(k_min), lnk_max = Math.log(k_max);
        const invT_min = 1 / T_max, invT_max = 1 / T_min; const p1 = { x: 20, y: 130 }, p2 = { x: 180, y: 10 }; els.stage.querySelector('#arrhenius-line').setAttribute('d', `M${p1.x},${p1.y} L${p2.x},${p2.y}`);
        const T_K_current = state.temp + 273.15, invT_current = 1 / T_K_current; const k_current = CONFIG.DEFAULT_A * Math.exp(-Ea / (CONFIG.R * T_K_current)), lnk_current = Math.log(k_current);
        const px = 20 + ((invT_current - invT_min) / (invT_max - invT_min)) * 160; const py = 130 - ((lnk_current - lnk_min) / (lnk_max - lnk_min)) * 120;
        const point = els.stage.querySelector('#arrhenius-point'); if(point) { point.setAttribute('cx', px); point.setAttribute('cy', py); }
    }
    function initParticles() { const box = els.stage.querySelector('#collision-box'); if (!box) return; box.innerHTML = ''; particles = []; state.totalCollisions = 0; state.effectiveCollisions = 0; const numParticles = 30; for (let i = 0; i < numParticles; i++) { const p = document.createElement('div'); p.style.cssText = `width:5px; height:5px; border-radius:50%; position:absolute; background-color:currentColor;`; box.appendChild(p); particles.push({ el: p, x: Math.random() * box.clientWidth, y: Math.random() * box.clientHeight, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2 }); } }
    function updateParticles() {
        const box = els.stage.querySelector('#collision-box'); if (!box || particles.length === 0) return; const speed = 1 + (state.temp / 30);
        const P_factor = state.catalyst / 10;
        particles.forEach(p => { p.x += p.vx * speed; p.y += p.vy * speed; if (p.x < 0 || p.x > box.clientWidth) p.vx *= -1; if (p.y < 0 || p.y > box.clientHeight) p.vy *= -1; p.el.style.transform = `translate(${p.x}px, ${p.y}px)`; });
        for (let i = 0; i < particles.length; i++) { for (let j = i + 1; j < particles.length; j++) { const p1 = particles[i], p2 = particles[j]; const dx = p1.x - p2.x, dy = p1.y - p2.y; if (dx * dx + dy * dy < 25) { state.totalCollisions++; const T_K = state.temp + 273.15, Ea_eff = CONFIG.DEFAULT_EA; const energyCheck = Math.exp(-Ea_eff / (CONFIG.R * T_K)); if (Math.random() < P_factor && Math.random() < energyCheck * CONFIG.COLLISION_PROBABILITY_SCALE_FACTOR) { state.effectiveCollisions++; p1.el.style.backgroundColor = '#2ecc71'; p2.el.style.backgroundColor = '#2ecc71'; setTimeout(() => { p1.el.style.backgroundColor = 'currentColor'; p2.el.style.backgroundColor = 'currentColor'; }, 200); } } } }
        const totalEl = els.stage.querySelector('#total-collisions'), effEl = els.stage.querySelector('#effective-collisions'); if(totalEl) totalEl.innerText = state.totalCollisions; if(effEl) effEl.innerText = state.effectiveCollisions;
    }
    function animLoop() { if (!state.running) return; state.time += CONFIG.TIME_STEP; state.currentConcentration = getConcentrationAtTime(state.time, state.order, state.concentration, state.k); updateVisuals(); if (state.scene === 5) updateParticles(); else drawActiveScene(); animFrame = requestAnimationFrame(animLoop); }

    // --- UI & CONTENT UPDATES ---
    function updateVisuals() {
        calculateKinetics(); els.valTemp.innerText = state.temp; els.valArea.innerText = state.concentration.toFixed(2); els.valWind.innerText = state.catalyst; els.valHum.innerText = state.order; els.outEvap.innerText = state.reactionRate.toExponential(2);
        els.outCool.innerText = `k=${state.k.toExponential(2)} | t½=${state.halfLife.toFixed(1)}s`; const T_K = state.temp + 273.15; const Ea_effective = CONFIG.DEFAULT_EA - (state.catalyst * CONFIG.CATALYST_EFFECT_MULTIPLIER); const fraction = Math.exp(-Ea_effective / (CONFIG.R * T_K));
        const displayFraction = Math.min(1, fraction * CONFIG.THERMOMETER_SCALE_FACTOR); els.thermLiquid.style.height = `${displayFraction * 100}%`; els.thermReadout.innerText = `${(displayFraction * 100).toFixed(1)}%`;
    }
    function updateLabChallenges() { els.guideContent.innerHTML = `<ul class="guide-list">${LAB_CHALLENGES.map(c => `<li class="guide-item challenge-${c.level}"><span class="bloom-tag">${c.tag}</span> <span class="guide-text">${c.text}</span></li>`).join('')}</ul>`; }
    function updateTabs() { const activeTab = document.querySelector('.tab-btn.active').dataset.tab; els.tabContent.innerHTML = MST_CONTENT[activeTab] || ''; }
    function triggerPulse() { document.querySelectorAll('.pulse-target').forEach(r => { r.classList.remove('pulse-anim'); void r.offsetWidth; r.classList.add('pulse-anim'); }); }

    // --- EVENT LISTENERS & INITIALIZATION ---
    function init() {
        ['input', 'change'].forEach(evt => {
            [els.inpTemp, els.inpHumidity, els.inpWind, els.inpArea, els.inpLiquid].forEach(inp => inp.addEventListener(evt, () => {
                state.temp = parseFloat(els.inpTemp.value); state.order = mapSliderToOrder(parseFloat(els.inpHumidity.value)); state.catalyst = parseFloat(els.inpWind.value);
                state.concentration = parseFloat(els.inpArea.value); state.mechanism = els.inpLiquid.value; if (!state.running) { state.time = 0; state.currentConcentration = state.concentration; }
                updateVisuals(); drawActiveScene(); triggerPulse();
            }));
        });
        els.btnRun.addEventListener('click', () => {
            state.running = true; els.btnRun.disabled = true; els.btnPause.disabled = false; state.time = 0; state.currentConcentration = state.concentration;
            if (state.scene === 5) { state.totalCollisions = 0; state.effectiveCollisions = 0; } animFrame = requestAnimationFrame(animLoop);
        });
        els.btnPause.addEventListener('click', () => { state.running = false; els.btnRun.disabled = false; els.btnPause.disabled = true; cancelAnimationFrame(animFrame); });
        els.btnReset.addEventListener('click', () => {
            state.running = false; cancelAnimationFrame(animFrame); els.btnRun.disabled = false; els.btnPause.disabled = true; setDefaultState();
            els.inpTemp.value = state.temp; els.inpHumidity.value = 70; els.inpWind.value = state.catalyst; els.inpArea.value = state.concentration; els.inpLiquid.value = state.mechanism;
            updateVisuals(); renderScene();
        });
        document.querySelectorAll('.scene-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.closest('.scene-btn'); document.querySelectorAll('.scene-btn').forEach(b => b.classList.remove('active')); target.classList.add('active');
                state.scene = parseInt(target.dataset.scene); state.running = false; els.btnRun.disabled = false; els.btnPause.disabled = true; renderScene();
            });
        });
        document.querySelectorAll('.tab-btn').forEach(btn => { btn.addEventListener('click', (e) => { document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); e.target.classList.add('active'); updateTabs(); }); });
        setDefaultState(); updateVisuals(); renderScene();
    }

    init();
})();