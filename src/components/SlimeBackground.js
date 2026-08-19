import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './SlimeBackground.css';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uQuality;

  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n = p.x + p.y * 57.0 + 113.0 * p.z;
    return mix(
      mix(mix(hash(n), hash(n + 1.0), f.x),
          mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
      mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
          mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y),
      f.z
    );
  }

  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  float map(vec3 p) {
    float t = uTime * 0.52;
    vec2 m = uMouse * 1.35;

    vec3 b1 = p - vec3(sin(t) * 1.18 + m.x, cos(t * 0.73) * 0.72 + m.y, sin(t * 0.48) * 0.42);
    vec3 b2 = p - vec3(cos(t * 0.82) * 1.08 - m.x * 0.55, sin(t * 0.91) * 0.88, cos(t * 0.61) * 0.38);
    vec3 b3 = p - vec3(sin(t * 0.64 + 1.4) * 0.95, cos(t * 1.07) * 0.62 - m.y * 0.4, sin(t * 0.39) * 0.32);
    vec3 b4 = p - vec3(cos(t * 0.47 + 0.8) * 0.55, sin(t * 0.41) * 0.42, -0.18);

    float n = noise(p * 1.85 + vec3(t * 0.35)) * 0.14;
    float d = length(b1) - (0.82 + n);
    d = smin(d, length(b2) - (0.64 + n * 0.55), 0.58);
    d = smin(d, length(b3) - 0.54, 0.52);
    d = smin(d, length(b4) - 0.4, 0.46);
    return d;
  }

  vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.0016, 0.0);
    return normalize(vec3(
      map(p + e.xyy) - map(p - e.xyy),
      map(p + e.yxy) - map(p - e.yxy),
      map(p + e.yyx) - map(p - e.yyx)
    ));
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.y, uResolution.x);
    vec3 ro = vec3(0.0, 0.0, 3.25);
    vec3 rd = normalize(vec3(uv, -1.45));

    float tDist = 0.0;
    float hit = 0.0;
    vec3 p = ro;
    int maxSteps = int(mix(26.0, 54.0, uQuality));

    for (int i = 0; i < 54; i++) {
      if (i >= maxSteps) break;
      p = ro + rd * tDist;
      float d = map(p);
      if (d < 0.0025) {
        hit = 1.0;
        break;
      }
      if (tDist > 8.0) break;
      tDist += d * 0.82;
    }

    vec3 bg = vec3(0.027, 0.035, 0.07);
    bg += vec3(0.28, 0.22, 0.7) * (0.16 * (0.45 - uv.y));
    bg += vec3(0.55, 0.2, 0.85) * (0.1 * length(uv * 0.85));
    bg += vec3(0.12, 0.45, 0.55) * (0.07 * (0.5 + 0.5 * sin(uTime * 0.2 + uv.x * 2.0)));

    vec3 col = bg;
    if (hit > 0.5) {
      vec3 n = calcNormal(p);
      vec3 view = -rd;
      float fres = pow(1.0 - max(dot(n, view), 0.0), 2.35);
      vec3 irid = 0.5 + 0.5 * cos(6.2831 * (n.yxy * 0.42 + uTime * 0.07 + vec3(0.0, 0.33, 0.67)));
      irid = mix(vec3(0.28, 0.58, 1.0), vec3(0.82, 0.32, 0.98), irid.x);
      irid = mix(irid, vec3(0.2, 0.92, 0.88), irid.y * 0.45);

      vec3 light = normalize(vec3(0.45, 0.75, 0.85));
      float diff = max(dot(n, light), 0.0);
      float spec = pow(max(dot(reflect(-light, n), view), 0.0), 36.0);

      col = mix(vec3(0.7, 0.82, 1.0), irid, 0.78);
      col = col * (0.32 + 0.68 * diff) + spec * vec3(0.95, 0.98, 1.0) * 0.62 + fres * irid * 0.9;
      col = mix(bg, col, 0.9);
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;

function createNeuralGraph(isMobile) {
  const group = new THREE.Group();
  const nodeCount = isMobile ? 48 : 92;
  const positions = new Float32Array(nodeCount * 3);
  const points = [];

  for (let i = 0; i < nodeCount; i += 1) {
    const r = 1.15 + Math.random() * 2.35;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    points.push(new THREE.Vector3(x, y, z));
  }

  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const nodes = new THREE.Points(
    nodeGeo,
    new THREE.PointsMaterial({
      color: 0x6366f1,
      size: isMobile ? 0.035 : 0.042,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      depthWrite: false,
    })
  );
  group.add(nodes);

  const linePositions = [];
  const maxDist = isMobile ? 1.05 : 1.18;
  for (let i = 0; i < nodeCount; i += 1) {
    for (let j = i + 1; j < nodeCount; j += 1) {
      const d = points[i].distanceTo(points[j]);
      if (d < maxDist) {
        linePositions.push(points[i].x, points[i].y, points[i].z);
        linePositions.push(points[j].x, points[j].y, points[j].z);
      }
    }
  }

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lines = new THREE.LineSegments(
    lineGeo,
    new THREE.LineBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
    })
  );
  group.add(lines);
  return group;
}

const SlimeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      mount.classList.add('slime-fallback');
      return undefined;
    }

    const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    let renderer;
    let animationId;
    let disposed = false;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      mount.classList.add('slime-fallback');
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.autoClear = false;
    mount.appendChild(renderer.domElement);

    const slimeScene = new THREE.Scene();
    const slimeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const slimeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(mount.clientWidth, mount.clientHeight) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uQuality: { value: isMobile ? 0.15 : 1 },
      },
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    const slimeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), slimeMaterial);
    slimeScene.add(slimeMesh);

    const graphScene = new THREE.Scene();
    const graphCamera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.1,
      40
    );
    graphCamera.position.z = 6.2;
    const neural = createNeuralGraph(isMobile);
    graphScene.add(neural);

    const mouse = { x: 0, y: 0 };
    const mouseTarget = { x: 0, y: 0 };

    const onPointerMove = (event) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = -((event.clientY / window.innerHeight) * 2 - 1);
      mouseTarget.x = nx;
      mouseTarget.y = ny;
    };

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      slimeMaterial.uniforms.uResolution.value.set(w, h);
      graphCamera.aspect = w / h;
      graphCamera.updateProjectionMatrix();
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();

    const tick = () => {
      if (disposed) return;
      animationId = requestAnimationFrame(tick);
      if (document.hidden) return;

      const elapsed = clock.getElapsedTime();
      mouse.x += (mouseTarget.x - mouse.x) * 0.045;
      mouse.y += (mouseTarget.y - mouse.y) * 0.045;

      slimeMaterial.uniforms.uTime.value = elapsed;
      slimeMaterial.uniforms.uMouse.value.set(mouse.x * 0.55, mouse.y * 0.45);

      neural.rotation.y = elapsed * 0.08 + mouse.x * 0.18;
      neural.rotation.x = Math.sin(elapsed * 0.12) * 0.12 + mouse.y * 0.12;

      renderer.clear();
      renderer.render(slimeScene, slimeCamera);
      renderer.clearDepth();
      renderer.render(graphScene, graphCamera);
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      slimeMesh.geometry.dispose();
      slimeMaterial.dispose();
      neural.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="slime-background" ref={mountRef} aria-hidden="true" />;
};

export default SlimeBackground;
