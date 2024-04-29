import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { iconAnchor, MarkerTypeToIcon } from "./MarkerIcon";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import PopupAnchor from "./PopupAnchor";
import { MarkerTypes } from "../models/MarkerTypes";
import PopupMarker from "./PopupMarker";
import { ApiDataRepository } from "../api/ApiDataRepository";

export default function MapDisplayRawLeaflet(props) {
  const repo = ApiDataRepository.getInstance();

  const zoom = props.zoom;
  const center = props.center;
  const mapInfo = props.map;
  const setAlertText = props.setAlertText;
  const setAlertDisplay = props.setAlertDisplay;

  const maps = props.maps;
  const setMaps = props.setMapsState;
  const width = mapInfo.mapSize.width;
  const height = mapInfo.mapSize.height;
  const wh = [width, height];
  const origin = [0, 0];
  const bounds = [origin, wh];
  const mapContainer = useRef();

  const anchors = mapInfo.anchors;

  const addMarker = (latlng, map, anchorId, anchorType) => {
    const anchor = L.marker(latlng, {
      icon: MarkerTypeToIcon[anchorType] || iconAnchor,
      draggable: true,
    }).addTo(map);

    anchor.bindPopup(() => {
      const div = document.createElement("div");
      const root = createRoot(div);
      flushSync(() => {
        if (anchorType == MarkerTypes.anchor) {
          root.render(
            <PopupAnchor
              anchorId={anchorId}
              mapInfo={mapInfo}
              maps={maps}
              setMaps={setMaps}
              marker={anchor}
              setAlertDisplay={setAlertDisplay}
              setAlertText={setAlertText}
            />
          );
        } else {
          root.render(
            <PopupMarker
              anchorId={anchorId}
              mapInfo={mapInfo}
              maps={maps}
              setMaps={setMaps}
              marker={anchor}
              setAlertDisplay={setAlertDisplay}
              setAlertText={setAlertText}
            />
          );
        }
      });
      return div.innerHTML;
    });
    anchor.on("dragend", (e) => {
      const anchors = mapInfo.anchors.filter(
        (anchor) => anchor.anchorType === "anchor"
      );
      const newAnchors = mapInfo.anchors.map((anchor) => {
        if (anchor.anchorId == anchorId) {
          anchor.imgCoords = e.target.getLatLng();
          //recalculate realCoords using mapInfo.scale
          if (anchorType == MarkerTypes.anchor) {
            anchor.coords = {
              lat: 0,
              lng: 0,
            };
          } else {
            anchor.coords = {
              lat: anchor.imgCoords.lat * mapInfo.scale + anchors[0].coords.lat,
              lng: anchor.imgCoords.lng * mapInfo.scale + anchors[0].coords.lng,
            };
          }
        }
        return anchor;
      });
      const newMaps = maps.filter((map) => map.id != mapInfo.id);
      mapInfo.anchors = newAnchors;
      newMaps.push(mapInfo);
      setMaps(newMaps);
      localStorage.setItem("maps", JSON.stringify(newMaps));
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
      addMarker(anchor.imgCoords, map, anchor.anchorId, anchor.anchorType);
    });

    map.on("click", (e) => {
      if (mapInfo.progressionState != "not-started") return;

      const anchorId = mapInfo.anchors.length + 1;
      mapInfo.anchors.push({
        anchorId: anchorId,
        anchorType: MarkerTypes.anchor,
        coords: { lat: 0, lng: 0 },
        imgCoords: e.latlng,
      });

      const newMaps = maps.filter((map) => map.id != mapInfo.id);
      newMaps.push(mapInfo);
      setMaps(newMaps);
      localStorage.setItem("maps", JSON.stringify(newMaps));
      addMarker(e.latlng, map, anchorId, MarkerTypes.anchor).openPopup();
    });
    repo
      .getFile(mapInfo.image)
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const image = L.imageOverlay(url, bounds).addTo(map);
        map.fitBounds(bounds);
      })
      .catch((error) => {
        console.error(error);
      });

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
