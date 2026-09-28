import { useEffect, useRef } from "react";
import * as THREE from "three";
import "../../../CSS/BravaisLattice.css";

function Bravais3D({
  a,
  b,
  c,
  alpha,
  beta,
  gamma,
  centering,
  hexagonal = false
}) {
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

    camera.position.set(4.8, 3.8, 5.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    scene.add(
      new THREE.AmbientLight(0xffffff, 1.5)
    );

    const pointLight = new THREE.PointLight(
      0x38bdf8,
      3,
      20
    );

    pointLight.position.set(4, 5, 5);
    scene.add(pointLight);

    const atomGeometry = new THREE.SphereGeometry(
      0.14,
      24,
      24
    );

    const cornerMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x075985,
        emissiveIntensity: 0.7,
        roughness: 0.3
      });

    const centerMaterial =
      new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0x854d0e,
        emissiveIntensity: 0.8,
        roughness: 0.3
      });

    const edgeMaterial =
      new THREE.LineBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.9
      });

    const addAtom = (position, material) => {
      const atom = new THREE.Mesh(
        atomGeometry,
        material
      );

      atom.position.copy(position);
      group.add(atom);
    };

    /*
      Converts fractional coordinates
      (u, v, w) into actual 3D coordinates.

      r = uA + vB + wC
    */

    const createVectors = () => {
      const toRad = THREE.MathUtils.degToRad;

      const A = new THREE.Vector3(
        a,
        0,
        0
      );

      const B = new THREE.Vector3(
        b * Math.cos(toRad(gamma)),
        b * Math.sin(toRad(gamma)),
        0
      );

      const cx =
        c * Math.cos(toRad(beta));

      const cy =
        c *
        (
          Math.cos(toRad(alpha)) -
          Math.cos(toRad(beta)) *
          Math.cos(toRad(gamma))
        ) /
        Math.sin(toRad(gamma));

      const cz = Math.sqrt(
        Math.max(
          0,
          c * c - cx * cx - cy * cy
        )
      );

      const C = new THREE.Vector3(
        cx,
        cy,
        cz
      );

      return { A, B, C };
    };

    const { A, B, C } = createVectors();

    const fractionalToCartesian = (
      u,
      v,
      w
    ) => {
      return new THREE.Vector3()
        .addScaledVector(A, u)
        .addScaledVector(B, v)
        .addScaledVector(C, w);
    };

    /*
      Corner positions
    */

    const corners = [
      [0, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 0],
      [1, 0, 1],
      [0, 1, 1],
      [1, 1, 1]
    ];

    /*
      Center the complete cell
    */

    const cellCenter =
      fractionalToCartesian(
        0.5,
        0.5,
        0.5
      );

    const toCenteredPosition = (
      u,
      v,
      w
    ) => {
      return fractionalToCartesian(
        u,
        v,
        w
      ).sub(cellCenter);
    };

    /*
      Draw 12 cell edges
    */

    const edges = [
      [0, 1],
      [0, 2],
      [0, 3],

      [1, 4],
      [1, 5],

      [2, 4],
      [2, 6],

      [3, 5],
      [3, 6],

      [4, 7],
      [5, 7],
      [6, 7]
    ];

    const cornerPositions =
      corners.map(([u, v, w]) =>
        toCenteredPosition(u, v, w)
      );

    edges.forEach(([i, j]) => {
      const geometry =
        new THREE.BufferGeometry().setFromPoints([
          cornerPositions[i],
          cornerPositions[j]
        ]);

      const line = new THREE.Line(
        geometry,
        edgeMaterial
      );

      group.add(line);
    });

    /*
      Corner atoms
    */

    cornerPositions.forEach((position) => {
      addAtom(
        position,
        cornerMaterial
      );
    });

    /*
      Body-centered
      (1/2, 1/2, 1/2)
    */

    if (centering === "body") {
      addAtom(
        toCenteredPosition(
          0.5,
          0.5,
          0.5
        ),
        centerMaterial
      );
    }

    /*
      Face-centered

      Six face centers
    */

    if (centering === "face") {
      const faceCenters = [
        [0.5, 0.5, 0],
        [0.5, 0.5, 1],

        [0.5, 0, 0.5],
        [0.5, 1, 0.5],

        [0, 0.5, 0.5],
        [1, 0.5, 0.5]
      ];

      faceCenters.forEach(
        ([u, v, w]) => {
          addAtom(
            toCenteredPosition(
              u,
              v,
              w
            ),
            centerMaterial
          );
        }
      );
    }

    /*
      Base-centered

      Two opposite faces
    */

    if (centering === "base") {
      const baseCenters = [
        [0.5, 0.5, 0],
        [0.5, 0.5, 1]
      ];

      baseCenters.forEach(
        ([u, v, w]) => {
          addAtom(
            toCenteredPosition(
              u,
              v,
              w
            ),
            centerMaterial
          );
        }
      );
    }

    /*
      Hexagonal unit cell

      Actual hexagonal prism
    */

    if (hexagonal) {
      group.clear();

      const radius = a / Math.sqrt(3);
      const height = c;

      const top = [];
      const bottom = [];

      for (let i = 0; i < 6; i++) {
        const angle =
          Math.PI / 3 * i;

        const x =
          radius * Math.cos(angle);

        const y =
          radius * Math.sin(angle);

        bottom.push(
          new THREE.Vector3(
            x,
            y,
            -height / 2
          )
        );

        top.push(
          new THREE.Vector3(
            x,
            y,
            height / 2
          )
        );
      }

      /*
        Hexagonal edges
      */

      for (let i = 0; i < 6; i++) {
        const next = (i + 1) % 6;

        const bottomGeometry =
          new THREE.BufferGeometry()
            .setFromPoints([
              bottom[i],
              bottom[next]
            ]);

        const topGeometry =
          new THREE.BufferGeometry()
            .setFromPoints([
              top[i],
              top[next]
            ]);

        const verticalGeometry =
          new THREE.BufferGeometry()
            .setFromPoints([
              bottom[i],
              top[i]
            ]);

        group.add(
          new THREE.Line(
            bottomGeometry,
            edgeMaterial
          )
        );

        group.add(
          new THREE.Line(
            topGeometry,
            edgeMaterial
          )
        );

        group.add(
          new THREE.Line(
            verticalGeometry,
            edgeMaterial
          )
        );
      }

      /*
        Hexagonal corner atoms
      */

      bottom.forEach((position) =>
        addAtom(
          position,
          cornerMaterial
        )
      );

      top.forEach((position) =>
        addAtom(
          position,
          cornerMaterial
        )
      );
    }

    /*
      Camera framing
    */

    const maxDimension =
      Math.max(a, b, c);

    camera.position.set(
      maxDimension * 2.1,
      maxDimension * 1.6,
      maxDimension * 2.4
    );

    camera.lookAt(0, 0, 0);

    /*
      Resize
    */

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

    /*
      Animation
    */

    let animationFrame;

    const animate = () => {
      animationFrame =
        requestAnimationFrame(animate);

      group.rotation.y += 0.005;
      group.rotation.x += 0.0015;

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      resizeObserver.disconnect();

      renderer.dispose();

      atomGeometry.dispose();
      cornerMaterial.dispose();
      centerMaterial.dispose();
      edgeMaterial.dispose();

      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(
              (material) =>
                material.dispose()
            );
          } else {
            object.material.dispose();
          }
        }
      });

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
    a,
    b,
    c,
    alpha,
    beta,
    gamma,
    centering,
    hexagonal
  ]);

  return (
    <div
      className="bravais-3d"
      ref={mountRef}
    />
  );
}

