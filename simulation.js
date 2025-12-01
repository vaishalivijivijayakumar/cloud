/*
  simulation.js
  Tarcin Modular Simulation Engine
  Chemical Kinetics: Rate, Order, Mechanism & Temperature Dependence
*/

// --- DATA STORE FOR SCENE CONTENT --- //
const mstContent = {
    1: {
        title: "Visualizing Rates",
        items: [
            "<strong>Visual:</strong> The concentration–time graph is a curve, not a straight line. A secant between two points gives the average rate, while the tangent at a single point gives the instantaneous rate.",
            "<strong>Analogy:</strong> This is like comparing your average speed over a whole car trip (average rate) versus the exact speed on your speedometer at one specific moment (instantaneous rate).",
            "<strong>Cause:</strong> The rate of reaction, shown by the curve's steepness, is highest at the start because the concentration of reactants is highest, leading to more frequent collisions.",
            "<strong>Model:</strong> Average rate = –Δ[R]/Δt. Instantaneous rate = –d[R]/dt.",
            "<strong>Fix:</strong> A common mistake is thinking the reaction rate is constant. The graph clearly shows the rate decreases as reactants are used up."
        ]
    },
    2: {
        title: "Rate Law & Order",
        items: [
            "<strong>Visual:</strong> A graph of Rate vs. [A] is horizontal for zero-order, a straight sloped line for first-order, and a steep curve for second-order.",
            "<strong>Analogy:</strong> Reaction order is like knowing how much adding more of one ingredient (a reactant) will speed up the whole recipe (the reaction rate).",
            "<strong>Cause:</strong> The exponents in the rate law (x and y) dictate how sensitive the reaction rate is to changes in the concentration of each reactant.",
            "<strong>Model:</strong> Rate = k[A]ˣ[B]ʸ. The overall order is the sum of the exponents (x + y).",
            "<strong>Fix:</strong> The order of a reaction is NOT determined by the stoichiometric coefficients in the balanced equation. It must be found experimentally."
        ]
    },
    3: {
        title: "Integrated Rate Laws",
        items: [
            "<strong>Visual:</strong> For a zero-order reaction, a plot of [R] vs. time is a straight line. For a first-order reaction, a plot of ln[R] vs. time is a straight line.",
            "<strong>Analogy:</strong> First-order half-life is like repeatedly cutting a chocolate bar in half. Each cut takes the same amount of time, but the amount you remove gets smaller.",
            "<strong>Cause:</strong> The constant half-life in a first-order reaction means the time it takes for the concentration to halve is independent of the initial amount.",
            "<strong>Model:</strong> Zero-order: [R] = [R]₀ – kt. First-order: ln[R] = ln[R]₀ – kt.",
            "<strong>Fix:</strong> Half-life is NOT constant for all reaction orders. For a zero-order reaction, the half-life decreases as the initial concentration decreases."
        ]
    },
    4: {
        title: "Temperature & Activation Energy",
        items: [
            "<strong>Visual:</strong> An energy profile diagram shows the activation energy (Ea) as a barrier. A catalyst provides an alternative pathway with a lower Ea barrier.",
            "<strong>Analogy:</strong> Activation energy is like needing to push a boulder up a small hill before it can roll down the other side. A catalyst is like finding a lower pass through the hill.",
            "<strong>Cause:</strong> Increasing temperature gives more molecules enough kinetic energy to overcome the Ea barrier. A catalyst lowers the barrier itself.",
            "<strong>Model:</strong> Arrhenius Equation: k = A * e^(-Ea/RT). Taking the natural log gives ln(k) = ln(A) - Ea/RT, which is the equation of a straight line (y = c + mx).",
            "<strong>Fix:</strong> A catalyst does not get used up in the reaction and does not change the overall enthalpy (ΔH) of the reaction—it only changes the rate."
        ]
    },
     5: {
        title: "Collision Theory",
        items: [
            "<strong>Visual:</strong> The micro view shows particles in constant, random motion. Only collisions with sufficient energy AND correct orientation result in a reaction.",
            "<strong>Analogy:</strong> A successful reaction is like a key fitting into a lock. It's not enough for the key (molecule A) to just bump into the lock (molecule B); it must hit at the right angle and with enough force.",
            "<strong>Cause:</strong> The rate depends on the collision frequency (Z), the fraction of molecules with E ≥ Ea, and the steric factor (P) representing the orientation requirement.",
            "<strong>Model:</strong> Rate = Z_AB * P * e^(-Ea/RT). This combines the concepts of collision, orientation, and energy.",
            "<strong>Fix:</strong> Don't assume every collision between reactant particles leads to a product. The vast majority of collisions are ineffective."
        ]
    }
};

