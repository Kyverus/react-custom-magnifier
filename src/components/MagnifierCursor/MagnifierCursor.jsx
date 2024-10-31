import React from "react";

export function MagnifierCursor({
  src,
  magnifierSize,
  cursorPosition,
  zoomPosition,
  cursorOnly,
  canFit,
}) {
  return (
    <div
      id="magnifier-cursor"
      style={{
        width: `${magnifierSize.width * 0.25}px`,
        height: `${magnifierSize.height * 0.25}px`,
        left: `${cursorPosition.x}px`,
        top: `${cursorPosition.y}px`,
        backgroundImage: `url("${src}")`,
        backgroundSize:
          cursorOnly || !canFit
            ? `${magnifierSize.width * 2}px ${magnifierSize.height * 2}px`
            : `${magnifierSize.width}px ${magnifierSize.height}px`,
        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
      }}
    ></div>
  );
}
