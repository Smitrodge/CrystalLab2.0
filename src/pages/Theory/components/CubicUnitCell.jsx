import { useEffect, useRef } from "react";
import * as THREE from "three";
import "../../../CSS/CubicUnitCell.css";

function CubicModel({ type }) {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            45,
            1,
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

        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";

        mount.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        // -------------------------
        // Unit Cell Geometry
        // -------------------------

        const size = 2;

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

        // -------------------------
        // Edges
        // -------------------------

        const edgeMaterial = new THREE.LineBasicMaterial({
            color: 0xa78bfa,
            transparent: true,
            opacity: 0.9,
            depthTest: false
        });

        const edgePoints = [
            [-1, -1, -1],
            [1, -1, -1],

            [1, -1, -1],
            [1, 1, -1],

            [1, 1, -1],
            [-1, 1, -1],

            [-1, 1, -1],
            [-1, -1, -1],

            [-1, -1, 1],
            [1, -1, 1],

            [1, -1, 1],
            [1, 1, 1],

            [1, 1, 1],
            [-1, 1, 1],

            [-1, 1, 1],
            [-1, -1, 1],

            [-1, -1, -1],
            [-1, -1, 1],

            [1, -1, -1],
            [1, -1, 1],

            [1, 1, -1],
            [1, 1, 1],

            [-1, 1, -1],
            [-1, 1, 1]
        ];

        const edgeGeometry = new THREE.BufferGeometry();

        edgeGeometry.setFromPoints(
            edgePoints.map(
                ([x, y, z]) =>
                    new THREE.Vector3(x, y, z)
            )
        );

        const edges = new THREE.LineSegments(
            edgeGeometry,
            edgeMaterial
        );

        group.add(edges);

        // -------------------------
        // Atom Geometry
        // -------------------------

        const blueAtomGeometry = new THREE.SphereGeometry(
            1.0,
            32,
            32
        );

        const yellowAtomGeometry = new THREE.SphereGeometry(
            0.50,
            32,
            32
        );

        // -------------------------
        // Atom Outline
        // -------------------------

        const blueOutlineGeometry = new THREE.SphereGeometry(
            1.05,
            32,
            32
        );

        const yellowOutlineGeometry = new THREE.SphereGeometry(
            0.55,
            32,
            32
        );

        const outlineMaterial = new THREE.MeshBasicMaterial({
            color: 0x020617,
            side: THREE.BackSide
        });

        // -------------------------
        // Atom Materials
        // -------------------------

        const atomMaterial = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x075985,
            emissiveIntensity: 0.6,
            metalness: 0.25,
            roughness: 0.25
        });

        const centerMaterial = new THREE.MeshStandardMaterial({
            color: 0xfacc15,
            emissive: 0xca8a04,
            emissiveIntensity: 0.7,
            metalness: 0.2,
            roughness: 0.25
        });

        // -------------------------
        // Create Atom
        // -------------------------

        const createAtom = (
            x,
            y,
            z,
            atomGeometry,
            outlineGeometry,
            material
        ) => {
            const outline = new THREE.Mesh(
                outlineGeometry,
                outlineMaterial
            );

            outline.position.set(x, y, z);

            group.add(outline);

            const atom = new THREE.Mesh(
                atomGeometry,
                material
            );

            atom.position.set(x, y, z);

            group.add(atom);
        };

        // -------------------------
        // Corner Atoms
        // -------------------------

        corners.forEach(([x, y, z]) => {
            createAtom(
                x,
                y,
                z,
                blueAtomGeometry,
                blueOutlineGeometry,
                atomMaterial
            );
        });

        // -------------------------
        // BCC
        // -------------------------

        if (type === "bcc") {
            createAtom(
                0,
                0,
                0,
                yellowAtomGeometry,
                yellowOutlineGeometry,
                centerMaterial
            );
        }

        // -------------------------
        // FCC
        // -------------------------

        if (type === "fcc") {
            const faceCenters = [
                [0, 0, 1],
                [0, 0, -1],

                [0, 1, 0],
                [0, -1, 0],

                [1, 0, 0],
                [-1, 0, 0]
            ];

            faceCenters.forEach(([x, y, z]) => {
                createAtom(
                    x,
                    y,
                    z,
                    yellowAtomGeometry,
                    yellowOutlineGeometry,
                    centerMaterial
                );
            });
        }

        // -------------------------
        // Lighting
        // -------------------------

        const ambientLight = new THREE.AmbientLight(
            0xffffff,
            1.5
        );

        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(
            0xffffff,
            2.5
        );

        pointLight.position.set(4, 5, 6);

        scene.add(pointLight);

        // -------------------------
        // Resize
        // -------------------------

        const resize = () => {
            const width = mount.clientWidth;
            const height = mount.clientHeight;

            if (!width || !height) return;

            camera.aspect = width / height;

            camera.updateProjectionMatrix();

            renderer.setSize(
                width,
                height,
                false
            );
        };

        const resizeObserver =
            new ResizeObserver(resize);

        resizeObserver.observe(mount);

        resize();

        // -------------------------
        // Animation
        // -------------------------

        let animationId;

        const animate = () => {
            animationId =
                requestAnimationFrame(animate);

            group.rotation.y += 0.006;
            group.rotation.x += 0.002;

            renderer.render(
                scene,
                camera
            );
        };

        animate();

        // -------------------------
        // Cleanup
        // -------------------------

        return () => {
            cancelAnimationFrame(animationId);

            resizeObserver.disconnect();

            blueAtomGeometry.dispose();
            yellowAtomGeometry.dispose();

            blueOutlineGeometry.dispose();
            yellowOutlineGeometry.dispose();

            atomMaterial.dispose();
            centerMaterial.dispose();

            outlineMaterial.dispose();

            edgeGeometry.dispose();
            edgeMaterial.dispose();

            renderer.dispose();

            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(
                    renderer.domElement
                );
            }
        };
    }, [type]);

    return (
        <div
            ref={mountRef}
            className="cubic-model"
        />
    );
}

