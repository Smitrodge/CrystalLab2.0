import { useEffect, useRef } from "react";
import * as THREE from "three";
import "../../../CSS/CrystalSystem.css";

const systems = [
  {
    name: "Cubic",
    edge: "a = b = c",
    angle: "α = β = γ = 90°",
    example: "NaCl",
    type: "cubic"
  },
  {
    name: "Tetragonal",
    edge: "a = b ≠ c",
    angle: "α = β = γ = 90°",
    example: "TiO₂",
    type: "tetragonal"
  },
  {
    name: "Orthorhombic",
    edge: "a ≠ b ≠ c",
    angle: "α = β = γ = 90°",
    example: "Sulfur",
    type: "orthorhombic"
  },
  {
    name: "Monoclinic",
    edge: "a ≠ b ≠ c",
    angle: "α = γ = 90°, β ≠ 90°",
    example: "Gypsum",
    type: "monoclinic"
  },
  {
    name: "Triclinic",
    edge: "a ≠ b ≠ c",
    angle: "α ≠ β ≠ γ ≠ 90°",
    example: "CuSO₄·5H₂O",
    type: "triclinic"
  },
  {
    name: "Hexagonal",
    edge: "a = b ≠ c",
    angle: "α = β = 90°, γ = 120°",
    example: "Graphite",
    type: "hexagonal"
  },
  {
    name: "Rhombohedral",
    edge: "a = b = c",
    angle: "α = β = γ ≠ 90°",
    example: "Calcite",
    type: "rhombohedral"
  }
];

function makeParallelepiped(a, b, c, alpha, beta, gamma) {
  const rad = Math.PI / 180;

  alpha *= rad;
  beta *= rad;
  gamma *= rad;

  const A = new THREE.Vector3(a, 0, 0);

  const B = new THREE.Vector3(
    b * Math.cos(gamma),
    b * Math.sin(gamma),
    0
  );

  const cx = c * Math.cos(beta);

  const cy =
    c *
    (Math.cos(alpha) - Math.cos(beta) * Math.cos(gamma)) /
    Math.sin(gamma);

  const cz = Math.sqrt(
    Math.max(
      0,
      c * c - cx * cx - cy * cy
    )
  );

  const C = new THREE.Vector3(cx, cy, cz);

  const O = new THREE.Vector3(0, 0, 0);
  const AB = A.clone();
  const AC = C.clone();
  const BC = B.clone();

  const vertices = [
    O,
    A,
    B,
    A.clone().add(B),
    C,
    A.clone().add(C),
    B.clone().add(C),
    A.clone().add(B).add(C)
  ];

  const edges = [
    [0, 1],
    [0, 2],
    [0, 4],

    [1, 3],
    [1, 5],

    [2, 3],
    [2, 6],

    [4, 5],
    [4, 6],

    [3, 7],
    [5, 7],
    [6, 7]
  ];

  const positions = [];

  edges.forEach(([i, j]) => {
    positions.push(
      vertices[i].x,
      vertices[i].y,
      vertices[i].z,

      vertices[j].x,
      vertices[j].y,
      vertices[j].z
    );
  });

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );

  return {
    geometry,
    vertices,
    vectors: {
      A: AB,
      B: AC,
      C: BC
    }
  };
}

function createAtom(position, material) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.11, 20, 20),
    material
  );

  mesh.position.copy(position);

  return mesh;
}

