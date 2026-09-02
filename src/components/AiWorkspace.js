import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './AiWorkspace.css';

function darkMat(extras = {}) {
  return new THREE.MeshStandardMaterial({
    color: 0x141416,
    metalness: 0.82,
    roughness: 0.22,
    ...extras,
  });
}

function glowMat(color, intensity = 1.2) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: intensity,
    roughness: 0.3,
    metalness: 0.1,
  });
}

function addBox(parent, w, h, d, material, x, y, z, rx = 0, ry = 0, rz = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function createGrid() {
  const group = new THREE.Group();
  const positions = [];
  const span = 7;
  const step = 0.55;
  for (let x = -span; x <= span; x += step) {
    positions.push(x, 0.01, -span, x, 0.01, span);
  }
  for (let z = -span; z <= span; z += step) {
    positions.push(-span, 0.01, z, span, 0.01, z);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  group.add(
    new THREE.LineSegments(
      geo,
      new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.35 })
    )
  );
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(8, 48),
    new THREE.MeshStandardMaterial({ color: 0x07080c, roughness: 0.95, metalness: 0.05 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);
  return group;
}

function createDesk() {
  const group = new THREE.Group();
  const desk = darkMat({ color: 0x101114, roughness: 0.18, metalness: 0.7 });

  addBox(group, 2.7, 0.06, 1.15, desk, 0.18, 0.92, 0.05);
  const waterfall = addBox(group, 0.08, 1.0, 1.15, desk, -1.13, 0.46, 0.05);
  waterfall.rotation.z = 0.12;

  addBox(group, 1.7, 0.72, 0.08, darkMat({ color: 0x0a0a0c }), 0.05, 1.52, -0.42);
  const screen = addBox(
    group,
    1.58,
    0.62,
    0.03,
    glowMat(0xdbeafe, 2.4),
    0.05,
    1.52,
    -0.385
  );
  screen.name = 'screen';
  addBox(group, 0.16, 0.18, 0.06, desk, 0.05, 1.1, -0.4);
  addBox(group, 0.34, 0.03, 0.16, desk, 0.05, 1.0, -0.32);

  addBox(group, 0.72, 0.03, 0.2, darkMat({ color: 0x0b0b0d }), 0.0, 0.96, 0.18);
  addBox(group, 0.08, 0.025, 0.12, darkMat({ color: 0x0b0b0d }), 0.5, 0.96, 0.28);

  const plant = new THREE.Group();
  plant.position.set(-0.95, 0.95, 0.12);
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.06, 0.08, 8),
    glowMat(0xecfeff, 1.8)
  );
  pot.position.y = 0.04;
  plant.add(pot);
  const leafMat = glowMat(0x5eead4, 1.1);
  for (let i = 0; i < 7; i += 1) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.16, 5), leafMat);
    const a = (i / 7) * Math.PI * 2;
    leaf.position.set(Math.cos(a) * 0.04, 0.16, Math.sin(a) * 0.04);
    leaf.rotation.z = Math.cos(a) * 0.35;
    leaf.rotation.x = Math.sin(a) * 0.35;
    plant.add(leaf);
  }
  group.add(plant);

  const tower = addBox(group, 0.28, 0.62, 0.42, darkMat({ color: 0x0c0c10 }), 1.1, 1.25, -0.12);
  tower.name = 'pc';
  const fanMat = glowMat(0x38bdf8, 1.5);
  const fan1 = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.012, 8, 16), fanMat);
  fan1.position.set(1.25, 1.38, -0.12);
  fan1.rotation.y = Math.PI / 2;
  fan1.name = 'fan1';
  group.add(fan1);
  const fan2 = fan1.clone();
  fan2.position.y = 1.12;
  fan2.name = 'fan2';
  group.add(fan2);

  return group;
}

function createChair() {
  const group = new THREE.Group();
  const mat = darkMat({ color: 0x121216, roughness: 0.28 });
  addBox(group, 0.52, 0.06, 0.5, mat, 0.05, 0.62, 0.78);
  addBox(group, 0.52, 0.58, 0.07, mat, 0.05, 0.92, 1.02);
  addBox(group, 0.06, 0.04, 0.32, mat, -0.2, 0.76, 0.78);
  addBox(group, 0.06, 0.04, 0.32, mat, 0.3, 0.76, 0.78);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), mat);
  pole.position.set(0.05, 0.35, 0.78);
  group.add(pole);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.04, 8), mat);
  base.position.set(0.05, 0.08, 0.78);
  group.add(base);
  return group;
}

