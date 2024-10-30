import React, { useState, useEffect, useRef } from "react";
import "./ImageMagnifier.css";

function ImageMagnifier({ src, initialWidth, fixedWidth, cursorOnly }) {
  const [magnifierSize, setMagnifierSize] = useState({ width: 0, height: 0 });

  const [displayPosition, setDisplayPosition] = useState({ x: 0, y: 0 });
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const cursorRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [imageWidth, setImageWidth] = useState(false);

  useEffect(() => {
    checkImageWidth();

    window.addEventListener("resize", checkImageWidth);

    return () => {
      window.removeEventListener("resize", checkImageWidth);
    };
  }, []);

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
        console.log("small", width);
        width = "100%";
      }
    }

    if (imageWidth != width) {
      setImageWidth(width);
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

    const cursorWidth = cursorRef.current.clientWidth;
    const cursorHeight = cursorRef.current.clientHeight;

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
    let x = event.clientX - rect.left - cursorWidth / 2;
    let y = event.clientY - rect.top - cursorHeight / 2;

    let boundedMagnifierWidth = magnifier.clientWidth - cursorWidth / 2;
    let boundedMagnifierHeight = magnifier.clientHeight - cursorHeight / 2;

    x = limitValue(x, 0, boundedMagnifierWidth);
    y = limitValue(y, 0, boundedMagnifierHeight);

    let zoomPosX = (x * 100) / (magnifier.clientWidth - cursorWidth);
    let zoomPosy = (y * 100) / (magnifier.clientHeight - cursorHeight);

    if (cursorOnly) {
      x = event.clientX - rect.left - cursorWidth / 4;
      y = event.clientY - rect.top - cursorHeight / 4;

      boundedMagnifierWidth = magnifier.clientWidth - cursorWidth / 4;
      boundedMagnifierHeight = magnifier.clientHeight - cursorHeight / 4;

      x = limitValue(x, 0, boundedMagnifierWidth);
      y = limitValue(y, 0, boundedMagnifierHeight);

      zoomPosX = (x * 100) / (magnifier.clientWidth - cursorWidth / 2);
      zoomPosy = (y * 100) / (magnifier.clientHeight - cursorHeight / 2);
    }

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
    if (!cursorOnly) {
      document.getElementById("magnifier-display").style.display = "block";
    }
  }

  function hideImage() {
    document.getElementById("magnifier-cursor").style.display = "none";
    if (!cursorOnly) {
      document.getElementById("magnifier-display").style.display = "none";
    }
  }

  return (
    <div
      id="magnifier"
      onMouseMove={onMouseMove}
      onMouseLeave={hideImage}
      onMouseEnter={showImage}
    >
      <img
        src={src}
        style={{
          width: imageWidth,
        }}
      />

      <div
        id="magnifier-cursor"
        ref={cursorRef}
        style={{
          width: `${magnifierSize.width * 0.25}px`,
          height: `${magnifierSize.height * 0.25}px`,
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          backgroundImage: `url("${src}")`,
          backgroundSize: cursorOnly
            ? `${magnifierSize.width * 2}px ${magnifierSize.height * 2}px`
            : `${magnifierSize.width}px ${magnifierSize.height}px`,
          backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
        }}
      ></div>

      {!cursorOnly && (
        <div
          id="magnifier-display"
          style={{
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
      )}
    </div>
  );
}

export default ImageMagnifier;
