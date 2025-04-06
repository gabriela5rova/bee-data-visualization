/**
 * colony-losses.js - Visualization for bee colony losses
 * 
 * This file creates a sophisticated data visualization showing
 * the percentage of bee colonies lost each year, with interactive
 * elements and animated transitions.
 */

// Configuration
const colonyLossesConfig = {
    margin: { top: 60, right: 80, bottom: 60, left: 70 },
    height: 400,
    criticalThreshold: 30, // Critical colony loss threshold (30%)
    averageColor: '#FFC107',
    criticalColor: '#E74C3C',
    tooltipDuration: 200,
    animationDuration: 1000
  };
  
  // Store visualization elements
  let colonyLossesChart;
  let colonyLossesWidth;
  let colonyLossesSvg;
  let colonyLossesData;
  let colonyLossesXScale;
  let colonyLossesYScale;
  let colonyLossesColorScale;
  let colonyLossesTooltip;
  
  /**
   * Initialize the colony losses chart
   */
  function initColonyLossesChart() {
    // Get the chart container
    colonyLossesChart = document.getElementById('colony-losses-chart');
    if (!colonyLossesChart) return;
    
    // Clear any existing content
    colonyLossesChart.innerHTML = '';
    
    // Set dimensions
    colonyLossesWidth = colonyLossesChart.clientWidth - colonyLossesConfig.margin.left - colonyLossesConfig.margin.right;
    const height = colonyLossesConfig.height - colonyLossesConfig.margin.top - colonyLossesConfig.margin.bottom;
    
    // Create SVG
    colonyLossesSvg = d3.select(colonyLossesChart)
      .append('svg')
      .attr('width', colonyLossesWidth + colonyLossesConfig.margin.left + colonyLossesConfig.margin.right)
      .attr('height', height + colonyLossesConfig.margin.top + colonyLossesConfig.margin.bottom)
      .append('g')
      .attr('transform', `translate(${colonyLossesConfig.margin.left},${colonyLossesConfig.margin.top})`);
    
    // Create tooltip
    if (!document.querySelector('.tooltip')) {
      colonyLossesTooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    } else {
      colonyLossesTooltip = d3.select('.tooltip');
    }
    
    // Load the data
    loadColonyLossesData();
  }
  
  /**
   * Load and process the colony losses data
   */
  function loadColonyLossesData() {
    // Use sample data until connected to real API/CSV
    colonyLossesData = [
      { year: 2015, lossPercent: 42.1 },
      { year: 2016, lossPercent: 44.1 },
      { year: 2017, lossPercent: 33.2 },
      { year: 2018, lossPercent: 40.1 },
      { year: 2019, lossPercent: 37.7 },
      { year: 2020, lossPercent: 43.7 },
      { year: 2021, lossPercent: 45.5 },
      { year: 2022, lossPercent: 39.0 },
      { year: 2023, lossPercent: 48.2 }
    ];
    
    // Process the data
    processColonyLossesData();
  }
  
  /**
   * Process the colony losses data and create the visualization
   */
  function processColonyLossesData() {
    // Calculate statistics
    const maxLoss = d3.max(colonyLossesData, d => d.lossPercent);
    const minLoss = d3.min(colonyLossesData, d => d.lossPercent);
    const avgLoss = d3.mean(colonyLossesData, d => d.lossPercent);
    
    // Create scales
    colonyLossesXScale = d3.scaleBand()
      .domain(colonyLossesData.map(d => d.year))
      .range([0, colonyLossesWidth])
      .padding(0.3);
    
    colonyLossesYScale = d3.scaleLinear()
      .domain([0, Math.max(50, maxLoss * 1.1)]) // Cap at least at 50%
      .range([colonyLossesConfig.height - colonyLossesConfig.margin.top - colonyLossesConfig.margin.bottom, 0]);
    
    // Color scale for bars (darker color for higher loss percentage)
    colonyLossesColorScale = d3.scaleSequential()
      .domain([minLoss, maxLoss])
      .interpolator(d3.interpolate('#FFB74D', '#E65100'));
    
    // Create visualization elements
    createColonyLossesBase();
    createColonyLossesBars();
    createColonyLossesGrid();
    createColonyLossesAxes();
    createColonyLossesThreshold();
    createColonyLossesAnnotations();
  }
  
  /**
   * Create the base elements for the visualization
   */
  function createColonyLossesBase() {
    // Add a background
    colonyLossesSvg.append('rect')
      .attr('width', colonyLossesWidth)
      .attr('height', colonyLossesConfig.height - colonyLossesConfig.margin.top - colonyLossesConfig.margin.bottom)
      .attr('fill', 'rgba(0, 0, 0, 0.2)')
      .attr('rx', 8)
      .attr('ry', 8);
    
    // Add title
    colonyLossesSvg.append('text')
      .attr('class', 'chart-title')
      .attr('x', colonyLossesWidth / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#fff')
      .text('U.S. Bee Colony Losses (2015-2023)')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1);
  }
  
  /**
   * Create bars for the colony losses chart
   */
  function createColonyLossesBars() {
    // Add the bars
    colonyLossesSvg.selectAll('.colony-loss-bar')
      .data(colonyLossesData)
      .enter()
      .append('rect')
      .attr('class', 'colony-loss-bar')
      .attr('x', d => colonyLossesXScale(d.year))
      .attr('width', colonyLossesXScale.bandwidth())
      .attr('y', colonyLossesConfig.height - colonyLossesConfig.margin.top - colonyLossesConfig.margin.bottom)
      .attr('height', 0)
      .attr('fill', d => colonyLossesColorScale(d.lossPercent))
      .attr('rx', 4)
      .attr('ry', 4)
      .on('mouseover', handleColonyLossesBarMouseOver)
      .on('mouseout', handleColonyLossesBarMouseOut)
      .transition()
      .duration(colonyLossesConfig.animationDuration)
      .delay((d, i) => i * 100)
      .attr('y', d => colonyLossesYScale(d.lossPercent))
      .attr('height', d => colonyLossesConfig.height - colonyLossesConfig.margin.top - colonyLossesConfig.margin.bottom - colonyLossesYScale(d.lossPercent));
  
    // Add hexagon data points at the top of each bar
    colonyLossesSvg.selectAll('.hex-data-point')
      .data(colonyLossesData)
      .enter()
      .append('path')
      .attr('class', 'hex-data-point')
      .attr('transform', d => `translate(${colonyLossesXScale(d.year) + colonyLossesXScale.bandwidth() / 2}, ${colonyLossesYScale(d.lossPercent)})`)
      .attr('d', createHexPath(6))
      .attr('fill', '#FFC107')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('opacity', 0)
      .on('mouseover', handleColonyLossesBarMouseOver)
      .on('mouseout', handleColonyLossesBarMouseOut)
      .transition()
      .duration(500)
      .delay((d, i) => i * 100 + colonyLossesConfig.animationDuration)
      .style('opacity', 1);
    
    // Add value labels
    colonyLossesSvg.selectAll('.colony-loss-label')
      .data(colonyLossesData)
      .enter()
      .append('text')
      .attr('class', 'colony-loss-label')
      .attr('x', d => colonyLossesXScale(d.year) + colonyLossesXScale.bandwidth() / 2)
      .attr('y', d => colonyLossesYScale(d.lossPercent) - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#fff')
      .text(d => `${d.lossPercent.toFixed(1)}%`)
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay((d, i) => i * 100 + colonyLossesConfig.animationDuration + 300)
      .style('opacity', 1);
  }
  
  /**
   * Create a hexagon path for data points
   * @param {number} size - Size of the hexagon
   * @returns {string} - SVG path definition
   */
  function createHexPath(size) {
    return `M0,${-size} L${size * 0.866},${-size / 2} L${size * 0.866},${size / 2} L0,${size} L${-size * 0.866},${size / 2} L${-size * 0.866},${-size / 2} Z`;
  }
  
  /**
   * Create grid lines for the chart
   */
  function createColonyLossesGrid() {
    // Add horizontal grid lines
    colonyLossesSvg.selectAll('.colony-grid-line')
      .data(colonyLossesYScale.ticks(5))
      .enter()
      .append('line')
      .attr('class', 'colony-grid-line')
      .attr('x1', 0)
      .attr('x2', colonyLossesWidth)
      .attr('y1', d => colonyLossesYScale(d))
      .attr('y2', d => colonyLossesYScale(d))
      .attr('stroke', 'rgba(255, 255, 255, 0.1)')
      .attr('stroke-dasharray', '3,3')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay((d, i) => i * 100)
      .style('opacity', 1);
  }
  
  /**
   * Create axes for the chart
   */
  function createColonyLossesAxes() {
    // Add X axis
    colonyLossesSvg.append('g')
      .attr('class', 'colony-x-axis')
      .attr('transform', `translate(0,${colonyLossesConfig.height - colonyLossesConfig.margin.top - colonyLossesConfig.margin.bottom})`)
      .call(d3.axisBottom(colonyLossesXScale).tickFormat(d => d))
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1)
      .selectAll('text')
      .style('text-anchor', 'middle')
      .style('fill', '#ccc')
      .style('font-size', '12px');
    
    // Style X axis
    colonyLossesSvg.select('.colony-x-axis')
      .selectAll('line')
      .style('stroke', '#ccc');
      
    colonyLossesSvg.select('.colony-x-axis')
      .selectAll('path')
      .style('stroke', '#ccc');
    
    // Add Y axis
    colonyLossesSvg.append('g')
      .attr('class', 'colony-y-axis')
      .call(d3.axisLeft(colonyLossesYScale).tickFormat(d => `${d}%`))
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1)
      .selectAll('text')
      .style('fill', '#ccc')
      .style('font-size', '12px');
    
    // Style Y axis
    colonyLossesSvg.select('.colony-y-axis')
      .selectAll('line')
      .style('stroke', '#ccc');
      
    colonyLossesSvg.select('.colony-y-axis')
      .selectAll('path')
      .style('stroke', '#ccc');
    
    // Add X axis label
    colonyLossesSvg.append('text')
      .attr('class', 'colony-x-label')
      .attr('x', colonyLossesWidth / 2)
      .attr('y', colonyLossesConfig.height - colonyLossesConfig.margin.top - colonyLossesConfig.margin.bottom + 45)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#ddd')
      .text('Year')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay(500)
      .style('opacity', 1);
    
    // Add Y axis label
    colonyLossesSvg.append('text')
      .attr('class', 'colony-y-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(colonyLossesConfig.height - colonyLossesConfig.margin.top - colonyLossesConfig.margin.bottom) / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#ddd')
      .text('Colony Loss (%)')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay(500)
      .style('opacity', 1);
  }
  
  /**
   * Create threshold line for critical colony loss
   */
  function createColonyLossesThreshold() {
    // Add threshold line
    colonyLossesSvg.append('line')
      .attr('class', 'colony-threshold-line')
      .attr('x1', 0)
      .attr('x2', colonyLossesWidth)
      .attr('y1', colonyLossesYScale(colonyLossesConfig.criticalThreshold))
      .attr('y2', colonyLossesYScale(colonyLossesConfig.criticalThreshold))
      .attr('stroke', colonyLossesConfig.criticalColor)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay(1000)
      .style('opacity', 0.8);
    
    // Add threshold label
    colonyLossesSvg.append('text')
      .attr('class', 'colony-threshold-label')
      .attr('x', colonyLossesWidth)
      .attr('y', colonyLossesYScale(colonyLossesConfig.criticalThreshold) - 5)
      .attr('text-anchor', 'end')
      .style('font-size', '12px')
      .style('fill', colonyLossesConfig.criticalColor)
      .text('30% - Critical Loss Level')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay(1200)
      .style('opacity', 1);
  }
  
  /**
   * Create annotations for significant data points
   */
  function createColonyLossesAnnotations() {
    // Find the highest and lowest loss percentages
    const sortedData = [...colonyLossesData].sort((a, b) => a.lossPercent - b.lossPercent);
    const lowestLoss = sortedData[0];
    const highestLoss = sortedData[sortedData.length - 1];
    
    // Add annotation for lowest loss
    createAnnotation(lowestLoss, 
      `Lowest: ${lowestLoss.lossPercent.toFixed(1)}%`, 
      -40, -20, 
      '#27AE60');
    
    // Add annotation for highest loss
    createAnnotation(highestLoss, 
      `Highest: ${highestLoss.lossPercent.toFixed(1)}%`, 
      40, -20, 
      '#E74C3C');
  }
  
  /**
   * Create annotation with custom position and style
   * @param {Object} data - Data point to annotate
   * @param {string} text - Annotation text
   * @param {number} dx - X offset
   * @param {number} dy - Y offset
   * @param {string} color - Annotation color
   */
  function createAnnotation(data, text, dx, dy, color) {
    const annotationGroup = colonyLossesSvg.append('g')
      .attr('class', 'colony-annotation')
      .attr('transform', `translate(${colonyLossesXScale(data.year) + colonyLossesXScale.bandwidth() / 2}, ${colonyLossesYScale(data.lossPercent)})`);
    
    // Add connector line
    annotationGroup.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', dx)
      .attr('y2', dy)
      .attr('stroke', color)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');
    
    // Add annotation background
    annotationGroup.append('path')
      .attr('d', createHexPath(20))
      .attr('transform', `translate(${dx}, ${dy})`)
      .attr('fill', 'rgba(0, 0, 0, 0.6)')
      .attr('stroke', color)
      .attr('stroke-width', 1);
    
    // Add annotation text
    annotationGroup.append('text')
      .attr('x', dx)
      .attr('y', dy + 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', color)
      .text(text);
    
    // Animate annotation
    annotationGroup.style('opacity', 0)
      .transition()
      .duration(500)
      .delay(1500)
      .style('opacity', 1);
  }
  
  /**
   * Handle mouse over event for colony loss bars
   * @param {Event} event - Mouse event
   * @param {Object} d - Data point
   */
  function handleColonyLossesBarMouseOver(event, d) {
    // Highlight the bar
    d3.select(this)
      .transition()
      .duration(200)
      .attr('fill', '#FFC107');
    
    // Find and highlight the hex point and label for this year
    colonyLossesSvg.selectAll(`.hex-data-point`)
      .filter(data => data.year === d.year)
      .transition()
      .duration(200)
      .attr('transform', data => `translate(${colonyLossesXScale(data.year) + colonyLossesXScale.bandwidth() / 2}, ${colonyLossesYScale(data.lossPercent)}) scale(1.5)`);
    
    colonyLossesSvg.selectAll(`.colony-loss-label`)
      .filter(data => data.year === d.year)
      .transition()
      .duration(200)
      .style('font-size', '14px')
      .style('font-weight', 'bold');
    
    // Show tooltip
    colonyLossesTooltip.transition()
      .duration(colonyLossesConfig.tooltipDuration)
      .style('opacity', 0.9);
    
    let severity = 'Normal';
    if (d.lossPercent > 45) severity = 'Extremely High';
    else if (d.lossPercent > 40) severity = 'Very High';
    else if (d.lossPercent > colonyLossesConfig.criticalThreshold) severity = 'High';
    
    colonyLossesTooltip.html(`
      <div class="tooltip-title">${d.year}</div>
      <div>Colony Loss: <span class="tooltip-value">${d.lossPercent.toFixed(1)}%</span></div>
      <div>Severity: <span style="color: ${getSeverityColor(d.lossPercent)}">${severity}</span></div>
    `)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px');
  }
  
  /**
   * Handle mouse out event for colony loss bars
   */
  function handleColonyLossesBarMouseOut() {
    // Reset the bar
    d3.select(this)
      .transition()
      .duration(200)
      .attr('fill', d => colonyLossesColorScale(d.lossPercent));
    
    // Reset all hex points and labels
    colonyLossesSvg.selectAll(`.hex-data-point`)
      .transition()
      .duration(200)
      .attr('transform', d => `translate(${colonyLossesXScale(d.year) + colonyLossesXScale.bandwidth() / 2}, ${colonyLossesYScale(d.lossPercent)}) scale(1)`);
    
    colonyLossesSvg.selectAll(`.colony-loss-label`)
      .transition()
      .duration(200)
      .style('font-size', '12px')
      .style('font-weight', '600');
    
    // Hide tooltip
    colonyLossesTooltip.transition()
      .duration(colonyLossesConfig.tooltipDuration)
      .style('opacity', 0);
  }
  
  /**
   * Get color based on severity of colony loss
   * @param {number} value - Loss percentage
   * @returns {string} - Color code
   */
  function getSeverityColor(value) {
    if (value > 45) return '#E74C3C';
    if (value > 40) return '#E67E22';
    if (value > colonyLossesConfig.criticalThreshold) return '#F39C12';
    return '#27AE60';
  }
  
  /**
   * Handle window resize event for the chart
   */
  function resizeColonyLossesChart() {
    if (!colonyLossesChart) return;
    
    // Update width
    colonyLossesWidth = colonyLossesChart.clientWidth - colonyLossesConfig.margin.left - colonyLossesConfig.margin.right;
    
    // Update SVG dimensions
    d3.select(colonyLossesChart).select('svg')
      .attr('width', colonyLossesWidth + colonyLossesConfig.margin.left + colonyLossesConfig.margin.right);
    
    // Update scales
    colonyLossesXScale.range([0, colonyLossesWidth]);
    
    // Update all elements
    colonyLossesSvg.select('rect')
      .attr('width', colonyLossesWidth);
      
    colonyLossesSvg.selectAll('.colony-loss-bar')
      .attr('x', d => colonyLossesXScale(d.year))
      .attr('width', colonyLossesXScale.bandwidth());
      
    colonyLossesSvg.selectAll('.hex-data-point')
      .attr('transform', d => `translate(${colonyLossesXScale(d.year) + colonyLossesXScale.bandwidth() / 2}, ${colonyLossesYScale(d.lossPercent)})`);
      
    colonyLossesSvg.selectAll('.colony-loss-label')
      .attr('x', d => colonyLossesXScale(d.year) + colonyLossesXScale.bandwidth() / 2);
      
    colonyLossesSvg.selectAll('.colony-grid-line')
      .attr('x2', colonyLossesWidth);
      
    colonyLossesSvg.select('.colony-x-axis')
      .call(d3.axisBottom(colonyLossesXScale).tickFormat(d => d));
      
    colonyLossesSvg.select('.colony-threshold-line')
      .attr('x2', colonyLossesWidth);
      
    colonyLossesSvg.select('.colony-threshold-label')
      .attr('x', colonyLossesWidth);
      
    colonyLossesSvg.select('.colony-x-label')
      .attr('x', colonyLossesWidth / 2);
      
    // Reposition annotations
    updateAnnotationPositions();
  }
  
  /**
   * Update annotation positions after resize
   */
  function updateAnnotationPositions() {
    const sortedData = [...colonyLossesData].sort((a, b) => a.lossPercent - b.lossPercent);
    const lowestLoss = sortedData[0];
    const highestLoss = sortedData[sortedData.length - 1];
    
    colonyLossesSvg.selectAll('.colony-annotation')
      .each(function(d, i) {
        const data = i === 0 ? lowestLoss : highestLoss;
        d3.select(this)
          .attr('transform', `translate(${colonyLossesXScale(data.year) + colonyLossesXScale.bandwidth() / 2}, ${colonyLossesYScale(data.lossPercent)})`);
      });
  }
  
  // Add to global resize handler
  if (typeof resizeCharts !== 'function') {
    function resizeCharts() {
      resizeColonyLossesChart();
      // Call other chart resize functions as needed
    }
  }
  
  // Initialize on load if the element exists
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('colony-losses-chart')) {
      initColonyLossesChart();
    }
  });
  