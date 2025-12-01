# Simulation Name
Chemical Kinetics: Rate, Order, Mechanism & Temperature Dependence

## Global Simulation Parameters
This section defines the initial state and adjustable parameters for the simulation. These values persist and can be modified by the user through the control panel sliders.

| Parameter | Default | Range | Step | Notes |
|---|---|---|---|---|
| Initial Concentration [R]₀ | 0.80 mol/L | 0.1–1.0 mol/L | 0.05 | Adjustable in Scene 3 |
| Temperature (T) | 298 K | 280–330 K | 2 K | Adjustable in Scene 4 |
| Activation Energy (Ea) | 50 kJ/mol | 20–100 kJ/mol | 5 kJ | Adjustable in Scene 4 |
| Frequency Factor (A) | 2.0 × 10⁹ s⁻¹ | — | — | Auto-lock (hidden) |

## Scene Structure

### Scene 1 — Measuring Reaction Rate: Average vs Instantaneous
- **Scene Overview:** This scene introduces the concept of reaction rate by visualizing the change in reactant concentration over time. It differentiates between the average rate over an interval and the instantaneous rate at a specific point.
- **Visual Elements:**
  - A dynamic graph of Concentration of Reactant [R] vs. Time. The curve will be steeper initially and flatten over time.
  - A molecular view animation showing a high concentration of R particles, which decreases as the simulation progresses.
- **User Interaction Elements:**
  - The user can select two points on the curve to draw a secant line. The calculated average rate (–Δ[R]/Δt) will be displayed.
  - The user can drag a single point along the curve to display a tangent line. The calculated instantaneous rate (–d[R]/dt) will be displayed in real-time.
- **Graphs / Sliders / Parameters:**
  - Graph: [R] vs. Time.
  - No sliders in this scene.
- **Key Equations and Models:**
  - Average rate = –Δ[R]/Δt
  - Instantaneous rate = –d[R]/dt
- **Multi-Style Thinking Elements:**
  - **Analogy (Pop-up):** Clicking on "Instantaneous Rate" will trigger a pop-up comparing it to a car's speedometer reading versus its average speed over a journey.
  - **Cause-Effect (Annotation):** The graph will be annotated with "Steeper slope = higher initial rate; Flatter slope = lower rate as reactant is consumed."

### Scene 2 — Rate Law, Order & Molecularity
- **Scene Overview:** This scene explains that reaction rates are determined experimentally through the rate law, which is not necessarily derived from the stoichiometric equation. It introduces the concepts of reaction order and molecularity.
- **Visual Elements:**
  - A graph of Initial Rate vs. Initial Concentration [A] for a hypothetical reaction A + B → C.
  - A simple molecular animation showing that not all collisions lead to a reaction.
- **User Interaction Elements:**
  - The user can select different experimental data sets (e.g., varying [A] while [B] is constant) to see how the initial rate changes. The graph will update accordingly.
- **Graphs / Sliders / Parameters:**
  - Graph: Rate vs. [A].
- **Key Equations and Models:**
  - Rate Law: Rate = k[A]ˣ[B]ʸ (order = x + y)
- **Multi-Style Thinking Elements:**
  - **Misconception Fix (Triggered):** If the user tries to determine the rate law from a given stoichiometric equation (e.g., 2A + B → C), a pop-up will explain that order must be determined experimentally.
  - **Analogy (Pop-up):** Clicking on "Order" will trigger a pop-up explaining it's like determining which ingredients in a recipe most affect the taste, which can only be found by trying different amounts.

### Scene 3 — Integrated Rate Laws & Half-Life (Zero vs First Order)
- **Scene Overview:** This scene contrasts zero-order and first-order reactions, focusing on their integrated rate laws and the concept of half-life.
- **Visual Elements:**
  - Two switchable graphs: one for a zero-order reaction ([R] vs. t is a straight line) and one for a first-order reaction (ln[R] vs. t is a straight line).
  - A visual representation of half-life (e.g., a bar that halves at regular intervals for a first-order reaction).
- **User Interaction Elements:**
  - The user can switch between "Zero Order" and "First Order" views.
  - Sliders to adjust initial concentration [R]₀.
- **Graphs / Sliders / Parameters:**
  - Graphs: [R] vs. t (Zero Order), ln[R] vs. t (First Order).
  - The user can adjust the Initial Concentration [R]₀ using a slider (see Global Simulation Parameters).
- **Key Equations and Models:**
  - Zero order: [R] = [R]₀ – kt, t½ = [R]₀/2k
  - First order: ln[R] = ln[R]₀ – kt; t½ = 0.693/k
- **Multi-Style Thinking Elements:**
  - **Cause-Effect (Annotation):** When the user doubles [R]₀, an annotation will appear: "For first-order, t½ is constant. For zero-order, t½ doubles."
  - **Analogy (Pop-up):** Clicking "Half-life" triggers a pop-up comparing it to repeatedly cutting a chocolate bar in half.

