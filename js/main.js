/**
 * main.js - Core functionality for The Hive Mind Bee Visualization
 * 
 * This file handles:
 * - Initialization of all components
 * - Preloader functionality
 * - Navigation and scroll functionality
 * - Stat counter animations
 * - General UI interactions
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initPreloader();
    initNavigation();
    initScrollAnimations();
    initStatCounters();
    setupEventListeners();
    
    // Update copyright year
    document.getElementById('current-year').textContent = new Date().getFullYear();
  });
  
  /**
   * Initialize preloader and fade it out when page is loaded
   */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    
    // Hide preloader when page is fully loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        // Enable scrolling on page load
        document.body.classList.remove('no-scroll');
        // Start initial animations
        startInitialAnimations();
      }, 500);
    });
    
    // Fallback to hide preloader if it takes too long
    setTimeout(() => {
      if (!preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        startInitialAnimations();
      }
    }, 3000);
  }
  
  /**
   * Start initial animations when page loads
   */
  function startInitialAnimations() {
    // Add animations to hero elements
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .scroll-indicator');
    
    heroElements.forEach((element, index) => {
      element.classList.add('animate-fade-up');
      element.style.animationDelay = `${0.2 * index}s`;
    });
    
    // Initialize 3D bee model after a slight delay
    setTimeout(() => {
      // Only initialize if the element exists
      if (typeof initBeeModel === 'function' && document.getElementById('hero-bee-3d')) {
        initBeeModel();
      }
    }, 800);
  }
  
  /**
   * Initialize navigation functionality
   */
  function initNavigation() {
    const nav = document.querySelector('.main-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Add scrolled class to navigation when page is scrolled
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
    
    // Toggle mobile menu
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
      });
    }
    
    // Close mobile menu when a link is clicked
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
          menuToggle.classList.remove('active');
          navLinks.classList.remove('active');
          document.body.classList.remove('no-scroll');
        }
      });
    });
  }
  
  /**
   * Initialize scroll-based animations
   */
  function initScrollAnimations() {
    // Get all elements that should be animated on scroll
    const elements = document.querySelectorAll('.reveal');
    
    // Create a new IntersectionObserver instance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Unobserve after animation is triggered
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15, // Trigger when 15% of the element is visible
      rootMargin: '0px 0px -50px 0px' // Adjust the trigger point
    });
    
    // Observe each element
    elements.forEach(element => {
      observer.observe(element);
    });
    
    // Add scroll classes to sections for specific animations
    const sections = document.querySelectorAll('.section');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          
          // Trigger section-specific animations
          const sectionId = entry.target.id;
          triggerSectionAnimations(sectionId);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    });
    
    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }
  
  /**
   * Trigger animations specific to each section
   * @param {string} sectionId - The ID of the section coming into view
   */
  function triggerSectionAnimations(sectionId) {
    switch (sectionId) {
      case 'overview':
        // Reveal stat hexagons with delay
        const statHexagons = document.querySelectorAll('.stat-hex');
        statHexagons.forEach((hex, index) => {
          setTimeout(() => {
            hex.classList.add('animate-fade-in');
          }, 300 * index);
        });
        
        // Initialize bee rotation
        if (typeof initInteractiveBee === 'function' && document.getElementById('interactive-bee')) {
          initInteractiveBee();
        }
        break;
        
      case 'colonies':
        // Initialize colony losses chart
        if (typeof initColonyLossesChart === 'function' && document.getElementById('colony-losses-chart')) {
          initColonyLossesChart();
        }
        break;
        
      case 'production':
        // Initialize honey production chart
        if (typeof initHoneyProductionChart === 'function' && document.getElementById('honey-production-chart')) {
          initHoneyProductionChart();
        }
        
        // Initialize hexagon grid with delay
        setTimeout(() => {
          if (typeof initHexagonGrid === 'function' && document.getElementById('hexagon-grid')) {
            initHexagonGrid();
          }
        }, 1000);
        break;
        
      case 'global':
        // Initialize global data visualization
        if (typeof initGlobalDataChart === 'function' && document.getElementById('global-data-chart')) {
          initGlobalDataChart();
        }
        break;
        
      case 'action':
        // Animate action hexagons with staggered delay
        const actionHexagons = document.querySelectorAll('.action-hex');
        actionHexagons.forEach((hex, index) => {
          setTimeout(() => {
            hex.classList.add('animate-fade-up');
          }, 200 * index);
        });
        break;
    }
  }
  
  /**
   * Initialize and animate stat counters
   */
  function initStatCounters() {
    const statValues = document.querySelectorAll('.stat-value');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const value = entry.target.getAttribute('data-value');
          const decimalPlaces = value.includes('.') ? value.split('.')[1].length : 0;
          const duration = 2000; // Animation duration in milliseconds
          const frameDuration = 1000 / 60; // Duration of a single frame at 60fps
          const totalFrames = Math.round(duration / frameDuration);
          
          let currentFrame = 0;
          const finalValue = parseFloat(value);
          const initialValue = 0;
          
          const counter = setInterval(() => {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            const currentValue = initialValue + (finalValue - initialValue) * easeOutQuad(progress);
            
            entry.target.textContent = decimalPlaces > 0 
              ? currentValue.toFixed(decimalPlaces) 
              : Math.floor(currentValue);
            
            if (currentFrame === totalFrames) {
              clearInterval(counter);
              entry.target.textContent = value; // Ensure final value is exact
            }
          }, frameDuration);
          
          // Stop observing after animation starts
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px'
    });
    
    statValues.forEach(statValue => {
      observer.observe(statValue);
    });
  }
  
  /**
   * Easing function for smoother animations
   * @param {number} t - Current time (0-1)
   * @returns {number} - Value with easing applied
   */
  function easeOutQuad(t) {
    return t * (2 - t);
  }
  
  /**
   * Set up event listeners for interactive elements
   */
  function setupEventListeners() {
    // Chart tabs/buttons
    const chartButtons = document.querySelectorAll('.chart-btn');
    chartButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        chartButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        // Handle chart view change
        const chartType = button.getAttribute('data-chart');
        if (typeof updateChartView === 'function') {
          updateChartView(chartType);
        }
      });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const navHeight = document.querySelector('.main-nav').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Tooltips for interactive elements
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        const tooltipText = element.getAttribute('data-tooltip');
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.textContent = tooltipText;
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        
        // Show tooltip
        setTimeout(() => {
          tooltip.classList.add('visible');
        }, 10);
        
        // Store tooltip reference
        element.tooltip = tooltip;
      });
      
      element.addEventListener('mouseleave', () => {
        if (element.tooltip) {
          element.tooltip.classList.remove('visible');
          
          // Remove tooltip after animation completes
          setTimeout(() => {
            if (element.tooltip && element.tooltip.parentNode) {
              element.tooltip.parentNode.removeChild(element.tooltip);
              element.tooltip = null;
            }
          }, 300);
        }
      });
    });
  }
  
  /**
   * Handle window resize events
   */
  window.addEventListener('resize', debounce(() => {
    // Reinitialize charts if they exist
    if (typeof resizeCharts === 'function') {
      resizeCharts();
    }
  }, 250));
  
  /**
   * Debounce function to limit how often a function can be called
   * @param {Function} func - Function to debounce
   * @param {number} wait - Time to wait in milliseconds
   * @returns {Function} - Debounced function
   */
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  