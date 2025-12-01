/*
  Tarcin Modular Simulation Engine
  File: simulation.js
  Description: All simulation logic, physics, and animations for the Chemical Kinetics module.
*/

document.addEventListener('DOMContentLoaded', () => {

  // Load Chart.js dynamically
  const chartJsScript = document.createElement('script');
  chartJsScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
  document.head.appendChild(chartJsScript);
  chartJsScript.onload = main;

  function main() {
    // Data Store for all dynamic content
    const simulationContent = {
      scene1: {
        title: "Measuring Reaction Rate",
        controls: `
          <label for="s1-concentration">Initial [R]: <span id="s1-concentration-value">1.0</span> M</label>
          <input type="range" id="s1-concentration" min="0.5" max="2.0" step="0.1" value="1.0">
          <label for="s1-k">Rate Constant k: <span id="s1-k-value">0.1</span> s⁻¹</label>
          <input type="range" id="s1-k" min="0.05" max="0.5" step="0.01" value="0.1">
        `,
        mst: {
            visual: `<p>A curve on a Concentration vs. Time graph shows how the reactant [R] decreases. The slope of a <strong>secant line</strong> between two points gives the <strong>average rate</strong>. The slope of a <strong>tangent line</strong> at a single point gives the <strong>instantaneous rate</strong>.</p>`,
            analogy: `<p><strong>Average Rate vs. Instantaneous Rate:</strong> Think of a road trip. Your <strong>average speed</strong> is the total distance divided by total time. Your <strong>instantaneous speed</strong> is what you see on your car's speedometer at any given moment.</p>`,
            cause: `<p>The reaction rate is fastest at the beginning because the concentration of reactants is highest, leading to more frequent collisions. As reactants are consumed, the concentration drops, collisions become less frequent, and the rate slows down, causing the graph to flatten.</p>`,
            model: `<p><strong>Average Rate</strong> = –Δ[R]/Δt <br> <strong>Instantaneous Rate</strong> = –d[R]/dt <br> The negative sign indicates that the concentration of the reactant is decreasing.</p>`,
            fix: `<p><strong>Misconception:</strong> Reaction rate is constant. <br> <strong>Correction:</strong> The rate of most reactions changes over time. Only the instantaneous rate at t=0 is the initial rate; all subsequent instantaneous rates are lower.</p>`
        },
        lab: `<p><strong>OBSERVE (Blue):</strong> Change the initial concentration and rate constant sliders and observe how the steepness of the concentration-time graph changes. A steeper curve means a faster reaction rate.</p>`
      },
      scene2: {
        title: "Rate Law, Order & Molecularity",
        controls: `
            <label for="s2-concentration">Concentration [A]: <span id="s2-concentration-value">1.0</span> M</label>
            <input type="range" id="s2-concentration" min="0.1" max="2" step="0.1" value="1.0">
            <label for="s2-order">Reaction Order (x):</label>
            <select id="s2-order">
                <option value="0">Zero Order</option>
                <option value="1" selected>First Order</option>
                <option value="2">Second Order</option>
            </select>
            <p>Rate = k[A]<sup>x</sup></p>
        `,
        mst: {
            visual: `<p>The graph of <strong>Rate vs. Concentration</strong> changes based on the order. For zero-order, it's a flat line (rate is independent of concentration). For first-order, it's a straight line through the origin. For second-order, it's a steepening curve.</p>`,
            analogy: `<p><strong>Order vs. Molecularity:</strong> The <strong>order</strong> of a reaction is like finding out which ingredient in a recipe has the biggest impact on taste through experimentation. <strong>Molecularity</strong> is simply counting the number of ingredients listed in one step of the recipe.</p>`,
            cause: `<p>The reaction order determines how the rate depends on reactant concentration. A first-order reactant has a direct, linear effect on the rate. A zero-order reactant has no effect. The order must be determined experimentally.</p>`,
            model: `<p><strong>Rate Law:</strong> Rate = k[A]<sup>x</sup>[B]<sup>y</sup>. The overall order is x + y. The units of the rate constant 'k' depend on the overall order of the reaction.</p>`,
            fix: `<p><strong>Misconception:</strong> The order of a reaction is the same as the stoichiometric coefficient in the balanced chemical equation. <br><strong>Correction:</strong> Order is determined experimentally and often does not match the coefficients.</p>`
        },
        lab: `<p><strong>ANALYZE (Orange):</strong> Select 'Second Order'. If the rate is 0.5 M/s at [A]=1M, what will the rate be at [A]=2M? (Hint: Rate ∝ [A]²). Check your prediction using the slider.</p>`
      },
      scene3: {
        title: "Integrated Rate Laws & Half-Life",
        controls: `
          <label for="s3-order">Reaction Order:</label>
          <select id="s3-order">
            <option value="0">Zero Order</option>
            <option value="1" selected>First Order</option>
          </select>
          <label for="s3-concentration">Initial [R]₀: <span id="s3-concentration-value">1.0</span> M</label>
          <input type="range" id="s3-concentration" min="0.5" max="2.0" step="0.1" value="1.0">
        `,
        mst: {
          visual: `<p>Integrated rate laws are plotted to find a straight line, which confirms the reaction order. For <strong>Zero Order</strong>, [R] vs. t is linear. For <strong>First Order</strong>, ln[R] vs. t is linear. Half-life (t½) for first-order is constant.</p>`,
          analogy: `<p><strong>Half-Life:</strong> Imagine cutting a cake in half repeatedly. For a first-order reaction, each cut (half-life) takes the same amount of time, regardless of how much cake is left. For zero-order, the time to lose half gets shorter as the amount decreases.</p>`,
          cause: `<p>First-order half-life is constant because the rate is directly proportional to the concentration. So, at half the concentration, the rate is also halved, meaning the time to halve it again remains the same. This is not true for other orders.</p>`,
          model: `<p><strong>t½ (Zero Order)</strong> = [R]₀ / 2k<br><strong>t½ (First Order)</strong> = 0.693 / k<br>Note that first-order half-life is independent of the initial concentration [R]₀.</p>`,
          fix: `<p><strong>Misconception:</strong> Half-life is always the time it takes for the concentration to drop to half of its initial value. <br><strong>Correction:</strong> This is true, but only for first-order reactions is the half-life period constant throughout the reaction.</p>`
        },
        lab: `<p><strong>COMPARE (Purple):</strong> Select First Order. Set [R]₀ to 1.0 M and note the half-life. Now set [R]₀ to 2.0 M. Does the half-life change? Compare this behavior to a Zero Order reaction.</p>`
      },
      scene4: {
        title: "Temperature, Arrhenius Plot & Catalyst",
        controls: `
          <label for="s4-temp">Temperature: <span id="s4-temp-value">298</span> K</label>
          <input type="range" id="s4-temp" min="273" max="373" step="1" value="298">
          <label for="s4-catalyst">Catalyst:</label>
          <input type="checkbox" id="s4-catalyst"> Add Catalyst
        `,
        mst: {
          visual: `<p>The <strong>Potential Energy Diagram</strong> shows the activation energy (Ea) barrier reactants must overcome. A catalyst provides an alternative pathway with a lower Ea. The <strong>Arrhenius Plot</strong> (ln k vs 1/T) is a straight line whose slope gives -Ea/R.</p>`,
          analogy: `<p><strong>Catalyst:</strong> A catalyst is like a tunnel through a mountain. It doesn't change the start or end points of a journey, but it provides a lower-energy, faster route for travelers (molecules) to get to the other side.</p>`,
          cause: `<p>Increasing temperature gives more molecules sufficient kinetic energy to overcome the activation energy barrier. A catalyst lowers this barrier, so at the same temperature, a larger fraction of molecules have enough energy to react, increasing the rate.</p>`,
          model: `<p><strong>Arrhenius Equation:</strong> k = A * e<sup>(-Ea/RT)</sup><br>Where k is the rate constant, A is the frequency factor, Ea is activation energy, R is the gas constant, and T is temperature.</p>`,
          fix: `<p><strong>Misconception:</strong> A catalyst adds energy to the reaction. <br><strong>Correction:</strong> A catalyst does not add energy or change the temperature. It provides a different, lower-energy reaction mechanism or pathway.</p>`
        },
        lab: `<p><strong>EXPERIMENT (Green):</strong> Turn on the catalyst. By how much do you have to lower the temperature to get the same reaction rate as the uncatalyzed reaction at 320 K?</p>`
      },
      scene5: {
        title: "Collision Theory & Reaction Mechanism",
        controls: `
            <label for="s5-temp">Temperature: <span id="s5-temp-value">300</span> K</label>
            <input type="range" id="s5-temp" min="250" max="400" step="5" value="300">
            <label for="s5-orientation">Proper Orientation:</label>
            <input type="checkbox" id="s5-orientation" checked>
        `,
        mst: {
            visual: `<p>For a reaction to occur, reactant particles must collide with both sufficient energy (activation energy) and the correct orientation. This simulation shows particles (blue & green) colliding. Successful collisions that form products (red) are highlighted.</p>`,
            analogy: `<p><strong>Rate-Determining Step:</strong> A reaction mechanism is like an assembly line. The overall speed of the assembly line is limited by its slowest step, just as the overall reaction rate is determined by the slowest elementary step in its mechanism.</p>`,
            cause: `<p>Only a small fraction of collisions are effective because of the activation energy and orientation requirements. Increasing temperature increases both the frequency and the energy of collisions, thus increasing the reaction rate.</p>`,
            model: `<p><strong>Collision Theory:</strong> Rate = Z * ρ * e<sup>(-Ea/RT)</sup> <br> Where Z is the collision frequency and ρ is the steric (orientation) factor. The exponential term is the fraction of collisions with sufficient energy.</p>`,
            fix: `<p><strong>Misconception:</strong> All collisions between reactant molecules lead to products. <br><strong>Correction:</strong> Only a tiny fraction of collisions are effective. Most are like billiard ball bounces with no chemical change.</p>`
        },
        lab: `<p><strong>CHALLENGE (Red):</strong> Uncheck 'Proper Orientation'. Does the reaction rate increase or decrease? Explain why, using the principles of collision theory.</p>`
      }
    };

    const sceneTabs = document.querySelectorAll('.scene-tab-button');
    const mstTabs = document.querySelectorAll('.mst-tab-button');
    const mstContentContainer = document.getElementById('mst-content-container');
    const controlsContainer = document.getElementById('controls-container');
    const labChallengeContainer = document.getElementById('lab-challenge-container');
    let activeScene = 'scene1';
    let chartInstances = {};
    let animationFrameId; // To control the animation loop for scene 5

    // --- RENDERER OBJECT ---
    const sceneRenderers = {
        scene1: function() {
            const canvas = document.getElementById('scene1-graph');
            if (!canvas) return;
            canvas.innerHTML = '';
            const canvasEl = document.createElement('canvas');
            canvas.appendChild(canvasEl);

            const C0 = parseFloat(document.getElementById('s1-concentration').value);
            const k = parseFloat(document.getElementById('s1-k').value);
            const labels = Array.from({length: 21}, (_, i) => i * 0.5); // time
            const data = labels.map(t => C0 * Math.exp(-k * t));

            if (chartInstances.scene1) chartInstances.scene1.destroy();
            chartInstances.scene1 = new Chart(canvasEl, {
                type: 'line',
                data: { labels, datasets: [{
                    label: '[R] vs. Time', data,
                    borderColor: 'var(--color-primary)',
                    tension: 0.1, fill: false
                }]},
                options: { maintainAspectRatio: false }
            });
        },
        scene2: function() {
            const canvas = document.getElementById('scene2-graph');
            if (!canvas) return;
            canvas.innerHTML = '';
            const canvasEl = document.createElement('canvas');
            canvas.appendChild(canvasEl);

            const order = parseInt(document.getElementById('s2-order').value);
            const k = 0.5; // fixed for this scene
            const labels = Array.from({length: 11}, (_, i) => i * 0.2); // concentration
            const data = labels.map(c => k * Math.pow(c, order));

            if (chartInstances.scene2) chartInstances.scene2.destroy();
            chartInstances.scene2 = new Chart(canvasEl, {
                type: 'line',
                data: { labels, datasets: [{
                    label: 'Rate vs. [A]', data,
                    borderColor: 'var(--color-primary)',
                    tension: 0.1, fill: false
                }]},
                options: { maintainAspectRatio: false }
            });
        },
        scene3: function() {
            const canvas = document.getElementById('scene3-graph');
            if (!canvas) return;
            canvas.innerHTML = '';
            const canvasEl = document.createElement('canvas');
            canvas.appendChild(canvasEl);

            const C0 = parseFloat(document.getElementById('s3-concentration').value);
            const order = parseInt(document.getElementById('s3-order').value);
            const k = 0.1;
            const labels = Array.from({length: 11}, (_, i) => i);
            let data, yLabel;

            if (order === 0) {
                data = labels.map(t => Math.max(0, C0 - k * t));
                yLabel = '[R]';
            } else { // First order
                data = labels.map(t => Math.log(C0 * Math.exp(-k * t)));
                yLabel = 'ln[R]';
            }

            if (chartInstances.scene3) chartInstances.scene3.destroy();
            chartInstances.scene3 = new Chart(canvasEl, {
                type: 'line',
                data: { labels, datasets: [{
                    label: `${yLabel} vs. Time`, data,
                    borderColor: 'var(--color-primary)',
                    tension: 0.1, fill: false
                }]},
                options: { maintainAspectRatio: false, scales: { y: { title: { display: true, text: yLabel } } } }
            });
        },
        scene4: function() {
            const container = document.getElementById('scene4-visual');
            const canvasEl = document.createElement('canvas');
            canvasEl.id = 'pe-diagram-canvas';
            container.innerHTML = '';
            container.appendChild(canvasEl);
            const ctx = canvasEl.getContext('2d');
            const canvas = ctx.canvas;

            const catalyst = document.getElementById('s4-catalyst').checked;

            const w = canvas.width = container.clientWidth;
            const h = canvas.height = container.clientHeight;

            // Define energy levels
            const E_reactants = h * 0.7;
            const E_products = h * 0.8;
            const Ea_uncatalyzed = h * 0.3;
            const Ea_catalyzed = h * 0.5;

            ctx.clearRect(0, 0, w, h);
            ctx.font = "14px Poppins";
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text');

            // Draw axes
            ctx.beginPath();
            ctx.moveTo(w * 0.1, h * 0.1);
            ctx.lineTo(w * 0.1, h * 0.9);
            ctx.lineTo(w * 0.9, h * 0.9);
            ctx.stroke();
            ctx.fillText("Potential Energy", w*0.1 - 20, h*0.1 - 20);
            ctx.fillText("Reaction Progress", w*0.5, h*0.9 + 20);

            // Function to draw an energy profile
            const drawProfile = (Ea, color, label) => {
                ctx.beginPath();
                ctx.moveTo(w * 0.2, E_reactants);
                ctx.bezierCurveTo(w * 0.35, E_reactants, w * 0.4, Ea, w * 0.5, Ea);
                ctx.bezierCurveTo(w * 0.6, Ea, w * 0.65, E_products, w * 0.8, E_products);
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.stroke();

                // Draw Ea arrow and label
                ctx.beginPath();
                ctx.strokeStyle = "gray";
                ctx.lineWidth = 1;
                ctx.moveTo(w * 0.5, E_reactants);
                ctx.lineTo(w * 0.5, Ea);
                ctx.stroke();
                ctx.fillText(label, w*0.5 + 5, E_reactants - (E_reactants - Ea)/2);
            };

            // Draw Reactants and Products lines
            ctx.fillText("Reactants", w*0.12, E_reactants - 5);
            ctx.fillText("Products", w*0.82, E_products - 5);


            // Draw uncatalyzed path
            drawProfile(Ea_uncatalyzed, 'orange', 'Ea (uncatalyzed)');

            // Draw catalyzed path if checked
            if (catalyst) {
                drawProfile(Ea_catalyzed, 'var(--color-primary)', 'Ea (catalyzed)');
            }
        },
        scene5: function() {
            const container = document.getElementById('scene5-collision');
            const canvasEl = document.createElement('canvas');
            canvasEl.id = 'collision-canvas';
            container.innerHTML = '';
            container.appendChild(canvasEl);
            const ctx = canvasEl.getContext('2d');

            const temp = parseFloat(document.getElementById('s5-temp').value);
            const orientationMatters = document.getElementById('s5-orientation').checked;

            const w = canvasEl.width = container.clientWidth;
            const h = canvasEl.height = container.clientHeight;
            const Ea_threshold = 50; // Activation energy threshold

            let particles = Array.from({ length: 30 }, () => ({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - 0.5) * (temp / 100),
                vy: (Math.random() - 0.5) * (temp / 100),
                radius: 5,
                mass: 1,
                color: Math.random() > 0.5 ? '#0078ff' : '#00d4ff', // Reactant A or B
                reacted: false
            }));

            function update() {
                ctx.clearRect(0, 0, w, h);

                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    if (p.reacted) continue;

                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < p.radius || p.x > w - p.radius) p.vx *= -1;
                    if (p.y < p.radius || p.y > h - p.radius) p.vy *= -1;

                    // Collision detection
                    for (let j = i + 1; j < particles.length; j++) {
                        const other = particles[j];
                        if (other.reacted) continue;

                        const dx = other.x - p.x;
                        const dy = other.y - p.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < p.radius + other.radius) {
                            // Simple collision response
                            p.vx *= -1; p.vy *= -1;
                            other.vx *= -1; other.vy *= -1;

                            const kineticEnergy = 0.5 * (p.mass * (p.vx*p.vx + p.vy*p.vy) + other.mass * (other.vx*other.vx + other.vy*other.vy));
                            const hasCorrectOrientation = orientationMatters ? Math.random() > 0.5 : true;

                            if (kineticEnergy > Ea_threshold && hasCorrectOrientation) {
                                p.reacted = true;
                                other.reacted = true;
                            }
                        }
                    }
                }

                particles.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = p.reacted ? 'red' : p.color;
                    ctx.fill();
                });

                animationFrameId = requestAnimationFrame(update);
            }
            update();
        }
    };

    function switchScene(sceneId) {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
        document.getElementById(sceneId).classList.add('active');
        sceneTabs.forEach(t => t.classList.toggle('active', t.dataset.scene === sceneId));
        activeScene = sceneId;
        loadSceneContent();
        runSceneLogic();
    }

    function switchMstTab(mstId) {
        mstTabs.forEach(t => t.classList.toggle('active', t.dataset.mst === mstId));
        loadMstContent(mstId);
    }

    function loadSceneContent() {
        const content = simulationContent[activeScene];
        if (!content) return;
        controlsContainer.innerHTML = content.controls;
        labChallengeContainer.innerHTML = content.lab;
        mstTabs.forEach(t => t.classList.remove('active'));
        mstTabs[0].classList.add('active');
        loadMstContent(mstTabs[0].dataset.mst);
        addControlListeners();
    }

    function loadMstContent(mstId) {
        const content = simulationContent[activeScene]?.mst[mstId];
        if (content) mstContentContainer.innerHTML = content;
    }

    function addControlListeners() {
        controlsContainer.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('input', () => {
                // Optimized DOM update for sliders
                if (el.type === 'range') {
                    const label = document.getElementById(`${el.id}-value`);
                    if (label) label.textContent = el.value;
                }
                runSceneLogic();
            });
        });
    }

    function runSceneLogic() {
        const renderFunction = sceneRenderers[activeScene];
        if (typeof renderFunction === 'function') {
            renderFunction();
        }
    }

    // --- INITIALIZATION ---
    sceneTabs.forEach(tab => tab.addEventListener('click', () => switchScene(tab.dataset.scene)));
    mstTabs.forEach(tab => tab.addEventListener('click', () => switchMstTab(tab.dataset.mst)));
    switchScene('scene1');
  }
});
