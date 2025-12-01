/*
  dynamic-loader.js
  Ensures that dependency scripts are loaded before the main simulation script runs.
*/
function loadScript(src, callback) {
    let script = document.createElement('script');
    script.src = src;
    script.onload = () => callback();
    document.head.appendChild(script);
}

// Chain the loading of scripts
loadScript('https://cdn.jsdelivr.net/npm/chart.js', () => {
    loadScript('https://cdn.jsdelivr.net/npm/chartjs-plugin-dragdata', () => {
        // Now that dependencies are loaded, load the main simulation script
        let mainScript = document.createElement('script');
        // Add cache-busting query parameter
        mainScript.src = 'simulation.js?v=' + new Date().getTime();
        document.body.appendChild(mainScript);
    });
});
