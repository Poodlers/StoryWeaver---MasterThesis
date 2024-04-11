import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { iconAnchor } from "./MarkerIcon";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import PopupAnchor from "./PopupDefault";

export default function MapDisplayRawLeaflet(props) {
  const zoom = props.zoom;
  const center = props.center;
  const mapInfo = props.map;
  const maps = props.maps;
  const setMaps = props.setMapsState;
  const width = mapInfo.mapSize.width;
  const height = mapInfo.mapSize.height;
  const wh = [width, height];
  const origin = [0, 0];
  const bounds = [origin, wh];
  const mapContainer = useRef();

  const anchors = mapInfo.anchors;

  const addMarker = (latlng, map, anchorId) => {
    const anchor = L.marker(latlng, {
      icon: iconAnchor,
      draggable: true,
    }).addTo(map);

    anchor.bindPopup(() => {
      const div = document.createElement("div");
      const root = createRoot(div);
      flushSync(() => {
        root.render(
          <PopupAnchor
            anchorId={anchorId}
            mapInfo={mapInfo}
            maps={maps}
            setMaps={setMaps}
            marker={anchor}
          />
        );
      });
      return div.innerHTML;
    });
    return anchor;
  };

  useEffect(() => {
    const map = L.map(mapContainer.current, {
      crs: L.CRS.Simple,
      attributionControl: false,
      minZoom: -2,
    });

    anchors.forEach((anchor) => {
      addMarker(anchor.imgCoords, map, anchor.anchorId);
    });

    map.on("click", (e) => {
      const anchorId = mapInfo.anchors.length + 1;
      mapInfo.anchors.push({
        anchorId: anchorId,
        coords: { lat: 0, lng: 0 },
        imgCoords: e.latlng,
      });

      const newMaps = maps.filter((map) => map.id != mapInfo.id);
      newMaps.push(mapInfo);
      setMaps(newMaps);
      localStorage.setItem("maps", JSON.stringify(newMaps));
      addMarker(e.latlng, map, anchorId).openPopup();
    });
    var image = L.imageOverlay(mapInfo.image, bounds).addTo(map);

    map.fitBounds(bounds);

    // unmount map function
    return () => {
      map.remove();
    };
  }, [mapInfo]);

  return (
    <div
      style={{
        padding: 0,
        margin: 0,
        width: "90%",
        height: "80vh",
        border: "1px solid black",
      }}
      ref={(el) => (mapContainer.current = el)}
    ></div>
  );
}
