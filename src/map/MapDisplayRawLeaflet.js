import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";

export default function MapDisplayRawLeaflet(props) {
  const zoom = props.zoom;
  const center = props.center;
  const map = props.map;
  const width = map.mapSize.width;
  const height = map.mapSize.height;
  const wh = [width, height];
  const origin = [0, 0];
  const bounds = [origin, wh];
  const mapContainer = useRef();
  useEffect(() => {
    const map = L.map("map", {
      crs: L.CRS.Simple,
    });

    var blob = new Blob([map.image], { type: "image/png" });

    var image = L.imageOverlay(blob, bounds).addTo(map);

    map.fitBounds(bounds);

    // unmount map function
    return () => map.remove();
  }, []);

  return (
    <div
      style={{ padding: 0, margin: 0, width: "90%", height: "90vh" }}
      ref={(el) => (mapContainer.current = el)}
    ></div>
  );
}
