/* ============================================================
   ClerQ Intelligence: Hero Three.js Scene
   Sparse, slow-orbiting wireframe geometric forms
   Monochrome · Quiet · Background-layer
   ============================================================ */

(function () {
  'use strict';

  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // Respect reduced motion
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Check WebGL support
  try {
    var testCanvas = document.createElement('canvas');
    var gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) return;
  } catch (e) {
    return;
  }

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 8);

  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  function resize() {
    var w = canvas.parentElement.clientWidth;
    var h = canvas.parentElement.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Materials: thin monochrome wireframes
  var wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x0A0A0A,
    wireframe: true,
    transparent: true,
    opacity: 0.08
  });

  var wireMaterialLight = new THREE.MeshBasicMaterial({
    color: 0x0A0A0A,
    wireframe: true,
    transparent: true,
    opacity: 0.05
  });

  // Geometry: sparse, quiet forms referencing circular letterforms
  var ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(2.2, 0.02, 16, 80),
    wireMaterial
  );
  ring1.rotation.x = Math.PI * 0.35;
  scene.add(ring1);

  var ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.6, 0.015, 16, 60),
    wireMaterialLight
  );
  ring2.rotation.x = Math.PI * 0.6;
  ring2.rotation.z = Math.PI * 0.2;
  scene.add(ring2);

  var sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(1.4, 20, 16),
    wireMaterialLight
  );
  sphere1.position.set(1.5, 0.5, -2);
  scene.add(sphere1);

  var torus1 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.08, 80, 12, 2, 3),
    new THREE.MeshBasicMaterial({
      color: 0x0A0A0A,
      wireframe: true,
      transparent: true,
      opacity: 0.04
    })
  );
  torus1.position.set(-2, -0.5, -1);
  scene.add(torus1);

  var ring3 = new THREE.Mesh(
    new THREE.TorusGeometry(3, 0.01, 8, 120),
    new THREE.MeshBasicMaterial({
      color: 0x0A0A0A,
      wireframe: true,
      transparent: true,
      opacity: 0.03
    })
  );
  ring3.rotation.x = Math.PI * 0.5;
  ring3.rotation.y = Math.PI * 0.15;
  scene.add(ring3);

  // Animation
  if (reducedMotion) {
    // Static render
    renderer.render(scene, camera);
    return;
  }

  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();

    ring1.rotation.y = t * 0.08;
    ring1.rotation.z = Math.sin(t * 0.05) * 0.1;

    ring2.rotation.y = -t * 0.06;
    ring2.rotation.x = Math.PI * 0.6 + Math.sin(t * 0.04) * 0.05;

    sphere1.rotation.y = t * 0.03;
    sphere1.position.y = 0.5 + Math.sin(t * 0.3) * 0.15;

    torus1.rotation.x = t * 0.04;
    torus1.rotation.y = t * 0.05;

    ring3.rotation.z = t * 0.02;

    renderer.render(scene, camera);
  }

  animate();

})();
