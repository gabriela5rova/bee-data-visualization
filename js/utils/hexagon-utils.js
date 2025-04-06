// Load data using data-loader.js
dataLoader.loadCSV('data/bee-colonies.csv')
  .then(data => {
    // Process the data
    const stats = dataLoader.calculateStatistics(data, 'colonies');
    console.log('Colony statistics:', stats);
    
    // Use the data to create visualization
    createVisualization(data);
  })
  .catch(error => {
    console.error('Failed to load colony data:', error);
  });

// Create hexagons using hexagon-utils.js
function createVisualization(data) {
  // Generate a grid of hexagon positions
  const positions = hexagonUtils.generateHoneycombGrid(
    width, 
    height, 
    hexSize, 
    padding
  );
  
  // Create SVG elements
  svg.selectAll('.hexagon')
    .data(positions)
    .enter()
    .append('path')
    .attr('d', d => hexagonUtils.createHexagonPath(hexSize))
    .attr('transform', d => `translate(${d.x}, ${d.y})`)
    .attr('fill', '#FFC107');
}