function CrystalSystem3D({ type }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    camera.position.set(4.5, 3.5, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setClearColor(0x000000, 0);

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    renderer.domElement.style.display = "block";

    container.appendChild(renderer.domElement);

    const group = new THREE.Group();

    scene.add(group);

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8
    });

    const atomMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x075985,
      emissiveIntensity: 0.35,
      roughness: 0.35
    });

    const centerAtomMaterial = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0x854d0e,
      emissiveIntensity: 0.35
    });

    let cellData;

    /*
      ============================
      CUBIC
      ============================
    */

    if (type === "cubic") {
      cellData = makeParallelepiped(
        2,
        2,
        2,
        90,
        90,
        90
      );
    }

    /*
      ============================
      TETRAGONAL
      a = b ≠ c
      ============================
    */

    if (type === "tetragonal") {
      cellData = makeParallelepiped(
        2,
        2,
        3,
        90,
        90,
        90
      );
    }

    /*
      ============================
      ORTHORHOMBIC
      a ≠ b ≠ c
      ============================
    */

    if (type === "orthorhombic") {
      cellData = makeParallelepiped(
        2.5,
        1.7,
        3,
        90,
        90,
        90
      );
    }

    /*
      ============================
      MONOCLINIC
      α = γ = 90°
      β ≠ 90°
      ============================
    */

    if (type === "monoclinic") {
      cellData = makeParallelepiped(
        2.5,
        1.8,
        2.8,
        90,
        110,
        90
      );
    }

    /*
      ============================
      TRICLINIC
      all angles unequal
      ============================
    */

    if (type === "triclinic") {
      cellData = makeParallelepiped(
        2.4,
        1.9,
        2.7,
        75,
        105,
        82
      );
    }

    /*
      ============================
      RHOMBOHEDRAL
      a = b = c
      α = β = γ ≠ 90°
      ============================
    */

    if (type === "rhombohedral") {
      cellData = makeParallelepiped(
        2.2,
        2.2,
        2.2,
        75,
        75,
        75
      );
    }

    /*
      ============================
      HEXAGONAL
      ============================
    */

    if (type === "hexagonal") {
      const radius = 1.35;
      const height = 2.7;

      const bottom = [];
      const top = [];

      for (let i = 0; i < 6; i++) {
        const angle =
          (Math.PI / 3) * i +
          Math.PI / 6;

        bottom.push(
          new THREE.Vector3(
            radius * Math.cos(angle),
            -height / 2,
            radius * Math.sin(angle)
          )
        );

        top.push(
          new THREE.Vector3(
            radius * Math.cos(angle),
            height / 2,
            radius * Math.sin(angle)
          )
        );
      }

      const positions = [];

      for (let i = 0; i < 6; i++) {
        const next = (i + 1) % 6;

        positions.push(
          bottom[i].x,
          bottom[i].y,
          bottom[i].z,

          bottom[next].x,
          bottom[next].y,
          bottom[next].z
        );

        positions.push(
          top[i].x,
          top[i].y,
          top[i].z,

          top[next].x,
          top[next].y,
          top[next].z
        );

        positions.push(
          bottom[i].x,
          bottom[i].y,
          bottom[i].z,

          top[i].x,
          top[i].y,
          top[i].z
        );
      }

      const geometry = new THREE.BufferGeometry();

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
          positions,
          3
        )
      );

      group.add(
        new THREE.LineSegments(
          geometry,
          edgeMaterial
        )
      );

      bottom.forEach((point) => {
        group.add(
          createAtom(point, atomMaterial)
        );
      });

      top.forEach((point) => {
        group.add(
          createAtom(point, atomMaterial)
        );
      });

      const bottomCenter = new THREE.Vector3(
        0,
        -height / 2,
        0
      );

      const topCenter = new THREE.Vector3(
        0,
        height / 2,
        0
      );

      group.add(
        createAtom(
          bottomCenter,
          centerAtomMaterial
        )
      );

      group.add(
        createAtom(
          topCenter,
          centerAtomMaterial
        )
      );
    }

    /*
      ============================
      OTHER PARALLELEPIPEDS
      ============================
    */

    if (cellData) {
      const cell = new THREE.LineSegments(
        cellData.geometry,
        edgeMaterial
      );

      group.add(cell);

      cellData.vertices.forEach((vertex) => {
        group.add(
          createAtom(
            vertex.clone(),
            atomMaterial
          )
        );
      });
    }

    /*
      ============================
      LIGHTING
      ============================
    */

    const ambientLight =
      new THREE.AmbientLight(
        0xffffff,
        1.8
      );

    scene.add(ambientLight);

    const pointLight =
      new THREE.PointLight(
        0xffffff,
        2.5
      );

    pointLight.position.set(
      4,
      5,
      5
    );

    scene.add(pointLight);

    /*
      ============================
      CENTER OBJECT
      ============================
    */

    const box = new THREE.Box3().setFromObject(
      group
    );

    const center = new THREE.Vector3();

    box.getCenter(center);

    group.position.sub(center);

    /*
      ============================
      RESIZE
      ============================
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
          height
        );
      });

    resizeObserver.observe(container);

    /*
      ============================
      ANIMATION
      ============================
    */

    let animationId;

    const animate = () => {
      animationId =
        requestAnimationFrame(
          animate
        );

      group.rotation.y += 0.004;

      group.rotation.x += 0.001;

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    /*
      ============================
      CLEANUP
      ============================
    */

    return () => {
      cancelAnimationFrame(
        animationId
      );

      resizeObserver.disconnect();

      scene.traverse(
        (object) => {
          if (object.geometry) {
            object.geometry.dispose();
          }

          if (object.material) {
            if (
              Array.isArray(
                object.material
              )
            ) {
              object.material.forEach(
                (material) =>
                  material.dispose()
              );
            } else {
              object.material.dispose();
            }
          }
        }
      );

      renderer.dispose();

      if (
        renderer.domElement
          .parentNode === container
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, [type]);

  return (
    <div
      className="crystal-system-three"
      ref={containerRef}
    />
  );
}

function CrystalSystem() {
  return (
    <section className="crystal-system-section">

      <div className="crystal-system-header">

        <span className="crystal-system-label">
          CRYSTAL STRUCTURE
        </span>

        <h1>
          Crystal Systems
        </h1>

        <p>
          A crystal system is a classification
          of crystals based on the geometry of
          their unit cells. There are
          <strong> seven crystal systems</strong>,
          which are distinguished by their edge
          lengths and axial angles.
        </p>

      </div>

      <div className="crystal-system-table-wrapper">

        <table className="crystal-system-table">

          <thead>
            <tr>
              <th>
                Crystal System
              </th>

              <th>
                Edge Length
              </th>

              <th>
                Axial Angle
              </th>

              <th>
                Example
              </th>

              <th>
                3D View
              </th>
            </tr>
          </thead>

          <tbody>

            {systems.map(
              (system) => (
                <tr
                  key={system.name}
                >

                  <td className="system-name">
                    {system.name}
                  </td>

                  <td>
                    {system.edge}
                  </td>

                  <td>
                    {system.angle}
                  </td>

                  <td>
                    {system.example}
                  </td>

                  <td>

                    <div className="table-3d-view">

                      <CrystalSystem3D
                        type={
                          system.type
                        }
                      />

                    </div>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}

export default CrystalSystem;