const labChallenges = {
    1: {
        title: "Lab Challenges: Rate of Reaction",
        items: [
            { type: "observe", text: "Observe how the slope of the concentration–time graph decreases and explain why the reaction slows down.", tags: ["Scientific reasoning"] },
            { type: "analyze", text: "From the graph, determine the average rate between t=10s and t=30s, and the instantaneous rate at t=40s.", tags: ["Data interpretation"] }
        ]
    },
    2: {
        title: "Lab Challenges: Rate Law & Order",
        items: [
            { type: "experiment", text: "Create two conditions using sliders that produce a similar rate and explain your choices using the rate law.", tags: ["Mathematical modeling"] },
            { type: "challenge", text: "Using the Pseudo First-Order mode, explain how you would experimentally determine the order with respect to reactant A.", tags: ["Experimental design"] }
        ]
    },
    3: {
        title: "Lab Challenges: Integrated Rate Laws",
        items: [
            { type: "compare", text: "Compare zero-order and first-order half-life plots and explain which depends on initial concentration.", tags: ["Scientific reasoning"] },
            { type: "analyze", text: "A medicine follows first-order decay. If its half-life is 30 days, calculate the rate constant (k) and the time it takes to reach 10% of its initial concentration.", tags: ["Real-world linkage"] }
        ]
    },
    4: {
        title: "Lab Challenges: Temperature & Catalyst",
        items: [
            { type: "observe", text: "Observe the effect of temperature and a catalyst on the rate constant 'k' and explain the difference in their mechanisms.", tags: ["Scientific reasoning"] },
            { type: "analyze", text: "Using the Arrhenius plot, estimate the activation energy (Ea) of the reaction and explain the meaning of the slope.", tags: ["Mathematical modeling"] }
        ]
    },
    5: {
        title: "Lab Challenges: Collision Theory & Mechanism",
        items: [
            { type: "compare", text: "Compare the number of effective collisions at a low temperature versus a high temperature and explain the dramatic increase.", tags: ["Data interpretation"] },
            { type: "challenge", text: "Propose a two-step reaction mechanism and justify how the rate-determining step connects the mechanism to the experimental rate law.", tags: ["Communication", "Modeling"] }
        ]
    }
};

// --- CHART INSTANCES --- //
let concTimeChart, rateConcChart, integratedRateChart, energyProfileChart, arrheniusChart;
let s5AnimationId; // For starting/stopping scene 5 animation

// --- SCRIPT INITIALIZATION --- //
// The script runs after the HTML is loaded, so we can initialize directly.
setupTabs();
loadContentForScene(1);

// Initialize scenes
initScene1();
initScene2();
initScene3();
initScene4();
initScene5();


// --- GENERAL SETUP FUNCTIONS --- //

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const sceneNum = tab.dataset.scene;
            
            // Stop animation if leaving scene 5
            if (s5AnimationId && document.querySelector('#scene-5').classList.contains('active')) {
                cancelAnimationFrame(s5AnimationId);
                s5AnimationId = null;
            }

            // UI updates for tabs and scenes
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.scene').forEach(scene => {
                scene.classList.remove('active');
            });
            document.getElementById(`scene-${sceneNum}`).classList.add('active');
            
            // Load dynamic content
            loadContentForScene(sceneNum);

            // Start animation if entering scene 5
            if (sceneNum === '5' && !s5AnimationId) {
                const canvas = document.getElementById('collisionCanvas');
                const ctx = canvas.getContext('2d');
                setupScene5Animation(ctx); // Restart animation
            }
        });
    });
}

