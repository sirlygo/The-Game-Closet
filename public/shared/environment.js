// Image-based lighting for the 3D boards: a real HDRI photo of a room (or a park)
// from Poly Haven (CC0), so glossy pieces pick up believable reflections.
// The built-in studio lighting is used until the photo has loaded, or if it fails.

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

// The photos are darker than the built-in room, so they get a boost to keep each
// board's tuned lighting level.
const BOOST = { lobby: 1.6, park: 1.25 };

export function applyEnvironment(renderer, scene, name = 'lobby') {
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  new EXRLoader().load(
    `/assets/hdri/${name}.exr`,
    (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      const fallback = scene.environment;
      scene.environment = pmrem.fromEquirectangular(texture).texture;
      scene.environmentIntensity *= BOOST[name] || 1;
      texture.dispose();
      fallback.dispose();
      pmrem.dispose();
    },
    undefined,
    () => pmrem.dispose()
  );
}
