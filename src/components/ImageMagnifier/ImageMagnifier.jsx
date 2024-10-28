import React, { useState, useEffect, useRef } from "react";

function ImageMagnifier({
  src,
  boxX,
  boxY,
  width,
  height,
  magnifierBorderColor = "black",
  boxBorderColor = "black",
}) {
  const imgRef = useRef(null);
  const [zoom, setZoom] = useState({ x: 0, y: 0 });
  const [hiddenImg, setHiddenImg] = useState(true);
  const [parentSize, setparentSize] = useState({ x: 0, y: 0 });
  const [boxPosition, setBoxPosition] = useState({
    x: 0,
    y: 0,
  });
  const [magnifierPosition, setMagnifierPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const parent = document.getElementById("magnifier-parent");

    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mouseleave", hideImage);
    parent.addEventListener("mouseenter", showImage);

    return () => {
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mouseleave", hideImage);
      parent.removeEventListener("mouseenter", showImage);
    };
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          setparentSize({
            x: entry.contentRect.width,
            y: entry.contentRect.height,
          });
        }
      }
    });
    const parent = document.getElementById("magnifier-parent");
    resizeObserver.observe(parent);
  }, []);

  function onMouseMove(event) {
    const parent = document.getElementById("magnifier-parent");
    var rect = parent.getBoundingClientRect();

    let mouseX = event.clientX - imgRef.current.clientWidth / 2;
    let mouseY = event.clientY - imgRef.current.clientHeight / 2;

    if (mouseX <= rect.left) {
      mouseX = rect.left;
    }

    if (mouseX + imgRef.current.clientWidth >= rect.right) {
      mouseX = rect.right - imgRef.current.clientWidth;
    }

    if (mouseY <= rect.top) {
      mouseY = rect.top;
    }

    if (mouseY + imgRef.current.clientHeight >= rect.bottom) {
      mouseY = rect.bottom - imgRef.current.clientHeight;
    }

    setBoxPosition({
      x: mouseX,
      y: mouseY,
    });

    mouseX = event.clientX - imgRef.current.clientWidth / 4;
    mouseY = event.clientY - imgRef.current.clientHeight / 4;

    if (mouseX <= rect.left) {
      mouseX = rect.left;
    }

    if (mouseX + imgRef.current.clientWidth / 2 >= rect.right) {
      mouseX = rect.right - imgRef.current.clientWidth / 2;
    }

    if (mouseY <= rect.top) {
      mouseY = rect.top;
    }

    if (mouseY + imgRef.current.clientHeight / 2 >= rect.bottom) {
      mouseY = rect.bottom - imgRef.current.clientHeight / 2;
    }

    setMagnifierPosition({
      x: mouseX,
      y: mouseY,
    });

    var rectX = event.clientX - rect.left;
    var rectY = event.clientY - rect.top;

    const limit = 4; //relative to zoombox

    var x = rectX - imgRef.current.clientWidth / limit;
    var y = rectY - imgRef.current.clientHeight / limit;

    if (x <= 0) {
      x = 0;
    }

    if (x >= parent.clientWidth - imgRef.current.clientWidth / limit) {
      x = parent.clientWidth - imgRef.current.clientWidth / limit;
    }

    if (y <= 0) {
      y = 0;
    }

    if (y >= parent.clientHeight - imgRef.current.clientHeight / limit) {
      y = parent.clientHeight - imgRef.current.clientHeight / limit;
    }

    let zoomX =
      (x * 100) /
      (parent.clientWidth - imgRef.current.clientWidth / (limit / 2));
    let zoomY =
      (y * 100) /
      (parent.clientHeight - imgRef.current.clientHeight / (limit / 2));

    if (zoomX <= 0) {
      zoomX = 0;
    }

    if (zoomX >= 100) {
      zoomX = 100;
    }

    if (zoomY <= 0) {
      zoomY = 0;
    }

    if (zoomY >= 100) {
      zoomY = 100;
    }

    console.log(zoomX, zoomY);

    setZoom({
      x: zoomX,
      y: zoomY,
    });
  }

  function showImage() {
    setHiddenImg(false);
  }

  function hideImage() {
    setHiddenImg(true);
  }

  return (
    <div id="magnifier-parent" style={{ position: "relative" }}>
      <div
        id="magnifierBox"
        ref={imgRef}
        style={{
          zIndex: "1000",
          pointerEvents: "none",
          overflow: "hidden",
          position: "absolute",
          display: `${hiddenImg ? "none" : "block"}`,
          border: "2px solid",
          borderColor: boxBorderColor,
          width: `${parentSize.x * 0.5}px`,
          height: `${parentSize.y * 0.5}px`,
          background: `url(${src})`,
          backgroundRepeat: "no-repeat",
          left: `${boxX && boxY ? boxX : boxPosition.x}px`,
          top: `${boxX && boxY ? boxY : boxPosition.y}px`,
          backgroundSize: `${width * 2}px ${height * 2}px`,
          backgroundPosition: `${zoom.x}% ${zoom.y}%`,
        }}
      ></div>
      <div
        id="magnifier"
        style={{
          position: "fixed",
          zIndex: "2000",
          borderRadius: "9999px",
          display: `${hiddenImg ? "none" : "block"}`,
          border: "2px solid",
          borderColor: magnifierBorderColor,
          width: `${parentSize.x * 0.25}px`,
          height: `${parentSize.y * 0.25}px`,
          background: `url(${src})`,
          backgroundRepeat: "no-repeat",
          left: `${magnifierPosition.x}px`,
          top: `${magnifierPosition.y}px`,
          backgroundSize: `${width}px ${height}px`,
          backgroundPosition: `${zoom.x}% ${zoom.y}%`,
        }}
      ></div>
      <img src={src} style={{ width: width, height: height }} />
    </div>
  );
}

export default ImageMagnifier;
