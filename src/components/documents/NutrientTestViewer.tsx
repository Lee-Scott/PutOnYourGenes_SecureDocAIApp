import { useEffect, useRef } from "react";

function NutrientTestViewer() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const { NutrientViewer } = window;
    if (container && NutrientViewer) {
      NutrientViewer.load({
        container,
        // You can also specify a file in public directory, for example /document.pdf
        document: "/pationt-report-example.pdf",
      });
    }

    return () => {
      NutrientViewer?.unload(container);
    };
  }, []);

  // we also need to set the container height and width
  return <div ref={containerRef} style={{ height: "100vh", width: "100vw", position: "relative" }} />;
}

export default NutrientTestViewer;