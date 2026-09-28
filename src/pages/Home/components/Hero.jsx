import { useEffect, useRef } from "react";
import * as THREE from "three";
import "../../../CSS/Hero.css";

function Hero() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      1,
      0.1,
      100
    );

    camera.position.set(4, 4, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(500, 500);

    mountRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const atomGeometry = new THREE.SphereGeometry(0.18, 32, 32);

    const atomMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.8,
    });

    const positions = [
      [-1.5, -1.5, -1.5],
      [1.5, -1.5, -1.5],
      [1.5, 1.5, -1.5],
      [-1.5, 1.5, -1.5],
      [-1.5, -1.5, 1.5],
      [1.5, -1.5, 1.5],
      [1.5, 1.5, 1.5],
      [-1.5, 1.5, 1.5],
    ];

    positions.forEach(([x, y, z]) => {
      const atom = new THREE.Mesh(atomGeometry, atomMaterial);
      atom.position.set(x, y, z);
      group.add(atom);
    });

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x67e8f9,
    });

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    edges.forEach(([a, b]) => {
      const points = [
        new THREE.Vector3(...positions[a]),
        new THREE.Vector3(...positions[b]),
      ];

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, edgeMaterial);

      group.add(line);
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const light = new THREE.PointLight(0xffffff, 3);
    light.position.set(4, 4, 6);
    scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);

      group.rotation.y += 0.006;
      group.rotation.x += 0.003;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();

      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section className="hero">

      <div className="hero-content">
        <h1>
          Explore the World of
          <span> Crystal Structures</span>
        </h1>

        <p>
          Understand unit cells, crystal systems and
          solid-state structures through interactive learning
          and 3D visualization.
        </p>

        {/* <button>Start Learning</button> */}
      </div>

      <div
        className="hero-visual"
        ref={mountRef}
      ></div>

    </section>
  );
}

export default Hero;