function loadContentForScene(sceneNum) {
    const mstPanel = document.getElementById(`mst-panel-s${sceneNum}`);
    const labPanel = document.getElementById(`lab-challenges-s${sceneNum}`);
    
    // MST Content
    const mstData = mstContent[sceneNum];
    if (mstData) {
        let mstHtml = `<h3>${mstData.title}</h3><ul>`;
        mstData.items.forEach(item => {
            mstHtml += `<li>${item}</li>`;
        });
        mstHtml += '</ul>';
        mstPanel.innerHTML = mstHtml;
    }

    // Lab Challenges Content
    const labData = labChallenges[sceneNum];
    if (labData) {
        let labHtml = `<h3>${labData.title}</h3>`;
        labData.items.forEach(item => {
            let tagsHtml = (item.tags || []).map(tag => `<span class="nep-tag">${tag}</span>`).join(' ');
            labHtml += `<div class="lab-challenge-item challenge-${item.type}"><strong>${item.type.toUpperCase()}:</strong> ${item.text} ${tagsHtml}</div>`;
        });
        labPanel.innerHTML = labHtml;
    }
}


// --- SCENE INITIALIZATION --- //

/** SCENE 1: Measuring Rate **/
function initScene1() {
    const ctx = document.getElementById('concTimeChart').getContext('2d');
    const avgModeRadio = document.getElementById('s1-mode-avg');
    const instModeRadio = document.getElementById('s1-mode-inst');
    const instructions = document.getElementById('s1-instructions');

    const initialConc = 1.0;
    const k = 0.05;
    const labels = Array.from({ length: 51 }, (_, i) => i);
    const data = labels.map(t => initialConc * Math.exp(-k * t));

    concTimeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Concentration [R]',
                data: data,
                borderColor: 'rgba(0, 120, 255, 0.8)',
                borderWidth: 3,
                tension: 0.1,
                pointRadius: 0
            }, {
                label: 'Measurement Handle',
                data: [{ x: 10, y: data[10] }, { x: 30, y: data[30] }],
                borderColor: 'rgba(231, 76, 60, 0.9)',
                backgroundColor: 'rgba(231, 76, 60, 0.9)',
                pointRadius: 8,
                showLine: true,
                dragData: true,
            }]
        },
        options: {
            plugins: {
                dragData: {
                    onDrag: (e) => {
                        e.target.style.cursor = 'grabbing';
                        updateScene1Rates();
                    },
                    onDragEnd: (e) => {
                        e.target.style.cursor = 'default';
                        updateScene1Rates();
                    },
                }
            },
            scales: {
                x: { type: 'linear', title: { display: true, text: 'Time (s)' } },
                y: { title: { display: true, text: 'Concentration [R] (mol/L)' }, min: 0 }
            }
        }
    });
    
    function setMode() {
        const isAverageMode = avgModeRadio.checked;
        const points = concTimeChart.data.datasets[1].data;
        
        if (isAverageMode) {
            if (points.length === 1) { // switching from inst to avg
                points.push({ x: points[0].x + 20, y: data[Math.min(50, Math.round(points[0].x) + 20)] });
            }
            instructions.textContent = "Drag the two handles to measure average rate.";
        } else { // Instantaneous mode
            if (points.length === 2) { // switching from avg to inst
                points.splice(1, 1);
            }
            instructions.textContent = "Drag the handle to measure instantaneous rate at any point.";
        }
        concTimeChart.update();
        updateScene1Rates();
    }

    avgModeRadio.addEventListener('click', setMode);
    instModeRadio.addEventListener('click', setMode);
    
    setMode(); // Initial setup
}

function updateScene1Rates() {
    const avgRateOutput = document.getElementById('avg-rate-output');
    const instRateOutput = document.getElementById('inst-rate-output');
    const points = concTimeChart.data.datasets[1].data;
    const isAverageMode = document.getElementById('s1-mode-avg').checked;

    const k = 0.05;
    const initialConc = 1.0;

    if (isAverageMode && points.length === 2) {
        const dx = points[1].x - points[0].x;
        // Snap points to the curve
        points[0].y = initialConc * Math.exp(-k * points[0].x);
        points[1].y = initialConc * Math.exp(-k * points[1].x);
        const dy = points[1].y - points[0].y;
        
        const avgRate = dx !== 0 ? -dy / dx : 0;
        avgRateOutput.textContent = avgRate.toFixed(4);
        instRateOutput.textContent = "-";
        concTimeChart.update('none'); // Update without animation
    } else if (!isAverageMode && points.length === 1) {
        const time = points[0].x;
        // Snap point to the curve
        points[0].y = initialConc * Math.exp(-k * time);
        const currentConc = points[0].y;
        const instRate = k * currentConc;
        
        instRateOutput.textContent = instRate.toFixed(4);
        avgRateOutput.textContent = "-";
        concTimeChart.update('none');
    }
}

