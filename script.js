// Whichever ThreeJS loader you are using
var modelPaths = ['./3ds.glb', './camera.glb', './succulents.glb']; // CHANGE TO MODEL PATHS
var currentPathIndex = 0; // index in the path array of the currently showing model
var currentModel; // stores the model that is currently displaying
var oldIndex;
const canvas = document.getElementById('dsContainer');
const canvasContainer = document.getElementById('canvasContainer');
var scene, loader, camera, renderer, clock, mixer, light, actions = [], mode, isWireframe = false;
let sound;
init();

function loadContent(oldIndex, newIndex) {
    var currentContentName = "model-" + oldIndex;
    var nextContentName = "model-" + newIndex;
    var contentToHide = document.getElementById(currentContentName);
    contentToHide.classList.toggle("hidden");
    var contentToShow = document.getElementById(nextContentName);
    contentToShow.classList.toggle("hidden");
}
function loadModel(index) {
    if (currentModel) {
        scene.remove(currentModel); //remove the current model
        actions = [];

    }
    loader.load(modelPaths[index], function (gltf) {
        const model = gltf.scene;
        currentModel = model;
        if (index === 0) {
            light.position.set(0, 10, 2);
        }
        if (index === 1) {//camera, want to add sound
            light.position.set(5, 10, 7.5);
            var object = gltf.scene.getObjectByName('Cube004');
            object.material = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.2,
                transmission: 0.9,
                roughness: 0,
                metalness: 0.1,
                ior: 1.450,
                envMapIntensity: 1.0,
            });
            object.material.needsUpdate = true;

            mixer = new THREE.AnimationMixer(model);
            const animations = gltf.animations;
            // ADD SOUND HERE

            animations.forEach(clip => {
                const action = mixer.clipAction(clip);
                actions.push(action);
            });

        }

        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        const animations = gltf.animations;

        animations.forEach(clip => {
            const action = mixer.clipAction(clip);
            actions.push(action);
        });
    });

    animate();
}

function next() { //function that will be called when a button is pressed (next model).
    if (currentPathIndex === 2) { //[0,1,2] so if on last model, loop around
        currentPathIndex = 0;
        oldIndex = 2;
    }
    else {
        oldIndex = currentPathIndex;
        currentPathIndex++;
    }
    loadModel(currentPathIndex);
    loadContent(oldIndex, currentPathIndex);
}


function init() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xc8d3e6);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    loader = new THREE.GLTFLoader();
    light = new THREE.DirectionalLight();
    light.position.set(0, 10, 2);
    scene.add(light);


    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    resize();

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(1, 2, 0);
    controls.update();

    const listener = new THREE.AudioListener();
    camera.add(listener);
    sound = new THREE.Audio(listener);

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('camera click.mp3',
        function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setVolume(1.0);
        });


    mode = 'open';

    const animBtn = document.getElementById("startAnim");
    animBtn.addEventListener('click', function () {
        if (actions.length > 0) {
            if (mode === "open") {
                actions.forEach(action => {
                    action.timeScale = 1;
                    action.reset();
                    action.setLoop(THREE.LoopOnce);
                    action.clampWhenFinished = true;
                    action.play();
                    if (currentPathIndex === 1) {
                        if (sound.isPlaying) {
                            sound.stop(); 
                        }
                        sound.play();

                    }
                })
            }
        }
    })

    // const pauseAnimBtn = document.getElementById("pauseAnim");
    // pauseAnimBtn.addEventListener('click', function () {
    //     actions.paused = true;
    // })

    const wireframeBtn = document.getElementById("toggleWireFrame");
    wireframeBtn.addEventListener('click', function () {
        isWireframe = !isWireframe;
        toggleWireFrame(isWireframe);


    })
    const nextModel = document.getElementById("nextModel");
    nextModel.addEventListener('click', function () {
        next();
    })
    window.addEventListener('resize', resize, false);


    loadModel(currentPathIndex);
}

function animate() {
    requestAnimationFrame(animate);

    if (mixer) {
        mixer.update(clock.getDelta());
    }
    renderer.render(scene, camera);
}

function toggleWireFrame(enable) {
    scene.traverse(function (object) {
        if (object.isMesh) {
            object.material.wireframe = enable;
        }
    })
}
function resize() {
    canvas.width = canvasContainer.offsetWidth;
    canvas.height = canvasContainer.offsetHeight;


    camera.aspect = canvas.width / canvas.height;
    if (camera.aspect > 1) {
        //wider than it is tall so landscape
        camera.position.set(1, 3, 8);
    } else {
        //taller than it is wide so portrait
        camera.position.set(-0.1, 2.5, 15.7);

    }
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}