import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const wrap = document.querySelector("#canvas-wrap");
const status = document.querySelector("#status");
const checks = [...document.querySelectorAll("[data-target]")];
const scene = new THREE.Scene();
const backdrop = 0xdee0d8;
scene.background = new THREE.Color(backdrop);
scene.fog = new THREE.Fog(backdrop, 34, 80);
const camera = new THREE.PerspectiveCamera(33, 1, .1, 120);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
wrap.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * .495;
controls.minDistance = 2;
controls.maxDistance = 45;

scene.add(new THREE.HemisphereLight(0xfff4df, 0xd5c1a7, 1.75));
const sun = new THREE.DirectionalLight(0xffebcb, 2.25);
sun.position.set(-7, 13, 9);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9 });
sun.shadow.camera.updateProjectionMatrix();
sun.shadow.normalBias = .018;
scene.add(sun);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(180, 180),
    new THREE.MeshStandardMaterial({ color: 0xd0cbbd, roughness: 1 }));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -.643;
ground.receiveShadow = true;
scene.add(ground);

function frame() {
    const { clientWidth: w, clientHeight: h } = wrap;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const zoom = Math.max(1, 1.32 / camera.aspect);
    controls.target.set(0, 2.48, 0);
    camera.position.copy(controls.target).addScaledVector(new THREE.Vector3(6.8, 3.0, 16.5), zoom);
    controls.update();
}
new ResizeObserver(frame).observe(wrap);
document.querySelector("#reset").addEventListener("click", frame);
const members = new Map(checks.map(input => [input.dataset.target, []]));
for (const input of checks) {
    input.disabled = true;
    input.addEventListener("change", () => {
        for (const mesh of members.get(input.dataset.target)) mesh.visible = input.checked;
    });
}
new GLTFLoader().load("./public/model/temple.glb", ({ scene: model }) => {
    model.traverse(mesh => {
        if (!mesh.isMesh) return;
        mesh.castShadow = mesh.receiveShadow = true;
        members.get(mesh.userData.part)?.push(mesh);
    });
    scene.add(model);
    for (const input of checks) input.disabled = members.get(input.dataset.target).length === 0;
    status.textContent = "Đã tải mô hình Blender";
}, undefined, error => {
    status.textContent = "Lỗi tải mô hình GLB. Hãy mở trang qua máy chủ HTTP.";
    console.error(error);
});
renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
});
