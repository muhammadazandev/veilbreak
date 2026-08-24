import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import './style.css';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true

document.body.appendChild(renderer.domElement);

camera.position.z = 10;

const light = new THREE.DirectionalLight(0xffffff, 4);
light.position.set(5, 5, 5);
light.castShadow = true

scene.add(light);

const loader = new GLTFLoader();

loader.load(`${import.meta.env.BASE_URL}character/scene.gltf`,
  (gltf) => {
    gltf.scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    })
    
    gltf.scene.scale.set(2,2,2);
    gltf.scene.position.z = 3;
    scene.add(gltf.scene);

    const box = new THREE.Box3();
    box.setFromObject(gltf.scene);

    const size = new THREE.Vector3();
    box.getSize(size);

    setTimeout(() => {
      console.log('Size:', size);
  console.log('Minimum:', box.min);
  console.log('Maximum:', box.max);
    }, 3000)
  }
);

const groundGeom = new THREE.PlaneGeometry(15,10);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 1
});

const ground = new THREE.Mesh(groundGeom, groundMaterial)

ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true;
ground.position.y = 0

scene.add(ground)

function animate() {
  requestAnimationFrame(animate);
  
  renderer.render(scene, camera);
}

animate()