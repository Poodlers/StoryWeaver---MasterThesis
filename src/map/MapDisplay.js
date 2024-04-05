import React from "react";
import "leaflet/dist/leaflet.css";
import {
  ImageOverlay,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";

export default function MapDisplay(props) {
  const width = props.width;
  const height = props.height;
  const zoom = props.zoom;
  const center = props.center;
  const imgPath = props.imgPath;

  const wh = [width, height];
  const origin = [0, 0];
  const bounds = [origin, wh];

  return (
    <div
      style={{
        width: "500px",
        height: "500px",
        textAlign: "center",
        margin: "0 auto",
      }}
    >
      <MapContainer
        style={{ height: "100%" }}
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
        <ImageOverlay url={imgPath} bounds={bounds} className="map_main" />
      </MapContainer>
    </div>
  );
}
