import React, { useEffect } from "react";
import { ThreeDModelTypes } from "../../models/ThreeDModelTypes";
import { useFrame } from "react-frame-component";

export default function ThreeDLocationBasedDisplay(props) {
  const position = props.position || { x: 0, y: 0, z: 0 };
  const scale = props.scale || { x: 1, y: 1, z: 1 };
  const rotation = props.rotation || { x: 0, y: 0, z: 0 };
  const coords = props.coords;
  const src = props.src;
  const threeDModelType = props.threeDModelType;
  const autoplay = props.autoplay;

  console.log("ThreeDLocationBasedDisplay: ", props);

  const { document, window } = useFrame();

  useEffect(() => {
    if (!autoplay) return;
    const model = document.getElementById("model");
    model.setAttribute("animation-mixer", "loop: repeat; timeScale: 1;");
  }, []);
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
        {threeDModelType === ThreeDModelTypes.gltf ? (
          <a-entity
            id="model"
            gltf-model={src}
            gps-new-entity-place={
              "latitude: " + coords.lat + ";" + "longitude: " + coords.lng
            }
            rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}
            scale={`${scale.x} ${scale.y} ${scale.z}`}
            position={`${position.x} ${position.y} ${position.z}`}
          ></a-entity>
        ) : threeDModelType === ThreeDModelTypes.obj ? (
          <a-entity
            id="model"
            obj-model={
              "obj: " + src + "; " + "mtl: " + src.replace(".obj", ".mtl") + ";"
            }
            gps-new-entity-place={
              "latitude: " + coords.lat + ";" + "longitude: " + coords.lng
            }
            rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}
            scale={`${scale.x} ${scale.y} ${scale.z}`}
            position={`${position.x} ${position.y} ${position.z}`}
          ></a-entity>
        ) : threeDModelType === ThreeDModelTypes.fbx ? (
          <a-entity
            id="model"
            fbx-model={"src: " + src}
            gps-new-entity-place={
              "latitude: " + coords.lat + ";" + "longitude: " + coords.lng
            }
            rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}
            scale={`${scale.x} ${scale.y} ${scale.z}`}
            position={`${position.x} ${position.y} ${position.z}`}
          ></a-entity>
        ) : null}
      </a-scene>
    </>
  );
}
