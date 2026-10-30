/* ============================================================
   ClerQ Intelligence · Product Stall 3D WebGL Scene
   Interactive Three.js viewport: On-Device Clinical Neural Lattice
   Geometric chassis · Dynamic orbital rings · Mouse-reactive parallax
   Transforms dynamically when switching product stalls
   ============================================================ */

(function () {
  'use strict';

  var canvas = document.getElementById('product-stall-canvas');
  if (!canvas) return;

  var wrap = canvas.parentElement;
  if (!wrap) return;

  // Respect reduced motion
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // WebGL check
  try {
    var testCanvas = document.createElement('canvas');
    var gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) return;
  } catch (e) {
    return;
  }

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 7.5);

  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  function resize() {
    var w = wrap.clientWidth;
    var h = wrap.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Group that holds all stall objects
  var stallGroup = new THREE.Group();
  scene.add(stallGroup);

  // Materials: High-contrast architectural monochrome with subtle teal accents
  var darkWireMat = new THREE.MeshBasicMaterial({
    color: 0x0A0A0A,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });

  var boldWireMat = new THREE.MeshBasicMaterial({
    color: 0x0A0A0A,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });

  var accentTealMat = new THREE.MeshBasicMaterial({
    color: 0x00D09C,
    wireframe: true,
    transparent: true,
    opacity: 0.65
  });

  var coreNodeMat = new THREE.MeshBasicMaterial({
    color: 0x0A0A0A,
    transparent: true,
    opacity: 0.85
  });

  // 1. Outer Gyroscope Rings (Referencing CQ Circular Monogram)
  var ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.015, 16, 100), darkWireMat);
  ring1.rotation.x = Math.PI * 0.4;
  stallGroup.add(ring1);

  var ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.02, 16, 90), boldWireMat);
  ring2.rotation.y = Math.PI * 0.35;
  stallGroup.add(ring2);

  var ring3 = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.015, 16, 80), accentTealMat);
  ring3.rotation.z = Math.PI * 0.25;
  stallGroup.add(ring3);

  // 2. Central Neural Engine Geometry (Transformable Core)
  var coreGeo = new THREE.IcosahedronGeometry(1.0, 1);
  var coreMesh = new THREE.Mesh(coreGeo, boldWireMat);
  stallGroup.add(coreMesh);

  var innerCoreGeo = new THREE.OctahedronGeometry(0.55, 0);
  var innerCoreMesh = new THREE.Mesh(innerCoreGeo, accentTealMat);
  stallGroup.add(innerCoreMesh);

  // 3. Orbiting Clinical Decision Anchor Nodes
  var nodeGroup = new THREE.Group();
  stallGroup.add(nodeGroup);

  var nodeSpheres = [];
  var nodeCount = 8;
  var sphereGeo = new THREE.SphereGeometry(0.06, 16, 16);

  for (var i = 0; i < nodeCount; i++) {
    var mat = (i % 3 === 0) ? new THREE.MeshBasicMaterial({ color: 0x00D09C }) : coreNodeMat;
    var node = new THREE.Mesh(sphereGeo, mat);
    var angle = (i / nodeCount) * Math.PI * 2;
    var rad = 1.35;
    node.position.set(Math.cos(angle) * rad, (Math.sin(angle * 2) * 0.4), Math.sin(angle) * rad);
    nodeGroup.add(node);
    nodeSpheres.push({ mesh: node, angle: angle, speed: 0.008 + (i * 0.002) });
  }

  // 4. Hairline Connector Lattice between nodes
  var linePoints = [];
  for (var j = 0; j < nodeCount; j++) {
    linePoints.push(nodeSpheres[j].mesh.position);
  }
  linePoints.push(nodeSpheres[0].mesh.position);
  var lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
  var lineMat = new THREE.LineBasicMaterial({
    color: 0x0A0A0A,
    transparent: true,
    opacity: 0.12
  });
  var latticeLine = new THREE.Line(lineGeo, lineMat);
  nodeGroup.add(latticeLine);

  // Mouse Parallax Interaction
  var mouseX = 0;
  var mouseY = 0;
  var targetRotX = 0;
  var targetRotY = 0;

  window.addEventListener('mousemove', function (e) {
    var rect = wrap.getBoundingClientRect();
    if (e.clientY >= rect.top - 200 && e.clientY <= rect.bottom + 200) {
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = mouseX * 0.45;
      targetRotX = -mouseY * 0.35;
    }
  });

  // Dynamic Stall Switcher (Nia, Sema, Rafiki, Hakiki)
  window.updateStall3D = function (productId) {
    if (productId === 'nia-cds') {
      coreMesh.geometry.dispose();
      coreMesh.geometry = new THREE.IcosahedronGeometry(1.05, 1);
      innerCoreMesh.geometry.dispose();
      innerCoreMesh.geometry = new THREE.OctahedronGeometry(0.55, 0);
      ring3.material.color.setHex(0x00D09C); // Teal
    } else if (productId === 'sema-voice') {
      coreMesh.geometry.dispose();
      coreMesh.geometry = new THREE.TorusKnotGeometry(0.7, 0.15, 64, 12, 2, 3);
      innerCoreMesh.geometry.dispose();
      innerCoreMesh.geometry = new THREE.SphereGeometry(0.4, 16, 16);
      ring3.material.color.setHex(0x0EA5E9); // Cyan
    } else if (productId === 'rafiki-triage') {
      coreMesh.geometry.dispose();
      coreMesh.geometry = new THREE.DodecahedronGeometry(0.95, 0);
      innerCoreMesh.geometry.dispose();
      innerCoreMesh.geometry = new THREE.TetrahedronGeometry(0.5, 0);
      ring3.material.color.setHex(0xD97706); // Amber
    } else if (productId === 'hakiki-audit') {
      coreMesh.geometry.dispose();
      coreMesh.geometry = new THREE.BoxGeometry(1.1, 1.1, 1.1);
      innerCoreMesh.geometry.dispose();
      innerCoreMesh.geometry = new THREE.OctahedronGeometry(0.6, 0);
      ring3.material.color.setHex(0x8B5CF6); // Violet
    }
  };

  // Animation Loop
  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    var delta = clock.getDelta();

    if (!reducedMotion) {
      // Rotation
      ring1.rotation.z += 0.003;
      ring2.rotation.x += 0.004;
      ring3.rotation.y += 0.005;

      coreMesh.rotation.y += 0.006;
      coreMesh.rotation.x += 0.003;
      innerCoreMesh.rotation.y -= 0.008;

      // Orbiting nodes
      nodeSpheres.forEach(function (ns) {
        ns.angle += ns.speed;
        ns.mesh.position.x = Math.cos(ns.angle) * 1.35;
        ns.mesh.position.z = Math.sin(ns.angle) * 1.35;
        ns.mesh.position.y = Math.sin(ns.angle * 2) * 0.35;
      });

      // Update connector line
      var updatedPts = [];
      for (var k = 0; k < nodeCount; k++) {
        updatedPts.push(nodeSpheres[k].mesh.position);
      }
      updatedPts.push(nodeSpheres[0].mesh.position);
      latticeLine.geometry.setFromPoints(updatedPts);

      // Smooth parallax damping
      stallGroup.rotation.y += (targetRotY - stallGroup.rotation.y) * 0.05;
      stallGroup.rotation.x += (targetRotX - stallGroup.rotation.x) * 0.05;
    }

    renderer.render(scene, camera);
  }

  animate();
})();
