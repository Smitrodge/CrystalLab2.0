import "../../../CSS/MatterContent.css";

function MatterContent() {
  return (
    <section className="matter-content">

      <div className="matter-breadcrumb">
        <span>⌂</span>
        <span>Theory</span>
        <b>›</b>
        <strong>Matter</strong>
      </div>


      {/* WHAT IS MATTER */}

      <div className="matter-intro">

        <span className="matter-badge">
          BASICS
        </span>

        <h1>What is Matter?</h1>

        <p>
          Matter is anything that has mass and occupies space.
          It is made up of particles and exists in different
          forms depending on the arrangement and movement of
          its particles.
        </p>

      </div>


      {/* MATTER IMAGE */}

      <div className="matter-main-image">
        <div className="image-placeholder">
          <img
            src={`${import.meta.env.BASE_URL}matter.png`}
            alt="Matter"
          />
        </div>
      </div>


      {/* TYPES OF MATTER */}

      <section className="matter-types">

        <h2>Types of Matter</h2>

        <p className="section-description">
          Matter can exist in different physical states based
          on the arrangement and movement of its particles.
        </p>


        {/* TREE */}

        <div className="matter-tree">

          <div className="tree-root">
            Matter
          </div>

          <div className="tree-connector">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="tree-items">

            <div className="tree-item">
              <span className="tree-dot"></span>
              <span>Solid</span>
            </div>

            <div className="tree-item">
              <span className="tree-dot"></span>
              <span>Liquid</span>
            </div>

            <div className="tree-item">
              <span className="tree-dot"></span>
              <span>Gas</span>
            </div>

          </div>

        </div>

      </section>


      {/* SOLID */}

      <section className="matter-state">

        <div className="state-content">

          <div className="state-text">

            <div className="state-heading">
              <span className="state-number">01</span>
              <h2>Solid</h2>
            </div>

            <p>
              A solid has a definite shape and definite volume.
              Its particles are closely packed and have very
              limited movement.
            </p>

          </div>

          <div className="state-image">
            <img src={`${import.meta.env.BASE_URL}solid.jpg`} alt="Solid" />
          </div>

        </div>

      </section>


      {/* LIQUID */}

      <section className="matter-state">

        <div className="state-content">

          <div className="state-text">

            <div className="state-heading">
              <span className="state-number">02</span>
              <h2>Liquid</h2>
            </div>

            <p>
              A liquid has a definite volume but does not have
              a definite shape. Its particles can move past
              one another.
            </p>

          </div>

          <div className="state-image">
            <img src={`${import.meta.env.BASE_URL}liquid.png`} alt="Liquid" />
          </div>

        </div>

      </section>


      {/* GAS */}

      <section className="matter-state">

        <div className="state-content">

          <div className="state-text">

            <div className="state-heading">
              <span className="state-number">03</span>
              <h2>Gas</h2>
            </div>

            <p>
              A gas has neither a definite shape nor a definite
              volume. Its particles are far apart and move freely.
            </p>

          </div>

          <div className="state-image">
           <img src={`${import.meta.env.BASE_URL}gas.png`} alt="Gas" />
          </div>

        </div>

      </section>

    </section>
  );
}

export default MatterContent;