
var scene, camera, renderer, clock, mixer, actions = [], mode, id, isWireframe = false;
const canvas = document.getElementById('sceneContainer');
const canvasContainer = document.getElementById('canvas1Container');
var camera, scene, renderer;
var geometry, material, mesh;
var selectGroup = new THREE.Group();

init();
checkOrientation();

function init() {
    const assetPath = './';
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xc8d3e6);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.set(0, 3, 5);


    const light = new THREE.DirectionalLight();
    light.position.set(5,2,2);
    scene.add(light);

    renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    resize();


    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.minPolarAngle = Math.PI * 0.4;
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minAzimuthAngle = Math.PI * -0.1;
    controls.maxAzimuthAngle = Math.PI * 0.1;
    controls.maxDistance = 1;
    controls.minDistance = 1;
    controls.target.set(0, 3, 5);
    controls.enablePan = false;
    controls.update();



    const loader = new THREE.GLTFLoader();
    loader.load(assetPath + 'desk.glb', function (gltf) {
        const model = gltf.scene;
        scene.add(model);
        // add the objects you want to be able to highlight and add them to group
        var desk = gltf.scene.getObjectByName('Monitor');
        var book1 = gltf.scene.getObjectByName('Book1');
        var book2 = gltf.scene.getObjectByName('Book2');
        var book3 = gltf.scene.getObjectByName('Book3');
        selectGroup.add(desk);
        selectGroup.add(book1);
        selectGroup.add(book2);
        selectGroup.add(book3);

        scene.add(selectGroup);

        mixer = new THREE.AnimationMixer(model);
        const animations = gltf.animations;

        animations.forEach(clip => {
            const action = mixer.clipAction(clip);
            actions.push(action);
        });
    });


    window.addEventListener('resize', resize, false);
    window.addEventListener("resize", checkOrientation);

    animate();

}

function animate() {
    requestAnimationFrame(animate);

    if (mixer) {
        mixer.update(clock.getDelta());
    }
    renderer.render(scene, camera);
}

function render() {

    renderer.render(scene, camera);

}

function resize() {
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();

}
function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        // If portrait mode, show the modal
        var rotateModal = new bootstrap.Modal(document.getElementById("rotateModal"));
        rotateModal.show();
    } else {
        // If landscape mode, hide the modal
        var modalEl = document.getElementById("rotateModal");
        var modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
    }
}

const raycaster = new THREE.Raycaster();
['mousedown', 'touchstart'].forEach(function(e) {
    document.addEventListener(e, onMouseDown);
  });
document.addEventListener("pointermove", onMouseHover);
function onMouseDown(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const coords = new THREE.Vector2(((event.clientX - rect.left) / rect.width) * 2 - 1,- ((event.clientY - rect.top) / rect.height) * 2 + 1);

    raycaster.setFromCamera(coords, camera);

    const intersections = raycaster.intersectObjects(selectGroup.children, true);
    if (intersections.length > 0) {
        console.log(intersections);
        var selectedObject = intersections[0].object;
        parent = selectedObject.parent.name;
        if(parent === "Monitor"){
            const showContent = document.getElementById("collapseTwo");
            const hideContent = document.getElementById("collapseThree");
            showContent.classList.add('show');
            hideContent.classList.remove('show');
        }
        else if(parent === "Book1" || parent === "Book2" || parent === "Book3"){
            const showContent = document.getElementById("collapseThree");
            const hideContent = document.getElementById("collapseTwo");
            showContent.classList.add('show');
            hideContent.classList.remove('show');
        }
        

 

    
    }
    else{
        document.getElementById("sceneContainer").style.cursor = "default";
    
    }

}
document.addEventListener("touchstart", onTouchStart);
function onTouchStart(event){
    const touch = event.touches[0];
    const rect = renderer.domElement.getBoundingClientRect();
    const coords = new THREE.Vector2(((touch.clientX - rect.left) / rect.width) * 2 - 1,- ((touch.clientY - rect.top) / rect.height) * 2 + 1);

    raycaster.setFromCamera(coords, camera);

    const intersections = raycaster.intersectObjects(selectGroup.children, true);
    if (intersections.length > 0) {
        console.log(intersections);
        var selectedObject = intersections[0].object;
        parent = selectedObject.parent.name;
        if(parent === "Monitor"){
            const showContent = document.getElementById("collapseTwo");
            const hideContent = document.getElementById("collapseThree");
            showContent.classList.add('show');
            hideContent.classList.remove('show');
        }
        else if(parent === "Book1" || parent === "Book2" || parent === "Book3"){
            const showContent = document.getElementById("collapseThree");
            const hideContent = document.getElementById("collapseTwo");
            showContent.classList.add('show');
            hideContent.classList.remove('show');
        }
        

 

    
    }
    else{
        document.getElementById("sceneContainer").style.cursor = "default";
    
    }

}

function onMouseHover(event){
    const rect = renderer.domElement.getBoundingClientRect();
    const coords = new THREE.Vector2(((event.clientX - rect.left) / rect.width) * 2 - 1,- ((event.clientY - rect.top) / rect.height) * 2 + 1);


    raycaster.setFromCamera(coords, camera);

    const intersections = raycaster.intersectObjects(selectGroup.children, true);
    if (intersections.length > 0) {
        document.getElementById("sceneContainer").style.cursor = "pointer";
    }
    else{
        document.getElementById("sceneContainer").style.cursor = "default";
    }
    

}