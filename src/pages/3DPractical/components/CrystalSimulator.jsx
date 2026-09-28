import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import "../../../CSS/CrystalSimulator.css";

const DATA = {
  SC: {
    atoms: 1,
    coordination: 6,
  },
  BCC: {
    atoms: 2,
    coordination: 8,
  },
  FCC: {
    atoms: 4,
    coordination: 12,
  },
};

function getAFromRadius(r, structure) {
  if (structure === "SC") return 2 * r;
  if (structure === "BCC") return (4 * r) / Math.sqrt(3);
  return 2 * Math.sqrt(2) * r;
}

function getRadiusFromA(a, structure) {
  if (structure === "SC") return a / 2;
  if (structure === "BCC") return (a * Math.sqrt(3)) / 4;
  return a / (2 * Math.sqrt(2));
}

function CrystalSimulator() {
  const canvasRef = useRef(null);

  const [structure, setStructure] = useState("SC");
  const [radius, setRadius] = useState(0.7);

  const [manual, setManual] = useState(false);

  const [a, setA] = useState(2);
  const [b, setB] = useState(2);
  const [c, setC] = useState(2);

  const [alpha, setAlpha] = useState(90);
  const [beta, setBeta] = useState(90);
  const [gamma, setGamma] = useState(90);

  const [showEdges, setShowEdges] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showRadius, setShowRadius] = useState(true);
  const [showContact, setShowContact] = useState(true);

  const [showContribution, setShowContribution] =
    useState(false);

  const [autoRotate, setAutoRotate] =
    useState(false);

  const [measureMode, setMeasureMode] =
    useState(false);

  const [measurement, setMeasurement] =
    useState(null);

  const [latticeMode, setLatticeMode] =
    useState(false);

  const currentA = manual
    ? Number(a)
    : getAFromRadius(radius, structure);

  const currentB = manual
    ? Number(b)
    : currentA;

  const currentC = manual
    ? Number(c)
    : currentA;

  const currentRadius = manual
    ? getRadiusFromA(a, structure)
    : radius;

  const info = DATA[structure];

  const atomVolume =
    info.atoms *
    ((4 / 3) *
      Math.PI *
      Math.pow(currentRadius, 3));

  const cellVolume =
    currentA *
    currentB *
    currentC;

  const apf =
    cellVolume > 0
      ? atomVolume / cellVolume
      : 0;

  useEffect(() => {
    const container = canvasRef.current;

    if (!container) return;

    const scene = new THREE.Scene();

    scene.background =
      new THREE.Color(0x07111f);

    const width =
      container.clientWidth || 800;

    const height =
      container.clientHeight || 600;

    const camera =
      new THREE.PerspectiveCamera(
        45,
        width / height,
        0.1,
        100
      );

    camera.position.set(
      4.5,
      3.5,
      4.5
    );

    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        2
      )
    );

    renderer.setSize(
      width,
      height
    );

    renderer.localClippingEnabled = true;

    container.innerHTML = "";

    container.appendChild(
      renderer.domElement
    );

    const controls =
      new OrbitControls(
        camera,
        renderer.domElement
      );

    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.2;
    controls.maxDistance = 15;

    /* ==========================================
       LIGHTING
       ========================================== */

    const ambient =
      new THREE.AmbientLight(
        0xffffff,
        latticeMode ? 0.8 : 2
      );

    scene.add(ambient);

    const light1 =
      new THREE.PointLight(
        0xffffff,
        latticeMode ? 1.3 : 2.5
      );

    light1.position.set(
      5,
      5,
      5
    );

    scene.add(light1);

    const light2 =
      new THREE.PointLight(
        0x22d3ee,
        latticeMode ? 0.7 : 2
      );

    light2.position.set(
      -4,
      2,
      4
    );

    scene.add(light2);

    const group =
      new THREE.Group();

    scene.add(group);

    const selectableAtoms = [];

    const size = currentA;
    const half = size / 2;

    const p000 =
      new THREE.Vector3(
        -half,
        -half,
        -half
      );

    const p100 =
      new THREE.Vector3(
        half,
        -half,
        -half
      );

    const p010 =
      new THREE.Vector3(
        -half,
        half,
        -half
      );

    const p110 =
      new THREE.Vector3(
        half,
        half,
        -half
      );

    const p001 =
      new THREE.Vector3(
        -half,
        -half,
        half
      );

    const p101 =
      new THREE.Vector3(
        half,
        -half,
        half
      );

    const p011 =
      new THREE.Vector3(
        -half,
        half,
        half
      );

    const p111 =
      new THREE.Vector3(
        half,
        half,
        half
      );

    let clippingPlanes = [];

    if (
      showContribution &&
      !manual
    ) {
      clippingPlanes = [
        new THREE.Plane(
          new THREE.Vector3(1, 0, 0),
          half
        ),
        new THREE.Plane(
          new THREE.Vector3(-1, 0, 0),
          half
        ),
        new THREE.Plane(
          new THREE.Vector3(0, 1, 0),
          half
        ),
        new THREE.Plane(
          new THREE.Vector3(0, -1, 0),
          half
        ),
        new THREE.Plane(
          new THREE.Vector3(0, 0, 1),
          half
        ),
        new THREE.Plane(
          new THREE.Vector3(0, 0, -1),
          half
        ),
      ];
    }

    function addCutSurface(
      position,
      axis,
      color
    ) {
      if (
        !showContribution ||
        manual
      ) {
        return;
      }

      const geometry =
        new THREE.CircleGeometry(
          currentRadius * 0.995,
          48
        );

      const material =
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.82,
          side: THREE.DoubleSide,
          clippingPlanes,
        });

      const disk =
        new THREE.Mesh(
          geometry,
          material
        );

      disk.position.copy(position);

      if (axis === "x") {
        disk.rotation.y =
          Math.PI / 2;
      }

      if (axis === "y") {
        disk.rotation.x =
          -Math.PI / 2;
      }

      group.add(disk);
    }

    function addAtom(
      position,
      color,
      contribution,
      cutAxes = [],
      atomName = "Atom"
    ) {
      const atomGroup =
        new THREE.Group();

      atomGroup.userData.isAtom = true;

      atomGroup.userData.atomName =
        atomName;

      atomGroup.userData.atomPosition =
        position.clone();

      const geometry =
        new THREE.SphereGeometry(
          currentRadius,
          48,
          48
        );

      const material =
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.22,
          metalness: 0.08,
          clippingPlanes,
        });

      const atom =
        new THREE.Mesh(
          geometry,
          material
        );

      atom.userData.isAtom = true;

      atom.userData.atomPosition =
        position.clone();

      atom.userData.atomName =
        atomName;

      atomGroup.add(atom);

      const outlineGeometry =
        new THREE.SphereGeometry(
          currentRadius * 1.01,
          32,
          32
        );

      const outlineMaterial =
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          wireframe: true,
          transparent: true,
          opacity: 0.32,
          clippingPlanes,
        });

      const outline =
        new THREE.Mesh(
          outlineGeometry,
          outlineMaterial
        );

      atomGroup.add(outline);

      atomGroup.position.copy(
        position
      );

      group.add(atomGroup);

      selectableAtoms.push(atom);

      cutAxes.forEach((axis) => {
        addCutSurface(
          position,
          axis,
          color
        );
      });

      if (
        showContribution &&
        contribution
      ) {
        const canvas =
          document.createElement(
            "canvas"
          );

        canvas.width = 300;
        canvas.height = 90;

        const ctx =
          canvas.getContext("2d");

        ctx.clearRect(
          0,
          0,
          300,
          90
        );

        ctx.font =
          "bold 32px Arial";

        ctx.fillStyle =
          "#ffffff";

        ctx.textAlign =
          "center";

        ctx.textBaseline =
          "middle";

        ctx.fillText(
          contribution,
          150,
          45
        );

        const texture =
          new THREE.CanvasTexture(
            canvas
          );

        const spriteMaterial =
          new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false,
          });

        const sprite =
          new THREE.Sprite(
            spriteMaterial
          );

        sprite.scale.set(
          0.7,
          0.21,
          1
        );

        sprite.position.set(
          position.x,
          position.y +
            currentRadius +
            0.15,
          position.z
        );

        group.add(sprite);
      }
    }

    const corners = [
      p000,
      p100,
      p010,
      p110,
      p001,
      p101,
      p011,
      p111,
    ];

    corners.forEach(
      (point, index) => {
        addAtom(
          point,
          0x22d3ee,
          "1/8",
          ["x", "y", "z"],
          `Corner ${index + 1}`
        );
      }
    );

    if (structure === "BCC") {
      addAtom(
        new THREE.Vector3(
          0,
          0,
          0
        ),
        0xa78bfa,
        "1",
        [],
        "Body Centre"
      );
    }

    if (structure === "FCC") {
      addAtom(
        new THREE.Vector3(
          0,
          0,
          half
        ),
        0xa78bfa,
        "1/2",
        ["z"],
        "Front Face"
      );

      addAtom(
        new THREE.Vector3(
          0,
          0,
          -half
        ),
        0xa78bfa,
        "1/2",
        ["z"],
        "Back Face"
      );

      addAtom(
        new THREE.Vector3(
          half,
          0,
          0
        ),
        0xa78bfa,
        "1/2",
        ["x"],
        "Right Face"
      );

      addAtom(
        new THREE.Vector3(
          -half,
          0,
          0
        ),
        0xa78bfa,
        "1/2",
        ["x"],
        "Left Face"
      );

      addAtom(
        new THREE.Vector3(
          0,
          half,
          0
        ),
        0xa78bfa,
        "1/2",
        ["y"],
        "Top Face"
      );

      addAtom(
        new THREE.Vector3(
          0,
          -half,
          0
        ),
        0xa78bfa,
        "1/2",
        ["y"],
        "Bottom Face"
      );
    }

    function addEdge(
      start,
      end,
      color = 0x67e8f9,
      opacity = 0.95
    ) {
      const geometry =
        new THREE.BufferGeometry().setFromPoints(
          [start, end]
        );

      const material =
        new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity,
        });

      const line =
        new THREE.Line(
          geometry,
          material
        );

      group.add(line);
    }

    if (showEdges) {
      addEdge(p000, p100);
      addEdge(p000, p010);
      addEdge(p000, p001);

      addEdge(p100, p110);
      addEdge(p100, p101);

      addEdge(p010, p110);
      addEdge(p010, p011);

      addEdge(p001, p101);
      addEdge(p001, p011);

      addEdge(p110, p111);
      addEdge(p101, p111);
      addEdge(p011, p111);
    }

    function addDimension(
      start,
      end,
      text
    ) {
      const geometry =
        new THREE.BufferGeometry().setFromPoints(
          [start, end]
        );

      const material =
        new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.8,
        });

      const line =
        new THREE.Line(
          geometry,
          material
        );

      group.add(line);

      const canvas =
        document.createElement(
          "canvas"
        );

      canvas.width = 400;
      canvas.height = 100;

      const ctx =
        canvas.getContext("2d");

      ctx.font =
        "bold 34px Arial";

      ctx.fillStyle =
        "#ffffff";

      ctx.textAlign =
        "center";

      ctx.fillText(
        text,
        200,
        60
      );

      const texture =
        new THREE.CanvasTexture(
          canvas
        );

      const spriteMaterial =
        new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthTest: false,
        });

      const sprite =
        new THREE.Sprite(
          spriteMaterial
        );

      sprite.scale.set(
        1.05,
        0.26,
        1
      );

      sprite.position
        .copy(start)
        .add(end)
        .multiplyScalar(
          0.5
        );

      group.add(sprite);
    }

    if (showDimensions) {
      addDimension(
        p000,
        p100,
        `a = ${currentA.toFixed(2)}`
      );

      addDimension(
        p000,
        p010,
        `b = ${currentB.toFixed(2)}`
      );

      addDimension(
        p000,
        p001,
        `c = ${currentC.toFixed(2)}`
      );
    }

    if (showRadius) {
      const radiusEnd =
        p000.clone();

      radiusEnd.x +=
        currentRadius;

      addEdge(
        p000,
        radiusEnd,
        0xfbbf24,
        1
      );
    }

    if (showContact) {
      if (structure === "SC") {
        addEdge(
          p000,
          p100,
          0xf472b6,
          1
        );
      }

      if (structure === "BCC") {
        addEdge(
          p000,
          p111,
          0xf472b6,
          1
        );
      }

      if (structure === "FCC") {
        addEdge(
          p000,
          p110,
          0xf472b6,
          1
        );
      }
    }

    /*
    =====================================================
    CRYSTAL LATTICE
    =====================================================
    */

    let latticeAnimationId = null;

    if (latticeMode) {
      const template =
        new THREE.Group();

      group.children.forEach(
        (child) => {
          template.add(
            child.clone(true)
          );
        }
      );

      group.clear();

      const latticeRoot =
        new THREE.Group();

      group.add(
        latticeRoot
      );

      const cells = [];

      for (
        let x = -1;
        x <= 1;
        x += 1
      ) {
        for (
          let y = -1;
          y <= 1;
          y += 1
        ) {
          for (
            let z = -1;
            z <= 1;
            z += 1
          ) {
            const cell =
              template.clone(true);

            /*
            ============================================
            LATTICE-ONLY VISUAL TUNING
            ============================================

            Solid atoms
            Lower roughness / metalness
            No glowing transparent layers
            Proper depth testing
            Very subtle atom outlines
            Hide dimensions/contact/radius overlays
            from every repeated cell.
            */

            cell.traverse(
              (object) => {
                if (
                  object.isSprite
                ) {
                  object.visible =
                    false;

                  return;
                }

                if (
                  object.isLine &&
                  object.material?.color
                ) {
                  const lineColor =
                    object.material.color.getHex();

                  /*
                  Keep only the normal
                  cyan cell-edge lines.
                  */

                  if (
                    lineColor !==
                      0x67e8f9 &&
                    lineColor !==
                      0xffffff
                  ) {
                    object.visible =
                      false;
                  }

                  /*
                  Dimension lines are
                  white, so hide them.
                  */

                  if (
                    lineColor ===
                    0xffffff
                  ) {
                    object.visible =
                      false;
                  }
                }

                if (
                  !object.material
                ) {
                  return;
                }

                const materials =
                  Array.isArray(
                    object.material
                  )
                    ? object.material
                    : [
                        object.material,
                      ];

                materials.forEach(
                  (material) => {
                    /*
                    ATOMS
                    */

                    if (
                      object.isMesh &&
                      material.isMeshStandardMaterial
                    ) {
                      material.transparent =
                        false;

                      material.opacity =
                        1;

                      material.roughness =
                        0.48;

                      material.metalness =
                        0.02;

                      material.depthTest =
                        true;

                      material.depthWrite =
                        true;

                      material.emissive.set(
                        0x000000
                      );

                      material.emissiveIntensity =
                        0;
                    }

                    /*
                    ATOM OUTLINES
                    */

                    if (
                      object.isMesh &&
                      material.isMeshBasicMaterial &&
                      material.wireframe
                    ) {
                      material.transparent =
                        true;

                      material.opacity =
                        0.14;

                      material.depthTest =
                        true;

                      material.depthWrite =
                        false;
                    }

                    /*
                    LATTICE EDGES
                    */

                    if (
                      object.isLine
                    ) {
                      material.transparent =
                        true;

                      material.opacity =
                        0.38;

                      material.depthTest =
                        true;

                      material.depthWrite =
                        false;
                    }
                  }
                );
              }
            );

            const target =
              new THREE.Vector3(
                x * currentA,
                y * currentB,
                z * currentC
              );

            const start =
              target
                .clone()
                .multiplyScalar(
                  0.12
                );

            cell.position.copy(
              start
            );

            latticeRoot.add(
              cell
            );

            cells.push({
              cell,
              start,
              target,
            });
          }
        }
      }

      const startTime =
        performance.now();

      const duration = 1600;

      const easeOutCubic = (
        t
      ) =>
        1 -
        Math.pow(
          1 - t,
          3
        );

      const animateLattice = (
        now
      ) => {
        const progress =
          Math.min(
            (now -
              startTime) /
              duration,
            1
          );

        const eased =
          easeOutCubic(
            progress
          );

        cells.forEach(
          ({
            cell,
            start,
            target,
          }) => {
            cell.position.lerpVectors(
              start,
              target,
              eased
            );
          }
        );

        if (
          progress < 1
        ) {
          latticeAnimationId =
            requestAnimationFrame(
              animateLattice
            );
        } else {
          latticeAnimationId =
            null;
        }
      };

      latticeAnimationId =
        requestAnimationFrame(
          animateLattice
        );
    }

    /*
    =====================================================
    MEASUREMENT
    =====================================================
    */

    const measurementGroup =
      new THREE.Group();

    scene.add(
      measurementGroup
    );

    function makeMeasurementLabel(
      distance
    ) {
      const canvas =
        document.createElement(
          "canvas"
        );

      canvas.width = 500;
      canvas.height = 130;

      const ctx =
        canvas.getContext(
          "2d"
        );

      ctx.clearRect(
        0,
        0,
        500,
        130
      );

      ctx.font =
        "bold 42px Arial";

      ctx.fillStyle =
        "#fbbf24";

      ctx.textAlign =
        "center";

      ctx.fillText(
        `d = ${distance.toFixed(
          3
        )}`,
        250,
        78
      );

      const texture =
        new THREE.CanvasTexture(
          canvas
        );

      const material =
        new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthTest: false,
        });

      const sprite =
        new THREE.Sprite(
          material
        );

      sprite.scale.set(
        1.4,
        0.36,
        1
      );

      return sprite;
    }

    function createMeasurement(
      first,
      second
    ) {
      measurementGroup.clear();

      const distance =
        first.distanceTo(
          second
        );

      const lineGeometry =
        new THREE.BufferGeometry().setFromPoints(
          [
            first,
            second,
          ]
        );

      const lineMaterial =
        new THREE.LineBasicMaterial({
          color: 0xfbbf24,
          linewidth: 3,
        });

      const line =
        new THREE.Line(
          lineGeometry,
          lineMaterial
        );

      measurementGroup.add(
        line
      );

      const sphereGeometry =
        new THREE.SphereGeometry(
          0.055,
          20,
          20
        );

      const sphereMaterial =
        new THREE.MeshBasicMaterial({
          color: 0xfbbf24,
        });

      const marker1 =
        new THREE.Mesh(
          sphereGeometry,
          sphereMaterial
        );

      marker1.position.copy(
        first
      );

      const marker2 =
        new THREE.Mesh(
          sphereGeometry,
          sphereMaterial
        );

      marker2.position.copy(
        second
      );

      measurementGroup.add(
        marker1
      );

      measurementGroup.add(
        marker2
      );

      const label =
        makeMeasurementLabel(
          distance
        );

      label.position
        .copy(first)
        .add(second)
        .multiplyScalar(
          0.5
        );

      label.position.y +=
        0.15;

      measurementGroup.add(
        label
      );
    }

    const raycaster =
      new THREE.Raycaster();

    const mouse =
      new THREE.Vector2();

    let firstPoint = null;
    let secondPoint = null;

    function handlePointerDown(
      event
    ) {
      if (
        !measureMode
      ) {
        return;
      }

      const rect =
        renderer.domElement.getBoundingClientRect();

      mouse.x =
        ((event.clientX -
          rect.left) /
          rect.width) *
          2 -
        1;

      mouse.y =
        -(
          ((event.clientY -
            rect.top) /
            rect.height) *
            2 -
          1
        );

      raycaster.setFromCamera(
        mouse,
        camera
      );

      const hits =
        raycaster.intersectObjects(
          selectableAtoms,
          false
        );

      if (
        !hits.length
      ) {
        return;
      }

      const selected =
        hits[0].object;

      const point =
        selected.userData.atomPosition.clone();

      if (
        !firstPoint
      ) {
        firstPoint =
          point;

        setMeasurement({
          first: point,
          second: null,
          distance: null,
        });

        return;
      }

      if (
        !secondPoint
      ) {
        secondPoint =
          point;

        const distance =
          firstPoint.distanceTo(
            secondPoint
          );

        createMeasurement(
          firstPoint,
          secondPoint
        );

        setMeasurement({
          first: firstPoint,
          second:
            secondPoint,
          distance,
        });

        return;
      }

      firstPoint =
        point;

      secondPoint =
        null;

      measurementGroup.clear();

      setMeasurement({
        first: point,
        second: null,
        distance: null,
      });
    }

    renderer.domElement.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    /*
    =====================================================
    CAMERA
    =====================================================
    */

    const baseDistance =
      Math.max(
        currentA,
        currentB,
        currentC
      ) * 2.8;

    const distance =
      latticeMode
        ? Math.max(
            currentA,
            currentB,
            currentC
          ) * 5.4
        : baseDistance;

    controls.maxDistance =
      latticeMode
        ? 40
        : 15;

    camera.position.set(
      distance,
      distance * 0.8,
      distance
    );

    controls.target.set(
      0,
      0,
      0
    );

    controls.update();

    let animationId;

    function animate() {
      animationId =
        requestAnimationFrame(
          animate
        );

      if (
        autoRotate
      ) {
        group.rotation.y +=
          0.004;

        measurementGroup.rotation.y +=
          0.004;
      }

      controls.update();

      renderer.render(
        scene,
        camera
      );
    }

    animate();

    function handleResize() {
      const w =
        container.clientWidth;

      const h =
        container.clientHeight;

      if (
        w <= 0 ||
        h <= 0
      ) {
        return;
      }

      camera.aspect =
        w / h;

      camera.updateProjectionMatrix();

      renderer.setSize(
        w,
        h
      );
    }

    const resizeObserver =
      new ResizeObserver(
        handleResize
      );

    resizeObserver.observe(
      container
    );

    return () => {
      cancelAnimationFrame(
        animationId
      );

      if (
        latticeAnimationId
      ) {
        cancelAnimationFrame(
          latticeAnimationId
        );
      }

      renderer.domElement.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      resizeObserver.disconnect();

      controls.dispose();

      group.traverse(
        (object) => {
          if (
            object.geometry
          ) {
            object.geometry.dispose();
          }

          if (
            object.material
          ) {
            if (
              Array.isArray(
                object.material
              )
            ) {
              object.material.forEach(
                (m) => {
                  if (m.map) {
                    m.map.dispose();
                  }

                  m.dispose();
                }
              );
            } else {
              if (
                object.material.map
              ) {
                object.material.map.dispose();
              }

              object.material.dispose();
            }
          }
        }
      );

      measurementGroup.clear();

      renderer.dispose();

      if (
        renderer.domElement.parentNode ===
        container
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, [
    structure,
    radius,
    manual,
    a,
    b,
    c,
    alpha,
    beta,
    gamma,
    showEdges,
    showDimensions,
    showRadius,
    showContact,
    showContribution,
    autoRotate,
    measureMode,
    latticeMode,
  ]);

  function clearMeasurement() {
    setMeasurement(null);
    setMeasureMode(false);
  }

  let contributionFormula =
    "8 × 1/8 = 1";

  let contributionText =
    "8 corner atoms contribute one complete atom.";

  if (
    structure === "BCC"
  ) {
    contributionFormula =
      "8 × 1/8 + 1 = 2";

    contributionText =
      "Corners contribute 1 and the body-centre atom contributes 1.";
  }

  if (
    structure === "FCC"
  ) {
    contributionFormula =
      "8 × 1/8 + 6 × 1/2 = 4";

    contributionText =
      "Corners contribute 1 and six face atoms contribute 3.";
  }

  return (
    <main className="simulator-page">

      <section className="simulator-section">

        <aside className="simulator-controls">

          <div className="simulator-heading">

            <span>
              3D PRACTICAL
            </span>

            <h1>
              Crystal Simulator
            </h1>

            <p>
              Explore SC, BCC and FCC
              unit cells interactively.
            </p>

          </div>

          <div className="control-group">

            <label>
              Crystal Structure
            </label>

            <div className="structure-buttons">

              {[
                "SC",
                "BCC",
                "FCC",
              ].map(
                (type) => (
                  <button
                    key={type}
                    className={
                      structure === type
                        ? "selected"
                        : ""
                    }
                    onClick={() => {
                      setStructure(
                        type
                      );

                      clearMeasurement();
                    }}
                  >
                    {type}
                  </button>
                )
              )}

            </div>

          </div>

          <div className="control-group">

            <label>
              Parameter Mode
            </label>

            <div className="mode-buttons">

              <button
                className={
                  !manual
                    ? "selected"
                    : ""
                }
                onClick={() => {
                  setManual(false);
                  clearMeasurement();
                }}
              >
                Atomic Radius
              </button>

              <button
                className={
                  manual
                    ? "selected"
                    : ""
                }
                onClick={() => {
                  setManual(true);
                  clearMeasurement();
                }}
              >
                Manual
              </button>

            </div>

          </div>

          {!manual && (
            <div className="control-group">

              <label>
                Atomic Radius
              </label>

              <input
                type="range"
                min="0.2"
                max="1.5"
                step="0.05"
                value={radius}
                onChange={(e) => {
                  setRadius(
                    Number(
                      e.target.value
                    )
                  );

                  clearMeasurement();
                }}
              />

              <div className="range-value">
                {radius.toFixed(2)}
              </div>

              <div className="formula">

                {structure ===
                  "SC" &&
                  "a = 2r"}

                {structure ===
                  "BCC" &&
                  "a = 4r / √3"}

                {structure ===
                  "FCC" &&
                  "a = 2√2r"}

              </div>

            </div>
          )}

          {manual && (
            <div className="control-group">

              <label>
                Lattice Parameters
              </label>

              <div className="manual-grid">

                <Parameter
                  name="a"
                  value={a}
                  min="1"
                  max="5"
                  step="0.1"
                  onChange={setA}
                />

                <Parameter
                  name="b"
                  value={b}
                  min="1"
                  max="5"
                  step="0.1"
                  onChange={setB}
                />

                <Parameter
                  name="c"
                  value={c}
                  min="1"
                  max="5"
                  step="0.1"
                  onChange={setC}
                />

                <Parameter
                  name="α"
                  value={alpha}
                  min="60"
                  max="120"
                  step="1"
                  onChange={setAlpha}
                />

                <Parameter
                  name="β"
                  value={beta}
                  min="60"
                  max="120"
                  step="1"
                  onChange={setBeta}
                />

                <Parameter
                  name="γ"
                  value={gamma}
                  min="60"
                  max="120"
                  step="1"
                  onChange={setGamma}
                />

              </div>

            </div>
          )}

          <div className="control-group">

            <label>
              Visualization
            </label>

            <Check
              text="Cell Edges"
              checked={showEdges}
              onChange={setShowEdges}
            />

            <Check
              text="Dimensions"
              checked={showDimensions}
              onChange={
                setShowDimensions
              }
            />

            <Check
              text="Radius"
              checked={showRadius}
              onChange={setShowRadius}
            />

            <Check
              text="Contact Geometry"
              checked={showContact}
              onChange={
                setShowContact
              }
            />

          </div>

          <div className="atom-card">

            <h3>
              Atoms per Unit Cell
            </h3>

            <p>
              See how atoms contribute
              to one complete unit cell.
            </p>

            <button
              className={
                showContribution
                  ? "contribution-button active"
                  : "contribution-button"
              }
              onClick={() =>
                setShowContribution(
                  !showContribution
                )
              }
            >
              {showContribution
                ? "Hide Cut View"
                : "Show Atoms per Unit Cell"}
            </button>

            {showContribution && (
              <div className="contribution-box">

                <div>
                  <span>
                    Corner Atom
                  </span>

                  <strong>
                    1/8
                  </strong>
                </div>

                <div>
                  <span>
                    Face Atom
                  </span>

                  <strong>
                    1/2
                  </strong>
                </div>

                <div>
                  <span>
                    Body Centre
                  </span>

                  <strong>
                    1
                  </strong>
                </div>

                <hr />

                <strong className="big-formula">
                  {contributionFormula}
                </strong>

                <small>
                  {contributionText}
                </small>

              </div>
            )}

          </div>

          <div className="lattice-card">

            <h3>
              Crystal Lattice
            </h3>

            <p>
              Expand the unit cell into a repeating
              3 × 3 × 3 crystal lattice.
            </p>

            <button
              className={
                latticeMode
                  ? "lattice-button active"
                  : "lattice-button"
              }
              onClick={() => {
                setLatticeMode(
                  !latticeMode
                );

                clearMeasurement();
              }}
            >
              {latticeMode
                ? "Show Single Unit Cell"
                : "Expand to Crystal Lattice"}
            </button>

          </div>

          <div className="measurement-card">

            <h3>
              Distance Measurement
            </h3>

            <p>
              Select any two atoms in the
              3D view to measure the distance.
            </p>

            <button
              className={
                measureMode
                  ? "measure-button active"
                  : "measure-button"
              }
              onClick={() => {
                setMeasureMode(
                  !measureMode
                );

                setMeasurement(
                  null
                );
              }}
            >
              {measureMode
                ? "Select 2 Atoms..."
                : "Measure Distance"}
            </button>

            {measurement?.distance !=
              null && (
              <div className="measurement-result">

                <span>
                  Measured Distance
                </span>

                <strong>
                  d ={" "}
                  {measurement.distance.toFixed(
                    3
                  )}
                </strong>

                <small>
                  Distance between selected
                  atoms.
                </small>

                <button
                  className="clear-measurement"
                  onClick={
                    clearMeasurement
                  }
                >
                  Clear Measurement
                </button>

              </div>
            )}

            {measureMode &&
              !measurement?.distance && (
                <div className="measurement-hint">
                  Click the first atom, then
                  click the second atom.
                </div>
              )}

          </div>

          <div className="control-group">

            <label>
              Structure Information
            </label>

            <div className="stats">

              <Stat
                title="Atoms / Cell"
                value={info.atoms}
              />

              <Stat
                title="Coordination"
                value={
                  info.coordination
                }
              />

              <Stat
                title="APF"
                value={`${(
                  apf * 100
                ).toFixed(1)}%`}
              />

            </div>

          </div>

          <div className="control-group">

            <label>
              Simulation
            </label>

            <Check
              text="Auto Rotate"
              checked={autoRotate}
              onChange={
                setAutoRotate
              }
            />

            <button
              className="reset-button"
              onClick={() => {
                setManual(false);
                setRadius(0.7);
                setA(2);
                setB(2);
                setC(2);
                setAlpha(90);
                setBeta(90);
                setGamma(90);
                setShowContribution(
                  false
                );
                setLatticeMode(
                  false
                );
                clearMeasurement();
              }}
            >
              Reset Parameters
            </button>

          </div>

        </aside>

        <div className="simulator-viewport">

          <div className="viewport-top">

            <div>

              <span>
                CURRENT STRUCTURE
              </span>

              <strong>
                {structure}
              </strong>

            </div>

            <div>
              a ={" "}
              {currentA.toFixed(2)}
              {"   "}
              r ={" "}
              {currentRadius.toFixed(
                2
              )}
            </div>

          </div>

          {showContribution && (
            <div className="contribution-badge">
              ATOM CONTRIBUTION VIEW
            </div>
          )}

          {latticeMode && (
            <div className="lattice-badge">
              3 × 3 × 3 CRYSTAL LATTICE
            </div>
          )}

          {measureMode && (
            <div className="measure-badge">
              CLICK TWO ATOMS TO MEASURE
            </div>
          )}

          <div
            ref={canvasRef}
            className="three-container"
          />

          <div className="viewport-bottom">

            <span>
              Mouse: Rotate
            </span>

            <span>
              Scroll: Zoom
            </span>

            <span>
              Right Click: Pan
            </span>

          </div>

        </div>

      </section>

    </main>
  );
}

function Parameter({
  name,
  value,
  min,
  max,
  step,
  onChange,
}) {
  return (
    <div className="parameter">

      <div>

        <span>
          {name}
        </span>

        <strong>
          {value}
        </strong>

      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) =>
          onChange(
            Number(
              e.target.value
            )
          )
        }
      />

    </div>
  );
}

function Check({
  text,
  checked,
  onChange,
}) {
  return (
    <label className="check-row">

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(
            e.target.checked
          )
        }
      />

      <span>
        {text}
      </span>

    </label>
  );
}

function Stat({
  title,
  value,
}) {
  return (
    <div className="stat">

      <span>
        {title}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}

export default CrystalSimulator;