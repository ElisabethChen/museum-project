import * as THREE from 'three';
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as assets from './ImportAssets'


// GUI
const gui = new dat.GUI();
const options = {
  shpereColor: 0x00b5c5,
  hColorTop: 0xffffff,
  hColorBottom: 0x2a2a2a,
  liquidOpacity: 0.7,
  colorOpacity: 0.8,
  textureOpacity: 0.6,
  wireframe: false,
  dLight: true,
  aLight: true,
  affectedByLight: true,
  enable: true,
  rotationSpeedX: 1,
  rotationSpeedY: 1,
  movementSpeedX: 1.5,
  movementSpeedY: 1.5,
  movementSpeedZ: 1.5,
};

const scene = new THREE.Scene();

// LIGHT
const hLight = new THREE.HemisphereLight(options.hColorTop, options.hColorBottom, 1.4);
scene.add(hLight);
const dLight = new THREE.DirectionalLight(0xffffff, 0.4);
// const dLight = new THREE.HemisphereLight(0xffffff, 1);
dLight.position.y = 10;
dLight.rotation.x = Math.PI / 8;
scene.add(dLight);

// LIGHT HELPER
const dLightHelper = new THREE.DirectionalLightHelper(dLight);
scene.add(dLightHelper)

// Background
const cubemapLoader = new THREE.CubeTextureLoader();
const cubeMap = cubemapLoader
  .load([
    assets.right,
    assets.left,
    assets.top,
    assets.bottom,
    assets.front,
    assets.back,
  ]);
scene.background = cubeMap;


// Camera
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight);
camera.position.set(0, 3, 7);
// scene.add(camera);

// Helper
const axesHelper = new THREE.AxesHelper(5);  // add x, y, z axes in the scene with the given length for each axis
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper();   // add horizontal transparent plane with grids
scene.add(gridHelper);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();


// Bubble Holder
function createBubble(size, color, position, opacity) {
  const sphereGeom = new THREE.SphereGeometry(size);
  const colorShpereMat = new THREE.MeshStandardMaterial({
    color: color,
    transparent: true,
    opacity: opacity
  });
  const colorShpereMesh = new THREE.Mesh(sphereGeom, colorShpereMat);
  colorShpereMesh.position.set(position.x, position.y, position.z);

  scene.add(colorShpereMesh);
  colorShpereMesh.userData = { tag: "bubble" };
  // TODO: FOR DEBUGGING
  const bubbleOptions = { color: color, opacity: opacity };
  gui.addColor(bubbleOptions, "color").onChange(e => colorShpereMesh.material.color.set(e)).name("shpere color") // creating "[Violation] Added non-passive event listener to a scroll-blocking 'touchstart' event."
  gui.add(bubbleOptions, "opacity").min(0).max(1).onChange(e => { colorShpereMesh.material.opacity = e }).name("opacity");

  return colorShpereMesh;
}

const bubble1 = createBubble(1, 0x00b5c5, { x: 3, y: 1, z: 0 }, 0.7);
const bubble2 = createBubble(1, 0xa7218d, { x: 0, y: 1, z: 0 }, 0.7);
const bubble3 = createBubble(1, 0x7ecf57, { x: -3, y: 1, z: 0}, 0.7);

// // GUI
// gui.addColor(options, "shpereColor").onChange(e => { ColorShpereMesh.material.color.set(e) }) // creating "[Violation] Added non-passive event listener to a scroll-blocking 'touchstart' event."
gui.addColor(options, "hColorTop").onChange(e => { hLight.color.set(e) }).name("ColorTopHemisphereLight") // creating "[Violation] Added non-passive event listener to a scroll-blocking 'touchstart' event."
gui.addColor(options, "hColorBottom").onChange(e => { hLight.groundColor.set(e) }).name("ColorBottomHemisphereLight") // creating "[Violation] Added non-passive event listener to a scroll-blocking 'touchstart' event."
// gui.add(options, "wireframe").onChange(e => { textureMesh.material.wireframe = e });
// gui.add(options, "liquidOpacity").min(0).max(1).onChange(e => { sphereMesh.material.opacity = e });
// gui.add(options, "colorOpacity").min(0).max(1).onChange(e => { ColorShpereMesh.material.opacity = e });
// gui.add(options, "textureOpacity").min(0).max(1).onChange(e => { textureMesh.material.opacity = e });
gui.add(options, "aLight").onChange(e => { hLight.visible = e }).name("HemisphereLight")
gui.add(options, "dLight").onChange(e => { dLight.visible = e }).name("DirectLight")
// gui.add(options, "affectedByLight").onChange(e => { e ? colorSMesh.material = colorSMatStand : colorSMesh.material = colorSMat })
gui.add(hLight, "intensity").min(0).max(50).name("IntensityHemisphereLight");
gui.add(dLight, "intensity").min(0).max(50).name("IntensityDirectLight");
// gui.add(options, "rotationSpeedX").min(0).max(10);
// gui.add(options, "rotationSpeedY").min(0).max(10);
gui.add(options, "movementSpeedX").min(0).max(10);
gui.add(options, "movementSpeedY").min(0).max(10);
gui.add(options, "movementSpeedZ").min(0).max(10);
gui.add(options, "enable").onChange(e => {
  axesHelper.visible = e;
  gridHelper.visible = e;
  dLightHelper.visible = e;
}).name("enable helper");

// render 
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

// controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// movement of the bubble
function bubbleMovement(bubbleObj, time, num) {
  bubbleObj.rotation.x = Math.sin(options.rotationSpeedX * time / 8000) / 2;
  bubbleObj.rotation.y = Math.cos(options.rotationSpeedY * time / 10000) / 2;

  bubbleObj.position.x = 4 * num - 6 + Math.sin(options.movementSpeedX * time * num / 8000) / 2;
  bubbleObj.position.y = Math.sin(num * 3) * -4 + 2 + Math.cos(options.movementSpeedY * time * num / 10000) / 2;
  bubbleObj.position.z = Math.cos(options.movementSpeedZ * time / 7000) / 2;

  bubbleObj.scale.y = Math.abs(Math.cos(1.2 + time / 2000)) / 10 + 0.9;
  bubbleObj.scale.z = Math.abs(Math.sin(time / 5000 + 1.2)) / 10 + 0.9;
  bubbleObj.scale.x = Math.abs(Math.sin(time / 3000)) / 10 + 0.9
}

// Store and update the mouse position
function onPointerMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

// onclick event
function onClick(event) {
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);
  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.userData.tag === "bubble") {
      intersects[i].object.material.color.set(0xff0000);
      console.log(intersects[i]);
    }
  }
}

// Animation 
function animate(time) {


  bubbleMovement(bubble1, time, 0);
  bubbleMovement(bubble2, time, 1);
  bubbleMovement(bubble3, time, 2);
  renderer.render(scene, camera);
}
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('click', onClick);
// set the animation loop
renderer.setAnimationLoop(animate);


// Resize
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();            // needs to be used after any changes on the camera
  renderer.setSize(innerWidth, innerHeight);
})
