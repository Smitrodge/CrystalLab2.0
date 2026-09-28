import "../../../CSS/SolidContent.css";

function SolidContent() {
    return (
        <section className="solid-content">

            {/* BREADCRUMB */}

            <div className="solid-breadcrumb">
                <span>⌂</span>
                <span>Theory</span>
                <b>›</b>
                <span>Solids</span>
            </div>


            {/* HEADING */}

            <div className="solid-intro">

                <span className="solid-badge">
                    BASICS
                </span>

                <h1>Solids</h1>

                <p>
                    Solids are a state of matter in which particles are
                    closely packed together and experience strong
                    intermolecular forces.
                </p>

            </div>


            {/* TYPES OF SOLIDS */}

            <section className="solid-types">

                <h2>Types of Solids</h2>

                <p className="solid-description">
                    Solids are mainly classified into two types based on
                    the arrangement of their constituent particles.
                </p>


                {/* TREE */}

                <div className="solid-tree">

                    <div className="solid-tree-root">
                        Solids
                    </div>

                    <div className="solid-tree-connector">
                        <span></span>
                        <span></span>
                    </div>

                    <div className="solid-tree-items">

                        <div className="solid-tree-item">
                            <span></span>
                            <strong>Amorphous Solids</strong>
                        </div>

                        <div className="solid-tree-item">
                            <span></span>
                            <strong>Crystalline Solids</strong>
                        </div>

                    </div>

                </div>

            </section>


            {/* AMORPHOUS */}

            <section className="solid-type-card">

                <div className="solid-type-text">

                    <div className="solid-type-heading">

                        <span className="solid-number">
                            01
                        </span>

                        <h2>Amorphous Solids</h2>

                    </div>

                    <p>
                        Amorphous solids do not have a regular or long-range
                        arrangement of their constituent particles. Their
                        particles are arranged randomly over large distances.
                    </p>

                </div>


                <div className="solid-type-image">
                    <img src={`${import.meta.env.BASE_URL}amorphousSolid.png`} alt="Amorphous Solid" />
                </div>

            </section>


            {/* CRYSTALLINE */}

            <section className="solid-type-card">

                <div className="solid-type-text">

                    <div className="solid-type-heading">

                        <span className="solid-number">
                            02
                        </span>

                        <h2>Crystalline Solids</h2>

                    </div>

                    <p>
                        Crystalline solids have a definite and regular
                        arrangement of their constituent particles that
                        extends over a long range.
                    </p>

                </div>


                <div className="solid-type-image">
                    <img src={`${import.meta.env.BASE_URL}csolid.jpeg`} alt="Crystalline------ Solid" />
                </div>


            </section>
            {/* DIFFERENCE TABLE */}

            <section className="solid-comparison">

                <div className="comparison-heading">
                    <span>COMPARISON</span>
                    <h2>Crystalline vs Amorphous Solids</h2>

                    <p>
                        Key differences between crystalline and amorphous solids.
                    </p>
                </div>


                <div className="comparison-table-wrapper">

                    <table className="comparison-table">

                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Crystalline Solids</th>
                                <th>Amorphous Solids</th>
                            </tr>
                        </thead>

                        <tbody>

                            <tr>
                                <td>Particle Arrangement</td>

                                <td>
                                    Particles have a regular and ordered arrangement.
                                </td>

                                <td>
                                    Particles have an irregular arrangement.
                                </td>
                            </tr>

                            <tr>
                                <td>Order</td>

                                <td>
                                    Long-range order is present.
                                </td>

                                <td>
                                    Long-range order is absent.
                                </td>
                            </tr>

                            <tr>
                                <td>Shape</td>

                                <td>
                                    Have a definite geometrical shape.
                                </td>

                                <td>
                                    Do not have a definite geometrical shape.
                                </td>
                            </tr>

                            <tr>
                                <td>Melting Point</td>

                                <td>
                                    Have a sharp and definite melting point.
                                </td>

                                <td>
                                    Soften over a range of temperature.
                                </td>
                            </tr>

                            <tr>
                                <td>Heat of Fusion</td>

                                <td>
                                    Have a definite heat of fusion.
                                </td>

                                <td>
                                    Do not have a definite heat of fusion.
                                </td>
                            </tr>

                            <tr>
                                <td>Cleavage</td>

                                <td>
                                    Break along definite planes.
                                </td>

                                <td>
                                    Break irregularly.
                                </td>
                            </tr>

                            <tr>
                                <td>Examples</td>

                                <td>
                                    NaCl, Quartz, Diamond
                                </td>

                                <td>
                                    Glass, Rubber, Plastic
                                </td>
                            </tr>

                        </tbody>

                    </table>

                </div>

            </section>


        </section>

    );
}

export default SolidContent;