import { useEffect, useRef } from "react";

function NutrientTestViewer() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    (async () => {
      if (window.NutrientViewer && container) {
        try {
          await window.NutrientViewer.load({
            container,
            document: "/pationt-report-example.pdf",
          });
        } catch (error: unknown) {
          // In development, React's StrictMode mounts components twice, which can cause this error.
          // We can safely ignore it because the viewer will be initialized on the second mount.
          if (error instanceof Error && error.message.includes("already used to mount")) {
            console.warn("NutrientTestViewer: Remounting due to React StrictMode.");
          } else {
            console.error("Error loading document in test viewer:", error);
          }
        }
      }
    })();

    return () => {
      if (window.NutrientViewer) {
        window.NutrientViewer.unload(container);
      }
    };
  }, []);

  return <div ref={containerRef} style={{ height: "100vh", width: "100vw", position: "relative" }} />;
}

export default NutrientTestViewer;