function createPerson() {
  const group = new THREE.Group();
  const body = darkMat({ color: 0x1a1b20, metalness: 0.88, roughness: 0.18 });

  const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.155, 0), body);
  head.position.set(0.05, 1.38, 0.58);
  head.rotation.y = Math.PI;
  group.add(head);

  addBox(group, 0.4, 0.42, 0.24, body, 0.05, 1.08, 0.68);
  addBox(group, 0.42, 0.08, 0.26, body, 0.05, 1.26, 0.66);

  const lUpper = addBox(group, 0.09, 0.09, 0.28, body, -0.2, 1.1, 0.5, 0.55);
  const rUpper = addBox(group, 0.09, 0.09, 0.28, body, 0.3, 1.1, 0.5, 0.55);
  addBox(group, 0.08, 0.08, 0.24, body, -0.2, 1.0, 0.28, 0.85);
  addBox(group, 0.08, 0.08, 0.24, body, 0.3, 1.0, 0.28, 0.85);
  addBox(group, 0.08, 0.05, 0.1, body, -0.18, 0.97, 0.16);
  addBox(group, 0.08, 0.05, 0.1, body, 0.32, 0.97, 0.22);

  addBox(group, 0.16, 0.12, 0.36, body, -0.08, 0.78, 0.72, 0.55);
  addBox(group, 0.16, 0.12, 0.36, body, 0.18, 0.78, 0.72, 0.55);
  addBox(group, 0.12, 0.32, 0.12, body, -0.1, 0.48, 0.52);
  addBox(group, 0.12, 0.32, 0.12, body, 0.2, 0.48, 0.52);
  addBox(group, 0.12, 0.06, 0.2, body, -0.1, 0.3, 0.46);
  addBox(group, 0.12, 0.06, 0.2, body, 0.2, 0.3, 0.46);

  group.userData.arms = [lUpper, rUpper];
  group.name = 'person';
  return group;
}

function createLabel(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 512, 96);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '700 42px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`「  ${text}  」`, 256, 48);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.35, 0.26),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(0, 0.04, 0.78);
  return plane;
}

function createPlatform() {
  const group = new THREE.Group();
  const inner = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.28), glowMat(0x22d3ee, 2.6));
  inner.position.y = 0.07;
  inner.name = 'core';
  group.add(inner);
  return group;
}

function createStation(x, z, label, kind) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.add(createPlatform());
  group.add(createLabel(label));

  const body = darkMat({ color: 0x2a2e38, roughness: 0.35, metalness: 0.45 });
  const cyan = glowMat(0x67e8f9, 2.0);

  if (kind === 'servers') {
    for (let i = 0; i < 6; i += 1) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      addBox(group, 0.16, 0.55, 0.14, body, -0.2 + col * 0.2, 0.35, -0.12 + row * 0.22);
      addBox(group, 0.12, 0.02, 0.1, cyan, -0.2 + col * 0.2, 0.64, -0.12 + row * 0.22);
    }
  } else if (kind === 'cube') {
    const cube = addBox(group, 0.22, 0.22, 0.22, glowMat(0x67e8f9, 2.4), 0, 0.32, 0);
    cube.name = 'core';
    addBox(group, 0.06, 0.28, 0.06, body, 0.22, 0.28, 0.1, 0, 0, 0.5);
  } else if (kind === 'ring') {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.03, 8, 32), cyan);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.12;
    group.add(ring);
  } else if (kind === 'dish') {
    const dish = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.12, 16, 1, true), cyan);
    dish.position.y = 0.22;
    dish.rotation.x = Math.PI;
    group.add(dish);
    addBox(group, 0.05, 0.2, 0.05, body, 0, 0.22, 0);
  } else if (kind === 'portal') {
    addBox(group, 0.08, 0.7, 0.08, cyan, -0.22, 0.42, 0);
    addBox(group, 0.08, 0.7, 0.08, cyan, 0.22, 0.42, 0);
    addBox(group, 0.52, 0.08, 0.08, cyan, 0, 0.74, 0);
  } else if (kind === 'console') {
    addBox(group, 0.55, 0.08, 0.32, body, 0, 0.18, 0);
    addBox(group, 0.42, 0.22, 0.04, glowMat(0xdbeafe, 2.2), 0, 0.34, -0.08);
  } else {
    addBox(group, 0.36, 0.16, 0.36, glowMat(0x22d3ee, 1.6), 0, 0.18, 0);
  }

  const light = new THREE.PointLight(0x67e8f9, 1.15, 2.8);
  light.position.set(0, 0.55, 0);
  group.add(light);
  return group;
}

