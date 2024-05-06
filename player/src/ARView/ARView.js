import React from "react";

export default function ARView(props) {
  return (
    <a-scene
      vr-mode-ui="enabled: false"
      arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false"
      renderer="antialias: true; alpha: true"
    >
      <a-camera gps-new-camera="gpsMinDistance: 5"></a-camera>
      <a-entity
        material="color: red"
        geometry="primitive: box"
        gps-new-entity-place="latitude: 41.17835243437434; longitude: -8.594876303684782"
        scale="1 1 1"
        position="0 0 0"
      ></a-entity>
    </a-scene>
  );
}
