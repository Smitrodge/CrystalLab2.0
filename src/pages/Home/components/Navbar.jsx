import { useEffect, useState } from "react";
import "../../../CSS/Navbar.css";

function Navbar({ activePage = "home" }) {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
      setDarkMode(false);
      document.body.classList.add("light-mode");
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;

    setDarkMode(newMode);

    if (newMode) {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    }
  };

  const goToHomeSection = (sectionId) => {
    setActiveSection(sectionId);

    // Agar already Home page par hain
    if (activePage === "home") {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    // Theory / Practical se Home par jao
    window.location.hash = "#/";

    // Home render hone ka wait
    setTimeout(() => {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const handleHomeClick = () => {
    setActiveSection("");
  };

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="logo">
        CrystalLab
      </div>


      {/* NAV LINKS */}
      <div className="nav-links">

        {/* HOME */}
        <a
          href="#/"
          className={
            activePage === "home" && activeSection === ""
              ? "active"
              : ""
          }
          onClick={handleHomeClick}
        >
          Home
        </a>


        {/* LEARNING PATH */}
        <a
          href="#/"
          className={
            activeSection === "learning-path"
              ? "active"
              : ""
          }
          onClick={(e) => {
            e.preventDefault();
            goToHomeSection("learning-path");
          }}
        >
          Learning Path
        </a>


        {/* THEORY */}
        <a
          href="#/theory"
          className={
            activePage === "theory"
              ? "active"
              : ""
          }
        >
          Theory
        </a>


        {/* 3D PRACTICAL */}
        <a
          href="#/practical"
          className={
            activePage === "practical"
              ? "active"
              : ""
          }
        >
          3D Practical
        </a>


        {/* ABOUT LEARNING */}
        <a
          href="#/"
          className={
            activeSection === "about"
              ? "active"
              : ""
          }
          onClick={(e) => {
            e.preventDefault();
            goToHomeSection("about");
          }}
        >
          About Learning
        </a>

      </div>


      {/* THEME TOGGLE */}
      <div className="theme-toggle">

        <span className="sun-icon">
          ☀
        </span>

        <button
          className={`theme-switch ${!darkMode ? "light" : ""}`}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <span></span>
        </button>

        <span className="moon-icon">
          ☾
        </span>

      </div>

    </nav>
  );
}

export default Navbar;