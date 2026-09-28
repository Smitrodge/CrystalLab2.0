import "../../../CSS/TheorySidebar.css";

function TheorySidebar({ activeTopic, setActiveTopic }) {
  const topics = [
    {
      id: "matter",
      title: "Matter",
      children: []
    },

    {
      id: "solids",
      title: "Solids",
      children: [
        {
          title: "Amorphous Solids"
        },
        {
          title: "Crystalline Solids"
        }
      ]
    },

    {
      id: "crystalline-solids",
      title: "Crystalline Solids",
      children: [
        {
          title: "Crystal Lattice"
        }
      ]
    },

    {
      id: "unit-cell",
      title: "Unit Cell",
      children: [
        {
          title: "Unit Cell"
        },
        {
          title: "Parameters of Unit Cells"
        },
        {
          title: "Type of Unit Cell"
        }
      ]
    },

    {
      id: "crystal-system",
      title: "Crystal System",
      children: []
    },

    {
      id: "bravais-lattice",
      title: "Bravais Lattice",
      children: []
    },

    {
      id: "cubic-unit-cell",
      title: "Cubic Unit Cell",
      children: []
    }
  ];

  return (
    <aside className="theory-sidebar">

      <div className="sidebar-header">

        <h2>Theory</h2>

        <p>
          Explore the concepts behind crystal structures
        </p>

      </div>


      <div className="topic-tree">

        {topics.map((topic) => {

          const isOpen =
            activeTopic === topic.id;

          const hasChildren =
            topic.children.length > 0;

          return (
            <div
              className={`topic-group ${
                isOpen ? "open" : ""
              }`}
              key={topic.id}
            >

              {/* MAIN TOPIC */}

              <button
                className={`topic-main ${
                  activeTopic === topic.id
                    ? "active"
                    : ""
                }`}
                onClick={() => {

                  setActiveTopic(topic.id);

                }}
              >

                <span className="topic-dot"></span>

                <span className="topic-title">
                  {topic.title}
                </span>

                {hasChildren && (
                  <span className="topic-arrow">
                    ›
                  </span>
                )}

              </button>


              {/* SUBTOPICS */}

              {hasChildren && isOpen && (

                <div className="subtopic-list">

                  {topic.children.map(
                    (child, index) => (

                      <button
                        className="subtopic"
                        key={index}
                      >

                        <span className="subtopic-dot"></span>

                        <span>
                          {child.title}
                        </span>

                      </button>

                    )
                  )}

                </div>

              )}

            </div>
          );

        })}

      </div>

    </aside>
  );
}

export default TheorySidebar;