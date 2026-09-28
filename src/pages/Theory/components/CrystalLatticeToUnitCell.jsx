import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "../../../CSS/CrystalLatticeToUnitCell.css";

function CrystalLatticeToUnitCell() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050f20);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    camera.position.set(7, 5, 8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // -------------------------
    // LIGHTS
    // -------------------------

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 4, 20);
    pointLight.position.set(4, 5, 5);
    scene.add(pointLight);

    // -------------------------
    // MAIN GROUP
    // -------------------------

    const latticeGroup = new THREE.Group();
    scene.add(latticeGroup);

    // -------------------------
    // MATERIALS
    // -------------------------

    const atomMaterial = new THREE.MeshStandardMaterial({
      color: 0x22aaff,
      emissive: 0x073b66,
      emissiveIntensity: 1.5,
      metalness: 0.1,
      roughness: 0.3
    });

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x248bd1,
      transparent: true,
      opacity: 0.65
    });

    const highlightMaterial = new THREE.MeshStandardMaterial({
      color: 0xffc928,
      emissive: 0xff9d00,
      emissiveIntensity: 2,
      metalness: 0.1,
      roughness: 0.25
    });

    const highlightEdgeMaterial = new THREE.LineBasicMaterial({
      color: 0xffd43b,
      transparent: true,
      opacity: 1
    });

    // -------------------------
    // ATOM
    // -------------------------

    const atomGeometry = new THREE.SphereGeometry(0.13, 20, 20);

    // -------------------------
    // LATTICE SETTINGS
    // -------------------------

    const size = 3;
    const spacing = 1.35;

    const atoms = [];
    const edges = [];

    // -------------------------
    // CREATE LATTICE
    // -------------------------

    for (let x = 0; x <= size; x++) {
      for (let y = 0; y <= size; y++) {
        for (let z = 0; z <= size; z++) {

          const atom = new THREE.Mesh(
            atomGeometry,
            atomMaterial.clone()
          );

          atom.position.set(
            (x - size / 2) * spacing,
            (y - size / 2) * spacing,
            (z - size / 2) * spacing
          );

          atom.userData = {
            x,
            y,
            z
          };

          latticeGroup.add(atom);
          atoms.push(atom);

          // X edge
          if (x < size) {
            const start = atom.position.clone();

            const end = new THREE.Vector3(
              start.x + spacing,
              start.y,
              start.z
            );

            const geometry = new THREE.BufferGeometry().setFromPoints([
              start,
              end
            ]);

            const line = new THREE.Line(
              geometry,
              edgeMaterial.clone()
            );

            latticeGroup.add(line);
            edges.push(line);
          }

          // Y edge
          if (y < size) {
            const start = atom.position.clone();

            const end = new THREE.Vector3(
              start.x,
              start.y + spacing,
              start.z
            );

            const geometry = new THREE.BufferGeometry().setFromPoints([
              start,
              end
            ]);

            const line = new THREE.Line(
              geometry,
              edgeMaterial.clone()
            );

            latticeGroup.add(line);
            edges.push(line);
          }

          // Z edge
          if (z < size) {
            const start = atom.position.clone();

            const end = new THREE.Vector3(
              start.x,
              start.y,
              start.z + spacing
            );

            const geometry = new THREE.BufferGeometry().setFromPoints([
              start,
              end
            ]);

            const line = new THREE.Line(
              geometry,
              edgeMaterial.clone()
            );

            latticeGroup.add(line);
            edges.push(line);
          }
        }
      }
    }

    // -------------------------
    // UNIT CELL
    // -------------------------

    const unitCellGroup = new THREE.Group();

    const cellSize = spacing;

    const cellGeometry = new THREE.BoxGeometry(
      cellSize,
      cellSize,
      cellSize
    );

    const cellEdges = new THREE.EdgesGeometry(cellGeometry);

    const cellWireframe = new THREE.LineSegments(
      cellEdges,
      highlightEdgeMaterial
    );

    cellWireframe.scale.set(1.03, 1.03, 1.03);

    unitCellGroup.add(cellWireframe);

    unitCellGroup.position.set(
      -spacing,
      -spacing,
      -spacing
    );

    latticeGroup.add(unitCellGroup);

    // -------------------------
    // HIGHLIGHTED ATOMS
    // -------------------------

    const highlightedAtoms = [];

    atoms.forEach((atom) => {
      const { x, y, z } = atom.userData;

      if (
        x >= 1 &&
        x <= 2 &&
        y >= 1 &&
        y <= 2 &&
        z >= 1 &&
        z <= 2
      ) {
        highlightedAtoms.push(atom);
      }
    });

    // -------------------------
    // CONTROLS
    // -------------------------

    const controls = new OrbitControls(
      camera,
      renderer.domElement
    );

    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 15;

    // -------------------------
    // ANIMATION VARIABLES
    // -------------------------

    let elapsed = 0;

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      elapsed += delta;

      // Slow lattice rotation
      latticeGroup.rotation.y += delta * 0.25;
      latticeGroup.rotation.x =
        Math.sin(elapsed * 0.4) * 0.08;

      // Pulse highlighted cell
      const pulse =
        1 + Math.sin(elapsed * 3) * 0.025;

      unitCellGroup.scale.set(
        pulse,
        pulse,
        pulse
      );

      // Highlight atoms
      highlightedAtoms.forEach((atom) => {
        atom.material.color.lerp(
          highlightMaterial.color,
          0.08
        );

        atom.material.emissive.lerp(
          highlightMaterial.emissive,
          0.08
        );

        atom.scale.setScalar(
          1.15 + Math.sin(elapsed * 3) * 0.05
        );
      });

      controls.update();

      renderer.render(scene, camera);
    };

    animate();

    // -------------------------
    // RESIZE
    // -------------------------

    const handleResize = () => {
      if (!container) return;

      camera.aspect =
        container.clientWidth /
        container.clientHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        container.clientWidth,
        container.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    // -------------------------
    // CLEANUP
    // -------------------------

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );

      controls.dispose();

      renderer.dispose();

      container.removeChild(
        renderer.domElement
      );
    };
  }, []);

  return (
    <section className="lattice-unitcell-demo">

      <div className="demo-header">
        <span>VISUAL EXPLANATION</span>

        <h2>
          From Crystal Lattice to Unit Cell
        </h2>

        <p>
          A crystal lattice is formed by repeating
          the unit cell in three dimensions.
        </p>
      </div>

      <div
        ref={mountRef}
        className="three-container"
      />

      <div className="demo-labels">

        <div className="demo-label lattice-label">
          <span className="label-dot blue"></span>
          Crystal Lattice
        </div>

        <div className="demo-arrow">
          →
        </div>

        <div className="demo-label unit-label">
          <span className="label-dot yellow"></span>
          Unit Cell
        </div>

      </div>

    </section>
  );
}

export default CrystalLatticeToUnitCell;