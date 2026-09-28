import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ShortLearning from "./components/ShortLearning";
import "../../CSS/Hero.css";
import "../../CSS/LearningPath.css";
import About from "./components/About";

function Home() {
  return (
    <>
      <Navbar activePage="home" />
      <div className="page-content">
        <Hero />
        <ShortLearning />
        <About />
      </div>
    </>
  );
}

export default Home;