"use client";

import { useEffect, useState, useCallback } from "react";

export default function PolandMap() {
  const [svg, setSvg] = useState("");

  const onSelect = useCallback((title: string) => {
    document.querySelectorAll('path[id^="PL-"]').forEach((p) => {
      p.setAttribute("fill", "#d9e3f0");
    });
    const clicked = Array.from(document.querySelectorAll("path[id^='PL-']")).find(
      (p) => p.getAttribute("title") === title
    );
    if (clicked) {
      clicked.setAttribute("fill", "#ffcc00");
    }
    console.log("Kliknięto:", title);
  }, []);
  useEffect(() => {
    fetch("/poland-map.svg")
      .then((res) => res.text())
      .then((text) => setSvg(text));
  }, []);

  useEffect(() => {
    if (!svg) return;
    const paths = document.querySelectorAll("path[id^='PL-']") as NodeListOf<SVGPathElement>;
    const tooltip = document.getElementById("tooltip");

    const handleClick = (p: SVGPathElement) => () => {
      onSelect(p.getAttribute("title") || "");
    };

    const handleMouseEnter = (p: SVGPathElement) => (e: MouseEvent) => {
      if (tooltip) {
        tooltip.style.display = "block";
        tooltip.textContent = p.getAttribute("title") || "";
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (tooltip) {
        tooltip.style.left = e.clientX + 10 + "px";
        tooltip.style.top = e.clientY + 10 + "px";
      }
    };

    const handleMouseLeave = () => {
      if (tooltip) {
        tooltip.style.display = "none";
      }
    };

    const handlers: Array<{ path: SVGPathElement; click: () => void; enter: (e: MouseEvent) => void }> = [];

    paths.forEach((p) => {
      p.style.cursor = "pointer";
      const click = handleClick(p);
      const enter = handleMouseEnter(p);
      
      p.addEventListener("click", click);
      p.addEventListener("mouseenter", enter);
      p.addEventListener("mousemove", handleMouseMove);
      p.addEventListener("mouseleave", handleMouseLeave);
      
      handlers.push({ path: p, click, enter });
    });

    return () => {
      handlers.forEach(({ path, click, enter }) => {
        path.removeEventListener("click", click);
        path.removeEventListener("mouseenter", enter);
        path.removeEventListener("mousemove", handleMouseMove);
        path.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [svg, onSelect]);
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
