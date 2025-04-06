/**
 * bee-3d.js - 3D bee model with Three.js
 * 
 * This file creates an interactive 3D bee model for the hero section
 * using Three.js, with responsive behavior and smooth animation.
 */

// Configuration
const beeModelConfig = {
    canvasWidth: 800,
    canvasHeight: 600,
    rotationSpeed: 0.005,
    hoverRotationSpeed: 0.01,
    yOffset: 20,
    floatAmplitude: 15,
    floatSpeed: 0.002,
    wingFlapSpeed: 0.2
  };
  
  // Store 3D elements
  let beeRenderer;
  let beeScene;
  let beeCamera;
  let beeModel;
  let beeWings = {
    left: null,
    right: null
  };
  let beeLights = [];
  let beeContainer;
  let beeAnimationFrame;
  let beeMouseDown = false;
  let beeMousePosition = { x: 0, y: 0 };
  let beeRotation = { x: 0, y: 0 };
  let beeTargetRotation = { x: 0, y: 0 };
  let beeInteracting = false;
  
  /**
   * Initialize the 3D bee model
   */
  function initBeeModel() {
    beeContainer = document.getElementById('hero-bee-3d');
    if (!beeContainer) return;
    
    // Create scene
    beeScene = new THREE.Scene();
    
    // Create camera
    const aspect = window.innerWidth / window.innerHeight;
    beeCamera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    beeCamera.position.z = 400;
    beeCamera.position.y = 50;
    
    // Create renderer
    beeRenderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    beeRenderer.setSize(window.innerWidth, window.innerHeight);
    beeRenderer.setPixelRatio(window.devicePixelRatio);
    beeRenderer.setClearColor(0x000000, 0);
    
    // Add renderer to container
    beeContainer.appendChild(beeRenderer.domElement);
    
    // Add lights
    addBeeLights();
    
    // Create a simple bee model
    createBeeModel();
    
    // Add event listeners
    window.addEventListener('resize', resizeBeeModel);
    beeRenderer.domElement.addEventListener('mousedown', handleBeeMouseDown);
    beeRenderer.domElement.addEventListener('mousemove', handleBeeMouseMove);
    beeRenderer.domElement.addEventListener('mouseup', handleBeeMouseUp);
    beeRenderer.domElement.addEventListener('mouseleave', handleBeeMouseUp);
    beeRenderer.domElement.addEventListener('touchstart', handleBeeTouchStart);
    beeRenderer.domElement.addEventListener('touchmove', handleBeeTouchMove);
    beeRenderer.domElement.addEventListener('touchend', handleBeeTouchEnd);
    
    // Start animation loop
    animateBeeModel();
  }
  
  /**
   * Add lights to the scene
   */
  function addBeeLights() {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    beeScene.add(ambientLight);
    
    // Add directional light (sun-like)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 100);
    beeScene.add(directionalLight);
    
    // Add point light from front
    const frontLight = new THREE.PointLight(0xffffcc, 0.8, 500);
    frontLight.position.set(0, 0, 200);
    beeScene.add(frontLight);
    
    // Add golden rim light from behind
    const rimLight = new THREE.PointLight(0xff9900, 0.5, 500);
    rimLight.position.set(-100, 20, -200);
    beeScene.add(rimLight);
    
    // Store lights for animation
    beeLights = [directionalLight, frontLight, rimLight];
  }
  
  /**
   * Create a stylized bee model with Three.js geometries
   */
  function createBeeModel() {
    // Create a group for the entire bee
    beeModel = new THREE.Group();
    
    // Create materials
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0xffc107,
      specular: 0xffffcc,
      shininess: 30,
      flatShading: false
    });
    
    const blackMaterial = new THREE.MeshPhongMaterial({
      color: 0x222222,
      specular: 0x333333,
      shininess: 30,
      flatShading: false
    });
    
    const wingMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      specular: 0xffffff,
      shininess: 100
    });
    
    // Create bee body (ellipsoid)
    const bodyGeometry = new THREE.SphereGeometry(50, 32, 32);
    bodyGeometry.scale(1, 0.8, 1.5);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    beeModel.add(body);
    
    // Create bee stripes
    const stripeDepth = 76;
    const stripePositions = [-30, 0, 30];
    
    stripePositions.forEach(pos => {
      const stripeGeometry = new THREE.CylinderGeometry(52, 52, 12, 32);
      const stripe = new THREE.Mesh(stripeGeometry, blackMaterial);
      stripe.position.z = pos;
      stripe.rotation.x = Math.PI / 2;
      beeModel.add(stripe);
    });
    
    // Create bee head
    const headGeometry = new THREE.SphereGeometry(30, 32, 32);
    const head = new THREE.Mesh(headGeometry, blackMaterial);
    head.position.z = 75;
    head.position.y = 10;
    beeModel.add(head);
    
    // Create bee eyes
    const eyeGeometry = new THREE.SphereGeometry(12, 32, 32);
    
    const leftEye = new THREE.Mesh(eyeGeometry, new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0xffffff,
      shininess: 100
    }));
    leftEye.position.set(-15, 20, 75);
    beeModel.add(leftEye);
    
    const rightEye = leftEye.clone();
    rightEye.position.set(15, 20, 75);
    beeModel.add(rightEye);
    
    // Create eye pupils
    const pupilGeometry = new THREE.SphereGeometry(6, 32, 32);
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(-15, 20, 86);
    beeModel.add(leftPupil);
    
    const rightPupil = leftPupil.clone();
    rightPupil.position.set(15, 20, 86);
    beeModel.add(rightPupil);
    
    // Create bee antennae
    const antennaGeometry = new THREE.CylinderGeometry(2, 2, 40, 8);
    antennaGeometry.translate(0, 20, 0);
    antennaGeometry.rotateX(Math.PI / 4);
    
    const leftAntenna = new THREE.Mesh(antennaGeometry, blackMaterial);
    leftAntenna.position.set(-10, 25, 80);
    leftAntenna.rotation.y = -Math.PI / 8;
    beeModel.add(leftAntenna);
    
    const rightAntenna = leftAntenna.clone();
    rightAntenna.position.set(10, 25, 80);
    rightAntenna.rotation.y = Math.PI / 8;
    beeModel.add(rightAntenna);
    
    // Create antenna tips
    const antennaTipGeometry = new THREE.SphereGeometry(4, 16, 16);
    
    const leftAntennaTip = new THREE.Mesh(antennaTipGeometry, blackMaterial);
    leftAntennaTip.position.set(-22, 52, 95);
    beeModel.add(leftAntennaTip);
    
    const rightAntennaTip = leftAntennaTip.clone();
    rightAntennaTip.position.set(22, 52, 95);
    beeModel.add(rightAntennaTip);
    
    // Create bee wings
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.bezierCurveTo(5, 25, 40, 50, 50, 5);
    wingShape.bezierCurveTo(50, -20, 25, -25, 0, 0);
    
    const wingGeometry = new THREE.ShapeGeometry(wingShape);
    
    // Left wing
    beeWings.left = new THREE.Group();
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.scale.set(1.5, 1.5, 1.5);
    leftWing.position.set(-25, 30, 0);
    leftWing.rotation.set(-Math.PI / 4, 0, -Math.PI / 8);
    beeWings.left.add(leftWing);
    
    // Create left wing veins
    const leftWingVeins = createWingVeins();
    leftWingVeins.scale.set(1.5, 1.5, 1.5);
    leftWingVeins.position.set(-25, 30, 0);
    leftWingVeins.rotation.set(-Math.PI / 4, 0, -Math.PI / 8);
    beeWings.left.add(leftWingVeins);
    
    beeWings.left.position.set(0, 20, 0);
    beeModel.add(beeWings.left);
    
    // Right wing
    beeWings.right = new THREE.Group();
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.scale.set(1.5, 1.5, 1.5);
    rightWing.position.set(25, 30, 0);
    rightWing.rotation.set(-Math.PI / 4, 0, Math.PI / 8);
    beeWings.right.add(rightWing);
    
    // Create right wing veins
    const rightWingVeins = createWingVeins();
    rightWingVeins.scale.set(1.5, 1.5, 1.5);
    rightWingVeins.position.set(25, 30, 0);
    rightWingVeins.rotation.set(-Math.PI / 4, 0, Math.PI / 8);
    beeWings.right.add(rightWingVeins);
    
    beeWings.right.position.set(0, 20, 0);
    beeModel.add(beeWings.right);
    
    // Create bee stinger
    const stingerGeometry = new THREE.ConeGeometry(5, 20, 32);
    const stinger = new THREE.Mesh(stingerGeometry, blackMaterial);
    stinger.position.z = -80;
    stinger.rotation.x = Math.PI / 2;
    beeModel.add(stinger);
    
    // Create bee legs
    createBeeLegs(beeModel, blackMaterial);
    
    // Add the bee to the scene
    beeScene.add(beeModel);
    
    // Position the bee
    beeModel.position.y = beeModelConfig.yOffset;
  }
  
  /**
   * Create wing veins for the bee wings
   * @returns {THREE.Object3D} - Wing veins object
   */
  function createWingVeins() {
    const veinsGroup = new THREE.Group();
    const veinMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    
    // Main vein
    const mainVeinPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(25, 25, 0),
      new THREE.Vector3(45, 5, 0)
    ];
    
    const mainVeinGeometry = new THREE.BufferGeometry().setFromPoints(mainVeinPoints);
    const mainVein = new THREE.Line(mainVeinGeometry, veinMaterial);
    veinsGroup.add(mainVein);
    
    // Secondary veins
    
  // Secondary veins
    const secondaryVeins = [
      [
        new THREE.Vector3(15, 15, 0),
        new THREE.Vector3(20, 30, 0)
      ],
      [
        new THREE.Vector3(30, 15, 0),
        new THREE.Vector3(40, 30, 0)
      ],
      [
        new THREE.Vector3(25, 5, 0),
        new THREE.Vector3(15, -10, 0)
      ]
    ];
    
    secondaryVeins.forEach(points => {
      const veinGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const vein = new THREE.Line(veinGeometry, veinMaterial);
      veinsGroup.add(vein);
    });
    
    return veinsGroup;
  }
  
  /**
   * Create legs for the bee model
   * @param {THREE.Object3D} beeModel - The bee model to add legs to
   * @param {THREE.Material} material - Material for the legs
   */
  function createBeeLegs(beeModel, material) {
    // Define leg positions (3 on each side)
    const legPositions = [
      { x: -40, y: -10, z: 40 },  // Front left
      { x: -45, y: -10, z: 0 },   // Middle left
      { x: -40, y: -10, z: -40 }, // Back left
      { x: 40, y: -10, z: 40 },   // Front right
      { x: 45, y: -10, z: 0 },    // Middle right
      { x: 40, y: -10, z: -40 }   // Back right
    ];
    
    // Create each leg as a bent cylinder
    legPositions.forEach((pos, index) => {
      const legGroup = new THREE.Group();
      
      // Upper leg segment
      const upperLegGeometry = new THREE.CylinderGeometry(3, 2, 30, 8);
      const upperLeg = new THREE.Mesh(upperLegGeometry, material);
      upperLeg.position.set(0, -15, 0);
      upperLeg.rotation.z = (index < 3) ? Math.PI / 4 : -Math.PI / 4;
      legGroup.add(upperLeg);
      
      // Lower leg segment
      const lowerLegGeometry = new THREE.CylinderGeometry(2, 1, 35, 8);
      const lowerLeg = new THREE.Mesh(lowerLegGeometry, material);
      
      // Position the lower leg at the end of the upper leg
      const xOffset = (index < 3) ? -15 : 15;
      lowerLeg.position.set(xOffset, -30, 0);
      lowerLeg.rotation.z = (index < 3) ? -Math.PI / 3 : Math.PI / 3;
      legGroup.add(lowerLeg);
      
      // Position the entire leg
      legGroup.position.set(pos.x, pos.y, pos.z);
      
      // Add slight forward/backward rotation for front/back legs
      if (index === 0 || index === 3) {
        legGroup.rotation.y = Math.PI / 12;
      } else if (index === 2 || index === 5) {
        legGroup.rotation.y = -Math.PI / 12;
      }
      
      beeModel.add(legGroup);
    });
  }
  
  /**
   * Animate the 3D bee model
   */
  function animateBeeModel() {
    beeAnimationFrame = requestAnimationFrame(animateBeeModel);
    
    // Skip if container is no longer in the document
    if (!document.body.contains(beeContainer)) {
      cancelAnimationFrame(beeAnimationFrame);
      return;
    }
    
    // Float up and down with sine wave
    const floatOffset = Math.sin(Date.now() * beeModelConfig.floatSpeed) * beeModelConfig.floatAmplitude;
    beeModel.position.y = beeModelConfig.yOffset + floatOffset;
    
    // Rotate the model
    if (beeInteracting) {
      // Smoothly interpolate towards target rotation
      beeRotation.x += (beeTargetRotation.x - beeRotation.x) * 0.1;
      beeRotation.y += (beeTargetRotation.y - beeRotation.y) * 0.1;
    } else {
      // Auto-rotate when not interacting
      beeRotation.y += beeModelConfig.rotationSpeed;
    }
    
    beeModel.rotation.set(beeRotation.x, beeRotation.y, 0);
    
    // Animate wings flapping
    const wingRotation = Math.sin(Date.now() * beeModelConfig.wingFlapSpeed) * 0.3;
    
    if (beeWings.left) {
      beeWings.left.rotation.x = wingRotation;
    }
    
    if (beeWings.right) {
      beeWings.right.rotation.x = -wingRotation;
    }
    
    // Animate lights
    beeLights.forEach(light => {
      if (light.intensity) {
        light.intensity = 0.5 + Math.sin(Date.now() * 0.001) * 0.1;
      }
    });
    
    // Render scene
    beeRenderer.render(beeScene, beeCamera);
  }
  
  /**
   * Resize the 3D bee model when window is resized
   */
  function resizeBeeModel() {
    if (!beeCamera || !beeRenderer || !beeContainer) return;
    
    // Update camera
    beeCamera.aspect = window.innerWidth / window.innerHeight;
    beeCamera.updateProjectionMatrix();
    
    // Update renderer
    beeRenderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  /**
   * Handle mouse down event for bee model interaction
   * @param {Event} event - Mouse event
   */
  function handleBeeMouseDown(event) {
    beeMouseDown = true;
    beeInteracting = true;
    
    beeMousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    beeMousePosition.y = -((event.clientY / window.innerHeight) * 2 - 1);
  }
  
  /**
   * Handle mouse move event for bee model interaction
   * @param {Event} event - Mouse event
   */
  function handleBeeMouseMove(event) {
    if (!beeMouseDown) return;
    
    const newX = (event.clientX / window.innerWidth) * 2 - 1;
    const newY = -((event.clientY / window.innerHeight) * 2 - 1);
    
    const deltaX = newX - beeMousePosition.x;
    const deltaY = newY - beeMousePosition.y;
    
    beeTargetRotation.y += deltaX * 3;
    beeTargetRotation.x += deltaY * 2;
    
    // Limit rotation on x-axis
    beeTargetRotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, beeTargetRotation.x));
    
    beeMousePosition.x = newX;
    beeMousePosition.y = newY;
  }
  
  /**
   * Handle mouse up event for bee model interaction
   */
  function handleBeeMouseUp() {
    beeMouseDown = false;
    
    // Set a timeout to stop interaction mode if not touched again
    setTimeout(() => {
      if (!beeMouseDown) {
        beeInteracting = false;
      }
    }, 2000);
  }
  
  /**
   * Handle touch start event for bee model interaction
   * @param {Event} event - Touch event
   */
  function handleBeeTouchStart(event) {
    if (event.touches.length === 1) {
      event.preventDefault();
      
      beeMouseDown = true;
      beeInteracting = true;
      
      beeMousePosition.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      beeMousePosition.y = -((event.touches[0].clientY / window.innerHeight) * 2 - 1);
    }
  }
  
  /**
   * Handle touch move event for bee model interaction
   * @param {Event} event - Touch event
   */
  function handleBeeTouchMove(event) {
    if (event.touches.length === 1 && beeMouseDown) {
      event.preventDefault();
      
      const newX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      const newY = -((event.touches[0].clientY / window.innerHeight) * 2 - 1);
      
      const deltaX = newX - beeMousePosition.x;
      const deltaY = newY - beeMousePosition.y;
      
      beeTargetRotation.y += deltaX * 3;
      beeTargetRotation.x += deltaY * 2;
      
      // Limit rotation on x-axis
      beeTargetRotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, beeTargetRotation.x));
      
      beeMousePosition.x = newX;
      beeMousePosition.y = newY;
    }
  }
  
  /**
   * Handle touch end event for bee model interaction
   */
  function handleBeeTouchEnd() {
    beeMouseDown = false;
    
    // Set a timeout to stop interaction mode if not touched again
    setTimeout(() => {
      if (!beeMouseDown) {
        beeInteracting = false;
      }
    }, 2000);
  }
  
  // Clean up resources when the page unloads
  window.addEventListener('beforeunload', () => {
    if (beeAnimationFrame) {
      cancelAnimationFrame(beeAnimationFrame);
    }
    
    if (beeRenderer) {
      beeRenderer.dispose();
    }
  });
  
  // Initialize on load if the element exists
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('hero-bee-3d') && typeof THREE !== 'undefined') {
      // Delay initialization to ensure smooth page load
      setTimeout(initBeeModel, 500);
    }
  });
  