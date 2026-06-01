// Lykan Hypersport Assembly Experience
// Three.js implementation with scroll-triggered assembly animations

let scene, camera, renderer, model, mixer, actions = {};
let scrollProgress = 0;
let currentStage = 0;
let modelLoaded = false;
let cameraOffset = { x: 0, y: 0, z: 0 };
const stages = [
    { name: 'Initialization', progress: 0 },
    { name: 'Chassis Assembly', progress: 11 },
    { name: 'Engine Installation', progress: 22 },
    { name: 'Suspension Setup', progress: 33 },
    { name: 'Interior Build', progress: 44 },
    { name: 'Body Panels', progress: 55 },
    { name: 'Door Assembly', progress: 66 },
    { name: 'Lighting Install', progress: 77 },
    { name: 'Final Reveal', progress: 88 }
];

// Initialize Three.js Scene
function initScene() {
    const container = document.getElementById('canvas-container');
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    scene.fog = new THREE.Fog(0x0a0e27, 1000, 100);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 0, 5);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    container.appendChild(renderer.domElement);
    
    // Lighting
    setupLighting();
    
    // Load model
    loadModel();
    
    // Event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('wheel', onMouseWheel, { passive: false });
    
    // Start animation loop
    animate();
}

// Setup lighting for cinematic effect
function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Key light (main)
    const keyLight = new THREE.DirectionalLight(0x64b5ff, 1.5);
    keyLight.position.set(10, 15, 10);
    keyLight.target.position.set(0, 0, 0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.left = -50;
    keyLight.shadow.camera.right = 50;
    keyLight.shadow.camera.top = 50;
    keyLight.shadow.camera.bottom = -50;
    scene.add(keyLight);
    
    // Fill light (accent)
    const fillLight = new THREE.DirectionalLight(0xff6b9d, 0.8);
    fillLight.position.set(-10, 5, 15);
    scene.add(fillLight);
    
    // Back light
    const backLight = new THREE.DirectionalLight(0x64b5ff, 0.6);
    backLight.position.set(0, 10, -20);
    scene.add(backLight);
}

// Load Lykan Hypersport model from Sketchfab
function loadModel() {
    const loader = new THREE.GLTFLoader();
    
    // Try to load from multiple sources
    const modelUrls = [
        'https://cdn.jsdelivr.net/gh/sketchfab/model-viewer@main/examples/lykan.glb',
        'https://models.readyplayer.me/public/lykan-hypersport.glb',
        'https://d1a3f4spazzrp4.cloudfront.net/models/lykan-hypersport.glb'
    ];
    
    function attemptLoad(urls, index = 0) {
        if (index >= urls.length) {
            console.warn('Could not load model from URLs, using procedural car');
            createProceduralCar();
            return;
        }
        
        loader.load(
            urls[index],
            (gltf) => {
                onModelLoaded(gltf);
            },
            (progress) => {
                const percentComplete = (progress.loaded / progress.total) * 100;
                console.log(`Loading: ${percentComplete.toFixed(2)}%`);
            },
            (error) => {
                console.warn(`Failed to load from ${urls[index]}, trying next...`);
                attemptLoad(urls, index + 1);
            }
        );
    }
    
    attemptLoad(modelUrls);
}

function onModelLoaded(gltf) {
    model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(0, -1, 0);
    
    // Setup model materials for animation
    model.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            
            // Store original material
            if (!node.userData.originalMaterial) {
                node.userData.originalMaterial = node.material.clone();
            }
        }
    });
    
    scene.add(model);
    modelLoaded = true;
    hideLoading();
    console.log('Lykan Hypersport model loaded successfully');
}

