/**
 * honey-production.js - Visualization for honey production and yield per colony
 * 
 * This file creates a sophisticated data visualization showing honey production
 * and yield per colony over time, with interactive elements and tab switching.
 */

// Configuration
const honeyConfig = {
    margin: { top: 60, right: 100, bottom: 60, left: 80 },
    height: 400,
    primaryColor: '#FFC107',
    secondaryColor: '#FF9800',
    tooltipDuration: 200,
    animationDuration: 1000
  };
  
  // Store visualization elements
  let honeyChart;
  let honeyWidth;
  let honeySvg;
  let honeyData;
  let honeyXScale;
  let honeyYScaleLeft;
  let honeyYScaleRight;
  let honeyTooltip;
  let honeyColorScale;
  let currentHoneyView = 'production'; // Default view
  
  /**
   * Initialize the honey production chart
   */
  function initHoneyProductionChart() {
    // Get the chart container
    honeyChart = document.getElementById('honey-production-chart');
    if (!honeyChart) return;
    
    // Clear any existing content
    honeyChart.innerHTML = '';
    
    // Set dimensions
    honeyWidth = honeyChart.clientWidth - honeyConfig.margin.left - honeyConfig.margin.right;
    const height = honeyConfig.height - honeyConfig.margin.top - honeyConfig.margin.bottom;
    
    // Create SVG
    honeySvg = d3.select(honeyChart)
      .append('svg')
      .attr('width', honeyWidth + honeyConfig.margin.left + honeyConfig.margin.right)
      .attr('height', height + honeyConfig.margin.top + honeyConfig.margin.bottom)
      .append('g')
      .attr('transform', `translate(${honeyConfig.margin.left},${honeyConfig.margin.top})`);
    
    // Create tooltip
    if (!document.querySelector('.tooltip')) {
      honeyTooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    } else {
      honeyTooltip = d3.select('.tooltip');
    }
    
    // Create color scale for dots
    honeyColorScale = d3.scaleSequential()
      .domain([0, 100])
      .interpolator(d3.interpolate('#FFECB3', '#E65100'));
    
    // Load the data
    loadHoneyData();
    
    // Set up button listeners
    setupHoneyChartButtons();
  }
  
  /**
   * Load and process the honey production data
   */
  function loadHoneyData() {
    // Use sample data until connected to real CSV
    honeyData = [
      { year: 1991, production: 210, yield: 59 },
      { year: 1996, production: 200, yield: 55 },
      { year: 2001, production: 186, yield: 71 },
      { year: 2006, production: 155, yield: 64 },
      { year: 2011, production: 148, yield: 58 },
      { year: 2016, production: 162, yield: 58 },
      { year: 2021, production: 126, yield: 52 },
      { year: 2022, production: 137, yield: 54 }
    ];
    
    // Process the data
    processHoneyData();
  }
  
  /**
   * Process the honey data and create the initial visualization
   */
  function processHoneyData() {
    // Create scales
    honeyXScale = d3.scaleLinear()
      .domain(d3.extent(honeyData, d => d.year))
      .range([0, honeyWidth]);
    
    honeyYScaleLeft = d3.scaleLinear()
      .domain([0, d3.max(honeyData, d => d.production) * 1.1])
      .range([honeyConfig.height - honeyConfig.margin.top - honeyConfig.margin.bottom, 0]);
    
    honeyYScaleRight = d3.scaleLinear()
      .domain([0, d3.max(honeyData, d => d.yield) * 1.1])
      .range([honeyConfig.height - honeyConfig.margin.top - honeyConfig.margin.bottom, 0]);
    
    // Create base elements
    createHoneyBase();
    
    // Create initial view (production)
    updateHoneyView('production');
  }
  
  /**
   * Create the base elements for the honey visualization
   */
  function createHoneyBase() {
    // Add a background
    honeySvg.append('rect')
      .attr('width', honeyWidth)
      .attr('height', honeyConfig.height - honeyConfig.margin.top - honeyConfig.margin.bottom)
      .attr('fill', 'rgba(0, 0, 0, 0.2)')
      .attr('rx', 8)
      .attr('ry', 8);
    
    // Add X axis
    honeySvg.append('g')
      .attr('class', 'honey-x-axis')
      .attr('transform', `translate(0,${honeyConfig.height - honeyConfig.margin.top - honeyConfig.margin.bottom})`)
      .call(d3.axisBottom(honeyXScale).tickFormat(d3.format('d')))
      .selectAll('text')
      .style('fill', '#ccc')
      .style('font-size', '12px');
    
    // Add Y axis left (for production)
    honeySvg.append('g')
      .attr('class', 'honey-y-axis-left')
      .call(d3.axisLeft(honeyYScaleLeft))
      .selectAll('text')
      .style('fill', '#ccc')
      .style('font-size', '12px');
    
    // Add Y axis right (for yield)
    honeySvg.append('g')
      .attr('class', 'honey-y-axis-right')
      .attr('transform', `translate(${honeyWidth}, 0)`)
      .call(d3.axisRight(honeyYScaleRight))
      .selectAll('text')
      .style('fill', '#ccc')
      .style('font-size', '12px');
    
    // Add X axis label
    honeySvg.append('text')
      .attr('class', 'honey-x-label')
      .attr('x', honeyWidth / 2)
      .attr('y', honeyConfig.height - honeyConfig.margin.top - honeyConfig.margin.bottom + 45)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#ddd')
      .text('Year');
    
    // Add grid lines
    honeySvg.append('g')
      .attr('class', 'honey-grid-lines')
      .selectAll('line')
      .data(honeyYScaleLeft.ticks())
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', honeyWidth)
      .attr('y1', d => honeyYScaleLeft(d))
      .attr('y2', d => honeyYScaleLeft(d))
      .attr('stroke', 'rgba(255, 255, 255, 0.1)')
      .attr('stroke-dasharray', '3,3');
  }
  
  /**
   * Update the honey visualization based on the selected view
   * @param {string} view - The view to show ('production', 'yield', or 'combined')
   */
  function updateHoneyView(view) {
    currentHoneyView = view;
    
    // Remove existing visualization elements
    honeySvg.selectAll('.honey-line, .honey-area, .honey-dots, .honey-annotation, .honey-y-label-left, .honey-y-label-right')
      .remove();
    
    // Update Y axis visibility
    honeySvg.select('.honey-y-axis-left')
      .style('opacity', view === 'yield' ? 0.3 : 1);
      
    honeySvg.select('.honey-y-axis-right')
      .style('opacity', view === 'production' ? 0.3 : 1);
    
    // Add the appropriate visualization
    switch (view) {
      case 'production':
        createProductionView();
        break;
      case 'yield':
        createYieldView();
        break;
      case 'combined':
        createCombinedView();
        break;
    }
  }
  
  /**
   * Create the production view
   */
  function createProductionView() {
    // Add Y axis label
    honeySvg.append('text')
      .attr('class', 'honey-y-label-left')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(honeyConfig.height - honeyConfig.margin.top - honeyConfig.margin.bottom) / 2)
      .attr('y', -50)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', honeyConfig.primaryColor)
      .text('Honey Production (million pounds)')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1);
    
    // Create gradient for area
    const gradient = honeySvg.append('defs')
      .append('linearGradient')
      .attr('id', 'honey-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
      
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', honeyConfig.primaryColor)
      .attr('stop-opacity', 0.7);
      
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', honeyConfig.primaryColor)
      .attr('stop-opacity', 0.1);
    
    // Create area path generator
    const areaGenerator = d3.area()
      .x(d => honeyXScale(d.year))
      .y0(honeyConfig.height - honeyConfig.margin.top - honeyConfig.margin.bottom)
      .y1(d => honeyYScaleLeft(d.production))
      .curve(d3.curveMonotoneX);
    
    // Add area
    honeySvg.append('path')
      .attr('class', 'honey-area')
      .datum(honeyData)
      .attr('fill', 'url(#honey-area-gradient)')
      .attr('d', areaGenerator)
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1);
    
    // Create line generator
    const lineGenerator = d3.line()
      .x(d => honeyXScale(d.year))
      .y(d => honeyYScaleLeft(d.production))
      .curve(d3.curveMonotoneX);
    
    // Add line with animation
    const path = honeySvg.append('path')
      .attr('class', 'honey-line')
      .datum(honeyData)
      .attr('fill', 'none')
      .attr('stroke', honeyConfig.primaryColor)
      .attr('stroke-width', 3)
      .attr('d', lineGenerator);
    
    // Animate line drawing
    const length = path.node().getTotalLength();
    path.attr('stroke-dasharray', length + ' ' + length)
      .attr('stroke-dashoffset', length)
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);
    
    // Add dots for data points with hexagon shapes
    honeySvg.selectAll('.honey-dots')
      .data(honeyData)
      .enter()
      .append('path')
      .attr('class', 'honey-dots')
      .attr('transform', d => `translate(${honeyXScale(d.year)}, ${honeyYScaleLeft(d.production)})`)
      .attr('d', d => createHexPath(6))
      .attr('fill', honeyConfig.primaryColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .style('opacity', 0)
      .on('mouseover', handleHoneyDotMouseOver)
      .on('mouseout', handleHoneyDotMouseOut)
      .transition()
      .delay((d, i) => 1500 + i * 100)
      .duration(500)
      .style('opacity', 1);
    
    // Add annotations for significant points
    addHoneyAnnotations('production');
  }
  
  /**
   * Create the yield view
   */
  function createYieldView() {
    // Add Y axis label
    honeySvg.append('text')
      .attr('class', 'honey-y-label-right')
      .attr('transform', 'rotate(90)')
      .attr('x', (honeyConfig.height - honeyConfig.margin.top - honeyConfig.margin.bottom) / 2)
      .attr('y', -honeyWidth - 60)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', honeyConfig.secondaryColor)
      .text('Yield per Colony (pounds)')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1);
    
    // Create gradient for area
    const gradient = honeySvg.append('defs')
      .append('linearGradient')
      .attr('id', 'honey-yield-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
      
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', honeyConfig.secondaryColor)
      .attr('stop-opacity', 0.7);
      
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', honeyConfig.secondaryColor)
      .attr('stop-opacity', 0.1);
    
    // Create area path generator
    const areaGenerator = d3.area()
      .x(d => honeyXScale(d.year))
      .y0(honeyConfig.height - honeyConfig.margin.top - honeyConfig.margin.bottom)
      .y1(d => honeyYScaleRight(d.yield))
      .curve(d3.curveMonotoneX);
    
    // Add area
    honeySvg.append('path')
      .attr('class', 'honey-area')
      .datum(honeyData)
      .attr('fill', 'url(#honey-yield-gradient)')
      .attr('d', areaGenerator)
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1);
    
    // Create line generator
    const lineGenerator = d3.line()
      .x(d => honeyXScale(d.year))
      .y(d => honeyYScaleRight(d.yield))
      .curve(d3.curveMonotoneX);
    
    // Add line with animation
    const path = honeySvg.append('path')
      .attr('class', 'honey-line')
      .datum(honeyData)
      .attr('fill', 'none')
      .attr('stroke', honeyConfig.secondaryColor)
      .attr('stroke-width', 3)
      .attr('d', lineGenerator);
    
    // Animate line drawing
    const length = path.node().getTotalLength();
    path.attr('stroke-dasharray', length + ' ' + length)
      .attr('stroke-dashoffset', length)
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);
    
    // Add dots for data points with hexagon shapes
    honeySvg.selectAll('.honey-dots')
      .data(honeyData)
      .enter()
      .append('path')
      .attr('class', 'honey-dots')
      .attr('transform', d => `translate(${honeyXScale(d.year)}, ${honeyYScaleRight(d.yield)})`)
      .attr('d', d => createHexPath(6))
      .attr('fill', honeyConfig.secondaryColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .style('opacity', 0)
      .on('mouseover', handleHoneyDotMouseOver)
      .on('mouseout', handleHoneyDotMouseOut)
      .transition()
      .delay((d, i) => 1500 + i * 100)
      .duration(500)
      .style('opacity', 1);
    
    // Add annotations for significant points
    addHoneyAnnotations('yield');
  }
  
  /**
   * Create the combined view showing both production and yield
   */
  function createCombinedView() {
    // Add Y axis labels
    honeySvg.append('text')
      .attr('class', 'honey-y-label-left')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(honeyConfig.height - honeyConfig.margin.top - honeyConfig.margin.bottom) / 2)
      .attr('y', -50)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', honeyConfig.primaryColor)
      .text('Honey Production (million pounds)')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1);
      
    honeySvg.append('text')
      .attr('class', 'honey-y-label-right')
      .attr('transform', 'rotate(90)')
      .attr('x', (honeyConfig.height - honeyConfig.margin.top - honeyConfig.margin.bottom) / 2)
      .attr('y', -honeyWidth - 60)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', honeyConfig.secondaryColor)
      .text('Yield per Colony (pounds)')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1);
    
    // Create production line generator
    const productionLineGenerator = d3.line()
      .x(d => honeyXScale(d.year))
      .y(d => honeyYScaleLeft(d.production))
      .curve(d3.curveMonotoneX);
    
    // Create yield line generator
    const yieldLineGenerator = d3.line()
      .x(d => honeyXScale(d.year))
      .y(d => honeyYScaleRight(d.yield))
      .curve(d3.curveMonotoneX);
    
    // Add production line with animation
    const productionPath = honeySvg.append('path')
      .attr('class', 'honey-line')
      .datum(honeyData)
      .attr('fill', 'none')
      .attr('stroke', honeyConfig.primaryColor)
      .attr('stroke-width', 3)
      .attr('d', productionLineGenerator);
    
    // Animate production line drawing
    const productionLength = productionPath.node().getTotalLength();
    productionPath.attr('stroke-dasharray', productionLength + ' ' + productionLength)
      .attr('stroke-dashoffset', productionLength)
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);
    
    // Add yield line with animation
    const yieldPath = honeySvg.append('path')
      .attr('class', 'honey-line')
      .datum(honeyData)
      .attr('fill', 'none')
      .attr('stroke', honeyConfig.secondaryColor)
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5')
      .attr('d', yieldLineGenerator);
    
    // Animate yield line drawing
    const yieldLength = yieldPath.node().getTotalLength();
    yieldPath.attr('stroke-dasharray', yieldLength + ' ' + yieldLength)
      .attr('stroke-dashoffset', yieldLength)
      .transition()
      .duration(1500)
      .delay(500)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)
      .on('end', function() {
        d3.select(this).attr('stroke-dasharray', '5,5');
      });
    
    // Add dots for production data points
    honeySvg.selectAll('.honey-dots-production')
      .data(honeyData)
      .enter()
      .append('path')
      .attr('class', 'honey-dots')
      .attr('transform', d => `translate(${honeyXScale(d.year)}, ${honeyYScaleLeft(d.production)})`)
      .attr('d', d => createHexPath(6))
      .attr('fill', honeyConfig.primaryColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('data-type', 'production')
      .style('opacity', 0)
      .on('mouseover', handleHoneyDotMouseOver)
      .on('mouseout', handleHoneyDotMouseOut)
      .transition()
      .delay((d, i) => 1500 + i * 100)
      .duration(500)
      .style('opacity', 1);
    
    // Add dots for yield data points
    honeySvg.selectAll('.honey-dots-yield')
      .data(honeyData)
      .enter()
      .append('path')
      .attr('class', 'honey-dots')
      .attr('transform', d => `translate(${honeyXScale(d.year)}, ${honeyYScaleRight(d.yield)})`)
      .attr('d', d => createHexPath(6))
      .attr('fill', honeyConfig.secondaryColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('data-type', 'yield')
      .style('opacity', 0)
      .on('mouseover', handleHoneyDotMouseOver)
      .on('mouseout', handleHoneyDotMouseOut)
      .transition()
      .delay((d, i) => 2000 + i * 100)
      .duration(500)
      .style('opacity', 1);
    
    // Add legend
    addHoneyLegend();
  }
  
  /**
   * Add legend for the combined view
   */
  function addHoneyLegend() {
    const legend = honeySvg.append('g')
      .attr('class', 'honey-annotation')
      .attr('transform', `translate(${honeyWidth - 180}, 20)`);
    
    // Add legend background
    legend.append('rect')
      .attr('width', 180)
      .attr('height', 70)
      .attr('fill', 'rgba(0, 0, 0, 0.5)')
      .attr('rx', 5)
      .attr('ry', 5);
    
    // Add legend title
    legend.append('text')
      .attr('x', 10)
      .attr('y', 20)
      .attr('font-size', '12px')
      .attr('fill', '#fff')
      .text('Legend');
    
    // Add production legend item
    const prodLegend = legend.append('g')
      .attr('transform', 'translate(10, 40)');
    
    prodLegend.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 30)
      .attr('y2', 0)
      .attr('stroke', honeyConfig.primaryColor)
      .attr('stroke-width', 3);
    
    prodLegend.append('path')
      .attr('d', createHexPath(4))
      .attr('transform', 'translate(15, 0)')
      .attr('fill', honeyConfig.primaryColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);
    
    prodLegend.append('text')
      .attr('x', 40)
      .attr('y', 4)
      .attr('font-size', '12px')
      .attr('fill', '#fff')
      .text('Production');
    
    // Add yield legend item
    const yieldLegend = legend.append('g')
      .attr('transform', 'translate(10, 60)');
    
    yieldLegend.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 30)
      .attr('y2', 0)
      .attr('stroke', honeyConfig.secondaryColor)
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5');
    
    yieldLegend.append('path')
      .attr('d', createHexPath(4))
      .attr('transform', 'translate(15, 0)')
      .attr('fill', honeyConfig.secondaryColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);
    
    yieldLegend.append('text')
      .attr('x', 40)
      .attr('y', 4)
      .attr('font-size', '12px')
      .attr('fill', '#fff')
      .text('Yield per Colony');
  }
  
  /**
   * Add annotations for significant data points
   * @param {string} type - Type of data to annotate ('production' or 'yield')
   */
  function addHoneyAnnotations(type) {
    // Find maximum and minimum values
    let sortedData = [...honeyData];
    let max, min;
    
    if (type === 'production') {
      sortedData.sort((a, b) => b.production - a.production);
      max = sortedData[0];
      min = sortedData[sortedData.length - 1];
      
      // Add annotation for max production
      addHoneyAnnotation(
        max,
        `${max.year}: ${max.production}M lbs`,
        30, -20,
        honeyConfig.primaryColor,
        'production'
      );
      
      // Add annotation for min production
      addHoneyAnnotation(
        min,
        `${min.year}: ${min.production}M lbs`,
        -30, -20,
        honeyConfig.primaryColor,
        'production'
      );
    } else if (type === 'yield') {
      sortedData.sort((a, b) => b.yield - a.yield);
      max = sortedData[0];
      min = sortedData[sortedData.length - 1];
      
      // Add annotation for max yield
      addHoneyAnnotation(
        max,
        `${max.year}: ${max.yield} lbs/colony`,
        30, -20,
        honeyConfig.secondaryColor,
        'yield'
      );
      
      // Add annotation for min yield
      addHoneyAnnotation(
        min,
        `${min.year}: ${min.yield} lbs/colony`,
        -30, -20,
        honeyConfig.secondaryColor,
        'yield'
      );
    }
  }
  
  /**
   * Add an annotation to the chart
   * @param {Object} data - Data point to annotate
   * @param {string} text - Annotation text
   * @param {number} dx - X offset
   * @param {number} dy - Y offset
   * @param {string} color - Annotation color
   * @param {string} type - Type of data ('production' or 'yield')
   */
  function addHoneyAnnotation(data, text, dx, dy, color, type) {
    const y = type === 'production' 
      ? honeyYScaleLeft(data.production) 
      : honeyYScaleRight(data.yield);
    
    const annotation = honeySvg.append('g')
      .attr('class', 'honey-annotation')
      .attr('transform', `translate(${honeyXScale(data.year)}, ${y})`)
      .style('opacity', 0);
    
    // Add connector line
    annotation.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', dx)
      .attr('y2', dy)
      .attr('stroke', color)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');
    
    // Add annotation background
    annotation.append('rect')
      .attr('x', dx - 5)
      .attr('y', dy - 15)
      .attr('width', text.length * 6)
      .attr('height', 20)
      .attr('fill', 'rgba(0, 0, 0, 0.7)')
      .attr('rx', 3)
      .attr('ry', 3);
    
    // Add annotation text
    annotation.append('text')
      .attr('x', dx)
      .attr('y', dy)
      .attr('text-anchor', dx > 0 ? 'start' : 'end')
      .style('font-size', '11px')
      .style('fill', '#fff')
      .text(text);
    
    // Animate annotation
    annotation.transition()
      .delay(2000)
      .duration(500)
      .style('opacity', 1);
  }
  
  /**
   * Handle mouse over event for honey data points
   * @param {Event} event - Mouse event
   * @param {Object} d - Data point
   */
  function handleHoneyDotMouseOver(event, d) {
    // Determine data type
    const type = event.currentTarget.getAttribute('data-type') || currentHoneyView;
    
    // Highlight the point
    d3.select(event.currentTarget)
      .transition()
      .duration(200)
      .attr('transform', function() {
        const current = d3.select(this).attr('transform');
        return current + ' scale(1.5)';
      });
    
    // Show tooltip
    honeyTooltip.transition()
      .duration(honeyConfig.tooltipDuration)
      .style('opacity', 0.9);
    
    let tooltipContent = `<div class="tooltip-title">${d.year}</div>`;
    
    if (type === 'production' || type === 'combined') {
      tooltipContent += `<div>Production: <span class="tooltip-value">${d.production.toLocaleString()} million lbs</span></div>`;
    }
    
    if (type === 'yield' || type === 'combined') {
      tooltipContent += `<div>Yield: <span class="tooltip-value">${d.yield.toLocaleString()} lbs/colony</span></div>`;
    }
    
  honeyTooltip.html(tooltipContent)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px');
  }
  
  /**
   * Handle mouse out event for honey data points
   * @param {Event} event - Mouse event
   */
  function handleHoneyDotMouseOut(event) {
    // Reset the point
    d3.select(event.currentTarget)
      .transition()
      .duration(200)
      .attr('transform', function() {
        // Extract just the translate part
        const transform = d3.select(this).attr('transform');
        return transform.split(' scale')[0];
      });
    
    // Hide tooltip
    honeyTooltip.transition()
      .duration(honeyConfig.tooltipDuration)
      .style('opacity', 0);
  }
  
  /**
   * Create a hexagon path for data points
   * @param {number} size - Size of the hexagon
   * @returns {string} - SVG path string for the hexagon
   */
  function createHexPath(size) {
    // Calculate points for a hexagon
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = 2 * Math.PI / 6 * i;
      const x = size * Math.cos(angle);
      const y = size * Math.sin(angle);
      points.push([x, y]);
    }
    
    // Create SVG path
    let path = 'M' + points[0][0] + ',' + points[0][1];
    for (let i = 1; i < points.length; i++) {
      path += ' L' + points[i][0] + ',' + points[i][1];
    }
    path += ' Z';
    
    return path;
  }
  
  /**
   * Set up button listeners for chart view switching
   */
  function setupHoneyChartButtons() {
    const buttons = document.querySelectorAll('.chart-btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', (event) => {
        // Remove active class from all buttons
        buttons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update chart view
        const view = button.getAttribute('data-chart');
        updateHoneyView(view);
      });
    });
  }
  
  /**
   * Handle window resize event for the chart
   */
  function resizeHoneyChart() {
    if (!honeyChart) return;
    
    // Update width
    honeyWidth = honeyChart.clientWidth - honeyConfig.margin.left - honeyConfig.margin.right;
    
    // Update SVG dimensions
    d3.select(honeyChart).select('svg')
      .attr('width', honeyWidth + honeyConfig.margin.left + honeyConfig.margin.right);
    
    // Update scales
    honeyXScale.range([0, honeyWidth]);
    
    // Update all elements
    d3.select('.honey-x-axis')
      .call(d3.axisBottom(honeyXScale).tickFormat(d3.format('d')));
      
    d3.select('.honey-y-axis-right')
      .attr('transform', `translate(${honeyWidth}, 0)`);
      
    d3.select('.honey-x-label')
      .attr('x', honeyWidth / 2);
      
    d3.selectAll('.honey-grid-lines line')
      .attr('x2', honeyWidth);
      
    // Update visualization based on current view
    updateHoneyView(currentHoneyView);
  }
  
  // Add to global resize handler
  if (typeof resizeCharts === 'function') {
    const origResizeCharts = resizeCharts;
    resizeCharts = function() {
      origResizeCharts();
      resizeHoneyChart();
    };
  } else {
    function resizeCharts() {
      resizeHoneyChart();
    }
  }
  
  // Initialize on load if the element exists
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('honey-production-chart')) {
      initHoneyProductionChart();
    }
  });
  