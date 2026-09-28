import "../../../CSS/About.css";

function About() {
  return (
    <section id="about" className="about-section">

      <div className="about-container">

        <div className="about-heading">
          <span>ABOUT CRYSTALLAB</span>

          <h2>
            Understand Crystals.
            <strong> See Them in 3D.</strong>
          </h2>
        </div>

        <div className="about-content">

          <div className="about-text">
            <p>
              CrystalLab is an interactive learning platform designed
              to make crystal structures and unit cells easier to
              understand through visualisation and simulation.
            </p>

            <p>
              Instead of learning crystal structures only through
              diagrams and theory, CrystalLab connects concepts with
              interactive 3D models so that students can explore
              structures and understand how their parameters affect them.
            </p>
          </div>

          <div className="about-highlight">
            <div className="about-line"></div>

            <h3>Learn → Explore → Understand</h3>

            <p>
              From the basics of solid state to SC, BCC and FCC,
              build your understanding step by step.
            </p>
          </div>

        </div>

        <div className="about-bottom">

          <div>
            <span>BUILT FOR</span>
            <h3>Students & Learners</h3>
          </div>

          <div>
            <span>FOCUS</span>
            <h3>Crystal Structures</h3>
          </div>

          <div>
            <span>EXPERIENCE</span>
            <h3>Interactive 3D Learning</h3>
          </div>

        </div>

      </div>

    </section>
  );
}

export default About;