// Create procedural hypercar if model fails to load
function createProceduralCar() {
    const group = new THREE.Group();
    
    // Chassis
    const chassisGeometry = new THREE.BoxGeometry(2, 0.8, 5);
    const chassisMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.2 });
    const chassis = new THREE.Mesh(chassisGeometry, chassisMaterial);
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    group.add(chassis);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9 });
    
    const wheelPositions = [
        [-0.8, 0, 1.5],
        [0.8, 0, 1.5],
        [-0.8, 0, -1.5],
        [0.8, 0, -1.5]
    ];
    
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(pos[0], pos[1], pos[2]);
        wheel.castShadow = true;
        group.add(wheel);
    });
    
    // Cabin
    const cabinGeometry = new THREE.BoxGeometry(1.8, 0.7, 1.5);
    const cabinMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.7 });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.y = 0.8;
    cabin.castShadow = true;
    group.add(cabin);
    
    // Hood
    const hoodGeometry = new THREE.BoxGeometry(2, 0.2, 1.2);
    const hoodMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.9 });
    const hood = new THREE.Mesh(hoodGeometry, hoodMaterial);
    hood.position.set(0, 0.9, 2);
    hood.castShadow = true;
    group.add(hood);
    
    model = group;
    scene.add(model);
    modelLoaded = true;
    hideLoading();
    console.log('Procedural hypercar created');
}

// Hide loading indicator
function hideLoading() {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.opacity = '0';
    loadingDiv.style.pointerEvents = 'none';
    setTimeout(() => {
        loadingDiv.style.display = 'none';
    }, 500);
}

// Handle scroll events for assembly animation
function onScroll() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = (window.scrollY / scrollHeight) * 100;
    
    // Update stage based on scroll progress
    currentStage = Math.floor((scrollProgress / 100) * stages.length);
    if (currentStage >= stages.length) currentStage = stages.length - 1;
    
    // Update UI
    updateStageInfo();
    updateAssembly();
}

// Update assembly state based on scroll progress
function updateAssembly() {
    if (!modelLoaded || !model) return;
    
    // Apply assembly effects based on stage
    const stageProgress = (scrollProgress % (100 / stages.length)) / (100 / stages.length);
    
    model.traverse((node) => {
        if (node.isMesh) {
            // Progressive opacity reveal
            if (node.material.opacity !== undefined) {
                node.material.opacity = Math.min(1, scrollProgress / 100);
                node.material.transparent = true;
            }
            
            // Color shift to indicate assembly stages
            const hue = (scrollProgress / 100) * 0.3; // Hue shift
            if (node.material.emissive) {
                const color = new THREE.Color();
                color.setHSL(hue, 0.5, 0.2);
                node.material.emissive = color;
                node.material.emissiveIntensity = 0.3 * Math.sin(scrollProgress / 10);
            }
        }
    });
    
    // Camera animation based on scroll
    animateCamera();
}

// Animate camera based on scroll progress
function animateCamera() {
    const progress = scrollProgress / 100;
    
    // Orbital camera movement
    const angle = progress * Math.PI * 2;
    const distance = 5 + progress * 3;
    
    camera.position.x = Math.cos(angle) * distance;
    camera.position.y = 2 + Math.sin(progress * Math.PI) * 3;
    camera.position.z = Math.sin(angle) * distance + 2;
    
    camera.lookAt(0, 0, 0);
}

// Mouse interaction for camera control
let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;

function onMouseDown(e) {
    isMouseDown = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function onMouseUp() {
    isMouseDown = false;
}

function onMouseMove(e) {
    if (!isMouseDown || !model) return;
    
    const deltaX = (e.clientX - mouseX) * 0.005;
    const deltaY = (e.clientY - mouseY) * 0.005;
    
    targetRotationY += deltaX;
    targetRotationX += deltaY;
    
    model.rotation.y = targetRotationY;
    model.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotationX));
    
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function onMouseWheel(e) {
    e.preventDefault();
    const zoomSpeed = 0.1;
    camera.position.z += (e.deltaY > 0 ? 1 : -1) * zoomSpeed;
    camera.position.z = Math.max(2, Math.min(15, camera.position.z));
}

// Update stage information in UI
function updateStageInfo() {
    const stageNameEl = document.getElementById('current-stage');
    const progressEl = document.getElementById('scroll-progress');
    
    if (stageNameEl) stageNameEl.textContent = stages[currentStage].name;
    if (progressEl) progressEl.textContent = Math.round(scrollProgress) + '%';
    
    // Update active stage styling
    document.querySelectorAll('.stage').forEach((el, index) => {
        if (index === currentStage) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
}

// Handle window resize
function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
}

// Main animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (model) {
        // Subtle auto-rotation when not scrolling
        if (!isMouseDown) {
            model.rotation.y += 0.0005;
        }
        
        // Update assembly effects
        updateAssembly();
    }
    
    renderer.render(scene, camera);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScene);
} else {
    initScene();
}