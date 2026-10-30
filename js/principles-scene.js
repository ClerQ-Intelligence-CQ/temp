/* ============================================================
   ClerQ Intelligence · First Principles Horizon Solar System
   Three.js 3D interactive scene: 7 orbiting constraint bodies
   Visualized orbital paths · Low horizon perspective
   Central Sun: circular container featuring official CQ monogram
   Bidirectional sync with accessible principles navigation
   ============================================================ */

(function () {
  'use strict';

  var canvas = document.getElementById('principles-canvas');
  if (!canvas) return;

  var wrap = canvas.parentElement;
  if (!wrap) return;

  var titleEl = document.getElementById('principle-title');
  var descEl = document.getElementById('principle-desc');
  var numEl = document.getElementById('principle-number');
  var navEl = document.getElementById('principles-nav');

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Principle definitions (faithful to ClerQ Copy Deck) ---- */
  var principles = [
    {
      id: '01',
      name: 'Context',
      nameSw: 'Muktadha',
      desc: "Guidance that reflects the setting it's given in, not a one-size answer.",
      descSw: 'Mwongozo unaozingatia mazingira unayotolewa, si jibu moja kwa wote.'
    },
    {
      id: '02',
      name: 'Ease',
      nameSw: 'Urahisi',
      desc: "Built for the phone and the pace a clinician already has, not one they need to learn.",
      descSw: 'Imejengwa kwa simu na kasi ambayo daktari tayari anayo, si kasi anayohitaji kujifunza.'
    },
    {
      id: '03',
      name: 'Integrability',
      nameSw: 'Uunganishaji',
      desc: 'Designed to work alongside existing systems, not replace them outright.',
      descSw: 'Imeundwa kufanya kazi pamoja na mifumo iliyopo, si kuibadilisha kabisa.'
    },
    {
      id: '04',
      name: 'Infrastructure',
      nameSw: 'Miundombinu',
      desc: "Built assuming unreliable power and connectivity, because that's the reality.",
      descSw: 'Imejengwa kwa kuzingatia umeme na muunganisho usio wa kuaminika, kwa sababu hiyo ndiyo ukweli.'
    },
    {
      id: '05',
      name: 'Auditability',
      nameSw: 'Ukaguzi',
      desc: 'Every suggestion can be traced back to what it was based on.',
      descSw: 'Kila pendekezo linaweza kufuatiliwa hadi chanzo chake.'
    },
    {
      id: '06',
      name: 'Speed',
      nameSw: 'Kasi',
      desc: 'Answers fast enough to be useful mid-consultation, not after.',
      descSw: 'Majibu ya haraka ya kutosha kuwa na manufaa wakati wa mashauriano, si baadaye.'
    },
    {
      id: '07',
      name: 'Precision',
      nameSw: 'Usahihi',
      desc: 'Correct over impressive. A stiffer right answer beats a fluent wrong one.',
      descSw: 'Sahihi zaidi ya kuvutia. Jibu sahihi gumu linashinda jibu laini lisilo sahihi.'
    }
  ];

  /* ---- Language helper ---- */
  function getLang() {
    return document.documentElement.getAttribute('data-lang') || 'en';
  }

  var activeIndex = 0;

  function updateActivePrinciple(index) {
    if (index < 0 || index >= principles.length) return;
    activeIndex = index;
    var p = principles[index];
    var lang = getLang();

    if (titleEl) titleEl.textContent = (lang === 'sw' ? p.nameSw : p.name);
    if (descEl) descEl.textContent = (lang === 'sw' ? p.descSw : p.desc);
    if (numEl) numEl.textContent = p.id + ' / 07';

    /* Update nav buttons */
    if (navEl) {
      var btns = navEl.querySelectorAll('.principle-btn');
      btns.forEach(function (btn, i) {
        if (i === index) {
          btn.classList.add('principle-btn--active');
          btn.setAttribute('aria-selected', 'true');
        } else {
          btn.classList.remove('principle-btn--active');
          btn.setAttribute('aria-selected', 'false');
        }
      });
    }
  }

  /* ---- Build Principles navigation buttons in DOM ---- */
  if (navEl) {
    navEl.innerHTML = '';
    principles.forEach(function (p, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'principle-btn' + (i === 0 ? ' principle-btn--active' : '');
      btn.setAttribute('data-index', String(i));
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.innerHTML = '<span class="principle-btn__num">' + p.id + '</span> <span class="principle-btn__name" data-en="' + p.name + '" data-sw="' + p.nameSw + '">' + (getLang() === 'sw' ? p.nameSw : p.name) + '</span>';

      btn.addEventListener('mouseenter', function () {
        selectIndex(i);
      });
      btn.addEventListener('click', function () {
        selectIndex(i);
      });
      btn.addEventListener('focus', function () {
        selectIndex(i);
      });
      navEl.appendChild(btn);
    });
  }

  /* Listen for global language toggle */
  var langObserver = new MutationObserver(function () {
    updateActivePrinciple(activeIndex);
    if (navEl) {
      var lang = getLang();
      navEl.querySelectorAll('.principle-btn__name').forEach(function (el) {
        var txt = lang === 'sw' ? el.getAttribute('data-sw') : el.getAttribute('data-en');
        if (txt) el.textContent = txt;
      });
    }
  });
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });

  /* ---- Verify WebGL & THREE Availability ---- */
  if (typeof THREE === 'undefined') return;

  try {
    var testCanvas = document.createElement('canvas');
    var gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) return;
  } catch (e) {
    return;
  }

  /* ---- THREE Scene Setup ---- */
  var scene = new THREE.Scene();

  /* Low Horizon Camera:
     Looking slightly upward across the orbital plane from an elevated horizon vantage */
  var camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
  camera.position.set(0, 3.4, 9.2);
  camera.lookAt(0, -0.15, 0);

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

  /* ---- Central Sun Texture (Circular Container with CQ Logo) ---- */
  var sunCanvas = document.createElement('canvas');
  sunCanvas.width = 512;
  sunCanvas.height = 512;
  var sctx = sunCanvas.getContext('2d');

  function renderSunTexture(image) {
    sctx.clearRect(0, 0, 512, 512);

    /* Circular dark container background */
    var cx = 256, cy = 256, r = 236;

    var grad = sctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, '#1c1c1c');
    grad.addColorStop(0.85, '#0e0e0e');
    grad.addColorStop(1, '#050505');

    sctx.beginPath();
    sctx.arc(cx, cy, r, 0, Math.PI * 2);
    sctx.fillStyle = grad;
    sctx.fill();

    /* Glowing circular border ring */
    sctx.beginPath();
    sctx.arc(cx, cy, r - 4, 0, Math.PI * 2);
    sctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    sctx.lineWidth = 5;
    sctx.stroke();

    /* Second concentric hairline ring */
    sctx.beginPath();
    sctx.arc(cx, cy, r - 14, 0, Math.PI * 2);
    sctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    sctx.lineWidth = 2;
    sctx.stroke();

    /* Draw CQ Logo in pure white */
    if (image && image.width > 0) {
      /* Render image into an offscreen buffer and invert to pure white */
      var off = document.createElement('canvas');
      off.width = 512;
      off.height = 512;
      var octx = off.getContext('2d');

      var targetW = 270;
      var targetH = targetW * (image.naturalHeight / image.naturalWidth || 0.61);
      var dx = (512 - targetW) / 2;
      var dy = (512 - targetH) / 2;

      octx.drawImage(image, dx, dy, targetW, targetH);
      octx.globalCompositeOperation = 'source-in';
      octx.fillStyle = '#FFFFFF';
      octx.fillRect(0, 0, 512, 512);

      sctx.drawImage(off, 0, 0);
    } else {
      /* Crisp typographic fallback */
      sctx.fillStyle = '#FFFFFF';
      sctx.font = '700 130px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      sctx.textAlign = 'center';
      sctx.textBaseline = 'middle';
      sctx.fillText('CQ', cx, cy - 6);
    }
  }

  renderSunTexture(null);
  var sunTexture = new THREE.CanvasTexture(sunCanvas);
  sunTexture.minFilter = THREE.LinearFilter;
  sunTexture.magFilter = THREE.LinearFilter;

  var cqImg = new Image();
  cqImg.onload = function () {
    renderSunTexture(cqImg);
    sunTexture.needsUpdate = true;
  };
  cqImg.onerror = function () {
    console.warn('[principles-scene] CQ monogram failed to load, using text fallback');
  };
  cqImg.src = '/assets/logos/cq-monogram.svg';

  /* Central Sun Mesh: Slightly large circular disc container */
  var sunGeo = new THREE.PlaneGeometry(1.7, 1.7);
  var sunMat = new THREE.MeshBasicMaterial({
    map: sunTexture,
    transparent: true,
    depthWrite: false
  });
  var sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunMesh.position.set(0, 0, 0);
  scene.add(sunMesh);

  /* Central Sun Outer Pulsing Corona */
  var coronaCanvas = document.createElement('canvas');
  coronaCanvas.width = 256;
  coronaCanvas.height = 256;
  var cctx = coronaCanvas.getContext('2d');
  var cGrad = cctx.createRadialGradient(128, 128, 50, 128, 128, 128);
  cGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
  cGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.12)');
  cGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  cctx.fillStyle = cGrad;
  cctx.beginPath();
  cctx.arc(128, 128, 128, 0, Math.PI * 2);
  cctx.fill();

  var coronaTexture = new THREE.CanvasTexture(coronaCanvas);
  var coronaGeo = new THREE.PlaneGeometry(3.2, 3.2);
  var coronaMat = new THREE.MeshBasicMaterial({
    map: coronaTexture,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  var coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
  coronaMesh.position.set(0, 0, -0.05);
  scene.add(coronaMesh);

  /* ---- 7 Orbiting Bodies & Visualized Orbit Paths ---- */
  var orbitGroup = new THREE.Group();
  /* Slight tilt to enhance low-horizon perspective.
     The horizon line and star field live inside this same
     group instead of being added straight to scene. Grouping
     everything under orbitGroup keeps the horizon, stars, orbit
     tracks, and bodies all tilting together as one coherent scene. */
  orbitGroup.rotation.x = -0.22;
  scene.add(orbitGroup);

  /* Horizon line: child of orbitGroup so it tilts with the orbits */
  var horizonPoints = [
    new THREE.Vector3(-40, -0.3, -4),
    new THREE.Vector3(40, -0.3, -4)
  ];
  var horizonGeo = new THREE.BufferGeometry().setFromPoints(horizonPoints);
  var horizonMat = new THREE.LineBasicMaterial({
    color: 0xd0d0d8,
    transparent: true,
    opacity: 0.8
  });
  orbitGroup.add(new THREE.Line(horizonGeo, horizonMat));

  /* Background ambient particles */
  var starGeo = new THREE.BufferGeometry();
  var starCount = 70;
  var starPositions = new Float32Array(starCount * 3);
  for (var s = 0; s < starCount; s++) {
    starPositions[s * 3] = (Math.random() - 0.5) * 28;
    starPositions[s * 3 + 1] = Math.random() * 8 - 1;
    starPositions[s * 3 + 2] = -Math.random() * 12 - 2;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  var starMat = new THREE.PointsMaterial({
    color: 0x111114,
    size: 0.05,
    transparent: true,
    opacity: 0.15
  });
  orbitGroup.add(new THREE.Points(starGeo, starMat));

  var bodies = [];
  var orbitLines = [];
  var raycastTargets = [];

  /* Sphere geometry & materials */
  var sphereGeo = new THREE.SphereGeometry(0.12, 24, 24);
  var hitGeo = new THREE.SphereGeometry(0.48, 12, 12);
  var hitMat = new THREE.MeshBasicMaterial({ visible: false });

  /* Particle glow for bodies */
  var bodyGlowCanvas = document.createElement('canvas');
  bodyGlowCanvas.width = 64;
  bodyGlowCanvas.height = 64;
  var bgctx = bodyGlowCanvas.getContext('2d');
  var bgGrad = bgctx.createRadialGradient(32, 32, 4, 32, 32, 32);
  bgGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  bgGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)');
  bgGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  bgctx.fillStyle = bgGrad;
  bgctx.beginPath();
  bgctx.arc(32, 32, 32, 0, Math.PI * 2);
  bgctx.fill();
  var bodyGlowTexture = new THREE.CanvasTexture(bodyGlowCanvas);

  principles.forEach(function (p, i) {
    var radius = 1.65 + i * 0.72;
    /* Harmonic orbital speed: inner orbits faster */
    var speed = (0.24 / Math.sqrt(1 + i * 0.45)) * (reducedMotion ? 0 : 1);
    var startAngle = (i / principles.length) * Math.PI * 2 + i * 0.4;

    /* 1. Visualized Orbit Track (clean, luminous hairline circle) */
    var trackPts = [];
    var segments = 128;
    for (var a = 0; a <= segments; a++) {
      var th = (a / segments) * Math.PI * 2;
      trackPts.push(new THREE.Vector3(Math.cos(th) * radius, 0, Math.sin(th) * radius));
    }
    var trackGeo = new THREE.BufferGeometry().setFromPoints(trackPts);
    var trackMat = new THREE.LineBasicMaterial({
      color: 0x111114,
      transparent: true,
      opacity: (i === 0 ? 0.45 : 0.14),
      linewidth: 1
    });
    var trackLine = new THREE.LineLoop(trackGeo, trackMat);
    orbitGroup.add(trackLine);
    orbitLines.push(trackLine);

    /* 2. Orbiting Body Mesh */
    var bodyMat = new THREE.MeshBasicMaterial({
      color: 0x111114,
      transparent: true,
      opacity: 0.95
    });
    var bodyMesh = new THREE.Mesh(sphereGeo, bodyMat);

    /* Glow sprite behind body */
    var glowSpriteMat = new THREE.SpriteMaterial({
      map: bodyGlowTexture,
      transparent: true,
      opacity: (i === 0 ? 0.9 : 0.45),
      blending: THREE.AdditiveBlending
    });
    var glowSprite = new THREE.Sprite(glowSpriteMat);
    glowSprite.scale.set(0.65, 0.65, 1);
    bodyMesh.add(glowSprite);

    /* Raycast hit-proxy (larger sphere for effortless touch/pointer interaction) */
    var hitMesh = new THREE.Mesh(hitGeo, hitMat);
    hitMesh.userData = { index: i };
    bodyMesh.add(hitMesh);
    raycastTargets.push(hitMesh);

    orbitGroup.add(bodyMesh);

    bodies.push({
      mesh: bodyMesh,
      glow: glowSprite,
      hitMesh: hitMesh,
      radius: radius,
      speed: speed,
      angle: startAngle,
      index: i,
      targetScale: i === 0 ? 1.6 : 1.0,
      currentScale: 1.0
    });
  });

  /* Initialize display */
  updateActivePrinciple(0);

  function selectIndex(i) {
    if (i === activeIndex) return;
    updateActivePrinciple(i);
  }

  /* ---- Interactive Raycasting (Pointer & Touch) ---- */
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2(-9999, -9999);
  var isHoveringCanvas = false;

  function setPointer(clientX, clientY) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  }

  canvas.addEventListener('mousemove', function (e) {
    isHoveringCanvas = true;
    setPointer(e.clientX, e.clientY);
  });

  canvas.addEventListener('mouseleave', function () {
    isHoveringCanvas = false;
    mouse.set(-9999, -9999);
    canvas.style.cursor = 'default';
  });

  canvas.addEventListener('touchstart', function (e) {
    isHoveringCanvas = true;
    if (e.touches && e.touches[0]) {
      setPointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', function (e) {
    if (e.touches && e.touches[0]) {
      setPointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  canvas.addEventListener('click', function () {
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(raycastTargets, false);
    if (intersects.length > 0) {
      var idx = intersects[0].object.userData.index;
      if (typeof idx === 'number') selectIndex(idx);
    }
  });

  /* ---- Render & Animation Loop ---- */
  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    var dt = Math.min(clock.getDelta(), 0.05);
    var t = clock.getElapsedTime();

    /* Make central sun & corona face camera constantly */
    sunMesh.quaternion.copy(camera.quaternion);
    coronaMesh.quaternion.copy(camera.quaternion);

    /* Subtle breathing pulse of central sun corona */
    var pulse = Math.sin(t * 1.6) * 0.5 + 0.5;
    coronaMesh.scale.set(1 + pulse * 0.08, 1 + pulse * 0.08, 1);
    coronaMat.opacity = 0.42 + pulse * 0.16;

    /* Orbiting bodies motion & position update */
    bodies.forEach(function (b) {
      b.angle += b.speed * dt;
      var x = Math.cos(b.angle) * b.radius;
      var z = Math.sin(b.angle) * b.radius;
      b.mesh.position.set(x, 0, z);

      /* Lerp scale & visual active state */
      var isActive = (b.index === activeIndex);
      var targetScale = isActive ? 1.65 : 1.0;
      b.currentScale += (targetScale - b.currentScale) * 0.14;
      b.mesh.scale.set(b.currentScale, b.currentScale, b.currentScale);

      b.glow.material.opacity = isActive ? 0.95 : 0.35;
      b.glow.scale.set(isActive ? 0.95 : 0.6, isActive ? 0.95 : 0.6, 1);

      /* Orbit line highlight */
      var targetTrackOpacity = isActive ? 0.85 : 0.18;
      var trackMat = orbitLines[b.index].material;
      trackMat.opacity += (targetTrackOpacity - trackMat.opacity) * 0.12;
    });

    /* Raycast for pointer hover */
    if (isHoveringCanvas && mouse.x > -1.5) {
      raycaster.setFromCamera(mouse, camera);
      var intersects = raycaster.intersectObjects(raycastTargets, false);
      if (intersects.length > 0) {
        canvas.style.cursor = 'pointer';
        var hoveredIdx = intersects[0].object.userData.index;
        if (typeof hoveredIdx === 'number' && hoveredIdx !== activeIndex) {
          selectIndex(hoveredIdx);
        }
      } else {
        canvas.style.cursor = 'default';
      }
    }

    renderer.render(scene, camera);
  }

  animate();

})();