/** SCENE 2: Rate Law **/
function initScene2() {
    const controls = {
        concA: document.getElementById('s2-conc-a'),
        orderA: document.getElementById('s2-order-a'),
        concB: document.getElementById('s2-conc-b'),
        orderB: document.getElementById('s2-order-b'),
        pseudoToggle: document.getElementById('s2-pseudo-order-toggle'),
    };
    const outputs = {
        concA: document.getElementById('s2-conc-a-value'),
        concB: document.getElementById('s2-conc-b-value'),
        orderA: document.getElementById('s2-order-a-display'),
        orderB: document.getElementById('s2-order-b-display'),
        rate: document.getElementById('s2-rate-output'),
        rateLaw: document.getElementById('s2-rate-law-display'),
    };
    
    const k = 0.2; // Arbitrary rate constant for this scene

    function updateRate() {
        const isPseudo = controls.pseudoToggle.checked;
        if (isPseudo) {
            controls.concB.value = 20.0; // Simulate large excess
            controls.concB.disabled = true;
            controls.orderB.value = 1; // Assume first order for B
            controls.orderB.disabled = true;
        } else {
            controls.concB.disabled = false;
            controls.orderB.disabled = false;
        }

        const concA = parseFloat(controls.concA.value);
        const orderA = parseInt(controls.orderA.value);
        const concB = parseFloat(controls.concB.value);
        const orderB = parseInt(controls.orderB.value);

        const baseRate = k * Math.pow(concA, orderA) * Math.pow(concB, orderB);

        // Update UI text outputs
        outputs.concA.textContent = concA.toFixed(1);
        outputs.concB.textContent = concB.toFixed(1);
        outputs.orderA.textContent = orderA;
        outputs.orderB.textContent = orderB;
        outputs.rate.textContent = baseRate.toFixed(3);
        
        if(isPseudo) {
            const k_prime = k * Math.pow(concB, orderB);
            outputs.rateLaw.innerHTML = `Rate = k'[A]<sup>${orderA}</sup> (where k' = k[B]<sup>${orderB}</sup> = ${k_prime.toFixed(2)})`;
        } else {
            outputs.rateLaw.innerHTML = `Rate = k[A]<sup>${orderA}</sup>[B]<sup>${orderB}</sup>`;
        }

        // Update rate table
        updateRateTable(baseRate, concA, orderA, concB, orderB);
    }
    
    function updateRateTable(baseRate, concA, orderA, concB, orderB) {
        // Double A
        const rate2A = k * Math.pow(concA * 2, orderA) * Math.pow(concB, orderB);
        document.getElementById('s2-rate-double-a').textContent = rate2A.toFixed(3);
        document.getElementById('s2-factor-double-a').textContent = `x ${(rate2A / baseRate).toFixed(2)}`;
        // Triple A
        const rate3A = k * Math.pow(concA * 3, orderA) * Math.pow(concB, orderB);
        document.getElementById('s2-rate-triple-a').textContent = rate3A.toFixed(3);
        document.getElementById('s2-factor-triple-a').textContent = `x ${(rate3A / baseRate).toFixed(2)}`;
        // Double B
        const rate2B = k * Math.pow(concA, orderA) * Math.pow(concB * 2, orderB);
        document.getElementById('s2-rate-double-b').textContent = rate2B.toFixed(3);
        document.getElementById('s2-factor-double-b').textContent = `x ${(rate2B / baseRate).toFixed(2)}`;
    }

    Object.values(controls).forEach(control => {
        control.addEventListener('input', updateRate);
    });

    updateRate(); // Initial calculation
}