function manhattanPath(from, to, y = 0.07) {
  const start = new THREE.Vector3(from.x, y, from.z);
  const end = new THREE.Vector3(to.x, y, to.z);
  const corner = new THREE.Vector3(to.x, y, from.z);
  if (Math.abs(from.x - to.x) < 0.01 || Math.abs(from.z - to.z) < 0.01) {
    return [start, end];
  }
  return [start, corner, end];
}

function pathLength(points) {
  let total = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    total += points[i].distanceTo(points[i + 1]);
  }
  return total;
}

function pointOnPath(points, t) {
  const total = pathLength(points);
  let remain = THREE.MathUtils.clamp(t, 0, 1) * total;
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const seg = a.distanceTo(b);
    if (remain <= seg || i === points.length - 2) {
      const u = seg === 0 ? 0 : remain / seg;
      const pos = a.clone().lerp(b, u);
      const dir = b.clone().sub(a).normalize();
      return { pos, dir };
    }
    remain -= seg;
  }
  const last = points[points.length - 1];
  return { pos: last.clone(), dir: new THREE.Vector3(1, 0, 0) };
}

function addTrackSegment(parent, a, b) {
  const dir = b.clone().sub(a);
  const len = dir.length();
  if (len < 0.01) return;
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.022, 0.01, len),
    glowMat(0x67e8f9, 1.8)
  );
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.normalize());
  parent.add(mesh);
}

function reversePath(path) {
  return path.slice().reverse();
}

function segmentKey(a, b) {
  const p1 = `${a.x.toFixed(2)},${a.z.toFixed(2)}`;
  const p2 = `${b.x.toFixed(2)},${b.z.toFixed(2)}`;
  return p1 < p2 ? `${p1}|${p2}` : `${p2}|${p1}`;
}

function createArrow() {
  const group = new THREE.Group();
  const mat = glowMat(0xa5f3fc, 2.4);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.07, 4), mat);
  cone.rotation.x = Math.PI / 2;
  group.add(cone);
  return group;
}

const PIPELINE_LINKS = [
  ['TRAIN', 'STORE'],
  ['EMBED', 'QUERY'],
  ['QUERY', 'STORE'],
  ['TRAIN', 'WORKS'],
  ['WORKS', 'DEPLOY'],
  ['SKILLS', 'DEPLOY'],
];

const STATIONS = [
  { pos: [-3.4, -2.4], label: 'TRAIN', kind: 'console' },
  { pos: [3.4, -2.4], label: 'QUERY', kind: 'cube' },
  { pos: [-3.6, 2.5], label: 'WORKS', kind: 'servers' },
  { pos: [3.6, 2.5], label: 'DEPLOY', kind: 'dish' },
  { pos: [0.0, -3.5], label: 'STORE', kind: 'portal' },
  { pos: [-3.8, 0.2], label: 'EMBED', kind: 'ring' },
  { pos: [3.8, 0.2], label: 'SKILLS', kind: 'cube' },
];