function CubicUnitCell() {
    return (
        <section className="cubic-unit-cell-section">

            {/* Header */}

            <div className="cubic-header">

                <span className="section-label">
                    CRYSTAL STRUCTURE
                </span>

                <h1>Cubic Unit Cell</h1>

                <p>
                    The cubic unit cell is a special type of
                    unit cell in which all three edge lengths
                    are equal and all three axial angles are
                    90°.
                </p>

            </div>

            {/* Characteristics */}

            <div className="cubic-characteristics">

                <div className="characteristic-card">

                    <span>a</span>

                    <h3>Edge Length</h3>

                    <p>
                        a = b = c
                    </p>

                </div>

                <div className="characteristic-card">

                    <span>90°</span>

                    <h3>Axial Angles</h3>

                    <p>
                        α = β = γ = 90°
                    </p>

                </div>

                <div className="characteristic-card">

                    <span>3</span>

                    <h3>Main Types</h3>

                    <p>
                        SC, BCC and FCC
                    </p>

                </div>

            </div>

            {/* Types */}

            <div className="cubic-types">

                <div className="cubic-section-heading">

                    <h2>
                        Types of Cubic Unit Cell
                    </h2>

                    <p>
                        Cubic crystal system contains three
                        important unit-cell arrangements.
                    </p>

                </div>

                {/* SC */}

                <article className="cubic-type-card">

                    <div className="cubic-type-info">

                        <span className="type-number">
                            01
                        </span>

                        <h3>
                            Simple Cubic (SC)
                        </h3>

                        <p>
                            In a simple cubic unit cell, atoms are
                            present only at the eight corners of
                            the cube.
                        </p>

                        <div className="formula-box">

                            <div>
                                <span>
                                    Atoms / Unit Cell
                                </span>

                                <strong>
                                    1
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Coordination Number
                                </span>

                                <strong>
                                    6
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Packing Efficiency
                                </span>

                                <strong>
                                    52.4%
                                </strong>
                            </div>

                        </div>

                        <div className="equation-box">

                            <span>
                                Relation between edge length and radius
                            </span>

                            <strong>
                                a = 2r
                            </strong>

                        </div>

                    </div>

                    <div className="cubic-type-visual">
                        <CubicModel type="sc" />
                    </div>

                </article>

                {/* BCC */}

                <article className="cubic-type-card">

                    <div className="cubic-type-info">

                        <span className="type-number">
                            02
                        </span>

                        <h3>
                            Body-Centered Cubic (BCC)
                        </h3>

                        <p>
                            In a body-centered cubic unit cell,
                            atoms are present at the eight corners
                            and one additional atom is present at
                            the center of the cube.
                        </p>

                        <div className="formula-box">

                            <div>
                                <span>
                                    Atoms / Unit Cell
                                </span>

                                <strong>
                                    2
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Coordination Number
                                </span>

                                <strong>
                                    8
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Packing Efficiency
                                </span>

                                <strong>
                                    68%
                                </strong>
                            </div>

                        </div>

                        <div className="equation-box">

                            <span>
                                Relation between edge length and radius
                            </span>

                            <strong>
                                √3a = 4r
                            </strong>

                        </div>

                    </div>

                    <div className="cubic-type-visual">
                        <CubicModel type="bcc" />
                    </div>

                </article>

                {/* FCC */}

                <article className="cubic-type-card">

                    <div className="cubic-type-info">

                        <span className="type-number">
                            03
                        </span>

                        <h3>
                            Face-Centered Cubic (FCC)
                        </h3>

                        <p>
                            In a face-centered cubic unit cell,
                            atoms are present at the eight corners
                            and at the center of each of the six
                            faces.
                        </p>

                        <div className="formula-box">

                            <div>
                                <span>
                                    Atoms / Unit Cell
                                </span>

                                <strong>
                                    4
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Coordination Number
                                </span>

                                <strong>
                                    12
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Packing Efficiency
                                </span>

                                <strong>
                                    74%
                                </strong>
                            </div>

                        </div>

                        <div className="equation-box">

                            <span>
                                Relation between edge length and radius
                            </span>

                            <strong>
                                √2a = 4r
                            </strong>

                        </div>

                    </div>

                    <div className="cubic-type-visual">
                        <CubicModel type="fcc" />
                    </div>

                </article>

            </div>

            {/* Atom Contribution */}

            <div className="atom-contribution">

                <div className="cubic-section-heading">

                    <h2>
                        Atoms per Unit Cell
                    </h2>

                    <p>
                        Each atom contributes differently
                        depending on its position in the unit cell.
                    </p>

                </div>

                <div className="contribution-grid">

                    <div className="contribution-card">

                        <h3>
                            Corner Atom
                        </h3>

                        <strong>
                            1/8
                        </strong>

                        <p>
                            Each corner atom is shared by
                            8 neighboring unit cells.
                        </p>

                    </div>

                    <div className="contribution-card">

                        <h3>
                            Face-Centered Atom
                        </h3>

                        <strong>
                            1/2
                        </strong>

                        <p>
                            Each face-centered atom is shared
                            between 2 unit cells.
                        </p>

                    </div>

                    <div className="contribution-card">

                        <h3>
                            Body-Centered Atom
                        </h3>

                        <strong>
                            1
                        </strong>

                        <p>
                            A body-centered atom belongs
                            completely to one unit cell.
                        </p>

                    </div>

                </div>

            </div>

            {/* Summary Table */}

            <div className="cubic-summary">

                <div className="cubic-section-heading">

                    <h2>
                        Cubic Unit Cell Comparison
                    </h2>

                </div>

                <div className="cubic-table-wrapper">

                    <table className="cubic-table">

                        <thead>

                            <tr>

                                <th>Type</th>
                                <th>Corner</th>
                                <th>Face Center</th>
                                <th>Body Center</th>
                                <th>Atoms / Unit Cell</th>
                                <th>Coordination</th>
                                <th>Packing</th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr>

                                <td>SC</td>
                                <td>8</td>
                                <td>0</td>
                                <td>0</td>
                                <td>1</td>
                                <td>6</td>
                                <td>52.4%</td>

                            </tr>

                            <tr>

                                <td>BCC</td>
                                <td>8</td>
                                <td>0</td>
                                <td>1</td>
                                <td>2</td>
                                <td>8</td>
                                <td>68%</td>

                            </tr>

                            <tr>

                                <td>FCC</td>
                                <td>8</td>
                                <td>6</td>
                                <td>0</td>
                                <td>4</td>
                                <td>12</td>
                                <td>74%</td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </section>
    );
}

export default CubicUnitCell;