/** SCENE 3: Integrated Rate Laws **/
function initScene3() {
    const ctx = document.getElementById('integratedRateChart').getContext('2d');
    const controls = {
        zeroOrder: document.getElementById('s3-zero-order'),
        firstOrder: document.getElementById('s3-first-order'),
        initialConc: document.getElementById('s3-initial-conc'),
        rateConstant: document.getElementById('s3-rate-constant'),
    };
    
    integratedRateChart = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: {
            scales: {
                x: { title: { display: true, text: 'Time (s)' } },
                y: { title: { display: true, text: 'Concentration or ln[R]' } }
            }
        }
    });

    function updatePlot() {
        const r0 = parseFloat(controls.initialConc.value);
        const k = parseFloat(controls.rateConstant.value);
        const isZeroOrder = controls.zeroOrder.checked;
        
        document.getElementById('s3-initial-conc-value').textContent = r0.toFixed(1);
        document.getElementById('s3-rate-constant-value').textContent = k.toFixed(2);
        
        let labels = Array.from({ length: 51 }, (_, i) => i);
        let data, halfLife, kUnit;
        
        if (isZeroOrder) {
            data = labels.map(t => Math.max(0, r0 - k * t));
            halfLife = r0 / (2 * k);
            kUnit = 'mol L⁻¹ s⁻¹';
            integratedRateChart.options.scales.y.title.text = 'Concentration [R]';
        } else { // First Order
            data = labels.map(t => Math.log(r0 * Math.exp(-k * t)));
            halfLife = 0.693 / k;
            kUnit = 's⁻¹';
            integratedRateChart.options.scales.y.title.text = 'ln[R]';
        }

        integratedRateChart.data.labels = labels;
        integratedRateChart.data.datasets = [{
            label: isZeroOrder ? 'Zero-Order Reaction' : 'First-Order Reaction',
            data: data,
            borderColor: 'var(--accent-color-dark)',
            pointRadius: 0
        }];
        integratedRateChart.update();
        
        document.getElementById('s3-half-life-output').textContent = halfLife.toFixed(2);
        document.getElementById('s3-k-output').textContent = `${k.toFixed(2)} ${kUnit}`;
    }
    
    Object.values(controls).forEach(control => control.addEventListener('input', updatePlot));
    updatePlot();
}


/** SCENE 4: Temperature & Catalyst **/
function initScene4() {
    const tempSlider = document.getElementById('s4-temperature');
    const catalystBtn = document.getElementById('s4-catalyst-toggle');
    
    const A = 1e10; // Pre-exponential factor
    const R = 8.314e-3; // Gas constant in kJ/mol·K
    let Ea = 50; // Initial Activation Energy in kJ/mol
    let isCatalyzed = false;

    const energyCtx = document.getElementById('energyProfileChart').getContext('2d');
    energyProfileChart = new Chart(energyCtx, {
        type: 'line',
        data: {
            labels: ['Reactants', 'Transition State', 'Products'],
            datasets: []
        },
        options: { scales: { y: { title: { display: true, text: 'Potential Energy (kJ)' } } } }
    });
    
    const arrheniusCtx = document.getElementById('arrheniusChart').getContext('2d');
    arrheniusChart = new Chart(arrheniusCtx, {
        type: 'line',
        data: { datasets: [] },
        options: { scales: { x: { title: { display: true, text: '1/T (K⁻¹)' } }, y: { title: { display: true, text: 'ln(k)' } } } }
    });

    function updateScene4() {
        const tempC = parseInt(tempSlider.value);
        const tempK = tempC + 273.15;
        document.getElementById('s4-temperature-value').textContent = tempC;

        const k = A * Math.exp(-Ea / (R * tempK));
        document.getElementById('s4-k-output').textContent = k.toExponential(2);
        document.getElementById('s4-ea-output').textContent = Ea;

        // Update Energy Profile
        energyProfileChart.data.datasets = [{
            label: 'Reaction Path',
            data: [20, 20 + Ea, 10], // Reactants, TS, Products
            borderColor: 'var(--accent-color-dark)',
            tension: 0.4
        }];
        energyProfileChart.update();
        
        // Update Arrhenius Plot
        const tempRange = Array.from({length: 8}, (_, i) => 283 + i * 10); // 283K to 353K
        const arrheniusData = tempRange.map(T => ({
            x: 1/T,
            y: Math.log(A * Math.exp(-Ea / (R * T)))
        }));
        arrheniusChart.data.datasets = [{
            label: 'ln(k) vs 1/T',
            data: arrheniusData,
            borderColor: 'var(--accent-color-dark)',
            showLine: true
        }];
        arrheniusChart.update();
    }
    
    catalystBtn.addEventListener('click', () => {
        isCatalyzed = !isCatalyzed;
        Ea = isCatalyzed ? 30 : 50; // Lower Ea with catalyst
        catalystBtn.textContent = isCatalyzed ? 'Remove Catalyst' : 'Add Catalyst';
        catalystBtn.style.backgroundColor = isCatalyzed ? 'var(--accent-color-hover)' : '';
        updateScene4();
    });

    tempSlider.addEventListener('input', updateScene4);
    updateScene4();
}


