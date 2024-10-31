import React from "react";

export function MagnifierDisplay({
  src,
  magnifierSize,
  displayPosition,
  zoomPosition,
}) {
  return (
    <div
      id="magnifier-display"
      style={{
        display: "none",
        width: `${magnifierSize.width * 0.5}px`,
        height: `${magnifierSize.height * 0.5}px`,
        left: `${displayPosition.x}px`,
        top: `${displayPosition.y}px`,
        backgroundImage: `url("${src}")`,
        backgroundSize: `${magnifierSize.width * 2}px ${
          magnifierSize.height * 2
        }px`,
        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
      }}
    ></div>
  );
}
