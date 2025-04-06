/**
 * hexagon-grid.js - Interactive hexagon grid visualization
 * 
 * This file creates an interactive honeycomb grid visualization
 * that displays honey production by state with elegant hexagonal cells.
 */

// Configuration
const hexGridConfig = {
    containerPadding: 20,
    hexSize: 35, // Size of each hexagon
    hexPadding: 5, // Padding between hexagons
    transitionDuration: 800,
    hoverScale: 1.1,
    colorRange: ['#FFF176', '#FFB74D', '#FF9800', '#F57C00', '#E65100']
  };
  
  // Store visualization elements
  let hexGridContainer;
  let hexGridSvg;
  let hexGridData;
  let hexGridColorScale;
  let hexGridWidth;
  let hexGridHeight;
  let hexGrid;
  let hexGridTooltip;
  
  /**
   * Initialize the hexagon grid visualization
   */
  function initHexagonGrid() {
    hexGridContainer = document.getElementById('hexagon-grid');
    if (!hexGridContainer) return;
    
    // Clear any existing content
    hexGridContainer.innerHTML = '';
    
    // Set dimensions
    hexGridWidth = hexGridContainer.clientWidth - (hexGridConfig.containerPadding * 2);
    hexGridHeight = 500; // Fixed height for the grid
    
    // Create SVG
    hexGridSvg = d3.select(hexGridContainer)
      .append('svg')
      .attr('width', hexGridWidth)
      .attr('height', hexGridHeight)
      .append('g')
      .attr('transform', `translate(${hexGridConfig.containerPadding}, ${hexGridConfig.containerPadding})`);
    
    // Create tooltip if it doesn't exist
    if (!document.querySelector('.tooltip')) {
      hexGridTooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    } else {
      hexGridTooltip = d3.select('.tooltip');
    }
    
    // Load data
    loadHexGridData();
  }
  
  /**
   * Load and process the hexagon grid data
   */
  function loadHexGridData() {
    // Sample data for US states honey production
    hexGridData = [
      { state: 'ND', production: 38.2, region: 'midwest' },
      { state: 'SD', production: 19.5, region: 'midwest' },
      { state: 'MT', production: 14.8, region: 'west' },
      { state: 'FL', production: 12.2, region: 'southeast' },
      { state: 'CA', production: 11.5, region: 'west' },
      { state: 'TX', production: 9.0, region: 'southwest' },
      { state: 'MN', production: 8.7, region: 'midwest' },
      { state: 'MI', production: 6.5, region: 'midwest' },
      { state: 'WI', production: 5.8, region: 'midwest' },
      { state: 'ID', production: 4.2, region: 'west' },
      { state: 'WA', production: 3.9, region: 'west' },
      { state: 'NY', production: 3.6, region: 'northeast' },
      { state: 'OH', production: 3.5, region: 'midwest' },
      { state: 'GA', production: 3.2, region: 'southeast' },
      { state: 'IA', production: 3.0, region: 'midwest' },
      { state: 'PA', production: 3.0, region: 'northeast' },
      { state: 'OR', production: 2.9, region: 'west' },
      { state: 'NE', production: 2.7, region: 'midwest' },
      { state: 'IL', production: 2.5, region: 'midwest' },
      { state: 'AL', production: 2.3, region: 'southeast' }
    ];
    
    // Sort by production (largest to smallest)
    hexGridData.sort((a, b) => b.production - a.production);
    
    // Process and visualize
    processHexGridData();
  }
  
  /**
   * Process the hexagon grid data and create the visualization
   */
  function processHexGridData() {
    // Create color scale
    
  
  // Create color scale
    const maxProduction = d3.max(hexGridData, d => d.production);
    hexGridColorScale = d3.scaleQuantize()
      .domain([0, maxProduction])
      .range(hexGridConfig.colorRange);
    
    // Create hexbin layout
    const hexRadius = hexGridConfig.hexSize;
    const hexbinGenerator = d3.hexbin()
      .radius(hexRadius)
      .extent([[0, 0], [hexGridWidth - (hexGridConfig.containerPadding * 2), hexGridHeight - (hexGridConfig.containerPadding * 2)]]);
    
    // Calculate grid positions
    const gridPositions = calculateGridPositions();
    
    // Create honeycomb pattern background
    createHoneycombBackground();
    
    // Create hexagon grid
    createHexagonGrid(gridPositions);
    
    // Create legend
    createHexGridLegend();
    
    // Add title
    hexGridSvg.append('text')
      .attr('class', 'grid-title')
      .attr('x', (hexGridWidth - (hexGridConfig.containerPadding * 2)) / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('fill', '#fff')
      .text('Top 20 Honey Producing States (Million Pounds)')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1);
  }
  
  /**
   * Calculate grid positions for hexagons
   * @returns {Array} Array of positions for each state
   */
  function calculateGridPositions() {
    // Create a honeycomb-like grid layout
    const positions = [];
    const gridWidth = Math.ceil(Math.sqrt(hexGridData.length));
    const gridHeight = Math.ceil(hexGridData.length / gridWidth);
    
    const hexWidth = hexGridConfig.hexSize * 2 + hexGridConfig.hexPadding;
    const hexHeight = Math.sqrt(3) * hexGridConfig.hexSize + hexGridConfig.hexPadding;
    
    // Calculate total width and height
    const totalWidth = gridWidth * hexWidth;
    const totalHeight = gridHeight * hexHeight;
    
    // Calculate start position for centering
    const startX = (hexGridWidth - (hexGridConfig.containerPadding * 2) - totalWidth) / 2 + hexGridConfig.hexSize;
    const startY = (hexGridHeight - (hexGridConfig.containerPadding * 2) - totalHeight) / 2 + hexGridConfig.hexSize;
    
    // Generate positions
    for (let i = 0; i < hexGridData.length; i++) {
      const row = Math.floor(i / gridWidth);
      const col = i % gridWidth;
      
      // Offset odd rows for honeycomb effect
      const xOffset = row % 2 === 1 ? hexWidth / 2 : 0;
      
      const x = startX + col * hexWidth + xOffset;
      const y = startY + row * hexHeight;
      
      positions.push({
        x: x,
        y: y,
        state: hexGridData[i].state,
        production: hexGridData[i].production,
        region: hexGridData[i].region
      });
    }
    
    return positions;
  }
  
  /**
   * Create honeycomb pattern background
   */
  function createHoneycombBackground() {
    // Create pattern definition
    const defs = hexGridSvg.append('defs');
    
    const pattern = defs.append('pattern')
      .attr('id', 'honeycomb-bg')
      .attr('width', hexGridConfig.hexSize * 3)
      .attr('height', hexGridConfig.hexSize * Math.sqrt(3) * 2)
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('patternTransform', 'rotate(30)');
    
    // Create hexagon path
    const hexPath = createHexagonPath(hexGridConfig.hexSize / 2);
    
    // Add hexagons to pattern
    pattern.append('path')
      .attr('d', hexPath)
      .attr('stroke', 'rgba(255, 193, 7, 0.1)')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .attr('transform', `translate(${hexGridConfig.hexSize}, ${hexGridConfig.hexSize * Math.sqrt(3) / 2})`);
    
    pattern.append('path')
      .attr('d', hexPath)
      .attr('stroke', 'rgba(255, 193, 7, 0.1)')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .attr('transform', `translate(${hexGridConfig.hexSize * 2.5}, ${hexGridConfig.hexSize * Math.sqrt(3) * 1.5})`);
    
    // Add background with pattern
    hexGridSvg.append('rect')
      .attr('width', hexGridWidth)
      .attr('height', hexGridHeight)
      .attr('fill', 'url(#honeycomb-bg)')
      .attr('opacity', 0.3)
      .attr('transform', `translate(-${hexGridConfig.containerPadding}, -${hexGridConfig.containerPadding})`);
  }
  
  /**
   * Create hexagon grid visualization
   * @param {Array} positions - Array of positions for hexagon cells
   */
  function createHexagonGrid(positions) {
    // Create group for all hexagons
    hexGrid = hexGridSvg.append('g')
      .attr('class', 'hex-grid');
    
    // Create hexagon cells
    const hexCells = hexGrid.selectAll('.hex-cell')
      .data(positions)
      .enter()
      .append('g')
      .attr('class', 'hex-cell')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .style('opacity', 0)
      .on('mouseover', handleHexGridMouseOver)
      .on('mouseout', handleHexGridMouseOut);
    
    // Add hexagon shape
    hexCells.append('path')
      .attr('d', createHexagonPath(hexGridConfig.hexSize))
      .attr('fill', d => hexGridColorScale(d.production))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.8);
    
    // Add state abbreviation
    hexCells.append('text')
      .attr('class', 'hex-label')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', d => getContrastColor(hexGridColorScale(d.production)))
      .text(d => d.state);
    
    // Animate cells appearing with delay
    hexCells.transition()
      .duration(hexGridConfig.transitionDuration)
      .delay((d, i) => i * 50)
      .style('opacity', 1);
  }
  
  /**
   * Create hexagon path
   * @param {number} size - Radius of the hexagon
   * @returns {string} - SVG path definition
   */
  function createHexagonPath(size) {
    const angles = d3.range(6).map(i => i * Math.PI / 3);
    const points = angles.map(angle => [
      size * Math.sin(angle),
      -size * Math.cos(angle)
    ]);
    
    return d3.line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveLinearClosed)(points);
  }
  
  /**
   * Create legend for the hexagon grid
   */
  function createHexGridLegend() {
    const legendContainer = d3.select('#hexagon-grid')
      .append('div')
      .attr('class', 'grid-legend')
      .style('display', 'flex')
      .style('justify-content', 'center')
      .style('margin-top', '20px')
      .style('gap', '10px');
    
    // Get color scale domain and range values
    const colorDomain = hexGridColorScale.domain();
    const colorRange = hexGridColorScale.range();
    const legendItems = [];
    
    // Create legend items
    const stepSize = (colorDomain[1] - colorDomain[0]) / colorRange.length;
    
    for (let i = 0; i < colorRange.length; i++) {
      const minValue = i * stepSize;
      const maxValue = (i + 1) * stepSize;
      
      legendItems.push({
        color: colorRange[i],
        label: `${minValue.toFixed(1)} - ${maxValue.toFixed(1)}`
      });
    }
    
    // Create legend elements
    legendItems.forEach(item => {
      const legendItem = legendContainer.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('margin-right', '15px');
      
      // Create color box
      legendItem.append('div')
        .style('width', '15px')
        .style('height', '15px')
        .style('background-color', item.color)
        .style('border', '1px solid #fff')
        .style('margin-right', '5px');
      
      // Create label
      legendItem.append('div')
        .style('font-size', '12px')
        .style('color', '#ccc')
        .text(item.label);
    });
  }
  
  /**
   * Handle mouse over event for hexagon cells
   * @param {Event} event - Mouse event
   * @param {Object} d - Data point
   */
  function handleHexGridMouseOver(event, d) {
    // Scale up the cell
    d3.select(this)
      .transition()
      .duration(200)
      .attr('transform', `translate(${d.x}, ${d.y}) scale(${hexGridConfig.hoverScale})`);
    
    // Add glow effect
    d3.select(this).select('path')
      .transition()
      .duration(200)
      .attr('filter', 'url(#hex-glow)');
    
    // Create drop shadow filter if it doesn't exist
    if (!d3.select('#hex-glow').size()) {
      const defs = hexGridSvg.append('defs');
      const filter = defs.append('filter')
        .attr('id', 'hex-glow')
        .attr('x', '-30%')
        .attr('y', '-30%')
        .attr('width', '160%')
        .attr('height', '160%');
      
      filter.append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'blur');
      
      filter.append('feFlood')
        .attr('flood-color', '#FFC107')
        .attr('flood-opacity', '0.7')
        .attr('result', 'glow');
      
      filter.append('feComposite')
        .attr('in', 'glow')
        .attr('in2', 'blur')
        .attr('operator', 'in')
        .attr('result', 'coloredBlur');
      
      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode')
        .attr('in', 'coloredBlur');
      feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic');
    }
    
    // Show tooltip
    hexGridTooltip.transition()
      .duration(200)
      .style('opacity', 0.9);
    
    // Get state name
    const stateName = getStateName(d.state);
    
    // Format tooltip content
    hexGridTooltip.html(`
      <div class="tooltip-title">${stateName} (${d.state})</div>
      <div>Honey Production: <span class="tooltip-value">${d.production} million lbs</span></div>
      <div>Region: <span class="tooltip-value">${capitalizeFirstLetter(d.region)}</span></div>
    `)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px');
  }
  
  /**
   * Handle mouse out event for hexagon cells
   */
  function handleHexGridMouseOut(event, d) {
    // Reset the cell
    d3.select(this)
      .transition()
      .duration(200)
      .attr('transform', `translate(${d.x}, ${d.y})`);
    
    // Remove glow effect
    d3.select(this).select('path')
      .transition()
      .duration(200)
      .attr('filter', null);
    
    // Hide tooltip
    hexGridTooltip.transition()
      .duration(500)
      .style('opacity', 0);
  }
  
  /**
   * Get contrast color (black or white) based on background color
   * @param {string} backgroundColor - Hex color code
   * @returns {string} - Color for text (black or white)
   */
  function getContrastColor(backgroundColor) {
    // Convert hex to RGB
    let r, g, b;
    
    if (backgroundColor.startsWith('#')) {
      // Handle hex color
      const hex = backgroundColor.replace('#', '');
      r = parseInt(hex.substr(0, 2), 16);
      g = parseInt(hex.substr(2, 2), 16);
      b = parseInt(hex.substr(4, 2), 16);
    } else if (backgroundColor.startsWith('rgb')) {
      // Handle rgb color
      const rgb = backgroundColor.match(/\d+/g);
      r = parseInt(rgb[0]);
      g = parseInt(rgb[1]);
      b = parseInt(rgb[2]);
    } else {
      // Default to white text
      return '#ffffff';
    }
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light backgrounds, white for dark
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }
  
  /**
   * Get full state name from abbreviation
   * @param {string} abbr - State abbreviation
   * @returns {string} - Full state name
   */
  function getStateName(abbr) {
    const states = {
      'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
      'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
      'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
      'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
      'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
      'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
      'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
      'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
      'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
      'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
      'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
      'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
      'WI': 'Wisconsin', 'WY': 'Wyoming'
    };
    
    return states[abbr] || abbr;
  }
  
  /**
   * Capitalize first letter of a string
   * @param {string} str - Input string
   * @returns {string} - Capitalized string
   */
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  /**
   * Handle resize event for the hexagon grid
   */
  function resizeHexagonGrid() {
    if (!hexGridContainer) return;
    
    // Update width
    hexGridWidth = hexGridContainer.clientWidth - (hexGridConfig.containerPadding * 2);
    
    // Update SVG dimensions
    d3.select('#hexagon-grid').select('svg')
      .attr('width', hexGridWidth);
    
    // Update background pattern
    d3.select('#hexagon-grid').select('rect')
      .attr('width', hexGridWidth);
    
    // Recalculate positions
    const newPositions = calculateGridPositions();
    
    // Update hexagon positions
    hexGrid.selectAll('.hex-cell')
      .data(newPositions)
      .transition()
      .duration(500)
      .attr('transform', d => `translate(${d.x}, ${d.y})`);
  }
  
  // Add to global resize handler
  if (typeof resizeCharts === 'function') {
    const origResizeCharts = resizeCharts;
    resizeCharts = function() {
      origResizeCharts();
      resizeHexagonGrid();
    };
  } else {
    function resizeCharts() {
      resizeHexagonGrid();
    }
  }
  
  // Initialize on load if the element exists
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('hexagon-grid')) {
      initHexagonGrid();
    }
  });
  
  