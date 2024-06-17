import React, { useEffect } from "react";
import { useFrame } from "react-frame-component";
import { ThreeDModelTypes } from "../../models/ThreeDModelTypes";

export default function ThreeDModelImageTrackingDisplay(props) {
  const position = props.position || { x: 0, y: 0, z: 0 };
  const scale = props.scale || { x: 1, y: 1, z: 1 };
  const rotation = props.rotation || { x: 0, y: 0, z: 0 };
  const src = props.src;
  const markerSrc = props.markerSrc;
  const threeDModelType = props.threeDModelType;
  const autoplay = props.autoplay;
  const { document, window } = useFrame();

  useEffect(() => {
    if (!autoplay) return;

    const model = document.getElementById("model");
    const nft = document.querySelector("a-nft");
    console.log("model", model);
    console.log("nft", nft);
    nft.addEventListener("markerFound", () => {
      model.setAttribute("animation-mixer", "loop: repeat; timeScale: 1;");
    });
    nft.addEventListener("markerLost", () => {
      model.removeAttribute("animation-mixer");
    });
  }, []);

  return (
    <div>
      <div className="arjs-loader">
        <div>Loading, please wait...</div>
      </div>
      <a-scene
        vr-mode-ui="enabled: false;"
        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
        renderer="antialias: true; alpha: true; precision: medium;"
      >
        <a-nft
          type="nft"
          url={
            markerSrc.includes("http://")
              ? "https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/trex-image/trex"
              : markerSrc
          }
          smooth="true"
          smoothCount="10"
          smoothTolerance=".01"
          smoothThreshold="5"
        >
          {threeDModelType === ThreeDModelTypes.gltf ? (
            <a-entity
              id="model"
              gltf-model={src}
              scale={`${scale.x} ${scale.y} ${scale.z}`}
              position={`${position.x} ${position.y} ${position.z}`}
              rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}
            ></a-entity>
          ) : threeDModelType === ThreeDModelTypes.obj ? (
            <a-entity
              id="model"
              obj-model={
                "obj: " + src + "; mtl: " + src.replace(".obj", ".mtl") + ";"
              }
              scale={`${scale.x} ${scale.y} ${scale.z}`}
              position={`${position.x} ${position.y} ${position.z}`}
              rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}
            ></a-entity>
          ) : threeDModelType === ThreeDModelTypes.fbx ? (
            <a-entity
              id="model"
              fbx-model={src}
              scale={`${scale.x} ${scale.y} ${scale.z}`}
              position={`${position.x} ${position.y} ${position.z}`}
              rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}
            ></a-entity>
          ) : null}
        </a-nft>

        <a-entity camera></a-entity>
      </a-scene>
    </div>
  );
}
