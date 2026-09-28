import { useEffect, useRef } from "react";
import * as THREE from "three";
import "../../../CSS/UnitCellContent.css";
import UnitCellTypes from "./UnitCellTypes";

function UnitCellContent() {
  const latticeRef = useRef(null);
  const parameterRef = useRef(null);

  // =====================================================
  // 3D CRYSTAL LATTICE
  // =====================================================

  useEffect(() => {
    const container = latticeRef.current;

    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      50,
      1,
      0.1,
      100
    );

    camera.position.set(7, 5, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setClearColor(0x000000, 0);

    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    container.appendChild(renderer.domElement);

    // Lights

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

    pointLight.position.set(4, 5, 5);

    scene.add(pointLight);

    // Lattice group

    const latticeGroup = new THREE.Group();

    scene.add(latticeGroup);

    const atomGeometry = new THREE.SphereGeometry(
      0.13,
      20,
      20
    );

    const atomMaterial = new THREE.MeshStandardMaterial({
      color: 0x22aaff,
      emissive: 0x073b66,
      emissiveIntensity: 1.5,
      roughness: 0.3
    });

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x248bd1,
      transparent: true,
      opacity: 0.65
    });

    const highlightMaterial = new THREE.LineBasicMaterial({
      color: 0xffc928
    });

    const size = 3;
    const spacing = 1.35;

    const atoms = [];

    // Create lattice

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

          if (x < size) {
            const geometry =
              new THREE.BufferGeometry().setFromPoints([
                atom.position,
                new THREE.Vector3(
                  atom.position.x + spacing,
                  atom.position.y,
                  atom.position.z
                )
              ]);

            latticeGroup.add(
              new THREE.Line(
                geometry,
                edgeMaterial.clone()
              )
            );
          }

          if (y < size) {
            const geometry =
              new THREE.BufferGeometry().setFromPoints([
                atom.position,
                new THREE.Vector3(
                  atom.position.x,
                  atom.position.y + spacing,
                  atom.position.z
                )
              ]);

            latticeGroup.add(
              new THREE.Line(
                geometry,
                edgeMaterial.clone()
              )
            );
          }

          if (z < size) {
            const geometry =
              new THREE.BufferGeometry().setFromPoints([
                atom.position,
                new THREE.Vector3(
                  atom.position.x,
                  atom.position.y,
                  atom.position.z + spacing
                )
              ]);

            latticeGroup.add(
              new THREE.Line(
                geometry,
                edgeMaterial.clone()
              )
            );
          }
        }
      }
    }

    // Highlighted unit cell

    const cellGeometry = new THREE.BoxGeometry(
      spacing,
      spacing,
      spacing
    );

    const cellEdges = new THREE.EdgesGeometry(
      cellGeometry
    );

    const unitCell = new THREE.LineSegments(
      cellEdges,
      highlightMaterial
    );

    unitCell.position.set(
      -spacing,
      -spacing,
      -spacing
    );

    latticeGroup.add(unitCell);

    // Highlight atoms

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
        atom.material.color.set(0xffc928);
        atom.material.emissive.set(0xff9d00);
        atom.material.emissiveIntensity = 1.8;
      }
    });

    // Resize

    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(
        width,
        height,
        false
      );
    });

    resizeObserver.observe(container);

    // Animation

    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      latticeGroup.rotation.y += 0.0025;

      latticeGroup.rotation.x =
        Math.sin(Date.now() * 0.0004) * 0.05;

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);

      resizeObserver.disconnect();

      renderer.dispose();

      if (
        container.contains(renderer.domElement)
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, []);

  // =====================================================
  // SIMPLE PARAMETER UNIT CELL
  // =====================================================

  useEffect(() => {
    const container = parameterRef.current;

    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      1,
      0.1,
      100
    );

    camera.position.set(
      4.2,
      3.2,
      5
    );

    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setClearColor(
      0x000000,
      0
    );

    renderer.domElement.style.display =
      "block";

    renderer.domElement.style.width =
      "100%";

    renderer.domElement.style.height =
      "100%";

    container.appendChild(
      renderer.domElement
    );

    // Lights

    const ambientLight =
      new THREE.AmbientLight(
        0xffffff,
        1.8
      );

    scene.add(ambientLight);

    const pointLight =
      new THREE.PointLight(
        0x38bdf8,
        3.5
      );

    pointLight.position.set(
      4,
      4,
      5
    );

    scene.add(pointLight);

    // Main group

    const group =
      new THREE.Group();

    scene.add(group);

    // Simple cube

    const cubeGeometry =
      new THREE.BoxGeometry(
        2.5,
        2.5,
        2.5
      );

    const cubeEdges =
      new THREE.EdgesGeometry(
        cubeGeometry
      );

    const cubeMaterial =
      new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.95
      });

    const cube =
      new THREE.LineSegments(
        cubeEdges,
        cubeMaterial
      );

    group.add(cube);

    // Corner atoms

    const atomGeometry =
      new THREE.SphereGeometry(
        0.13,
        16,
        16
      );

    const atomMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x075080,
        emissiveIntensity: 1.4
      });

    const positions = [
      [-1.25, -1.25, -1.25],
      [1.25, -1.25, -1.25],
      [1.25, 1.25, -1.25],
      [-1.25, 1.25, -1.25],
      [-1.25, -1.25, 1.25],
      [1.25, -1.25, 1.25],
      [1.25, 1.25, 1.25],
      [-1.25, 1.25, 1.25]
    ];

    positions.forEach((position) => {
      const atom = new THREE.Mesh(
        atomGeometry,
        atomMaterial
      );

      atom.position.set(
        position[0],
        position[1],
        position[2]
      );

      group.add(atom);
    });

    // Dimension lines

    const dimensionMaterial =
      new THREE.LineBasicMaterial({
        color: 0xffc928
      });

    const createDimensionLine = (
      start,
      end
    ) => {
      const geometry =
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...start),
          new THREE.Vector3(...end)
        ]);

      return new THREE.Line(
        geometry,
        dimensionMaterial
      );
    };

    const aLine = createDimensionLine(
      [-1.25, -1.55, -1.25],
      [1.25, -1.55, -1.25]
    );

    const bLine = createDimensionLine(
      [-1.55, -1.25, -1.25],
      [-1.55, 1.25, -1.25]
    );

    const cLine = createDimensionLine(
      [1.55, -1.25, -1.25],
      [1.55, -1.25, 1.25]
    );

    group.add(aLine);
    group.add(bLine);
    group.add(cLine);

    // Resize

    const resizeObserver =
      new ResizeObserver(() => {
        const width =
          container.clientWidth;

        const height =
          container.clientHeight;

        if (!width || !height) return;

        camera.aspect =
          width / height;

        camera.updateProjectionMatrix();

        renderer.setSize(
          width,
          height,
          false
        );
      });

    resizeObserver.observe(container);

    // Animation

    let animationId;

    const animate = () => {
      animationId =
        requestAnimationFrame(
          animate
        );

      group.position.y =
        Math.sin(
          Date.now() * 0.001
        ) * 0.08;

      group.rotation.y += 0.003;

      group.rotation.x =
        Math.sin(
          Date.now() * 0.0008
        ) * 0.04;

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    return () => {
      cancelAnimationFrame(
        animationId
      );

      resizeObserver.disconnect();

      renderer.dispose();

      cubeGeometry.dispose();
      cubeEdges.dispose();
      cubeMaterial.dispose();

      atomGeometry.dispose();
      atomMaterial.dispose();

      dimensionMaterial.dispose();

      if (
        container.contains(
          renderer.domElement
        )
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, []);

  // =====================================================
  // JSX
  // =====================================================

  return (
    <section className="unit-cell-content">

      {/* Breadcrumb */}

      <div className="unit-cell-breadcrumb">
        <span>⌂</span>
        <span>Theory</span>
        <b>›</b>
        <strong>Unit Cell</strong>
      </div>

      {/* Intro */}

      <div className="unit-cell-intro">

        <span className="unit-cell-badge">
          CRYSTAL STRUCTURE
        </span>

        <h1>
          What is a Unit Cell?
        </h1>

        <p>
          A unit cell is the smallest repeating portion
          of a crystal lattice that represents the complete
          crystal structure when repeated in three dimensions.
        </p>

        <p>
          It provides a simple way to describe the arrangement
          of particles in a crystalline solid.
        </p>

      </div>

      {/* Definition */}

      <section className="unit-cell-definition">

        <div className="definition-icon">
          ◈
        </div>

        <div className="definition-content">

          <h2>
            The Basic Idea
          </h2>

          <p>
            A crystal lattice contains a regular and repeating
            arrangement of points. Instead of describing the
            entire crystal, we can study one small repeating
            portion called the <strong>unit cell</strong>.
          </p>

          <p>
            When this unit cell is repeated along the three
            dimensions of space, it generates the complete
            crystal lattice.
          </p>

        </div>

      </section>

      {/* Important Points */}

      <section className="unit-cell-points">

        <div className="unit-point">

          <span>01</span>

          <div>
            <h3>
              Smallest Repeating Unit
            </h3>

            <p>
              The unit cell is the basic repeating portion
              used to describe a crystal structure.
            </p>
          </div>

        </div>

        <div className="unit-point">

          <span>02</span>

          <div>
            <h3>
              Three-Dimensional
            </h3>

            <p>
              A unit cell repeats along the three dimensions
              to form the complete crystal lattice.
            </p>
          </div>

        </div>

        <div className="unit-point">

          <span>03</span>

          <div>
            <h3>
              Defines Crystal Structure
            </h3>

            <p>
              The shape, dimensions and arrangement of a unit
              cell help describe the structure of a crystal.
            </p>
          </div>

        </div>

      </section>

      {/* Transition */}

      <div className="unit-cell-transition">

        <span></span>

        <b>
          FROM CRYSTAL LATTICE TO UNIT CELL
        </b>

        <span></span>

      </div>

      {/* Existing Lattice 3D */}

      <section className="unit-visual-section">

        <div className="visual-heading">

          <span>
            INTERACTIVE 3D
          </span>

          <h2>
            Crystal Lattice → Unit Cell
          </h2>

          <p>
            The highlighted portion represents one unit cell
            inside the crystal lattice.
          </p>

        </div>

        <div
          ref={latticeRef}
          className="lattice-three"
        />

        <div className="visual-legend">

          <span>
            <i className="blue-dot"></i>
            Crystal Lattice
          </span>

          <span>
            <i className="yellow-dot"></i>
            Unit Cell
          </span>

        </div>

      </section>

      {/* =================================================
          PARAMETERS OF UNIT CELL
      ================================================= */}

      <section className="unit-cell-parameters">

        <div className="parameters-heading">

          <span>
            NEXT CONCEPT
          </span>

          <h2>
            Parameters of Unit Cell
          </h2>

          <p>
            The size and shape of a unit cell are described
            using three edge lengths and three angles.
          </p>

        </div>

        <div className="parameters-layout">

          {/* LEFT — THEORY */}

          <div className="parameters-theory">

            <h3>
              Six Parameters
            </h3>

            <p className="parameters-intro">
              A unit cell is described by three edge lengths
              and three angles between those edges.
            </p>

            <div className="parameter-item">

              <span className="parameter-symbol">
                a
              </span>

              <div>
                <h4>
                  Edge Length — a
                </h4>

                <p>
                  Length of the unit cell along one edge.
                </p>
              </div>

            </div>

            <div className="parameter-item">

              <span className="parameter-symbol">
                b
              </span>

              <div>
                <h4>
                  Edge Length — b
                </h4>

                <p>
                  Length of the unit cell along the second edge.
                </p>
              </div>

            </div>

            <div className="parameter-item">

              <span className="parameter-symbol">
                c
              </span>

              <div>
                <h4>
                  Edge Length — c
                </h4>

                <p>
                  Length of the unit cell along the third edge.
                </p>
              </div>

            </div>

            <div className="parameter-item">

              <span className="parameter-symbol">
                α
              </span>

              <div>
                <h4>
                  Angle — α
                </h4>

                <p>
                  Angle between the b and c edges.
                </p>
              </div>

            </div>

            <div className="parameter-item">

              <span className="parameter-symbol">
                β
              </span>

              <div>
                <h4>
                  Angle — β
                </h4>

                <p>
                  Angle between the a and c edges.
                </p>
              </div>

            </div>

            <div className="parameter-item">

              <span className="parameter-symbol">
                γ
              </span>

              <div>
                <h4>
                  Angle — γ
                </h4>

                <p>
                  Angle between the a and b edges.
                </p>
              </div>

            </div>

            {/* STATIC BUTTON */}

            {/* <button className="parameter-explore-btn">
              Explore in 3D
              <span>→</span>
            </button> */}

          </div>

          {/* RIGHT — SIMPLE FLOATING UNIT CELL */}

          <div className="parameter-visual">

            <div className="parameter-visual-label">

              <span>
                3D UNIT CELL
              </span>

              <p>
                Edge lengths & angles
              </p>

            </div>

            <div
              ref={parameterRef}
              className="parameter-three"
            />

            <div className="parameter-floating-info">

              <span>
                <i className="yellow-dot"></i>
                Edge lengths
              </span>

              <span>
                <i className="blue-dot"></i>
                Unit cell
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* Takeaway */}

      <section className="unit-cell-takeaway">

        <span>
          KEY IDEA
        </span>

        <h2>
          Six Parameters Define a Unit Cell
        </h2>

        <p>
          Three edge lengths — a, b and c — describe the
          dimensions of the unit cell, while α, β and γ
          describe the angles between its edges.
        </p>

      </section>

      <UnitCellTypes />

    </section>
  );
}

export default UnitCellContent;