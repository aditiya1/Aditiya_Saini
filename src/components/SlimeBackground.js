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

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float hexDist(vec2 p) {
    p = abs(p);
    return max(p.x * 0.866 + p.y * 0.5, p.y);
  }

  vec2 hexCell(vec2 uv) {
    vec2 r = vec2(1.0, 1.732);
    vec2 h = r * 0.5;
    vec2 a = mod(uv, r) - h;
    vec2 b = mod(uv - h, r) - h;
    return dot(a, a) < dot(b, b) ? a : b;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.y, uResolution.x);
    vec2 screen = gl_FragCoord.xy / uResolution;

    vec3 col = vec3(0.025, 0.04, 0.075);
    col += vec3(0.05, 0.12, 0.28) * (0.18 * (0.55 - uv.y));

    vec2 hexUv = uv * 7.2 + vec2(uTime * 0.03, 0.0);
    vec2 cell = hexCell(hexUv);
    float hex = 1.0 - smoothstep(0.46, 0.5, hexDist(cell));
    float hexLine = smoothstep(0.42, 0.46, hexDist(cell)) * hex;
    col += vec3(0.12, 0.35, 0.7) * hexLine * 0.22;

    float scan = 0.5 + 0.5 * sin(screen.y * 42.0 - uTime * 1.6);
    col += vec3(0.08, 0.28, 0.55) * scan * 0.045;

    float gridX = 1.0 - smoothstep(0.0, 0.012, abs(fract(uv.x * 4.5 + uTime * 0.04) - 0.5));
    float gridY = 1.0 - smoothstep(0.0, 0.012, abs(fract(uv.y * 4.5) - 0.5));
    col += vec3(0.1, 0.32, 0.62) * max(gridX, gridY) * 0.07;

    float spark = step(0.992, hash(floor(gl_FragCoord.xy / 3.0) + floor(uTime * 2.0)));
    col += vec3(0.45, 0.8, 1.0) * spark * 0.55;

    vec2 m = uMouse * 0.8;
    float cursor = exp(-12.0 * length(uv - m));
    col += vec3(0.2, 0.55, 1.0) * cursor * 0.18;

    float vig = smoothstep(1.25, 0.15, length(uv));
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function createNetwork(isMobile) {
  const group = new THREE.Group();
  const nodeCount = isMobile ? 42 : 78;
  const positions = new Float32Array(nodeCount * 3);
  const points = [];

  for (let i = 0; i < nodeCount; i += 1) {
    const r = 1.4 + Math.random() * 2.6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta) * 0.7;
    const z = r * Math.cos(phi);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    points.push(new THREE.Vector3(x, y, z));
  }

  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  group.add(
    new THREE.Points(
      nodeGeo,
      new THREE.PointsMaterial({
        color: 0x7dd3fc,
        size: isMobile ? 0.04 : 0.05,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        depthWrite: false,
      })
    )
  );

  const linePositions = [];
  const maxDist = isMobile ? 1.15 : 1.28;
  for (let i = 0; i < nodeCount; i += 1) {
    for (let j = i + 1; j < nodeCount; j += 1) {
      if (points[i].distanceTo(points[j]) < maxDist) {
        linePositions.push(
          points[i].x, points[i].y, points[i].z,
          points[j].x, points[j].y, points[j].z
        );
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  group.add(
    new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      })
    )
  );
  return group;
}

function createGlobe() {
  const group = new THREE.Group();
  const geo = new THREE.IcosahedronGeometry(2.35, 1);
  group.add(
    new THREE.LineSegments(
      new THREE.WireframeGeometry(geo),
      new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.18,
      })
    )
  );
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

    const bgScene = new THREE.Scene();
    const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const bgMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(mount.clientWidth, mount.clientHeight) },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMaterial);
    bgScene.add(bgMesh);

    const fgScene = new THREE.Scene();
    const fgCamera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.1,
      40
    );
    fgCamera.position.z = 6.4;

    const network = createNetwork(isMobile);
    const globe = createGlobe();
    fgScene.add(network, globe);

    const mouse = { x: 0, y: 0 };
    const mouseTarget = { x: 0, y: 0 };
    const onPointerMove = (event) => {
      mouseTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseTarget.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    const onResize = () => {
      const w = mount.clientWidth;
      const h = Math.max(mount.clientHeight, 1);
      renderer.setSize(w, h);
      bgMaterial.uniforms.uResolution.value.set(w, h);
      fgCamera.aspect = w / h;
      fgCamera.updateProjectionMatrix();
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    const tick = () => {
      if (disposed) return;
      animationId = requestAnimationFrame(tick);
      if (document.hidden) return;
      const t = clock.getElapsedTime();
      mouse.x += (mouseTarget.x - mouse.x) * 0.04;
      mouse.y += (mouseTarget.y - mouse.y) * 0.04;

      bgMaterial.uniforms.uTime.value = t;
      bgMaterial.uniforms.uMouse.value.set(mouse.x * 0.55, mouse.y * 0.4);

      network.rotation.y = t * 0.05 + mouse.x * 0.15;
      network.rotation.x = Math.sin(t * 0.08) * 0.08 + mouse.y * 0.1;
      globe.rotation.y = t * 0.07;
      globe.rotation.x = 0.35;

      renderer.clear();
      renderer.render(bgScene, bgCamera);
      renderer.clearDepth();
      renderer.render(fgScene, fgCamera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      bgMesh.geometry.dispose();
      bgMaterial.dispose();
      fgScene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="slime-background" ref={mountRef} aria-hidden="true" />;
};

export default SlimeBackground;
