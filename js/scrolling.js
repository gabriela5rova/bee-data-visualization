/**
 * scrolling.js - Scroll-based animations and interactions
 * 
 * This file handles:
 * - Scroll-based triggers for visualizations
 * - Parallax effects
 * - Section transitions
 */

// Store scrolling state
let lastScrollPosition = 0;
let ticking = false;
let scrollDirection = 'down';
let scroller;
let scrollSections;

/**
 * Initialize scrolling functionality
 */
document.addEventListener('DOMContentLoaded', () => {
  initScrolling();
});

/**
 * Initialize scroll detection and effects
 */
function initScrolling() {
  // Listen for scroll events
  window.addEventListener('scroll', handleScroll);
  
  // Initialize scrollama for section triggers
  initScrollama();
  
  // Initialize parallax effects
  initParallaxEffects();
  
  // Initialize honeycomb background animation
  initHoneycombBackground();
}

/**
 * Handle scroll events
 */
function handleScroll() {
  // Determine scroll direction
  const scrollPosition = window.scrollY;
  scrollDirection = scrollPosition > lastScrollPosition ? 'down' : 'up';
  lastScrollPosition = scrollPosition;
  
  // Use requestAnimationFrame to optimize performance
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollEffects(scrollPosition);
      ticking = false;
    });
    ticking = true;
  }
}

/**
 * Update scroll-based effects
 * @param {number} scrollPosition - Current scroll position
 */
function updateScrollEffects(scrollPosition) {
  // Update navigation based on scroll position
  updateNavigation(scrollPosition);
  
  // Update parallax elements
  updateParallaxElements(scrollPosition);
}

/**
 * Update navigation based on scroll position
 * @param {number} scrollPosition - Current scroll position
 */
function updateNavigation(scrollPosition) {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;
  
  // Add scrolled class when page is scrolled
  if (scrollPosition > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  
  // Highlight current section in navigation
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  // Find the current section in view
  let currentSection = null;
  const offset = nav.offsetHeight + 50;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - offset;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.id;
    }
  });
  
  // Highlight the corresponding nav link
  if (currentSection) {
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
}

/**
 * Initialize scrollama for section triggers
 */
function initScrollama() {
  // Create scrollama instance
  scroller = scrollama();
  
  // Get all sections
  scrollSections = document.querySelectorAll('.section');
  
  // Initialize the scroller
  scroller
    .setup({
      step: '.section',
      offset: 0.5,  // Trigger when section is 50% in view
      debug: false
    })
    .onStepEnter(handleSectionEnter)
    .onStepExit(handleSectionExit);
  
  // Handle resize
  window.addEventListener('resize', debounce(() => {
    scroller.resize();
  }, 250));
}

/**
 * Handle section enter event
 * @param {Object} response - Scrollama response object
 */
function handleSectionEnter(response) {
  // Add active class to current section
  response.element.classList.add('active');
  
  // Fire section-specific animations
  const sectionId = response.element.id;
  
  // Wait a bit for DOM updates
  setTimeout(() => {
    triggerSectionAnimations(sectionId, response.direction);
  }, 100);
}

/**
 * Handle section exit event
 * @param {Object} response - Scrollama response object
 */
function handleSectionExit(response) {
  // Remove active class when leaving section
  response.element.classList.remove('active');
}

/**
 * Trigger section-specific animations
 * @param {string} sectionId - ID of the section
 * @param {string} direction - Scroll direction ('up' or 'down')
 */
function triggerSectionAnimations(sectionId, direction) {
  // Don't animate if we're scrolling up to a section we've already seen
  if (direction === 'up') return;
  
  // Find reveal elements in the section
  const revealElements = document.querySelectorAll(`#${sectionId} .reveal`);
  revealElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('active');
    }, 100 * index);
  });
  
  // Section-specific animations
  switch (sectionId) {
    case 'hero':
      // Hero animations handled in main.js
      break;
      
    case 'overview':
      // Trigger stat counter animations
      animateStatCounters();
      break;
      
    case 'colonies':
      // Initialize colony losses chart if it exists and isn't already initialized
      if (typeof initColonyLossesChart === 'function' && 
          document.getElementById('colony-losses-chart') && 
          !document.getElementById('colony-losses-chart').classList.contains('initialized')) {
        
        initColonyLossesChart();
        document.getElementById('colony-losses-chart').classList.add('initialized');
      }
      break;
      
    case 'production':
      // Initialize honey production chart
      if (typeof initHoneyProductionChart === 'function' && 
          document.getElementById('honey-production-chart') && 
          !document.getElementById('honey-production-chart').classList.contains('initialized')) {
        
        initHoneyProductionChart();
        document.getElementById('honey-production-chart').classList.add('initialized');
      }
      
      // Initialize hexagon grid with a slight delay
      setTimeout(() => {
        if (typeof initHexagonGrid === 'function' && 
            document.getElementById('hexagon-grid') && 
            !document.getElementById('hexagon-grid').classList.contains('initialized')) {
          
          initHexagonGrid();
          document.getElementById('hexagon-grid').classList.add('initialized');
        }
      }, 500);
      break;
      
    case 'global':
      // Initialize global data chart
      if (typeof initGlobalDataChart === 'function' && 
          document.getElementById('global-data-chart') && 
          !document.getElementById('global-data-chart').classList.contains('initialized')) {
        
        initGlobalDataChart();
        document.getElementById('global-data-chart').classList.add('initialized');
      }
      break;
      
    case 'action':
      // Animate action hexagons
      animateActionHexagons();
      break;
  }
}

