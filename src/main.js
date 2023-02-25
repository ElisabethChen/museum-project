import * as THREE from 'three';
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Water } from "three/examples/jsm/objects/Water2";


// GUI
const gui = new dat.GUI();
const options = {
  shpereColor: 0x00b5c5,
  liquidOpacity: 0.7,
  colorOpacity: 0.5,
  textureOpacity: 0.6,
  wireframe: false,
  dLight: true,
  aLight: true,
  affectedByLight: true,
  enable: true,
  rotationSpeedX: 1,
  rotationSpeedY: 1,
  movementSpeedX: 1,
  movementSpeedY: 1,
  movementSpeedZ: 1,
};

const scene = new THREE.Scene();

// LIGHT
const aLight = new THREE.AmbientLight(0xffffff, 1.4);
scene.add(aLight);
const dLight = new THREE.DirectionalLight(0xffffff, 7);
dLight.position.y = 10
scene.add(dLight);

// LIGHT HELPER
const dLightHelper = new THREE.DirectionalLightHelper(dLight);
scene.add(dLightHelper)

// Background
const cubemapLoader = new THREE.CubeTextureLoader();
const cubeMap = cubemapLoader
  .setPath('./src/assets/Images/skyboxBlue/')
  .load([
    'right.png',
    'left.png',
    'top.png',
    'bottom.png',
    'front.png',
    'back.png',
  ]);
scene.background = cubeMap;

// Reflection & Refraction cube
const path = './src/assets/Images/SwedishRoyalCastle/';
const format = '.jpg';
const urls = [
  path + 'px' + format, path + 'nx' + format,
  path + 'py' + format, path + 'ny' + format,
  path + 'pz' + format, path + 'nz' + format
];

const cubeTextureLoader = new THREE.CubeTextureLoader();

const reflectionCube = cubeTextureLoader.load(urls);
const refractionCube = cubeTextureLoader.load(urls);
refractionCube.mapping = THREE.CubeRefractionMapping;

// Liquid material
const liquidMat = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  envMap: reflectionCube,
  refractionRatio: 0.85,
  transparent: true,
  opacity: options.liquidOpacity
});

// liqud Sphere
const sphereGeom = new THREE.SphereGeometry(0.7);     // given the radius
// const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
const sphereMesh = new THREE.Mesh(sphereGeom, liquidMat);
sphereMesh.position.y = 0.75;

scene.add(sphereMesh);

// Texture shpere
const textureLoader = new THREE.TextureLoader();
const texture1 = textureLoader.load("./src/assets/Images/SwedishRoyalCastle/nz.jpg");
texture1.wrapS = THREE.RepeatWrapping;
texture1.wrapT = THREE.RepeatWrapping;
texture1.repeat.set(2, 1);

const textureMat = new THREE.MeshStandardMaterial({
  map: texture1,
  transparent: true,
  opacity: options.textureOpacity
});
const textureMesh = new THREE.Mesh(sphereGeom, textureMat);
textureMesh.position.y = 0.75;
textureMesh.position.x = 4;

scene.add(textureMesh);


// Creating color sphere
const colorSMat = new THREE.MeshBasicMaterial({
  color: options.shpereColor,
  transparent: true,
  opacity: options.colorOpacity
});
const colorSMatStand = new THREE.MeshStandardMaterial({
  color: options.shpereColor,
  transparent: true,
  opacity: options.colorOpacity
});
const colorSMesh = new THREE.Mesh(sphereGeom, colorSMatStand);
colorSMesh.position.x = 2;
colorSMesh.position.y = 0.75;
scene.add(colorSMesh);

// Water
let water = new Water(sphereGeom, {
  color: 0xffffff,
  scale: 1,
  flowDirection: new THREE.Vector2(0.2, 0),
  textureWidth: 800,
  textureHeight: 600,
  normalMap0: textureLoader.load('./src/assets/Water_1_M_Normal.jpg'),
  normalMap1: textureLoader.load('./src/assets/water/Water_2_M_Normal.jpg')
});

water.position.y = 0.75;
water.position.x = -2;
scene.add(water);


// Plane
const planeGeom = new THREE.PlaneGeometry(5, 5);
const planeMat = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide
});
const planeMesh = new THREE.Mesh(planeGeom, planeMat);
planeMesh.rotation.x = -Math.PI / 2;
scene.add(planeMesh);


// Camera
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight);
camera.position.set(0, 3, 7);
// scene.add(camera);

// Helper
const axesHelper = new THREE.AxesHelper(5);  // add x, y, z axes in the scene with the given length for each axis
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper();   // add horizontal transparent plane with grids
scene.add(gridHelper);

// GUI
gui.addColor(options, "shpereColor").onChange(e => { colorSMesh.material.color.set(e) }) // creating "[Violation] Added non-passive event listener to a scroll-blocking 'touchstart' event."
gui.add(options, "wireframe").onChange(e => { textureMesh.material.wireframe = e });
gui.add(options, "liquidOpacity").min(0).max(1).onChange(e => { sphereMesh.material.opacity = e });
gui.add(options, "colorOpacity").min(0).max(1).onChange(e => { colorSMesh.material.opacity = e });
gui.add(options, "textureOpacity").min(0).max(1).onChange(e => { textureMesh.material.opacity = e });
gui.add(options, "aLight").onChange(e => { aLight.visible = e })
gui.add(options, "dLight").onChange(e => { dLight.visible = e })
gui.add(options, "affectedByLight").onChange(e => { e ? colorSMesh.material = colorSMatStand : colorSMesh.material = colorSMat })
gui.add(aLight, "intensity").min(1).max(50).name("aIntensity");
gui.add(dLight, "intensity").min(1).max(50).name("dIntensity");
gui.add(options, "rotationSpeedX").min(0).max(10);
gui.add(options, "rotationSpeedY").min(0).max(10);
gui.add(options, "movementSpeedX").min(0).max(10);
gui.add(options, "movementSpeedY").min(0).max(10);
gui.add(options, "movementSpeedZ").min(0).max(10);
gui.add(options, "enable").onChange(e => {
  colorSMesh.visible = e;
  planeMesh.visible = e;
  axesHelper.visible = e;
  gridHelper.visible = e;
  dLightHelper.visible = e;
  sphereMesh.visible = e;
});

// render 
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

// controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Animation 
function animate(time) {
  textureMesh.rotation.x = Math.sin(options.rotationSpeedX * time / 8000) / 2;
  textureMesh.rotation.y = Math.cos(options.rotationSpeedY * time / 10000) / 2;

  textureMesh.position.x = 4 + Math.sin(options.movementSpeedX * time / 8000) / 2;
  textureMesh.position.y = 0.7 + Math.cos(options.movementSpeedY * time / 10000) / 2;
  textureMesh.position.z = Math.cos(options.movementSpeedZ * time / 7000) / 2;

  textureMesh.scale.y = Math.abs(Math.cos(1.2 + time / 2000)) / 10 + 0.9;
  textureMesh.scale.z = Math.abs(Math.sin(time / 5000 + 1.2)) / 10 + 0.9;
  textureMesh.scale.x = Math.abs(Math.sin(time / 3000)) / 10 + 0.9

  renderer.render(scene, camera);
}

// set the animation loop
renderer.setAnimationLoop(animate);


// Resize
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();            // needs to be used after any changes on the camera
  renderer.setSize(innerWidth, innerHeight);
})