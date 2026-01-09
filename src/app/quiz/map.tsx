"use client";

import { useEffect, useState } from "react";

export interface PolandMapProps {
  onSelect: (title: string) => void;
  locked: boolean;
}

export default function PolandMap({ onSelect, locked }: PolandMapProps) {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    fetch("/poland-map.svg")
      .then((res) => res.text())
      .then((text) => setSvg(text));
  }, []);

  useEffect(() => {
    if (!svg) return;

    const paths = document.querySelectorAll(
      "path[id^='PL-']",
    ) as NodeListOf<SVGPathElement>;

    const tooltip = document.getElementById("tooltip");

    const handlePathClick = (p: SVGPathElement) => {
      if (locked) return;

      const title = p.getAttribute("title") || "";

      document.querySelectorAll('path[id^="PL-"]').forEach((path) => {
        path.setAttribute("fill", "#d9e3f0");
      });
      p.setAttribute("fill", "#ffcc00");
      onSelect(title);
    };

    const handleMouseEnter = (p: SVGPathElement) => {
      if (locked) return;
      if (tooltip) {
        tooltip.style.display = "block";
        tooltip.textContent = p.getAttribute("title") || "";
      }
    };

    const handleMouseMove = (e: Event) => {
      if (locked) return;
      if (tooltip && e instanceof MouseEvent) {
        tooltip.style.left = e.clientX + 10 + "px";
        tooltip.style.top = e.clientY + 10 + "px";
      }
    };

    const handleMouseLeave = () => {
      if (tooltip) tooltip.style.display = "none";
    };

    const eventListeners: Array<{
      path: SVGPathElement;
      events: Array<{ type: string; handler: EventListener }>;
    }> = [];

    paths.forEach((p) => {
      p.style.cursor = locked ? "not-allowed" : "pointer";

      if (!locked) {
        const clickHandler = () => handlePathClick(p);
        const enterHandler = () => handleMouseEnter(p);

        p.addEventListener("click", clickHandler);
        p.addEventListener("mouseenter", enterHandler);
        p.addEventListener("mousemove", handleMouseMove);
        p.addEventListener("mouseleave", handleMouseLeave);

        eventListeners.push({
          path: p,
          events: [
            { type: "click", handler: clickHandler },
            { type: "mouseenter", handler: enterHandler },
            { type: "mousemove", handler: handleMouseMove },
            { type: "mouseleave", handler: handleMouseLeave },
          ],
        });
      }
    });
    return () => {
      eventListeners.forEach(({ path, events }) => {
        events.forEach(({ type, handler }) => {
          path.removeEventListener(type, handler);
        });
      });
    };
  }, [svg, locked, onSelect]);

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{ width: "100%", height: "100%" }}
      />

      <div
        id="tooltip"
        style={{
          position: "fixed",
          background: "#000000cc",
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          pointerEvents: "none",
          display: "none",
          zIndex: 9999,
        }}
      />
    </div>
  );
}
