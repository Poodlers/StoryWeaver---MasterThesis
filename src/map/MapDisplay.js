import React from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  ImageOverlay,
  MapContainer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import ClickMarker from "./PopupAnchor";

export default function MapDisplay(props) {
  const zoom = props.zoom;
  const center = props.center;
  const map = props.map;
  const width = map.mapSize.width;
  const height = map.mapSize.height;
  const wh = [width, height];
  const origin = [0, 0];
  const bounds = [origin, wh];

  return (
    <div style={{ width: "1100px", height: "600px" }}>
      <MapContainer
        maxNativeZoom={5}
        style={{ height: "100%", minHeight: "100%" }}
        bounds={zoom ? undefined : bounds}
        boundsOptions={{
          padding: [0, 0],
        }}
        maxBounds={bounds}
        zoom={center ? zoom : undefined}
        center={zoom ? center : undefined}
        zoomSnap={0} // Important to disable snap after fitBounds
        whenReady={(e) => e.target.fitBounds(bounds)} // Have the map adjust its view to the same bounds as the Image Overlay
      >
        <ImageOverlay
          url={map.image}
          bounds={bounds}
          className="map_main"
          minZoom={5}
        />
        <ClickMarker position={new L.latLng(0, 0)} />
      </MapContainer>
    </div>
  );
}
