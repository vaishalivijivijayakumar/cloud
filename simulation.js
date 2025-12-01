document.addEventListener('DOMContentLoaded', () => {

    // --- CONTENT DATA ---
    const mstContent = {
        scene1: {
            title: "Measuring Reaction Rate",
            visual: "A concentration–time graph for R → P, with secants (average rate) and a tangent (instantaneous rate) that becomes steeper at the start and flatter as reactants are used up.",
            analogy: "Like measuring the average speed of a car over a whole trip versus looking at the speedometer at one instant.",
            cause: "As the reaction proceeds, [reactant] decreases, so the average rate falls with time; the instantaneous rate is obtained when Δt → 0 (slope of the tangent).",
            model: "Average rate = –Δ[R]/Δt, Instantaneous rate = –d[R]/dt (slope of tangent).",
            fix: "The rate of a reaction is not constant. It changes continuously as the concentration of reactants changes."
        },
        scene2: {
            title: "Rate Law, Order & Molecularity",
            visual: "A “rate vs [A]” graph where slope changes with order; highlight that rate = k[A]ˣ[B]ʸ is obtained from experiment, not from stoichiometric coefficients.",
            analogy: "Order is like how strongly each ingredient affects the taste of a dish (experimental), while molecularity is simply how many ingredients are put together in one simple step.",
            cause: "Higher concentration leads to more frequent effective collisions; experimentally we summarize this in the rate law Rate = k[A]ˣ[B]ʸ, where x + y is the order.",
            model: "Rate law: Rate = k[A]ˣ[B]ʸ, order = x + y, units of k depend on order (e.g., s⁻¹ for first order).",
            fix: "Order is not taken from stoichiometric coefficients; it must be found experimentally from rate data."
        },
        scene3: {
            title: "Integrated Rate Laws & Half-Life",
            visual: "For zero order, a straight line [R] vs t; for first order, straight line ln[R] vs t. Show t½ on the graph and how it is constant for first order.",
            analogy: "Half-life is like repeatedly cutting a chocolate bar in half—each cut takes the same time for a first-order reaction.",
            cause: "Zero-order reactions have rate independent of concentration, while first-order reactions have rate proportional to [R]; this causes different shapes of [R] vs t and different half-life behaviour.",
            model: "Zero order: [R] = [R]₀ – kt, t½ = [R]₀ / 2k. First order: ln[R] = ln[R]₀ – kt, t½ = 0.693/k.",
            fix: "Half-life is not always constant; it depends on [R]₀ for zero-order reactions, but is constant for first-order reactions."
        },
        scene4: {
            title: "Temperature, Arrhenius Plot & Catalyst",
            visual: "Show potential energy diagrams with and without catalyst, and an Arrhenius plot (ln k vs 1/T) with a straight line whose slope is –Ea/R.",
            analogy: "Reactants must climb a “hill” (Ea) before rolling down to products, just like cyclists needing enough energy to cross a mountain pass.",
            cause: "Raising temperature increases the fraction of molecules with E ≥ Ea and therefore increases k; catalysts lower Ea by providing an alternate path.",
            model: "Arrhenius Equation: k = A * e^(-Ea/RT). Graph of ln(k) vs 1/T gives a straight line with slope = -Ea/R.",
            fix: "Catalysts do not increase temperature; they lower activation energy and provide an alternate pathway, without changing ΔG or equilibrium."
        },
        scene5: {
            title: "Collision Theory & Reaction Mechanism",
            visual: "A particle view where only some collisions (correct orientation + E ≥ Ea) are highlighted as “effective collisions”.",
            analogy: "In a multi-link traffic route, the slowest, most congested segment controls the total travel time, just as the slowest step controls the overall rate.",
            cause: "Only collisions with correct orientation and energy become products; steric factor P (<1) accounts for orientation, especially in complex molecules.",
            model: "Rate = Z_AB * P * e^(-Ea/RT), where Z_AB is collision frequency and P is the steric factor.",
            fix: "Not all collisions lead to products; only properly oriented collisions with energy ≥ Ea are effective and contribute to the rate."
        }
    };

    const labChallenges = [
        { color: "Blue", level: "Observe", text: "Observe how the concentration–time graph becomes flatter with time and describe how this shows that the average rate of reaction decreases as reactants are consumed." },
        { color: "Purple", level: "Compare", text: "Compare zero-order and first-order plots to explain how their half-lives behave differently when the initial concentration is doubled." },
        { color: "Green", level: "Experiment", text: "Using the sliders, design two different sets of conditions that give approximately the same reaction rate and justify your choice." },
        { color: "Orange", level: "Analyze", text: "From a given graph, determine the order of the reaction and calculate the rate constant and half-life, explaining each step." },
        { color: "Red", level: "Challenge", text: "Propose a plausible mechanism with a rate-determining step for the simulated reaction and argue whether the experimental rate law is consistent with your mechanism." }
    ];

    // --- Constants ---
    const R = 8.314;
    const PRE_EXPONENTIAL_FACTOR = 1e10;
    const ACTIVATION_ENERGY_NO_CATALYST = 50000;
    const ACTIVATION_ENERGY_CATALYST = 35000;

    // --- State Variables ---
    let state = { activeScene: 'scene1', initialConcentration: 0.5, temperature: 300, reactionOrder: 0, catalystActive: false, isRunning: false, startTime: 0, elapsedTime: 0, rateConstant: 0, currentConcentration: 0.5, animationFrameId: null, simulationData: [] };

    // --- Chart & Canvas ---
    let chart;
    const canvas = document.getElementById('simulation-canvas');
    const ctx = canvas.getContext('2d');

    // --- DOM Elements ---
    const concentrationSlider = document.getElementById('concentration-slider'), concentrationValue = document.getElementById('concentration-value');
    const temperatureSlider = document.getElementById('temperature-slider'), temperatureValue = document.getElementById('temperature-value');
    const orderZeroBtn = document.getElementById('order-zero-btn'), orderFirstBtn = document.getElementById('order-first-btn');
    const catalystToggle = document.getElementById('catalyst-toggle');
    const startResetBtn = document.getElementById('start-reset-btn');
    const tabs = document.querySelectorAll('.tab-button');
    const mstContentContainer = document.getElementById('mst-content');
    const labsBtn = document.getElementById('labs-btn'), labsModal = document.getElementById('labs-modal'), modalCloseBtn = document.querySelector('.modal-close-btn'), labsContainer = document.getElementById('labs-container');

    // --- Core Logic ---
    function calculateRateConstant() { state.rateConstant = PRE_EXPONENTIAL_FACTOR * Math.exp(-(state.catalystActive ? ACTIVATION_ENERGY_CATALYST : ACTIVATION_ENERGY_NO_CATALYST) / (R * state.temperature)); }
    function updateConcentration(time) { state.currentConcentration = Math.max(0, state.reactionOrder === 0 ? state.initialConcentration - state.rateConstant * time : state.initialConcentration * Math.exp(-state.rateConstant * time)); }
    function startSimulation() { if (state.isRunning) return; state.isRunning = true; startResetBtn.textContent = 'Reset'; [concentrationSlider, temperatureSlider, orderZeroBtn, orderFirstBtn, catalystToggle].forEach(el => el.disabled = true); state.startTime = 0; state.elapsedTime = 0; state.currentConcentration = state.initialConcentration; state.simulationData = []; calculateRateConstant(); prepareVisualization(); state.animationFrameId = requestAnimationFrame(simulationLoop); }
    function stopSimulation() { state.isRunning = false; startResetBtn.textContent = 'Start'; [concentrationSlider, temperatureSlider, orderZeroBtn, orderFirstBtn, catalystToggle].forEach(el => el.disabled = false); if (state.animationFrameId) cancelAnimationFrame(state.animationFrameId); state.animationFrameId = null; }
    function simulationLoop(timestamp) { if (!state.startTime) state.startTime = timestamp; const elapsed = (timestamp - state.startTime) / 1000; state.elapsedTime = elapsed; updateConcentration(elapsed); state.simulationData.push({ time: elapsed, concentration: state.currentConcentration }); updateVisualization(); if (state.currentConcentration > 0.001) state.animationFrameId = requestAnimationFrame(simulationLoop); else stopSimulation(); }

    // --- Visualization ---
    function prepareVisualization() { if (chart) chart.destroy(); canvas.style.display = 'block'; if (state.activeScene === 'scene5') { ctx.clearRect(0,0,canvas.width,canvas.height); return; } chart = new Chart(ctx, getChartConfig()); }
    function updateVisualization() { if (state.activeScene === 'scene5') { drawCollisionAnimation(); return; } if (!chart) return; const { labels, data } = getChartData(); chart.data.labels = labels; chart.data.datasets[0].data = data; chart.update('none'); }
    function getChartConfig() { const { labels, data, yLabel, title, xLabel } = getChartData(); return { type: 'line', data: { labels, datasets: [{ label: yLabel, data, borderColor: '#00bcd4', tension: 0.1, pointRadius: 0 }] }, options: { scales: { x: { title: { display: true, text: xLabel, color: '#e0e0e0' }, ticks:{color: '#e0e0e0'}}, y: { title: { display: true, text: yLabel, color: '#e0e0e0'}, ticks:{color: '#e0e0e0'} } }, plugins: { title: { display: true, text: title, color: '#e0e0e0' }, legend: {labels: {color: '#e0e0e0'}}}, animation: false } }; }
    function getChartData() {
        const dataPoints = state.simulationData;
        switch(state.activeScene) {
            case 'scene1':
                return {
                    labels: dataPoints.map(d => d.time.toFixed(1)),
                    data: dataPoints.map(d => d.concentration),
                    yLabel: 'Concentration [R] (M)',
                    title: 'Concentration vs. Time',
                    xLabel: 'Time (s)'
                };
            case 'scene2':
                const rateData = [];
                const concLabels = [];
                calculateRateConstant(); // Ensure k is up-to-date
                for (let i = 0; i <= 10; i++) {
                    const conc = i * 0.1;
                    concLabels.push(conc.toFixed(2));
                    const rate = (state.reactionOrder === 0) ? state.rateConstant : state.rateConstant * conc;
                    rateData.push(rate);
                }
                return {
                    labels: concLabels,
                    data: rateData,
                    yLabel: 'Rate (M/s)',
                    title: 'Rate vs. Concentration',
                    xLabel: 'Concentration [R] (M)'
                };
            case 'scene3':
                const transformedData = state.reactionOrder === 0 ? dataPoints.map(d => d.concentration) : dataPoints.map(d => d.concentration > 0 ? Math.log(d.concentration) : null);
                return {
                    labels: dataPoints.map(d => d.time.toFixed(1)),
                    data: transformedData,
                    yLabel: state.reactionOrder === 0 ? '[R]' : 'ln[R]',
                    title: 'Integrated Rate Law Plot',
                    xLabel: 'Time (s)'
                };
            case 'scene4':
                const arrheniusData = [];
                const tempLabels = [];
                const Ea = state.catalystActive ? ACTIVATION_ENERGY_CATALYST : ACTIVATION_ENERGY_NO_CATALYST;

                for (let i = -2; i <= 2; i++) {
                    const temp = state.temperature + i * 10;
                    const invT = 1 / temp;
                    const k = PRE_EXPONENTIAL_FACTOR * Math.exp(-Ea / (R * temp));
                    const lnK = Math.log(k);

                    tempLabels.push(invT.toExponential(2));
                    arrheniusData.push(lnK);
                }
                return {
                    labels: tempLabels,
                    data: arrheniusData,
                    yLabel: 'ln(k)',
                    title: 'Arrhenius Plot',
                    xLabel: '1/T (K⁻¹)'
                };
            default:
                return { labels: [], data: [], yLabel: '', title: '', xLabel: '' };
        }
    }
    function drawCollisionAnimation() { const numParticles = Math.floor(state.initialConcentration * 40); const energyThreshold = 0.8; const tempFactor = (state.temperature - 280) / 40; ctx.clearRect(0, 0, canvas.width, canvas.height); for (let i = 0; i < numParticles; i++) { const energy = Math.random() + tempFactor * 0.2; const isEffective = energy > energyThreshold; ctx.fillStyle = isEffective ? '#00bcd4' : '#e0e0e0'; ctx.beginPath(); ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 5, 0, 2 * Math.PI); ctx.fill(); } }

    // --- Content Loading ---
    function loadMstContent() { const content = mstContent[state.activeScene]; mstContentContainer.innerHTML = `<h3>${content.title}</h3>` + Object.entries(content).filter(([key]) => key !== 'title').map(([key, value]) => `<div class="mst-item"><h4>${key.charAt(0).toUpperCase() + key.slice(1)}</h4><p>${value}</p></div>`).join(''); }
    function loadLabChallenges() { labsContainer.innerHTML = labChallenges.map(c => `<div class="lab-challenge" style="border-left-color: ${c.color.toLowerCase()};"><p><strong>${c.level}:</strong> ${c.text}</p></div>`).join(''); }

    // --- Event Listeners ---
    tabs.forEach(tab => { tab.addEventListener('click', () => { if (state.isRunning) stopSimulation(); state.activeScene = tab.dataset.scene; tabs.forEach(t => t.classList.remove('active')); tab.classList.add('active'); loadMstContent(); prepareVisualization(); startResetBtn.style.display = (state.activeScene === 'scene2' || state.activeScene === 'scene4') ? 'none' : 'block'; }); });
    concentrationSlider.addEventListener('input', (e) => { state.initialConcentration = parseFloat(e.target.value); concentrationValue.textContent = `${state.initialConcentration.toFixed(1)} M`; if (state.activeScene === 'scene2') prepareVisualization(); });
    temperatureSlider.addEventListener('input', (e) => { state.temperature = parseInt(e.target.value); temperatureValue.textContent = `${state.temperature} K`; if (state.activeScene === 'scene2' || state.activeScene === 'scene4') prepareVisualization(); });
    orderZeroBtn.addEventListener('click', () => { state.reactionOrder = 0; orderZeroBtn.classList.add('active'); orderFirstBtn.classList.remove('active'); if (state.activeScene === 'scene2' || state.activeScene === 'scene3') prepareVisualization(); });
    orderFirstBtn.addEventListener('click', () => { state.reactionOrder = 1; orderFirstBtn.classList.add('active'); orderZeroBtn.classList.remove('active'); if (state.activeScene === 'scene2' || state.activeScene === 'scene3') prepareVisualization(); });
    catalystToggle.addEventListener('change', (e) => { state.catalystActive = e.target.checked; if (state.activeScene === 'scene4' || state.activeScene === 'scene2') prepareVisualization(); });
    startResetBtn.addEventListener('click', () => { state.isRunning ? stopSimulation() : startSimulation(); });
    labsBtn.addEventListener('click', () => labsModal.style.display = 'flex');
    modalCloseBtn.addEventListener('click', () => labsModal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target === labsModal) labsModal.style.display = 'none'; });

    // --- Initialization ---
    function init() {
        concentrationValue.textContent = `${state.initialConcentration.toFixed(1)} M`;
        temperatureValue.textContent = `${state.temperature} K`;
        loadMstContent();
        loadLabChallenges();
        prepareVisualization();
        console.log("Simulation Fully Initialized");
        document.dispatchEvent(new CustomEvent('simulationReady'));
    }

    init();
});
