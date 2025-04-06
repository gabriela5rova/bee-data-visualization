/**
 * global-data.js - Visualization for global bee-related data
 * 
 * This file creates visualizations for global honey production and
 * beehive counts with interactive elements and comparative analysis.
 */

// Configuration
const globalConfig = {
    margin: { top: 60, right: 30, bottom: 60, left: 80 },
    height: 400,
    honeycombColor: '#FFC107',
    beehiveColor: '#FF9800',
    tooltipDuration: 200,
    animationDuration: 1000
  };
  
  // Store visualization elements
  let globalChart;
  let globalWidth;
  let globalSvg;
  let globalHoneyData;
  let globalBeehiveData;
  let globalXScale;
  let globalYScaleLeft;
  let globalYScaleRight;
  let globalTooltip;
  
  /**
   * Initialize the global data chart
   */
  function initGlobalDataChart() {
    // Get the chart container
    globalChart = document.getElementById('global-data-chart');
    if (!globalChart) return;
    
    // Clear any existing content
    globalChart.innerHTML = '';
    
    // Set dimensions
    globalWidth = globalChart.clientWidth - globalConfig.margin.left - globalConfig.margin.right;
    const height = globalConfig.height - globalConfig.margin.top - globalConfig.margin.bottom;
    
    // Create SVG
    globalSvg = d3.select(globalChart)
      .append('svg')
      .attr('width', globalWidth + globalConfig.margin.left + globalConfig.margin.right)
      .attr('height', height + globalConfig.margin.top + globalConfig.margin.bottom)
      .append('g')
      .attr('transform', `translate(${globalConfig.margin.left},${globalConfig.margin.top})`);
    
    // Create tooltip
    if (!document.querySelector('.tooltip')) {
      globalTooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    } else {
      globalTooltip = d3.select('.tooltip');
    }
    
    // Load the data
    loadGlobalData();
  }
  
  /**
   * Load and process the global data
   */
  function loadGlobalData() {
    // Load global honey production data
    globalHoneyData = [
      { year: 2000, production: 1.25 },
      { year: 2005, production: 1.40 },
      { year: 2010, production: 1.60 },
      { year: 2015, production: 1.83 },
      { year: 2018, production: 1.90 },
      { year: 2020, production: 1.85 },
      { year: 2022, production: 1.88 }
    ];
    
    // Load global beehive data
    globalBeehiveData = [
      { year: 2010, hives: 78.2 },
      { year: 2011, hives: 80.5 },
      { year: 2012, hives: 81.3 },
      { year: 2013, hives: 83.2 },
      { year: 2014, hives: 85.3 },
      { year: 2015, hives: 87.5 },
      { year: 2016, hives: 89.1 },
      { year: 2017, hives: 90.6 },
      { year: 2018, hives: 91.4 },
      { year: 2019, hives: 92.8 },
      { year: 2020, hives: 93.7 },
      { year: 2021, hives: 94.5 },
      { year: 2022, hives: 95.2 }
    ];
    
    // Process the data
    processGlobalData();
  }
  
  /**
   * Process the global data and create the visualization
   */
  function processGlobalData() {
    // Find common year range to show both datasets
    const commonYears = globalBeehiveData
      .filter(d => d.year >= 2010 && d.year <= 2022)
      .map(d => d.year);
    
    // Filter honey data to match the range
    const filteredHoneyData = globalHoneyData.filter(d => commonYears.includes(d.year));
    
    // Create scales
    globalXScale = d3.scaleLinear()
      .domain([d3.min(commonYears), d3.max(commonYears)])
      .range([0, globalWidth]);
    
    globalYScaleLeft = d3.scaleLinear()
      .domain([0, d3.max(filteredHoneyData, d => d.production) * 1.1])
      .range([globalConfig.height - globalConfig.margin.top - globalConfig.margin.bottom, 0]);
    
    globalYScaleRight = d3.scaleLinear()
      .domain([0, d3.max(globalBeehiveData, d => d.hives) * 1.1])
      .range([globalConfig.height - globalConfig.margin.top - globalConfig.margin.bottom, 0]);
    
    // Create base elements
    createGlobalChartBase();
    
    // Create combined visualization
    createGlobalVisualization(filteredHoneyData, globalBeehiveData);
  }
  
  /**
   * Create the base elements for the global chart
   */
  function createGlobalChartBase() {
    // Add background
    globalSvg.append('rect')
      .attr('width', globalWidth)
      .attr('height', globalConfig.height - globalConfig.margin.top - globalConfig.margin.bottom)
      .attr('fill', 'rgba(0, 0, 0, 0.2)')
      .attr('rx', 8)
      .attr('ry', 8);
    
    // Add title
    globalSvg.append('text')
      .attr('class', 'chart-title')
      .attr('x', globalWidth / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#fff')
      .text('Global Honey Production & Beehive Growth (2010-2022)');
    
    // Add X axis
    globalSvg.append('g')
      .attr('class', 'global-x-axis')
      .attr('transform', `translate(0,${globalConfig.height - globalConfig.margin.top - globalConfig.margin.bottom})`)
      .call(d3.axisBottom(globalXScale).tickFormat(d3.format('d')))
      .selectAll('text')
      .style('fill', '#ccc')
      .style('font-size', '12px');
    
    // Add Y axis left (for honey production)
    globalSvg.append('g')
      .attr('class', 'global-y-axis-left')
      .call(d3.axisLeft(globalYScaleLeft))
      .selectAll('text')
      .style('fill', '#ccc')
      .style('font-size', '12px');
    
    // Add Y axis right (for beehives)
    globalSvg.append('g')
      .attr('class', 'global-y-axis-right')
      .attr('transform', `translate(${globalWidth}, 0)`)
      .call(d3.axisRight(globalYScaleRight))
      .selectAll('text')
      .style('fill', '#ccc')
      .style('font-size', '12px');
    
    // Add X axis label
    globalSvg.append('text')
      .attr('class', 'global-x-label')
      .attr('x', globalWidth / 2)
      .attr('y', globalConfig.height - globalConfig.margin.top - globalConfig.margin.bottom + 45)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#ddd')
      .text('Year');
    
    // Add Y axis left label
    globalSvg.append('text')
      .attr('class', 'global-y-label-left')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(globalConfig.height - globalConfig.margin.top - globalConfig.margin.bottom) / 2)
      .attr('y', -50)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', globalConfig.honeycombColor)
      .text('Honey Production (million metric tons)');
    
    // Add Y axis right label
    globalSvg.append('text')
      .attr('class', 'global-y-label-right')
      .attr('transform', 'rotate(90)')
      .attr('x', (globalConfig.height - globalConfig.margin.top - globalConfig.margin.bottom) / 2)
      .attr('y', -globalWidth - 50)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', globalConfig.beehiveColor)
      .text('Number of Beehives (millions)');
    
    // Add grid lines
    globalSvg.append('g')
      .attr('class', 'global-grid-lines')
      .selectAll('line')
      .data(globalYScaleLeft.ticks())
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', globalWidth)
      .attr('y1', d => globalYScaleLeft(d))
      .attr('y2', d => globalYScaleLeft(d))
      .attr('stroke', 'rgba(255, 255, 255, 0.1)')
      .attr('stroke-dasharray', '3,3');
  }
  
  /**
   * Create the global visualization with both datasets
   * @param {Array} honeyData - Global honey production data
   * @param {Array} beehiveData - Global beehive count data
   */
  function createGlobalVisualization(honeyData, beehiveData) {
    // Create clip path to keep lines within chart area
    globalSvg.append('defs')
      .append('clipPath')
      .attr('id', 'global-clip')
      .append('rect')
      .attr('width', globalWidth)
      .attr('height', globalConfig.height - globalConfig.margin.top - globalConfig.margin.bottom);
    
    // Create gradient for honey production area
    const honeyGradient = globalSvg.append('defs')
      .append('linearGradient')
      .attr('id', 'global-honey-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
      
    honeyGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', globalConfig.honeycombColor)
      .attr('stop-opacity', 0.7);
      
    honeyGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', globalConfig.honeycombColor)
      .attr('stop-opacity', 0.1);
    
    // Create honey production line generator
    const honeyLineGenerator = d3.line()
      .x(d => globalXScale(d.year))
      .y(d => globalYScaleLeft(d.production))
      .curve(d3.curveMonotoneX);
    
    // Create beehive count line generator
    const beehiveLineGenerator = d3.line()
      .x(d => globalXScale(d.year))
      .y(d => globalYScaleRight(d.hives))
      .curve(d3.curveMonotoneX);
    
    // Add honey production area
    const honeyAreaGenerator = d3.area()
      .x(d => globalXScale(d.year))
      .y0(globalConfig.height - globalConfig.margin.top - globalConfig.margin.bottom)
      .y1(d => globalYScaleLeft(d.production))
      .curve(d3.curveMonotoneX);
    
    globalSvg.append('path')
      .attr('class', 'global-honey-area')
      .datum(honeyData)
      .attr('clip-path', 'url(#global-clip)')
      .attr('fill', 'url(#global-honey-gradient)')
      .attr('d', honeyAreaGenerator)
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 0.6);
    
    // Add honey production line
    const honeyPath = globalSvg.append('path')
      .attr('class', 'global-honey-line')
      .datum(honeyData)
      .attr('clip-path', 'url(#global-clip)')
      .attr('fill', 'none')
      .attr('stroke', globalConfig.honeycombColor)
      .attr('stroke-width', 3)
      .attr('d', honeyLineGenerator);
    
    // Animate honey production line drawing
    const honeyLength = honeyPath.node().getTotalLength();
    honeyPath.attr('stroke-dasharray', honeyLength + ' ' + honeyLength)
      .attr('stroke-dashoffset', honeyLength)
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);
    
    // Add beehive count line
    const beehivePath = globalSvg.append('path')
      .attr('class', 'global-beehive-line')
      .datum(beehiveData)
      .attr('clip-path', 'url(#global-clip)')
      .attr('fill', 'none')
      .attr('stroke', globalConfig.beehiveColor)
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5')
      .attr('d', beehiveLineGenerator);
    
    // Animate beehive count line drawing
    const beehiveLength = beehivePath.node().getTotalLength();
    beehivePath.attr('stroke-dasharray', beehiveLength + ' ' + beehiveLength)
      .attr('stroke-dashoffset', beehiveLength)
      .transition()
      .duration(1500)
      .delay(500)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)
      .on('end', function() {
        d3.select(this).attr('stroke-dasharray', '5,5');
      });
    
    // Add data points for honey production
    globalSvg.selectAll('.global-honey-dots')
      .data(honeyData)
      .enter()
      .append('path')
      .attr('class', 'global-dots')
      .attr('transform', d => `translate(${globalXScale(d.year)}, ${globalYScaleLeft(d.production)})`)
      .attr('d', createHexPath(6))
      .attr('fill', globalConfig.honeycombColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('data-type', 'honey')
      .style('opacity', 0)
      .on('mouseover', handleGlobalDotMouseOver)
      .on('mouseout', handleGlobalDotMouseOut)
      .transition()
      .delay((d, i) => 1500 + i * 100)
      .duration(500)
      .style('opacity', 1);
    
    // Add data points for beehive counts
    globalSvg.selectAll('.global-beehive-dots')
      .data(beehiveData)
      .enter()
      .append('path')
      .attr('class', 'global-dots')
      .attr('transform', d => `translate(${globalXScale(d.year)}, ${globalYScaleRight(d.hives)})`)
      .attr('d', createHexPath(6))
      .attr('fill', globalConfig.beehiveColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('data-type', 'beehive')
      .style('opacity', 0)
      .on('mouseover', handleGlobalDotMouseOver)
      .on('mouseout', handleGlobalDotMouseOut)
      .transition()
      .delay((d, i) => 2000 + i * 100)
      .duration(500)
      .style('opacity', 1);
    
    // Add annotations
    addGlobalAnnotations(honeyData, beehiveData);
    
    // Add legend
    addGlobalLegend();
  }
  
  /**
   * Add annotations for significant data points
   * @param {Array} honeyData - Global honey production data
   * @param {Array} beehiveData - Global beehive count data
   */
  function addGlobalAnnotations(honeyData, beehiveData) {
    // Find maximum honey production and growth rate
    const maxHoney = [...honeyData].sort((a, b) => b.production - a.production)[0];
    
    // Find beehive growth
    const firstBeehive = beehiveData[0];
    const lastBeehive = beehiveData[beehiveData.length - 1];
    const growthPercent = ((lastBeehive.hives - firstBeehive.hives) / firstBeehive.hives * 100).toFixed(1);
    
    // Add annotation for maximum honey production
    addGlobalAnnotation(
      maxHoney,
      `Peak: ${maxHoney.production.toFixed(2)} mil. tons`,
      -30, -20,
      globalConfig.honeycombColor,
      'honey'
    );
    
    // Add annotation for beehive growth
    addGlobalAnnotation(
      lastBeehive,
      `${growthPercent}% growth since 2010`,
      -40, -20,
      globalConfig.beehiveColor,
      'beehive'
    );
  }
  
  /**
   * Add an annotation to the chart
   * @param {Object} data - Data point to annotate
   * @param {string} text - Annotation text
   * @param {number} dx - X offset
   * @param {number} dy - Y offset
   * @param {string} color - Annotation color
   * @param {string} type - Type of data ('honey' or 'beehive')
   */
  function addGlobalAnnotation(data, text, dx, dy, color, type) {
    const y = type === 'honey' 
      ? globalYScaleLeft(data.production) 
      : globalYScaleRight(data.hives);
    
    const annotation = globalSvg.append('g')
      .attr('class', 'global-annotation')
      .attr('transform', `translate(${globalXScale(data.year)}, ${y})`)
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
      .delay(2500)
      .duration(500)
      .style('opacity', 1);
  }
  
  /**
   * Add legend for the global visualization
   */
  function addGlobalLegend() {
    const legend = globalSvg.append('g')
      .attr('class', 'global-legend')
      .attr('transform', `translate(${globalWidth - 180}, 20)`);
    
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
    
    // Add honey production legend item
    const honeyLegend = legend.append('g')
      .attr('transform', 'translate(10, 40)');
    
    honeyLegend.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 30)
      .attr('y2', 0)
      .attr('stroke', globalConfig.honeycombColor)
      .attr('stroke-width', 3);
    
    honeyLegend.append('path')
      .attr('d', createHexPath(4))
      .attr('transform', 'translate(15, 0)')
      .attr('fill', globalConfig.honeycombColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);
    
    honeyLegend.append('text')
      .attr('x', 40)
      .attr('y', 4)
      .attr('font-size', '12px')
      .attr('fill', '#fff')
      .text('Honey Production');
    
    // Add beehive legend item
    const beehiveLegend = legend.append('g')
      .attr('transform', 'translate(10, 60)');
    
    beehiveLegend.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 30)
      .attr('y2', 0)
      .attr('stroke', globalConfig.beehiveColor)
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5');
    
    beehiveLegend.append('path')
      .attr('d', createHexPath(4))
      .attr('transform', 'translate(15, 0)')
      .attr('fill', globalConfig.beehiveColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);
    
    beehiveLegend.append('text')
      .attr('x', 40)
      .attr('y', 4)
      .attr('font-size', '12px')
      .attr('fill', '#fff')
      .text('Number of Beehives');
  }
  
  /**
   * Handle mouse over event for global data points
   * @param {Event} event - Mouse event
   * @param {Object} d - Data point
   */
  function handleGlobalDotMouseOver(event, d) {
    // Determine data type
    const type = event.currentTarget.getAttribute('data-type');
    
    // Highlight the point
    d3.select(event.currentTarget)
      .transition()
      .duration(200)
      .attr('transform', function() {
        const current = d3.select(this).attr('transform');
        return current + ' scale(1.5)';
      });
    
    // Show tooltip
    globalTooltip.transition()
      .duration(globalConfig.tooltipDuration)
      .style('opacity', 0.9);
    
    let tooltipContent = `<div class="tooltip-title">${d.year}</div>`;
    
    if (type === 'honey') {
      tooltipContent += `<div>Honey Production: <span class="tooltip-value">${d.production.toFixed(2)} million metric tons</span></div>`;
    } else if (type === 'beehive') {
      tooltipContent += `<div>Beehives: <span class="tooltip-value">${d.hives.toFixed(1)} million</span></div>`;
    }
    
    globalTooltip.html(tooltipContent)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px');
  }
  
  /**
   * Handle mouse out event for global data points
   * @param {Event} event - Mouse event
   */
  function handleGlobalDotMouseOut(event) {
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
    globalTooltip.transition()
      .duration(globalConfig.tooltipDuration)
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
   * Handle window resize event for the chart
   */
  function resizeGlobalChart() {
    if (!globalChart) return;
    
    // Update width
    globalWidth = globalChart.clientWidth - globalConfig.margin.left - globalConfig.margin.right;
    
    // Update SVG dimensions
    d3.select(globalChart).select('svg')
      .attr('width', globalWidth + globalConfig.margin.left + globalConfig.margin.right);
    
    // Update scales
    globalXScale.range([0, globalWidth]);
    
    // Update clipPath
    globalSvg.select('#global-clip rect')
      .attr('width', globalWidth);
    
    // Update axes
    globalSvg.select('.global-x-axis')
      .call(d3.axisBottom(globalXScale).tickFormat(d3.format('d')));
      
    globalSvg.select('.global-y-axis-right')
      .attr('transform', `translate(${globalWidth}, 0)`);
      
      globalSvg.select('.global-x-label')
      .attr('x', globalWidth / 2);
  
    globalSvg.select('.global-y-label-right')
      .attr('x', (globalConfig.height - globalConfig.margin.top - globalConfig.margin.bottom) / 2)
      .attr('y', -globalWidth - 50);
  
    globalSvg.select('.global-legend')
      .attr('transform', `translate(${globalWidth - 180}, 20)`);
  }
  
  // Bind to window resize
  window.addEventListener('resize', resizeGlobalChart);
  
  // Initialize only when DOM is ready and element is present
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('global-data-chart')) {
      initGlobalDataChart();
    }
  });
  
  