/**
 * Animate stat counters with easing
 */
function animateStatCounters() {
  const statValues = document.querySelectorAll('.stat-value');
  
  statValues.forEach(statValue => {
    if (statValue.classList.contains('animated')) return;
    
    const value = parseFloat(statValue.getAttribute('data-value'));
    const decimal = value.toString().includes('.') ? value.toString().split('.')[1].length : 0;
    
    const duration = 2000; // Animation duration in milliseconds
    const frameDuration = 1000 / 60; // Duration of a single frame at 60fps
    const frames = Math.round(duration / frameDuration);
    
    let frame = 0;
    const countTo = value;
    let currentCount = 0;
    
    const counter = setInterval(() => {
      frame++;
      
      // Calculate eased progress
      const progress = frame / frames;
      const easedProgress = easeOutQuad(progress);
      
      // Calculate current value
      currentCount = countTo * easedProgress;
      
      // Update the display
      statValue.textContent = decimal > 0 
        ? currentCount.toFixed(decimal) 
        : Math.floor(currentCount);
      
      // Stop when done
      if (frame === frames) {
        clearInterval(counter);
        statValue.textContent = value; // Ensure final value is exact
      }
    }, frameDuration);
    
    statValue.classList.add('animated');
  });
}

/**
 * Initialize parallax effects
 */
function initParallaxEffects() {
  // Find parallax elements
  const parallaxElements = document.querySelectorAll('.parallax');
  
  if (parallaxElements.length === 0) return;
  
  // Set up IntersectionObserver to only animate visible elements
  const parallaxObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.1 });
  
  // Observe each parallax element
  parallaxElements.forEach(element => {
    parallaxObserver.observe(element);
    
    // Get parallax speed/direction
    const speed = parseFloat(element.getAttribute('data-parallax-speed') || 0.2);
    const direction = element.getAttribute('data-parallax-direction') || 'up';
    
    // Store values for use in updateParallaxElements
    element.parallaxSpeed = speed;
    element.parallaxDirection = direction;
  });
}

/**
 * Update parallax elements based on scroll position
 * @param {number} scrollPosition - Current scroll position
 */
function updateParallaxElements(scrollPosition) {
  const parallaxElements = document.querySelectorAll('.parallax.visible');
  
  parallaxElements.forEach(element => {
    // Skip elements that are not in view
    if (!isElementInViewport(element)) return;
    
    // Get element position relative to viewport
    const rect = element.getBoundingClientRect();
    const offsetTop = rect.top + scrollPosition;
    const elementHeight = rect.height;
    const viewportHeight = window.innerHeight;
    
    // Calculate how far element is from center of viewport as percentage
    const viewportCenter = scrollPosition + (viewportHeight / 2);
    const elementCenter = offsetTop + (elementHeight / 2);
    const distanceFromCenter = elementCenter - viewportCenter;
    const percentFromCenter = distanceFromCenter / (viewportHeight / 2);
    
    // Apply transform based on parallax direction and speed
    const speed = element.parallaxSpeed || 0.2;
    const direction = element.parallaxDirection || 'up';
    let transform = '';
    
    if (direction === 'up' || direction === 'down') {
      const yOffset = percentFromCenter * speed * 100;
      transform = `translateY(${direction === 'up' ? -yOffset : yOffset}px)`;
    } else if (direction === 'left' || direction === 'right') {
      const xOffset = percentFromCenter * speed * 100;
      transform = `translateX(${direction === 'left' ? -xOffset : xOffset}px)`;
    }
    
    element.style.transform = transform;
  });
}

/**
 * Initialize honeycomb background animation
 */
function initHoneycombBackground() {
  // Create floating hexagons for background decoration
  const floatingHexagons = document.createElement('div');
  floatingHexagons.className = 'floating-hexagons';
  document.body.appendChild(floatingHexagons);
  
  // Create hexagons
  const hexCount = Math.min(20, Math.floor(window.innerWidth / 100));
  
  for (let i = 0; i < hexCount; i++) {
    const hex = document.createElement('div');
    hex.className = 'floating-hex';
    
    // Random size
    const size = 20 + Math.random() * 60;
    hex.style.width = `${size}px`;
    hex.style.height = `${size}px`;
    
    // Random position
    hex.style.left = `${Math.random() * 100}%`;
    hex.style.top = `${Math.random() * 100}%`;
    
    // Random animation duration and delay
    const duration = 15 + Math.random() * 30;
    const delay = Math.random() * 10;
    hex.style.animationDuration = `${duration}s`;
    hex.style.animationDelay = `${delay}s`;
    
    floatingHexagons.appendChild(hex);
  }
}

/**
 * Animate action hexagons with staggered reveal
 */
function animateActionHexagons() {
  const actionHexagons = document.querySelectorAll('.action-hex');
  
  actionHexagons.forEach((hex, index) => {
    if (hex.classList.contains('animated')) return;
    
    setTimeout(() => {
      hex.style.opacity = 0;
      hex.style.transform = 'translateY(30px)';
      
      // Trigger animation
      setTimeout(() => {
        hex.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        hex.style.opacity = 1;
        hex.style.transform = 'translateY(0)';
      }, 50);
      
      hex.classList.add('animated');
    }, index * 150);
  });
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @returns {boolean} - True if element is in viewport
 */
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  
  return (
    rect.top < window.innerHeight &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.right > 0
  );
}

/**
 * Easing function for smoother animations
 * @param {number} t - Current time (0-1)
 * @returns {number} - Eased value
 */
function easeOutQuad(t) {
  return t * (2 - t);
}

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
