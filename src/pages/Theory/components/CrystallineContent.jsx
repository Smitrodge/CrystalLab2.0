import "../../../CSS/CrystallineContent.css";

function CrystallineContent() {
  return (
    <section className="crystalline-content">

      {/* BREADCRUMB */}
      <div className="crystalline-breadcrumb">
        <span>⌂</span>
        <span>Theory</span>
        <b>›</b>
        <strong>Crystalline Solids</strong>
      </div>

      {/* INTRO */}
      <div className="crystalline-intro">

        <span className="crystalline-badge">
          CRYSTALLINE SOLIDS
        </span>

        <h1>What are Crystalline Solids?</h1>

        <p>
          Crystalline solids are solids in which the constituent
          particles are arranged in a regular and repeating
          three-dimensional pattern.
        </p>

        <p>
          The particles may be atoms, ions, or molecules. Their
          ordered arrangement extends over large distances,
          producing a characteristic property called
          <strong> long-range order.</strong>
        </p>

      </div>

      {/* KEY CONCEPT */}
      <div className="crystalline-concept">

        <div className="concept-item">
          <span>01</span>
          <div>
            <h3>Regular Arrangement</h3>
            <p>
              Particles occupy well-defined positions in an
              organized pattern.
            </p>
          </div>
        </div>

        <div className="concept-item">
          <span>02</span>
          <div>
            <h3>Repeating Pattern</h3>
            <p>
              The arrangement repeats itself throughout the
              crystal.
            </p>
          </div>
        </div>

        <div className="concept-item">
          <span>03</span>
          <div>
            <h3>Long-Range Order</h3>
            <p>
              The ordered arrangement continues over large
              distances in the solid.
            </p>
          </div>
        </div>

      </div>

      {/* EXAMPLES */}
      <section className="crystalline-examples">

        <div className="section-label">
          EXAMPLES
        </div>

        <h2>Examples of Crystalline Solids</h2>

        <div className="example-list">
          <span>NaCl</span>
          <span>Diamond</span>
          <span>Quartz</span>
          <span>Copper</span>
        </div>

      </section>

      {/* CRYSTALLINE SOLID VIDEO */}
      <section className="crystalline-video-section">

        <div className="section-label">
          VISUAL EXPLANATION
        </div>

        <h2>How does a Crystalline Solid Look?</h2>

        <p>
          Observe how particles arrange themselves into a
          regular and repeating three-dimensional structure.
        </p>

        <div className="crystalline-video-box">

          <img
            src={`${import.meta.env.BASE_URL}crystalline_solid_simulation.gif`}
            alt="Crystalline solid particle arrangement simulation"
          />
        </div>

        <div className="video-caption">
          Particles form a regular and repeating arrangement,
          producing long-range order.
        </div>

      </section>


      {/* DIVIDER */}
      <div className="concept-divider">
        <span></span>
        <b>FROM PARTICLES TO STRUCTURE</b>
        <span></span>
      </div>

      {/* CRYSTAL LATTICE */}
      <section className="crystal-lattice-section">

        <div className="section-label">
          NEXT CONCEPT
        </div>

        <h2>Crystal Lattice</h2>

        <p className="lattice-intro">
          The regular arrangement observed in a crystalline
          solid can be represented using a crystal lattice.
        </p>

        <div className="lattice-definition">

          <div className="lattice-icon">
            ✦
          </div>

          <div>
            <h3>What is a Crystal Lattice?</h3>

            <p>
              A crystal lattice is a regular and repeating
              three-dimensional arrangement of points that
              represents the positions of particles in a crystal.
            </p>
          </div>

        </div>

        {/* LATTICE POINT */}
        <div className="lattice-point-section">

          <h3>Lattice Points</h3>

          <p>
            Each point in a crystal lattice is called a
            <strong> lattice point.</strong> It represents the
            position of a constituent particle or a group of
            particles.
          </p>

        </div>

        {/* LATTICE PROPERTIES */}
        <div className="lattice-properties">

          <div>
            <span>01</span>
            <h4>Regular</h4>
            <p>
              Points are arranged in an organized pattern.
            </p>
          </div>

          <div>
            <span>02</span>
            <h4>Repeating</h4>
            <p>
              The arrangement repeats periodically.
            </p>
          </div>

          <div>
            <span>03</span>
            <h4>Three-Dimensional</h4>
            <p>
              The pattern extends along all three dimensions.
            </p>
          </div>

        </div>

      </section>

      {/* CRYSTAL LATTICE VIDEO */}
      <section className="lattice-video-section">

        <div className="section-label">
          VISUAL EXPLANATION
        </div>

        <h2>Visualizing a Crystal Lattice</h2>

        <p>
          The animation shows how lattice points form a regular
          and repeating three-dimensional framework.
        </p>

        <div className="lattice-video-box">

          <img
            src={`${import.meta.env.BASE_URL}crystal_lattice_visualization.gif`}
            alt="Crystal lattice visualization"
          />

        </div>

        <div className="video-caption">
          A crystal lattice extends as a regular repeating
          pattern in three dimensions.
        </div>

      </section>

      {/* NEXT CONCEPT */}
      <div className="next-concept">

        <span>NEXT CONCEPT</span>

        <h3>From Crystal Lattice to Unit Cell</h3>

        <p>
          A crystal lattice is made up of repeating units.
          The smallest repeating portion used to describe
          this structure is called a <strong>Unit Cell.</strong>
        </p>

      </div>

    </section>
  );
}

export default CrystallineContent;