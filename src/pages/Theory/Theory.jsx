import { useState } from "react";

import Navbar from "../Home/components/Navbar";
import TheorySidebar from "./components/TheorySidebar";
import MatterContent from "./components/MatterContent";
import SolidContent from "./components/SolidContent";
import CrystallineContent from "./components/CrystallineContent";
import UnitCellContent from "./components/UnitCellContent";
import CrystalSystem from "./components/CrystalSystem";
import BravaisLattice from "./components/BravaisLattice";
import CubicUnitCell from "./components/CubicUnitCell";

import "../../CSS/Theory.css";

function Theory() {

  const [activeTopic, setActiveTopic] = useState("matter");

  return (
    <>
      <Navbar activePage="theory" />

      <main className="theory-page">

        <TheorySidebar
          activeTopic={activeTopic}
          setActiveTopic={setActiveTopic}
        />

        {activeTopic === "matter" && (
          <MatterContent />
        )}

        {activeTopic === "solids" && (
          <SolidContent />
        )}

        {activeTopic === "crystalline-solids" && (
          <CrystallineContent />
        )}

        {activeTopic === "unit-cell" && <UnitCellContent />}

        {activeTopic === "crystal-system" && <CrystalSystem />}

        {activeTopic === "bravais-lattice" && <BravaisLattice />}

        {activeTopic === "cubic-unit-cell" && <CubicUnitCell />}

      </main>
    </>
  );
}

export default Theory;