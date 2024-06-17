import React from "react";

export default function TextLocationBasedDisplay(props) {
  const position = props.position || { x: 0, y: 0, z: 0 };
  const scale = props.scale || { x: 1, y: 1, z: 1 };
  const rotation = props.rotation || { x: 0, y: 0, z: 0 };
  const coords = props.coords;
  const text = props.text;
  const textColor = props.textColor.color || "#000000";
  return (
    <>
      <div className="arjs-loader">
        <div>Loading, please wait...</div>
      </div>
      <a-scene
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false;"
        renderer="antialias: true; alpha: true"
      >
        <a-camera
          gps-camera
          rotation-reader
          gps-new-camera={
            "gpsMinDistance: 0.5; simulateLatitude:" +
            coords.lat +
            "; simulateLongitude: " +
            coords.lng
          }
        ></a-camera>

        <a-text
          value={text}
          look-at="[gps-camera]"
          side="double"
          color={textColor}
          rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}
          scale={`${scale.x} ${scale.y} ${scale.z}`}
          gps-new-entity-place={
            "latitude: " + coords.lat + ";" + "longitude: " + coords.lng
          }
        ></a-text>
      </a-scene>
    </>
  );
}
