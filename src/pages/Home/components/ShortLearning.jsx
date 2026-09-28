import { useEffect } from "react";
import "../../../CSS/LearningPath.css";


function ShortLearning() {
  useEffect(() => {
    const items = document.querySelectorAll(".learning-step");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="learning-path" className="learning-path">

      <div className="learning-intro">
        <span>LEARNING PATH</span>

        <h2>
          From Solids to
          <strong> Unit Cells</strong>
        </h2>

        <p>
          Build your understanding step by step.
          Scroll to explore the structure of crystalline solids.
        </p>
      </div>

      <div className="learning-journey">

        <div className="journey-line"></div>

        <div className="learning-step left">
          <div className="step-number">01</div>

          <div className="step-content">
            <span>START HERE</span>
            <h3>Solid State</h3>
            <p>
              Understand what a solid is and how solids are
              classified into different types.
            </p>
          </div>
        </div>

        <div className="learning-step right">
          <div className="step-number">02</div>

          <div className="step-content">
            <span>STRUCTURE</span>
            <h3>Crystalline Solids</h3>
            <p>
              Learn how particles are arranged in an ordered
              and repeating pattern.
            </p>
          </div>
        </div>

        <div className="learning-step left">
          <div className="step-number">03</div>

          <div className="step-content">
            <span>ARRANGEMENT</span>
            <h3>Crystal Lattice</h3>
            <p>
              Explore the three-dimensional periodic arrangement
              of particles in a crystal.
            </p>
          </div>
        </div>

        <div className="learning-step right">
          <div className="step-number">04</div>

          <div className="step-content">
            <span>CORE CONCEPT</span>
            <h3>Unit Cell</h3>
            <p>
              Discover the smallest repeating portion that
              represents the structure of a crystal.
            </p>
          </div>
        </div>

        <div className="learning-step left">
          <div className="step-number">05</div>

          <div className="step-content">
            <span>GEOMETRY</span>
            <h3>Crystal Systems</h3>
            <p>
              Understand how crystal structures are classified
              based on their geometry and lattice parameters.
            </p>
          </div>
        </div>

        <div className="learning-step right">
          <div className="step-number">06</div>

          <div className="step-content">
            <span>CUBIC SYSTEMS</span>
            <h3>SC • BCC • FCC</h3>
            <p>
              Compare Simple Cubic, Body-Centered Cubic and
              Face-Centered Cubic unit cells.
            </p>
          </div>
        </div>

        <div className="learning-destination">

          <div className="destination-node"></div>

          <div className="destination-card">

            <span>NEXT STEP</span>

            <h3>Ready to Build?</h3>

            <p>
              Take what you have learned and explore
              crystal structures in an interactive 3D environment.
            </p>

            {/* <a href="#" className="destination-button">
              Start Interactive Module →
            </a> */}

          </div>

        </div>

      </div>

    </section>
  );
}

export default ShortLearning;