function BravaisLattice() {
  const lattices = [
    {
      system: "Cubic",
      name: "Primitive",
      a: 2.4,
      b: 2.4,
      c: 2.4,
      alpha: 90,
      beta: 90,
      gamma: 90,
      centering: "primitive",
      edges: "a = b = c",
      angles: "α = β = γ = 90°",
      points: "8 corners",
      atoms: "1"
    },

    {
      system: "Cubic",
      name: "Body-Centered",
      a: 2.4,
      b: 2.4,
      c: 2.4,
      alpha: 90,
      beta: 90,
      gamma: 90,
      centering: "body",
      edges: "a = b = c",
      angles: "α = β = γ = 90°",
      points: "8 corners + 1 body",
      atoms: "2"
    },

    {
      system: "Cubic",
      name: "Face-Centered",
      a: 2.4,
      b: 2.4,
      c: 2.4,
      alpha: 90,
      beta: 90,
      gamma: 90,
      centering: "face",
      edges: "a = b = c",
      angles: "α = β = γ = 90°",
      points: "8 corners + 6 faces",
      atoms: "4"
    },

    {
      system: "Tetragonal",
      name: "Primitive",
      a: 2.4,
      b: 2.4,
      c: 3.5,
      alpha: 90,
      beta: 90,
      gamma: 90,
      centering: "primitive",
      edges: "a = b ≠ c",
      angles: "α = β = γ = 90°",
      points: "8 corners",
      atoms: "1"
    },

    {
      system: "Tetragonal",
      name: "Body-Centered",
      a: 2.4,
      b: 2.4,
      c: 3.5,
      alpha: 90,
      beta: 90,
      gamma: 90,
      centering: "body",
      edges: "a = b ≠ c",
      angles: "α = β = γ = 90°",
      points: "8 corners + 1 body",
      atoms: "2"
    },

    {
      system: "Orthorhombic",
      name: "Primitive",
      a: 2.7,
      b: 1.9,
      c: 3.4,
      alpha: 90,
      beta: 90,
      gamma: 90,
      centering: "primitive",
      edges: "a ≠ b ≠ c",
      angles: "α = β = γ = 90°",
      points: "8 corners",
      atoms: "1"
    },

    {
      system: "Orthorhombic",
      name: "Body-Centered",
      a: 2.7,
      b: 1.9,
      c: 3.4,
      alpha: 90,
      beta: 90,
      gamma: 90,
      centering: "body",
      edges: "a ≠ b ≠ c",
      angles: "α = β = γ = 90°",
      points: "8 corners + 1 body",
      atoms: "2"
    },

    {
      system: "Orthorhombic",
      name: "Face-Centered",
      a: 2.7,
      b: 1.9,
      c: 3.4,
      alpha: 90,
      beta: 90,
      gamma: 90,
      centering: "face",
      edges: "a ≠ b ≠ c",
      angles: "α = β = γ = 90°",
      points: "8 corners + 6 faces",
      atoms: "4"
    },

    {
      system: "Orthorhombic",
      name: "Base-Centered",
      a: 2.7,
      b: 1.9,
      c: 3.4,
      alpha: 90,
      beta: 90,
      gamma: 90,
      centering: "base",
      edges: "a ≠ b ≠ c",
      angles: "α = β = γ = 90°",
      points: "8 corners + 2 faces",
      atoms: "2"
    },

    {
      system: "Monoclinic",
      name: "Primitive",
      a: 2.7,
      b: 1.9,
      c: 3.3,
      alpha: 90,
      beta: 110,
      gamma: 90,
      centering: "primitive",
      edges: "a ≠ b ≠ c",
      angles: "α = γ = 90°, β ≠ 90°",
      points: "8 corners",
      atoms: "1"
    },

    {
      system: "Monoclinic",
      name: "Base-Centered",
      a: 2.7,
      b: 1.9,
      c: 3.3,
      alpha: 90,
      beta: 110,
      gamma: 90,
      centering: "base",
      edges: "a ≠ b ≠ c",
      angles: "α = γ = 90°, β ≠ 90°",
      points: "8 corners + 2 faces",
      atoms: "2"
    },

    {
      system: "Triclinic",
      name: "Primitive",
      a: 2.7,
      b: 1.9,
      c: 3.2,
      alpha: 75,
      beta: 105,
      gamma: 82,
      centering: "primitive",
      edges: "a ≠ b ≠ c",
      angles: "α ≠ β ≠ γ ≠ 90°",
      points: "8 corners",
      atoms: "1"
    },

    {
      system: "Hexagonal",
      name: "Primitive",
      a: 2.4,
      b: 2.4,
      c: 3.8,
      alpha: 90,
      beta: 90,
      gamma: 120,
      centering: "primitive",
      hexagonal: true,
      edges: "a = b ≠ c",
      angles: "α = β = 90°, γ = 120°",
      points: "12 corners",
      atoms: "2"
    },

    {
      system: "Rhombohedral",
      name: "Rhombohedral",
      a: 2.6,
      b: 2.6,
      c: 2.6,
      alpha: 75,
      beta: 75,
      gamma: 75,
      centering: "primitive",
      edges: "a = b = c",
      angles: "α = β = γ ≠ 90°",
      points: "8 corners",
      atoms: "1"
    }
  ];

  return (
    <section className="bravais-section">

      <div className="bravais-header">
        <span className="section-label">
          CRYSTAL STRUCTURE
        </span>

        <h1>Bravais Lattice</h1>

        <p>
          A Bravais lattice is a periodic arrangement
          of lattice points in which every lattice point
          has an identical environment.
        </p>
      </div>

      <div className="bravais-theory">

        <h2>How are 14 Bravais Lattices formed?</h2>

        <p>
          The seven crystal systems have different
          geometric and symmetry requirements.
          Different allowed lattice-center arrangements
          within these systems produce the distinct
          Bravais lattices.
        </p>

        <div className="bravais-flow">

          <div className="flow-box">
            <strong>7</strong>
            <span>Crystal Systems</span>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-box">
            <strong>Centering</strong>
            <span>Primitive / Body / Face / Base</span>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-box highlight">
            <strong>14</strong>
            <span>Distinct Bravais Lattices</span>
          </div>

        </div>

        <h2>Why exactly 14?</h2>

        <p>
          Not every combination of crystal system and
          centering gives a new lattice. Some combinations
          are equivalent or incompatible with the symmetry
          of the crystal system. After these redundancies
          are removed, 14 distinct Bravais lattices remain.
        </p>

        <div className="bravais-count">

          <div>
            <strong>1</strong>
            <span>Triclinic</span>
          </div>

          <div>
            <strong>2</strong>
            <span>Monoclinic</span>
          </div>

          <div>
            <strong>4</strong>
            <span>Orthorhombic</span>
          </div>

          <div>
            <strong>2</strong>
            <span>Tetragonal</span>
          </div>

          <div>
            <strong>3</strong>
            <span>Cubic</span>
          </div>

          <div>
            <strong>1</strong>
            <span>Hexagonal</span>
          </div>

          <div>
            <strong>1</strong>
            <span>Rhombohedral</span>
          </div>

          <div className="total">
            <strong>14</strong>
            <span>Total</span>
          </div>

        </div>

      </div>

      <div className="bravais-table-wrapper">

        <h2>14 Bravais Lattices</h2>

        <div className="table-scroll">

          <table className="bravais-table">

            <thead>
              <tr>
                <th>Crystal System</th>
                <th>Bravais Lattice</th>
                <th>Edge Length</th>
                <th>Axial Angles</th>
                <th>Lattice Points / Unit Cell</th>
                <th>Atoms / Unit Cell</th>
                <th>3D View</th>
              </tr>
            </thead>

            <tbody>

              {lattices.map((lattice, index) => (
                <tr key={index}>

                  <td>
                    <strong>
                      {lattice.system}
                    </strong>
                  </td>

                  <td>
                    {lattice.name}
                  </td>

                  <td>
                    {lattice.edges}
                  </td>

                  <td>
                    {lattice.angles}
                  </td>

                  <td>
                    {lattice.points}
                  </td>

                  <td>
                    <span className="atom-count">
                      {lattice.atoms}
                    </span>
                  </td>

                  <td>
                    <Bravais3D
                      a={lattice.a}
                      b={lattice.b}
                      c={lattice.c}
                      alpha={lattice.alpha}
                      beta={lattice.beta}
                      gamma={lattice.gamma}
                      centering={lattice.centering}
                      hexagonal={lattice.hexagonal}
                    />
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </section>
  );
}

export default BravaisLattice;