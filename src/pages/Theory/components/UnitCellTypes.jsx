import { useEffect, useRef } from "react";
import * as THREE from "three";
import "../../../CSS/UnitCellTypes.css";

function UnitCell3D({ type }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      1,
      0.1,
      100
    );

    camera.position.set(4, 3.5, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const atomGeometry = new THREE.SphereGeometry(0.16, 32, 32);

    const atomMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x075985,
      emissiveIntensity: 0.6,
      roughness: 0.35,
      metalness: 0.2
    });

    const centerMaterial = new THREE.MeshStandardMaterial({
      color: 0xa78bfa,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.7,
      roughness: 0.3
    });

    const atoms = [];

    const addAtom = (x, y, z, material = atomMaterial) => {
      const atom = new THREE.Mesh(atomGeometry, material);
      atom.position.set(x, y, z);
      group.add(atom);
      atoms.push(atom);
    };

    const corners = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1]
    ];

    corners.forEach(([x, y, z]) => {
      addAtom(x, y, z);
    });

    if (type === "body") {
      addAtom(0, 0, 0, centerMaterial);
    }

    if (type === "face") {
      addAtom(0, 0, -1, centerMaterial);
      addAtom(0, 0, 1, centerMaterial);
      addAtom(0, -1, 0, centerMaterial);
      addAtom(0, 1, 0, centerMaterial);
      addAtom(-1, 0, 0, centerMaterial);
      addAtom(1, 0, 0, centerMaterial);
    }

    if (type === "end") {
      addAtom(0, 0, -1, centerMaterial);
      addAtom(0, 0, 1, centerMaterial);
    }

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.7
    });

    const edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],

      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],

      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7]
    ];

    edges.forEach(([a, b]) => {
      const points = [
        new THREE.Vector3(...corners[a]),
        new THREE.Vector3(...corners[b])
      ];

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const line = new THREE.Line(geometry, edgeMaterial);

      group.add(line);
    });

    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      1.5
    );

    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(
      0x38bdf8,
      4,
      20
    );

    pointLight.position.set(3, 4, 4);
    scene.add(pointLight);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    resize();

    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      group.rotation.y += 0.004;
      group.rotation.x += 0.0015;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();

      atoms.forEach((atom) => {
        atom.geometry.dispose();
        atom.material.dispose();
      });

      renderer.dispose();

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(
          renderer.domElement
        );
      }
    };
  }, [type]);

  return <div ref={mountRef} className="unit-type-three"></div>;
}

function UnitCellTypeCard({ title, type, children }) {
  return (
    <div className="unit-type-card">

      <div className="unit-type-info">

        <h3>{title}</h3>

        <p>
          {children}
        </p>

        {/* <button className="unit-2d-button">
          Open 3D View →
        </button> */}

      </div>

      <div className="unit-type-visual">
        <UnitCell3D type={type} />
      </div>

    </div>
  );
}

function UnitCellTypes() {
  return (
    <section className="unit-types-section">

      <div className="unit-types-header">

        <span className="unit-types-label">
          UNIT CELL CLASSIFICATION
        </span>

        <h2>Types of Unit Cells</h2>

        <p>
          Unit cells are classified according to the position
          of lattice points within the unit cell.
        </p>

      </div>

      {/* TREE */}

      {/* TREE */}

<div className="unit-types-tree">

  <div className="tree-root">
    <span className="tree-dot"></span>
    <span>Unit Cell</span>
  </div>

  <div className="tree-branches">

    {/* Primitive */}
    <div className="tree-main-item">
      <span className="tree-horizontal"></span>
      <span className="tree-dot"></span>
      <span>Primitive Unit Cell</span>
    </div>

    {/* Centred */}
    <div className="centred-tree">

      <div className="tree-main-item">
        <span className="tree-horizontal"></span>
        <span className="tree-dot"></span>
        <span>Centred Unit Cell</span>
      </div>

      <div className="centred-children">

        <div className="tree-sub-item">
          <span className="tree-sub-horizontal"></span>
          <span className="tree-dot small"></span>
          <span>Body-Centered Unit Cell</span>
        </div>

        <div className="tree-sub-item">
          <span className="tree-sub-horizontal"></span>
          <span className="tree-dot small"></span>
          <span>Face-Centered Unit Cell</span>
        </div>

        <div className="tree-sub-item">
          <span className="tree-sub-horizontal"></span>
          <span className="tree-dot small"></span>
          <span>End-Centered Unit Cell</span>
        </div>

      </div>

    </div>

  </div>

</div>

      {/* PRIMITIVE */}

      <div className="unit-type-group">

        <UnitCellTypeCard
          title="Primitive Unit Cell"
          type="primitive"
        >
          A primitive unit cell contains lattice points only at
          the corners of the unit cell. Each corner atom is shared
          by eight neighboring unit cells.
        </UnitCellTypeCard>

      </div>

      {/* CENTRED */}

      <div className="centred-section">

        <div className="centred-heading">
          <span></span>
          <h3>Centred Unit Cells</h3>
        </div>

        <UnitCellTypeCard
          title="Body-Centered Unit Cell"
          type="body"
        >
          A body-centered unit cell has lattice points at all
          corners and one additional lattice point at the center
          of the unit cell.
        </UnitCellTypeCard>

        <UnitCellTypeCard
          title="Face-Centered Unit Cell"
          type="face"
        >
          A face-centered unit cell has lattice points at all
          corners and at the center of every face.
        </UnitCellTypeCard>

        <UnitCellTypeCard
          title="End-Centered Unit Cell"
          type="end"
        >
          An end-centered unit cell has lattice points at all
          corners and additional lattice points at the centers
          of two opposite faces.
        </UnitCellTypeCard>

      </div>

    </section>
  );
}

export default UnitCellTypes;