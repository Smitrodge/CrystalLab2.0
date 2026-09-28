import { useState, useEffect } from "react";

import Home from "./pages/Home/Home.jsx";
import Theory from "./pages/Theory/Theory.jsx";
import Practical from "./pages/3DPractical/Practical.jsx";

function App() {
  const [currentHash, setCurrentHash] = useState(
    window.location.hash
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener(
      "hashchange",
      handleHashChange
    );

    return () => {
      window.removeEventListener(
        "hashchange",
        handleHashChange
      );
    };
  }, []);

  if (
    currentHash === "#/theory" ||
    currentHash === "#theory"
  ) {
    return <Theory />;
  }

  if (currentHash === "#/practical") {
    return <Practical />;
  }

  return <Home />;
}

export default App;