/** SCENE 5: Collision Theory **/
function initScene5() {
    const canvas = document.getElementById('collisionCanvas');
    const ctx = canvas.getContext('2d');
    const modal = document.getElementById('rds-modal');
    const openBtn = document.getElementById('rds-popup-btn');
    const closeBtn = modal.querySelector('.modal-close-btn');
    
    // Set canvas size
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight > 250 ? container.clientHeight : 250;
    
    // Modal logic
    openBtn.addEventListener('click', () => modal.style.display = 'flex');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Start animation immediately if this is the active scene on load
    if (document.querySelector('#scene-5').classList.contains('active')) {
       setupScene5Animation(ctx);
    }
}

let particles = [];
function setupScene5Animation(ctx) {
    const controls = {
        concentration: document.getElementById('s5-concentration'),
        temperature: document.getElementById('s5-temperature')
    };

    const canvas = ctx.canvas;
    const effectiveCollisionsEl = document.getElementById('s5-effective-collisions');
    const totalCollisionsEl = document.getElementById('s5-total-collisions');
    
    let effectiveCollisions = 0;
    let totalCollisions = 0;

    function createParticles() {
        particles = [];
        const numParticles = parseInt(controls.concentration.value);
        document.getElementById('s5-concentration-value').textContent = numParticles;
        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 5,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: 'var(--text-color-light)'
            });
        }
    }

    function updateParticleSpeed() {
        const tempK = parseFloat(controls.temperature.value);
        document.getElementById('s5-temperature-value').textContent = tempK;
        const speedFactor = Math.sqrt(tempK / 298); // Proportional to sqrt(T)
        particles.forEach(p => {
            p.vx *= speedFactor;
            p.vy *= speedFactor;
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, i) => {
            // Move particle
            p.x += p.vx;
            p.y += p.vy;

            // Wall collision
            if (p.x < p.radius || p.x > canvas.width - p.radius) p.vx *= -1;
            if (p.y < p.radius || p.y > canvas.height - p.radius) p.vy *= -1;

            // Particle collision
            for (let j = i + 1; j < particles.length; j++) {
                const other = particles[j];
                const dx = other.x - p.x;
                const dy = other.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < p.radius + other.radius) {
                    totalCollisions++;
                    // Simple collision response
                    p.vx *= -1; p.vy *= -1;
                    other.vx *= -1; other.vy *= -1;

                    // Check for "effective" collision (simplified)
                    const tempK = parseFloat(controls.temperature.value);
                    const kineticEnergy = 0.5 * (p.vx*p.vx + p.vy*p.vy);
                    if (kineticEnergy > (tempK/298)*5) { // Arbitrary energy threshold
                         effectiveCollisions++;
                         p.color = '#2ecc71'; // Green
                         other.color = '#2ecc71';
                    } else {
                         p.color = '#e74c3c'; // Red
                         other.color = '#e74c3c';
                    }
                }
            }

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            // Reset color after a short time
            if(p.color !== 'var(--text-color-light)') {
                setTimeout(() => { p.color = 'var(--text-color-light)'}, 200);
            }
        });
        
        totalCollisionsEl.textContent = totalCollisions;
        effectiveCollisionsEl.textContent = effectiveCollisions;
        s5AnimationId = requestAnimationFrame(animate);
    }
    
    controls.concentration.addEventListener('input', createParticles);
    controls.temperature.addEventListener('input', updateParticleSpeed);
    
    createParticles();
    animate();
}
