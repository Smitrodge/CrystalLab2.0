import "../../../CSS/TheoryContent.css";

function TheoryContent() {
  return (
    <section className="theory-content">

      {/* BREADCRUMB */}

      <div className="breadcrumb">
        <span>⌂</span>
        <span>Theory</span>
        <b>›</b>
        <span>Solid State</span>
        <b>›</b>
        <strong>Solids</strong>
      </div>


      {/* TOPIC HEADER */}

      <div className="content-header">

        <span className="topic-badge">
          ◉ &nbsp; BASICS
        </span>

        <h1>Solids</h1>

        <p>
          Solids are one of the three fundamental states of matter,
          characterized by a fixed shape and volume due to strong
          intermolecular forces.
        </p>

      </div>


      {/* TABS */}

      <div className="content-tabs">

        <button className="tab active">
          <span>▢</span>
          Overview
        </button>

        <button className="tab">
          <span>♧</span>
          Key Points
        </button>

        <button className="tab">
          <span>▧</span>
          Diagrams
        </button>

        <button className="tab">
          <span>⚗</span>
          Examples
        </button>

      </div>


      {/* MAIN CONTENT */}

      <div className="content-grid">

        {/* EXPLANATION */}

        <article className="explanation-card">

          <h2>What are Solids?</h2>

          <p>
            Solids have a definite shape and volume. The particles
            in a solid are closely packed and have strong forces of
            attraction between them. This results in a rigid
            structure with minimal movement of particles.
          </p>

          <div className="content-divider"></div>

          <h2>Key Characteristics</h2>

          <ul className="characteristics">

            <li>
              <span>✓</span>
              Fixed shape and volume
            </li>

            <li>
              <span>✓</span>
              High density
            </li>

            <li>
              <span>✓</span>
              Strong intermolecular forces
            </li>

            <li>
              <span>✓</span>
              Very low compressibility
            </li>

            <li>
              <span>✓</span>
              Ordered arrangement of particles
            </li>

          </ul>

        </article>


        {/* 3D VISUALIZATION */}

        <article className="visual-card">

          <div className="interaction-hint">
            <span>♧</span>
            Drag to rotate 3D
          </div>

          <div className="zoom-hint">
            <span>⌕</span>
            Scroll to zoom
          </div>

          <div className="crystal-placeholder">
            <div className="crystal-cube">

              <span className="atom a1"></span>
              <span className="atom a2"></span>
              <span className="atom a3"></span>
              <span className="atom a4"></span>
              <span className="atom a5"></span>
              <span className="atom a6"></span>
              <span className="atom a7"></span>
              <span className="atom a8"></span>

              <span className="edge e1"></span>
              <span className="edge e2"></span>
              <span className="edge e3"></span>
              <span className="edge e4"></span>
              <span className="edge e5"></span>
              <span className="edge e6"></span>
              <span className="edge e7"></span>
              <span className="edge e8"></span>
              <span className="edge e9"></span>
              <span className="edge e10"></span>
              <span className="edge e11"></span>
              <span className="edge e12"></span>

            </div>
          </div>


          {/* PARAMETERS */}

          <div className="parameter-card lattice">
            <span>Lattice Parameter</span>
            <strong>a = b = c</strong>
            <small>(nm)</small>
          </div>

          <div className="parameter-card angles">
            <span>Angles</span>
            <strong>α = β = γ</strong>
            <small>90°</small>
          </div>


          {/* EXAMPLE */}

          <div className="example-card">

            <div className="example-icon">
              ◇
            </div>

            <div>
              <h3>Example: Sodium Chloride (NaCl)</h3>

              <p>
                In NaCl, Na⁺ and Cl⁻ ions are arranged in a regular
                3D lattice structure, forming a solid.
              </p>
            </div>

          </div>

        </article>

      </div>


      {/* PREVIOUS / NEXT */}

      <div className="content-navigation">

        <div className="previous">
          <span>←</span>

          <div>
            <small>Previous</small>
            <p>Classification of Solids</p>
          </div>
        </div>

        <div className="next">

          <div>
            <small>Next</small>
            <p>Crystal Lattice</p>
          </div>

          <span>→</span>

        </div>

      </div>

    </section>
  );
}

export default TheoryContent;