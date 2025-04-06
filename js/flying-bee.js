/**
 * flying-bee.js - Creates a stylish bee that follows scroll on the right side
 */

document.addEventListener('DOMContentLoaded', () => {
  // Create or get the bee container
  let beeContainer = document.getElementById('flying-bee');
  if (!beeContainer) {
    beeContainer = document.createElement('div');
    beeContainer.id = 'flying-bee';
    document.body.appendChild(beeContainer);
  }
  
  // Create SVG bee
  const beeSvg = `
    <svg width="60" height="60" viewBox="0 0 60 60">
      <!-- Wings -->
      <ellipse class="left-wing" cx="20" cy="20" rx="15" ry="8" fill="rgba(255, 255, 255, 0.7)"/>
      <ellipse class="right-wing" cx="40" cy="20" rx="15" ry="8" fill="rgba(255, 255, 255, 0.7)"/>
      
      <!-- Body -->
      <ellipse cx="30" cy="30" rx="15" ry="20" fill="#ffc107"/>
      
      <!-- Stripes -->
      <rect x="15" y="18" width="30" height="8" fill="#222"/>
      <rect x="15" y="30" width="30" height="8" fill="#222"/>
      <rect x="15" y="42" width="30" height="8" fill="#222"/>
      
      <!-- Face -->
      <circle cx="30" cy="15" r="8" fill="#222"/>
      <circle cx="26" cy="13" r="2" fill="white"/>
      <circle cx="34" cy="13" r="2" fill="white"/>
    </svg>
  `;
  
  // Add bee to container
  beeContainer.innerHTML = beeSvg;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #flying-bee {
      position: fixed;
      z-index: 9999;
      right: 50px;
      top: 100px;
      pointer-events: none;
      transition: top 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    @keyframes flapWings {
      0%, 100% { transform: scaleY(1); }
      50% { transform: scaleY(0.8); }
    }
    
    .left-wing, .right-wing {
      animation: flapWings 0.2s infinite;
      transform-origin: center;
    }
    
    .right-wing {
      animation-delay: 0.1s;
    }
  `;
  document.head.appendChild(style);
  
  // Set initial position
  updateBeePosition();
  
  // Add scroll handler
  window.addEventListener('scroll', () => {
    updateBeePosition();
  });
  
  // Add subtle hover movement
  setInterval(() => {
    const randomOffset = Math.sin(Date.now() / 1000) * 10;
    beeContainer.style.marginTop = `${randomOffset}px`;
  }, 100);
  
  // Handle bee position based on scroll
  function updateBeePosition() {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = window.scrollY / maxScroll;
    
    // Move from top to middle as user scrolls
    const topPosition = 100 + (scrollPercent * 300);
    beeContainer.style.top = `${topPosition}px`;
  }
});