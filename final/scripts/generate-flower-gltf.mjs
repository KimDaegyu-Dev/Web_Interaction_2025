import * as fs from 'fs';
import * as path from 'path';
import * as THREE from 'three';
import { Blob } from 'buffer';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// Polyfill browser-specific globals used by GLTFExporter
if (!globalThis.Blob) {
  globalThis.Blob = Blob;
}
if (!globalThis.FileReader) {
  globalThis.FileReader = class {
    constructor() {
      this.result = null;
      this.onload = null;
      this.onloadend = null;
    }
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buffer) => {
        this.result = buffer;
        if (this.onload) this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buffer) => {
        const base64 = Buffer.from(buffer).toString('base64');
        this.result = `data:${blob.type || 'application/octet-stream'};base64,${base64}`;
        if (this.onload) this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      });
    }
  };
}

const exporter = new GLTFExporter();

const scene = new THREE.Scene();

// Simple stylized flower: stem + head
const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x5cb85c });
const petalMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b9d });

const group = new THREE.Group();

const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8, 12), stemMaterial);
stem.name = 'Stem';
stem.position.y = 0.4;

const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), petalMaterial);
head.name = 'FlowerHead';
head.position.y = 0.9;

const leafLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.25), stemMaterial);
leafLeft.name = 'LeafLeft';
leafLeft.position.set(-0.08, 0.2, 0.12);
leafLeft.rotation.y = Math.PI / 6;

const leafRight = leafLeft.clone();
leafRight.name = 'LeafRight';
leafRight.position.set(0.08, 0.2, -0.12);
leafRight.rotation.y = -Math.PI / 6;

[group, stem, head, leafLeft, leafRight].forEach((obj) => {
  obj.castShadow = true;
  obj.receiveShadow = true;
});

group.add(stem, head, leafLeft, leafRight);
group.name = 'Flower';
scene.add(group);

// Animations
const idleTrack = new THREE.VectorKeyframeTrack(
  'Flower.scale',
  [0, 1, 2],
  [1, 1, 1, 1.03, 0.98, 1.03, 1, 1, 1]
);
const idleClip = new THREE.AnimationClip('Idle', 2, [idleTrack]);

const hoverTrack = new THREE.VectorKeyframeTrack(
  'Flower.scale',
  [0, 0.3, 0.6],
  [1, 1, 1, 1.2, 1.2, 1.2, 1, 1, 1]
);
const hoverClip = new THREE.AnimationClip('Hover', 0.6, [hoverTrack]);

const windQuatA = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
const windQuatB = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.18));
const windQuatC = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -0.16));
const windTrack = new THREE.QuaternionKeyframeTrack(
  'Flower.quaternion',
  [0, 0.5, 1],
  [
    windQuatA.x,
    windQuatA.y,
    windQuatA.z,
    windQuatA.w,
    windQuatB.x,
    windQuatB.y,
    windQuatB.z,
    windQuatB.w,
    windQuatC.x,
    windQuatC.y,
    windQuatC.z,
    windQuatC.w,
  ]
);
const windClip = new THREE.AnimationClip('Wind', 1, [windTrack]);

const bloomTrack = new THREE.VectorKeyframeTrack(
  'Flower.scale',
  [0, 0.6, 1.2],
  [0.3, 0.3, 0.3, 1.3, 1.2, 1.3, 1, 1, 1]
);
const bloomClip = new THREE.AnimationClip('Bloom', 1.2, [bloomTrack]);

const animations = [idleClip, hoverClip, windClip, bloomClip];

exporter.parse(
  scene,
  (result) => {
    const outPath = path.resolve('./public/models/flower_basic.gltf');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    const json = JSON.stringify(result, null, 2);
    fs.writeFileSync(outPath, json, 'utf-8');
    console.log(`Saved ${outPath}`);
  },
  (error) => {
    console.error('Export failed:', error);
  },
  { binary: false, animations }
);
