// simulation.js

(function() {
    /**
     * Dynamically loads a script from a given URL and executes a callback function upon completion.
     * @param {string} url The URL of the script to load.
     * @param {function} callback The function to execute after the script has loaded.
     */
    function loadScript(url, callback) {
        const script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        script.onerror = () => console.error(`Failed to load script: ${url}`);
        document.head.appendChild(script);
    }

    /**
     * Main simulation logic. This function is executed after Chart.js is loaded.
     */
    function initializeSimulation() {
        // --- STATE & DATA ---
        const mstContent = {
            1: {
                visual: 'Scene 1: Concentration–time graph with secant (average rate) and tangent (instantaneous rate) slopes.',
                analogy: 'Average vs Instantaneous Rate = car trip average speed vs speedometer reading.',
                cause: 'Rate decreases with time because reactant concentration decreases.',
                model: 'Rate = –Δ[R]/Δt or –d[R]/dt',
                fix: 'A common misconception is that reaction rate is constant. It actually changes as reactants are consumed.'
            },
            2: {
                visual: 'Scene 2: Rate vs Concentration graphs for zero, first, second order; highlight that order is experimental.',
                analogy: 'Order vs Molecularity = recipe taste effect vs number of ingredients added.',
                cause: 'Higher concentration → more effective collisions → faster rate. Zero order: rate independent of [R]; First order: rate ∝ [R].',
                model: 'Rate = k[A]ˣ[B]ʸ; order = x+y',
                fix: '❌ Order = Molecularity'
            },
            3: {
                visual: 'Scene 3: Linear plots for zero-order ([R] vs t) and first-order (ln[R] vs t); half-life markings.',
                analogy: 'Half-life = repeatedly cutting a chocolate bar in half.',
                cause: 'The time it takes for half the reactant to disappear is constant for first-order reactions but depends on initial concentration for zero-order.',
                model: 'Zero Order: [R] = [R]₀ − kt; t½ = [R]₀/2k <br> First Order: ln[R] = ln[R]₀ − kt; t½ = 0.693/k',
                fix: '❌ All reactions have constant half-life'
            },
            4: {
                visual: 'Scene 4: Energy profile diagrams with/without catalyst; Arrhenius ln k vs 1/T straight line, slope = –Ea/R.',
                analogy: 'Activation Energy = climbing a hill before rolling down.',
                cause: 'Temperature increases k by raising fraction of molecules with E ≥ Ea. Catalysts lower Ea but do not change ΔG or equilibrium.',
                model: 'ln k = ln A − Ea/RT',
                fix: '❌ Catalyst increases temperature. ❌ High activation energy means faster reaction.'
            },
            5: {
                visual: 'Scene 5: Molecular collision view showing only correctly oriented & energetic collisions producing products.',
                analogy: 'Rate-determining step = slowest toll gate decides total travel time.',
                cause: 'Not all collisions form products — only effective ones with sufficient energy and correct orientation.',
                model: 'Rate = Z_AB P e⁻ᴱᵃ/ᴿᵀ',
                fix: '✔ Only effective collisions lead to products'
            }
        };

        let activeScene = '1';
        let activeMstTab = 'visual';
        let chartInstance = null;

        // --- GLOBAL SIMULATION STATE ---
        const simState = {
            concentration: 1.0,
            temperature: 298,
            order: 0,
            catalyst: false,
            isRunning: true,
        };

        // --- DOM ELEMENTS ---
        const sceneTabs = document.querySelector('.scene-tabs');
        const mstTabs = document.querySelector('.mst-tabs');
        const mstContentEl = document.querySelector('.mst-content');
        const controlGroups = document.querySelectorAll('.control-group');
        const simulationArea = document.getElementById('simulation-area');
        const labChallengesContainer = document.querySelector('.panel-lab-challenges');

        // --- INTERACTIVE CHALLENGE HANDLER ---
        const notificationEl = document.getElementById('challenge-notification');

        function showNotification(message) {
            notificationEl.textContent = message;
            notificationEl.classList.add('show');
            setTimeout(() => {
                notificationEl.classList.remove('show');
            }, 3000);
        }

        function handleChallenge(challengeId) {
            let message = '';
            switch (challengeId) {
                case 'observe':
                    simState.concentration = 1.5;
                    document.querySelector('.scene-tab[data-scene="1"]').click();
                    message = 'Challenge: Observe how the rate changes over time.';
                    break;
                case 'compare':
                    simState.concentration = 0.8;
                    simState.order = 0;
                    document.querySelector('.scene-tab[data-scene="3"]').click();
                    message = 'Challenge: Now try First Order and compare half-life.';
                    break;
                case 'experiment':
                    simState.temperature = 320;
                    simState.concentration = 0.5;
                    document.querySelector('.scene-tab[data-scene="4"]').click();
                    message = 'Challenge: Find a new state with a similar rate.';
                    break;
                case 'analyze':
                    simState.order = 1;
                    document.querySelector('.scene-tab[data-scene="3"]').click();
                    message = 'Challenge: Determine the half-life from this graph.';
                    break;
                case 'challenge':
                    simState.temperature = 350;
                    simState.concentration = 1.8;
                    document.querySelector('.scene-tab[data-scene="5"]').click();
                    message = 'Challenge: Does this high-energy state favor reaction?';
                    break;
            }
            // Manually update the controls to reflect the new state
            document.getElementById('concentration-slider').value = simState.concentration;
            document.getElementById('concentration-value').textContent = simState.concentration.toFixed(1);
            document.getElementById('temperature-slider').value = simState.temperature;
            document.getElementById('temperature-value').textContent = simState.temperature;
            document.getElementById('order-select').value = simState.order;

            renderScene();
            showNotification(message);
        }


        // --- CHARTING & SCENE SPECIFIC FUNCTIONS ---

        function destroyChart() {
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null;
            }
        }

        function setupScene1() {
            destroyChart();
            simulationArea.innerHTML = '<canvas id="scene1-chart"></canvas>';
            const ctx = document.getElementById('scene1-chart').getContext('2d');

            // Use simState to generate data
            const initialConcentration = simState.concentration;
            const k = 0.1; // Rate constant can be adjusted based on other params later
            const timePoints = Array.from({ length: 21 }, (_, i) => i);
            const concentrationPoints = timePoints.map(t => initialConcentration * Math.exp(-k * t));

            const tangentPlugin = {
                id: 'tangentPlugin',
                afterDraw: (chart) => {
                    const ctx = chart.ctx;
                    const xAxis = chart.scales.x;
                    const yAxis = chart.scales.y;

                    // --- Draw Secant Line (Average Rate) ---
                    const p1 = chart.getDatasetMeta(0).data[2]; // at t=2
                    const p2 = chart.getDatasetMeta(0).data[15]; // at t=15

                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#f97316'; // Orange
                    ctx.stroke();

                    ctx.fillStyle = '#f97316';
                    ctx.font = '12px Poppins';
                    ctx.fillText('Average Rate (Secant)', p2.x + 10, p2.y);
                    ctx.restore();

                    // --- Draw Tangent Line (Instantaneous Rate) ---
                    const pTangent = chart.getDatasetMeta(0).data[5]; // at t=5
                    const pBefore = chart.getDatasetMeta(0).data[4];
                    const pAfter = chart.getDatasetMeta(0).data[6];

                    const slope = (pAfter.y - pBefore.y) / (pAfter.x - pBefore.x);

                    const lineLength = 100;
                    const x0 = pTangent.x - lineLength;
                    const y0 = pTangent.y - lineLength * slope;
                    const x1 = pTangent.x + lineLength;
                    const y1 = pTangent.y + lineLength * slope;

                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(x0, y0);
                    ctx.lineTo(x1, y1);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#ef4444'; // Red
                    ctx.stroke();

                    ctx.fillStyle = '#ef4444';
                    ctx.fillText('Instantaneous Rate (Tangent)', x1 + 5, y1 + 5);
                    ctx.restore();
                }
            };

            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timePoints,
                    datasets: [{
                        label: '[R] (mol/L)',
                        data: concentrationPoints,
                        borderColor: 'var(--color-primary)',
                        tension: 0.2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { title: { display: true, text: 'Time (s)' } },
                        y: { title: { display: true, text: 'Concentration [R] (mol/L)' } }
                    }
                },
                plugins: [tangentPlugin]
            });
        }

        function setupScene2() {
            destroyChart();
            simulationArea.innerHTML = '<canvas id="scene2-chart"></canvas>';
            const ctx = document.getElementById('scene2-chart').getContext('2d');

            const concentrationPoints = Array.from({ length: 11 }, (_, i) => i * 0.2 * simState.concentration); // Scale with concentration
            const k = 0.5 + (simState.temperature - 273) / 100; // k depends on temp

            const zeroOrderRate = concentrationPoints.map(c => k);
            const firstOrderRate = concentrationPoints.map(c => k * c);
            const secondOrderRate = concentrationPoints.map(c => k * c * c);

            const datasets = [
                { label: 'Zero Order', data: zeroOrderRate, borderColor: '#3b82f6' },
                { label: 'First Order', data: firstOrderRate, borderColor: '#22c55e' },
                { label: 'Second Order', data: secondOrderRate, borderColor: '#ef4444' }
            ];

            datasets.forEach((ds, index) => ds.hidden = (index !== simState.order));

            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: concentrationPoints.map(c => c.toFixed(2)),
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { title: { display: true, text: 'Concentration [R] (mol/L)' } },
                        y: { title: { display: true, text: 'Rate (mol/L·s)' } }
                    }
                }
            });
        }

        function setupScene3() {
            destroyChart();
            simulationArea.innerHTML = '<canvas id="scene3-chart"></canvas>';
            const ctx = document.getElementById('scene3-chart').getContext('2d');
            const initialConcentration = simState.concentration;
            const k = 0.05 + (simState.temperature - 273) / 2000;
            const timePoints = Array.from({ length: 21 }, (_, i) => i);

            // Data for plots
            const zeroOrderData = timePoints.map(t => Math.max(0, initialConcentration - k * t));
            const firstOrderDataLn = timePoints.map(t => Math.log(initialConcentration) - k * t);

            // Half-life calculation
            const zeroOrderHalfLife = initialConcentration / (2 * k);
            const firstOrderHalfLife = 0.693 / k;

            const halfLifePlugin = {
                id: 'halfLifePlugin',
                afterDraw: (chart) => {
                    const isFirstOrder = simState.order !== 0;
                    const halfLife = isFirstOrder ? firstOrderHalfLife : zeroOrderHalfLife;
                    const xAxis = chart.scales.x;
                    const yAxis = chart.scales.y;

                    if (halfLife <= xAxis.max && halfLife > 0) {
                        const xPos = xAxis.getPixelForValue(halfLife);
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(xPos, yAxis.top);
                        ctx.lineTo(xPos, yAxis.bottom);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = '#8b5cf6';
                        ctx.setLineDash([5, 5]);
                        ctx.stroke();
                        ctx.fillStyle = '#8b5cf6';
                        ctx.textAlign = 'center';
                        ctx.fillText(`t½ = ${halfLife.toFixed(1)}s`, xPos, yAxis.top - 5);
                        ctx.restore();
                    }
                }
            };

            const datasets = [
                { label: '[R] vs. Time (Zero Order)', data: zeroOrderData, borderColor: '#3b82f6' },
                { label: 'ln[R] vs. Time (First Order)', data: firstOrderDataLn, borderColor: '#22c55e' }
            ];

            let activeDataset;
            let yAxisLabel;

            if (simState.order === 0) {
                activeDataset = datasets[0];
                yAxisLabel = '[R] (mol/L)';
            } else {
                activeDataset = datasets[1];
                yAxisLabel = 'ln[R]';
            }

            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timePoints,
                    datasets: [activeDataset]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { title: { display: true, text: 'Time (s)' } },
                        y: { title: { display: true, text: yAxisLabel } }
                    }
                },
                plugins: [halfLifePlugin]
            });
        }

        function setupScene4() {
            destroyChart();
            simulationArea.innerHTML = `
                <div style="width:100%; height:100%; display:flex; flex-direction:column; gap: 16px;">
                    <canvas id="scene4-canvas" style="height: 60%;"></canvas>
                    <div id="scene4-chart-container" style="height: 40%; position: relative;">
                        <canvas id="scene4-chart"></canvas>
                    </div>
                </div>
            `;
            const canvas = document.getElementById('scene4-canvas');
            const ctx = canvas.getContext('2d');
            let activationEnergy = 75; // kJ/mol
            let catalystActive = simState.catalyst;

            function drawEnergyProfile() {
                const { width, height } = canvas;
                ctx.clearRect(0, 0, width, height);

                const startY = height * 0.7;
                const endY = height * 0.8;
                const peakY = height * 0.2; // SCIENTIFICALLY ACCURATE: Peak is NOT dependent on temperature
                const catalystPeakY = height * 0.4;

                ctx.beginPath();
                ctx.moveTo(0, startY);
                ctx.bezierCurveTo(width * 0.25, startY, width * 0.3, peakY, width * 0.5, peakY);
                ctx.bezierCurveTo(width * 0.7, peakY, width * 0.75, endY, width, endY);
                ctx.strokeStyle = 'var(--color-primary)';
                ctx.lineWidth = 3;
                ctx.stroke();

                if (catalystActive) {
                    ctx.beginPath();
                    ctx.moveTo(0, startY);
                    ctx.bezierCurveTo(width * 0.25, startY, width * 0.3, catalystPeakY, width * 0.5, catalystPeakY);
                    ctx.bezierCurveTo(width * 0.7, catalystPeakY, width * 0.75, endY, width, endY);
                    ctx.strokeStyle = '#22c55e';
                    ctx.stroke();
                }
            }

            drawEnergyProfile();

            const chartCtx = document.getElementById('scene4-chart').getContext('2d');
            const R = 8.314;
            const A = 1e11;
            const tempPoints = Array.from({ length: 11 }, (_, i) => 273 + i * 10);
            const invTempPoints = tempPoints.map(T => 1 / T);
            const Ea = catalystActive ? activationEnergy * 0.7 : activationEnergy;
            const lnKPoints = tempPoints.map(T => Math.log(A) - (Ea * 1000) / (R * T));

            chartInstance = new Chart(chartCtx, {
                type: 'line',
                data: {
                    labels: invTempPoints.map(t => t.toFixed(4)),
                    datasets: [{
                        label: 'ln(k)',
                        data: lnKPoints,
                        borderColor: '#f97316',
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { title: { display: true, text: '1/T (K⁻¹)' } },
                        y: { title: { display: true, text: 'ln(k)' } }
                    }
                }
            });
        }

        function setupScene5() {
            destroyChart();
            simulationArea.innerHTML = '<canvas id="scene5-canvas"></canvas>';
            const canvas = document.getElementById('scene5-canvas');
            const ctx = canvas.getContext('2d');
            let particles = [];
            const numParticles = Math.floor(simState.concentration * 20); // More concentration = more particles
            const velocityFactor = simState.temperature / 298; // Higher temp = faster particles

            function resizeCanvas() {
                canvas.width = simulationArea.clientWidth;
                canvas.height = simulationArea.clientHeight;
            }

            class Particle {
                constructor() {
                    this.radius = 8;
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.vx = (Math.random() - 0.5) * 2 * velocityFactor;
                    this.vy = (Math.random() - 0.5) * 2 * velocityFactor;
                    this.isProduct = false;
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = this.isProduct ? '#22c55e' : 'var(--color-primary)';
                    ctx.fill();
                }

                update() {
                    this.x += this.vx;
                    this.y += this.vy;

                    if (this.x < this.radius || this.x > canvas.width - this.radius) this.vx *= -1;
                    if (this.y < this.radius || this.y > canvas.height - this.radius) this.vy *= -1;
                }
            }

            function createParticles() {
                particles = [];
                for (let i = 0; i < numParticles; i++) {
                    particles.push(new Particle());
                }
            }

            let animationFrameId = null;
            function animate() {
                if (!simState.isRunning) {
                    animationFrameId = requestAnimationFrame(animate);
                    return;
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach((p, i) => {
                    p.update();
                    p.draw();
                    // Check for collisions
                    for (let j = i + 1; j < particles.length; j++) {
                        const other = particles[j];
                        const dist = Math.hypot(p.x - other.x, p.y - other.y);
                        if (dist < p.radius + other.radius) {
                            // Simple collision -> successful reaction (for demo)
                            if (!p.isProduct && !other.isProduct && Math.random() < 0.01) { // 1% chance of reaction
                               p.isProduct = true;
                               other.isProduct = true;
                            }
                        }
                    }
                });
                animationFrameId = requestAnimationFrame(animate);
            }

            // Initialize
            resizeCanvas();
            createParticles();
            animate();

            // Cleanup on scene change
            const observer = new MutationObserver((mutations) => {
                if (!document.contains(canvas)) {
                    cancelAnimationFrame(animationFrameId);
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }


        // --- CORE UI FUNCTIONS ---

        function updateControlsVisibility() {
            controlGroups.forEach(group => {
                const visibleScenes = group.dataset.controlsFor.split(' ');
                if (visibleScenes.includes(String(activeScene))) {
                    group.style.display = 'flex';
                } else {
                    group.style.display = 'none';
                }
            });
        }

        function updateMstContent() {
            if (mstContent[activeScene] && mstContent[activeScene][activeMstTab]) {
                mstContentEl.innerHTML = `<p>${mstContent[activeScene][activeMstTab]}</p>`;
            }
        }

        function renderScene() {
            destroyChart(); // Clear previous scene's chart
            simulationArea.innerHTML = ''; // Clear previous scene's content

            switch (activeScene) {
                case '1':
                    setupScene1();
                    break;
                case '2':
                    setupScene2();
                    break;
                case '3':
                    setupScene3();
                    break;
                case '4':
                    setupScene4();
                    break;
                case '5':
                    setupScene5();
                    break;
            }

            // Update controls and MST panel
            updateControlsVisibility();
            updateMstContent();
        }


        // --- EVENT LISTENERS ---

        labChallengesContainer.addEventListener('click', (e) => {
            const challengeItem = e.target.closest('.challenge-item');
            if (challengeItem) {
                handleChallenge(challengeItem.dataset.challengeId);
            }
        });

        sceneTabs.addEventListener('click', (e) => {
            if (e.target.classList.contains('scene-tab')) {
                const newScene = e.target.dataset.scene;
                if (newScene !== activeScene) {
                    activeScene = newScene;
                    // Update active class
                    sceneTabs.querySelector('.active').classList.remove('active');
                    e.target.classList.add('active');
                    // Re-render
                    renderScene();
                }
            }
        });

        mstTabs.addEventListener('click', (e) => {
            if (e.target.classList.contains('mst-tab')) {
                const newTab = e.target.dataset.mstTab;
                if (newTab !== activeMstTab) {
                    activeMstTab = newTab;
                    // Update active class
                    mstTabs.querySelector('.active').classList.remove('active');
                    e.target.classList.add('active');
                    // Re-render content
                    updateMstContent();
                }
            }
        });

        // --- EVENT LISTENERS (CONTROLS) ---
        function bindControlEvents() {
            const concentrationSlider = document.getElementById('concentration-slider');
            const temperatureSlider = document.getElementById('temperature-slider');
            const orderSelect = document.getElementById('order-select');
            const catalystToggle = document.getElementById('catalyst-toggle');

            concentrationSlider.addEventListener('input', (e) => {
                simState.concentration = parseFloat(e.target.value);
                document.getElementById('concentration-value').textContent = simState.concentration.toFixed(1);
                renderScene();
            });

            temperatureSlider.addEventListener('input', (e) => {
                simState.temperature = parseInt(e.target.value);
                document.getElementById('temperature-value').textContent = simState.temperature;
                renderScene();
            });

            orderSelect.addEventListener('change', (e) => {
                simState.order = parseInt(e.target.value);
                renderScene();
            });

            catalystToggle.addEventListener('change', (e) => {
                simState.catalyst = e.target.checked;
                renderScene();
            });

            const playPauseBtn = document.getElementById('play-pause-btn');
            playPauseBtn.addEventListener('click', () => {
                simState.isRunning = !simState.isRunning;
                playPauseBtn.textContent = simState.isRunning ? 'Pause' : 'Play';
            });

            const resetBtn = document.getElementById('reset-btn');
            resetBtn.addEventListener('click', () => {
                simState.concentration = 1.0;
                simState.temperature = 298;
                simState.order = 0;
                simState.catalyst = false;
                simState.isRunning = true;

                // Manually update controls
                document.getElementById('concentration-slider').value = simState.concentration;
                document.getElementById('concentration-value').textContent = simState.concentration.toFixed(1);
                document.getElementById('temperature-slider').value = simState.temperature;
                document.getElementById('temperature-value').textContent = simState.temperature;
                document.getElementById('order-select').value = simState.order;
                document.getElementById('catalyst-toggle').checked = simState.catalyst;
                playPauseBtn.textContent = 'Pause';

                renderScene();
            });
        }


        // --- INITIALIZATION ---
        function init() {
            renderScene();
            bindControlEvents();
        }

        init();
    }

    // Load Chart.js from CDN, then initialize the simulation
    loadScript('https://cdn.jsdelivr.net/npm/chart.js', initializeSimulation);
})();