### Scene 4 — Temperature, Arrhenius Plot & Catalyst
- **Scene Overview:** This scene explores the effect of temperature and catalysts on the reaction rate constant, k, using the Arrhenius equation and potential energy diagrams.
- **Visual Elements:**
  - A potential energy diagram showing the activation energy (Ea) barrier. A second, lower-Ea curve appears when a catalyst is added.
  - An Arrhenius plot (ln k vs. 1/T).
- **User Interaction Elements:**
  - Sliders to adjust Temperature (T) and Activation Energy (Ea).
  - A button to "Add Catalyst," which will lower the Ea value.
- **Graphs / Sliders / Parameters:**
  - Graphs: Potential Energy Diagram, Arrhenius Plot (ln k vs. 1/T).
  - The user can adjust Temperature (T) and Activation Energy (Ea) using sliders (see Global Simulation Parameters).
- **Key Equations and Models:**
  - Arrhenius: k = A e⁻ᴱᵃ/ᴿᵀ
  - ln k vs 1/T slope = –Ea/R
- **Multi-Style Thinking Elements:**
  - **Analogy (Pop-up):** Clicking on "Activation Energy" shows an animation of a person biking over a hill, with the catalyst making the hill smaller.
  - **Misconception Fix (Triggered):** If the user increases T, a note clarifies that the catalyst does not increase temperature; it provides an alternative reaction pathway.

### Scene 5 — Collision Theory & Reaction Mechanism
- **Scene Overview:** This scene visualizes collision theory and explains how reaction mechanisms, particularly the rate-determining step, relate to the overall rate law.
- **Visual Elements:**
  - An animation of molecules colliding. Some collisions are ineffective (wrong orientation, not enough energy), while others are effective, leading to product formation.
  - A multi-step reaction animation showing a bottleneck, representing the rate-determining step.
- **User Interaction Elements:**
  - Buttons to view different proposed mechanisms for a reaction.
- **Graphs / Sliders / Parameters:**
  - No new graphs or sliders.
- **Key Equations and Models:**
  - Collision Theory: Rate = Z_AB * P * e⁻ᴱᵃ/ᴿᵀ
- **Multi-Style Thinking Elements:**
  - **Cause-Effect (Annotation):** The animation will be labeled: "Only effective collisions (Correct orientation + E ≥ Ea) lead to a reaction."
  - **Analogy (Pop-up):** Clicking "Rate-determining step" shows an animation of a traffic bottleneck controlling the flow of cars.

## UI Layout Mapping
- **Main Simulation Window:** Displays the primary visual content for each scene (graphs, animations, energy diagrams).
- **Control Panel:** Contains all sliders (Initial Concentration, Temperature, Ea), buttons (Add Catalyst, Switch Scene), and input elements.
- **Graph Region:** A dedicated area within the Main Simulation Window for plotting dynamic graphs.
- **Multi-Style Thinking Panel:** A tabbed interface containing:
  - **Visuals:** Static visual summaries for each scene.
  - **Analogies:** A list of all analogies used in the simulation.
  - **Cause-Effect:** A summary of all cause-effect relationships.
  - **Model Equations:** A quick reference for all key equations.
  - **Misconceptions:** A list of common misconceptions and their corrections.
- **Lab Challenges Panel:** A dedicated, full-screen view with the following challenges:
  - **OBSERVE:** "Explain why the concentration–time graph flattens over time." (Text input)
  - **COMPARE:** "Compare the zero-order and first-order half-life when initial concentration is doubled." (Multiple choice/Text input)
  - **EXPERIMENT:** "Adjust concentration and temperature sliders to achieve a target reaction rate. Justify your settings using the Arrhenius equation and the rate law." (Interactive sliders + text input)
  - **ANALYZE:** "Given the following data/graph, determine the reaction order, rate constant (k), and half-life (t½)." (Numerical/Text input)
  - **CHALLENGE:** "Propose a two-step mechanism for a given reaction and verify its consistency with the experimental rate law." (Text input)

## Navigation and Logic Flow
- **Scene Transitions:**
  - Default guided path: Users are progressed from Scene 1 to 5 sequentially via "Next Scene" buttons.
  - Free navigation: A side menu allows users to jump to any scene at any time.
- **State Persistence:**
  - Values for [R]₀, T, and Ea will persist across scenes. For example, changing the temperature in Scene 4 will affect the concentration-time graph if the user navigates back to Scene 3.

## Assessment Hooks
- User responses for all Lab Challenges will be captured and stored in a local session object. This includes text inputs, numerical answers, and slider values for the EXPERIMENT challenge. This data can be exported or reviewed by an instructor.
