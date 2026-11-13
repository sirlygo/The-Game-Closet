// Loads the low-poly 3D models in /assets/models (Kenney and Quaternius, CC0).
// They are meshopt-compressed GLB files.

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const cache = new Map();

// Resolves to the model's scene (a THREE.Group); clone it before adding it twice.
export function loadModel(name) {
  if (!cache.has(name)) {
    cache.set(
      name,
      new Promise((resolve, reject) => loader.load(`/assets/models/${name}.glb`, (gltf) => resolve(gltf.scene), undefined, reject))
    );
  }
  return cache.get(name);
}

export function loadModels(names) {
  return Promise.all(names.map(loadModel));
}