const AiWorkspace = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    } catch (err) {
      return undefined;
    }

    const measure = () => ({
      w: Math.max(mount.clientWidth, 1),
      h: Math.max(mount.clientHeight, 1),
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.2 : 1.75));
    const { w, h } = measure();
    renderer.setSize(w, h);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !isMobile;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 50);
    camera.position.set(0.15, 10.8, 0.2);
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0x94a3b8, 0.7));
    const key = new THREE.DirectionalLight(0xf8fafc, 1.05);
    key.position.set(2, 12, 4);
    key.castShadow = !isMobile;
    scene.add(key);
    const monitorLight = new THREE.PointLight(0xdbeafe, 2.6, 7);
    monitorLight.position.set(0.05, 1.52, -0.15);
    scene.add(monitorLight);
    const plantLight = new THREE.PointLight(0x5eead4, 1.1, 3);
    plantLight.position.set(-0.95, 1.15, 0.12);
    scene.add(plantLight);

    const hub = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.03, 0.55),
      glowMat(0x22d3ee, 2.2)
    );
    hub.position.set(0, 0.045, 0);
    scene.add(hub);

    const root = new THREE.Group();
    root.add(createGrid());
    root.add(createDesk());
    root.add(createChair());
    const person = createPerson();
    root.add(person);
    scene.add(root);

    const hubPoint = { x: 0, z: 0 };
    const nodes = STATIONS.map((station) => {
      const node = createStation(station.pos[0], station.pos[1], station.label, station.kind);
      node.userData.label = station.label;
      scene.add(node);
      return node;
    });

    const byLabel = {};
    nodes.forEach((node) => {
      byLabel[node.userData.label] = { x: node.position.x, z: node.position.z };
    });

    const connections = [];
    nodes.forEach((node) => {
      connections.push({ from: hubPoint, to: { x: node.position.x, z: node.position.z } });
    });
    const around = [...nodes].sort(
      (a, b) => Math.atan2(a.position.z, a.position.x) - Math.atan2(b.position.z, b.position.x)
    );
    around.forEach((node, i) => {
      const next = around[(i + 1) % around.length];
      connections.push({
        from: { x: node.position.x, z: node.position.z },
        to: { x: next.position.x, z: next.position.z },
      });
    });
    PIPELINE_LINKS.forEach(([a, b]) => {
      if (byLabel[a] && byLabel[b]) connections.push({ from: byLabel[a], to: byLabel[b] });
    });

    const tracks = new THREE.Group();
    scene.add(tracks);
    const seen = new Set();
    const paths = [];
    connections.forEach((link) => {
      const path = manhattanPath(link.from, link.to);
      paths.push(path);
      for (let i = 0; i < path.length - 1; i += 1) {
        const key = segmentKey(path[i], path[i + 1]);
        if (seen.has(key)) continue;
        seen.add(key);
        addTrackSegment(tracks, path[i], path[i + 1]);
      }
    });

    const arrows = [];
    const addArrows = (path, count, extraOffset) => {
      for (let i = 0; i < count; i += 1) {
        const arrow = createArrow();
        arrow.userData.path = path;
        arrow.userData.offset = i / count + extraOffset;
        scene.add(arrow);
        arrows.push(arrow);
      }
    };
    paths.forEach((path, index) => {
      addArrows(path, isMobile ? 1 : 2, index * 0.04);
      addArrows(reversePath(path), 1, 0.5 + index * 0.03);
    });

    const mouse = { x: 0, y: 0 };
    const onPointerMove = (event) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 - 1;
    };
    const onResize = () => {
      const next = measure();
      camera.aspect = next.w / next.h;
      camera.updateProjectionMatrix();
      renderer.setSize(next.w, next.h);
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let animationId;
    let disposed = false;

    const tick = () => {
      if (disposed) return;
      animationId = requestAnimationFrame(tick);
      if (document.hidden) return;
      const t = clock.getElapsedTime();
      const speed = prefersReduced ? 0 : 1;

      camera.position.x = 0.15 + mouse.x * 0.8;
      camera.position.z = 0.2 + mouse.y * 0.8;
      camera.lookAt(0, 0, 0);

      person.position.y = Math.sin(t * 1.4 * speed) * 0.008;
      const screen = root.getObjectByName('screen');
      if (screen) screen.material.emissiveIntensity = 2.1 + Math.sin(t * 2.2 * speed) * 0.35;
      monitorLight.intensity = 2.4 + Math.sin(t * 2.2 * speed) * 0.35;
      const fan1 = root.getObjectByName('fan1');
      const fan2 = root.getObjectByName('fan2');
      if (fan1) fan1.rotation.x = t * 4 * speed;
      if (fan2) fan2.rotation.x = -t * 5 * speed;
      hub.material.emissiveIntensity = 1.8 + Math.sin(t * 3 * speed) * 0.5;

      nodes.forEach((node, i) => {
        const core = node.getObjectByName('core');
        if (core) core.material.emissiveIntensity = 0.8 + Math.abs(Math.sin(t * 3 * speed + i)) * 1.1;
      });

      arrows.forEach((arrow) => {
        const u = (t * 0.22 * speed + arrow.userData.offset) % 1;
        const { pos, dir } = pointOnPath(arrow.userData.path, u);
        arrow.position.copy(pos);
        arrow.position.y = 0.1;
        if (dir.lengthSq() > 0.0001) {
          const yaw = Math.atan2(dir.x, dir.z);
          arrow.rotation.set(0, yaw, 0);
        }
      });

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section id="workspace" className="workspace-section" aria-label="AI workspace visualization">
      <div className="section-container">
        <h2 className="section-title">Building with AI</h2>
        <p className="section-lede">
          The path behind the assistant on this page: embed the work, store it,
          retrieve what matters, then answer. Stations below are that loop, not decoration.
        </p>
        <div className="workspace-stage" ref={mountRef} />
        <ul className="workspace-legend">
          <li><span>Train</span> Call and ops data from real internal tools</li>
          <li><span>Embed</span> Chunking and vectors for semantic search</li>
          <li><span>Store</span> Chroma knowledge base for this site</li>
          <li><span>Query</span> Retrieve, then generate with citations</li>
          <li><span>Deploy</span> Docker, live demos, the chatbot in the corner</li>
        </ul>
      </div>
    </section>
  );
};

export default AiWorkspace;
