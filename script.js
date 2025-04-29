document.getElementById('quantity-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page reload

    // Get input values
    const length = parseFloat(document.getElementById('length').value);
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);

    const resultsDiv = document.getElementById('results');
    const errorDiv = document.getElementById('error-message');

    // --- Clear previous results and errors ---
    resultsDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    document.getElementById('bricks-result').textContent = '---';
    document.getElementById('cement-result').textContent = '---';
    document.getElementById('sand-result').textContent = '---';
    document.getElementById('aggregate-result').textContent = '---';
    document.getElementById('steel-result').textContent = '---';

    // --- Input Validation ---
    if (isNaN(length) || isNaN(width) || isNaN(height) || length <= 0 || width <= 0 || height <= 0) {
        errorDiv.textContent = 'Please enter valid positive numbers for all dimensions.';
        errorDiv.style.display = 'block';
        return; // Stop calculation
    }

    // --- Constants & Assumptions (MODIFY THESE AS NEEDED) ---
    const WALL_THICKNESS_M = 0.23; // Assuming 9-inch walls (approx 0.23m)
    const BRICK_VOL_WITH_MORTAR_M3 = 0.40 * 0.20 * 0.20; // Standard brick 400x200x200 + 10mm mortar
    const BRICK_WASTAGE_FACTOR = 1.05; // 5% wastage

    // Concrete Assumptions (M20 Mix Ratio 1:1.5:3)
    const CEMENT_RATIO = 1;
    const SAND_RATIO = 2;
    const AGGREGATE_RATIO = 3;
    const SUM_OF_RATIOS = CEMENT_RATIO + SAND_RATIO + AGGREGATE_RATIO;
    const DRY_VOLUME_FACTOR = 1.54; // To convert wet volume to dry volume for concrete ingredients
    const CEMENT_DENSITY_KG_M3 = 1440;
    const CEMENT_BAG_WEIGHT_KG = 50;
    const CEMENT_WASTAGE_FACTOR = 1.03; // 3% wastage
    const SAND_AGGREGATE_WASTAGE_FACTOR = 1.12; // 12% wastage

    // Steel Reinforcement Assumptions
    const STEEL_PERCENTAGE = 0.01; // Assuming 1% steel in RCC volume
    const STEEL_DENSITY_KG_M3 = 7850;
    const STEEL_WASTAGE_FACTOR = 1.05; // 5% wastage for lapping/cutting

    // --- Calculations ---

    // 1. Brick Calculation (Simplified: Perimeter * Height * Thickness)
    const perimeter = 2 * (length + width);
    const wallVolume = perimeter * height * WALL_THICKNESS_M;
    // Note: This doesn't subtract openings and assumes all perimeter walls are brick.
    const numberOfBricks = (wallVolume / BRICK_VOL_WITH_MORTAR_M3) * BRICK_WASTAGE_FACTOR;

    // 2. Concrete Calculation (Simplified: Total L*W*H as concrete volume)
    // This is a MAJOR simplification. In reality, you'd calculate slab, beams, columns separately.
    const totalConcreteVolumeWet = length * width * height; // Using overall volume as proxy
    const totalConcreteVolumeDry = totalConcreteVolumeWet * DRY_VOLUME_FACTOR;

    // 3. Cement Calculation
    const cementVolumeM3 = (totalConcreteVolumeDry * CEMENT_RATIO) / SUM_OF_RATIOS;
    const cementWeightKg = cementVolumeM3 * CEMENT_DENSITY_KG_M3;
    const numberOfCementBags = (cementWeightKg / CEMENT_BAG_WEIGHT_KG) * CEMENT_WASTAGE_FACTOR;

    // 4. Sand Calculation
    const sandVolumeM3 = ((totalConcreteVolumeDry * SAND_RATIO) / SUM_OF_RATIOS) * SAND_AGGREGATE_WASTAGE_FACTOR;

    // 5. Aggregate Calculation
    const aggregateVolumeM3 = ((totalConcreteVolumeDry * AGGREGATE_RATIO) / SUM_OF_RATIOS) * SAND_AGGREGATE_WASTAGE_FACTOR;

    // 6. Steel Calculation (Based on total concrete volume proxy)
    const steelVolumeM3 = totalConcreteVolumeWet * STEEL_PERCENTAGE; // Based on wet volume
    const steelWeightKg = (steelVolumeM3 * STEEL_DENSITY_KG_M3) * STEEL_WASTAGE_FACTOR;


    // --- Display Results ---
    document.getElementById('bricks-result').textContent = Math.ceil(numberOfBricks).toLocaleString(); // Round up bricks
    document.getElementById('cement-result').textContent = Math.ceil(numberOfCementBags).toLocaleString(); // Round up bags
    document.getElementById('sand-result').textContent = sandVolumeM3.toFixed(2);
    document.getElementById('aggregate-result').textContent = aggregateVolumeM3.toFixed(2);
    document.getElementById('steel-result').textContent = steelWeightKg.toFixed(2);

    resultsDiv.style.display = 'block'; // Show the results section
});