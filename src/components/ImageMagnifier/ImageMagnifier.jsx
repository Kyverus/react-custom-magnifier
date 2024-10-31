import React, { useState, useEffect, useRef } from "react";
import { isTouchDevice } from "../../utils/utils";
import "./ImageMagnifier.css";
import { MagnifierDisplay } from "../MagnifierDisplay/MagnifierDisplay";
import { MagnifierCursor } from "../MagnifierCursor/MagnifierCursor";

function ImageMagnifier({ src, initialWidth, fixedWidth, cursorOnly }) {
  const [magnifierSize, setMagnifierSize] = useState({ width: 0, height: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [displayPosition, setDisplayPosition] = useState({ x: 0, y: 0 });
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [canFit, setCanFit] = useState(false);

  const touch = isTouchDevice();

  useEffect(() => {
    checkImageWidth();
  }, [window.innerWidth, magnifierSize]);

  function checkImageWidth() {
    const parent = document.getElementById("magnifier").parentElement;

    const parentWidth =
      parent.id == "root" ? window.innerWidth : parent.clientWidth;

    let width = initialWidth
      ? initialWidth
      : fixedWidth
      ? "max-content"
      : "100%";

    if (initialWidth && !fixedWidth) {
      if (initialWidth >= parentWidth) {
        width = "100%";
      }
    }
    const magnifierAndBoxWidth =
      document.getElementById("magnifier").clientWidth * 1.5;

    if (magnifierAndBoxWidth >= window.innerWidth) {
      setCanFit(false);
    } else {
      setCanFit(true);
    }

    const image = document.getElementById("magnifier-image");
    if (image.style.width != width) {
      image.style.width = width;
    }
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          setMagnifierSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
          setDisplayPosition({
            x: entry.contentRect.width,
            y: entry.contentRect.height / 2,
          });
        }
      }
    });
    const magnifier = document.getElementById("magnifier");
    resizeObserver.observe(magnifier);

    return () => {
      resizeObserver.unobserve(magnifier);
    };
  }, []);

  function onMouseMove(event) {
    const magnifier = document.getElementById("magnifier");
    const cursor = document.getElementById("magnifier-cursor");

    const cursorWidth = cursor.clientWidth;
    const cursorHeight = cursor.clientHeight;

    cursorHandler(magnifier, event, cursorWidth, cursorHeight);
    zoomHandler(magnifier, event, cursorWidth, cursorHeight);
  }

  function cursorHandler(magnifier, event, cursorWidth, cursorHeight) {
    var rect = magnifier.getBoundingClientRect();

    let mouseX = event.clientX - cursorWidth / 2;
    let mouseY = event.clientY - cursorHeight / 2;

    mouseX = limitValue(mouseX, rect.left, rect.right - cursorWidth);

    mouseY = limitValue(mouseY, rect.top, rect.bottom - cursorHeight);

    setCursorPosition({
      x: mouseX,
      y: mouseY,
    });
  }

  function zoomHandler(magnifier, event, cursorWidth, cursorHeight) {
    const rect = magnifier.getBoundingClientRect();

    const cursorDivider = cursorOnly || !canFit ? 4 : 2;

    let x = event.clientX - rect.left - cursorWidth / cursorDivider;
    let y = event.clientY - rect.top - cursorHeight / cursorDivider;

    let boundedMagnifierWidth =
      magnifier.clientWidth - cursorWidth / cursorDivider;
    let boundedMagnifierHeight =
      magnifier.clientHeight - cursorHeight / cursorDivider;

    x = limitValue(x, 0, boundedMagnifierWidth);
    y = limitValue(y, 0, boundedMagnifierHeight);

    let zoomPosX =
      (x * 100) / (magnifier.clientWidth - cursorWidth / (cursorDivider / 2));
    let zoomPosy =
      (y * 100) / (magnifier.clientHeight - cursorHeight / (cursorDivider / 2));

    zoomPosX = limitValue(zoomPosX, 0, 100);
    zoomPosy = limitValue(zoomPosy, 0, 100);

    setZoomPosition({
      x: zoomPosX,
      y: zoomPosy,
    });
  }

  function limitValue(value, min, max) {
    if (value <= min) return min;
    if (value >= max) return max;
    return value;
  }

  function showImage() {
    document.getElementById("magnifier-cursor").style.display = "block";
    if (!cursorOnly && canFit) {
      document.getElementById("magnifier-display").style.display = "block";
    }
  }

  function hideImage() {
    document.getElementById("magnifier-cursor").style.display = "none";
    if (!cursorOnly && canFit) {
      document.getElementById("magnifier-display").style.display = "none";
    }
  }

  return (
    <div
      id="magnifier"
      onMouseMove={!touch ? onMouseMove : undefined}
      onMouseLeave={!touch ? hideImage : undefined}
      onMouseEnter={!touch ? showImage : undefined}
    >
      <img id="magnifier-image" src={src} />

      {!touch && (
        <MagnifierCursor
          src={src}
          cursorPosition={cursorPosition}
          zoomPosition={zoomPosition}
          magnifierSize={magnifierSize}
          cursorOnly={cursorOnly}
          canFit={canFit}
        />
      )}

      {canFit && !cursorOnly && !touch && (
        <MagnifierDisplay
          src={src}
          displayPosition={displayPosition}
          zoomPosition={zoomPosition}
          magnifierSize={magnifierSize}
        />
      )}
    </div>
  );
}

export default ImageMagnifier;
