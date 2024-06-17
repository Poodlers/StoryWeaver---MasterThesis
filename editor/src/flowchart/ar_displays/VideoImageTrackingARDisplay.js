import React, { useEffect } from "react";
import { useFrame } from "react-frame-component";

export default function VideoImageTrackingARDisplay(props) {
  const position = props.position || { x: 0, y: 0, z: 0 };
  const scale = props.scale || { x: 1, y: 1, z: 1 };
  const rotation = props.rotation || { x: 0, y: 0, z: 0 };
  const src = props.src;
  const markerSrc = props.markerSrc;

  const [videoWidth, setVideoWidth] = React.useState(600);
  const [videoHeight, setVideoHeight] = React.useState(600);
  const { document, window } = useFrame();

  useEffect(() => {
    var v = document.getElementById("vid");
    v.addEventListener(
      "loadedmetadata",
      function (e) {
        setVideoWidth(this.videoWidth);
        setVideoHeight(this.videoHeight);
      },
      false
    );
    if (!window.AFRAME.components["videohandler"]) {
      window.AFRAME.registerComponent("videohandler", {
        init: function () {
          var marker = this.el;
          console.log("registering videohandler");
          this.vid = document.querySelector("#vid");

          marker.addEventListener(
            "markerFound",
            function () {
              this.vid.play();
            }.bind(this)
          );

          marker.addEventListener(
            "markerLost",
            function () {
              this.vid.pause();
              this.vid.currentTime = 0;
            }.bind(this)
          );
        },
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (window.AFRAME.components["videohandler"]) {
        delete window.AFRAME.components["videohandler"];
      }
    };
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
        <a-text
          value="Hello, AR.js!"
          position="3 5 -10"
          scale="2 2 2"
          rotation="0 0 0"
        ></a-text>

        <a-assets>
          <video
            src={src}
            preload="auto"
            response-type="arraybuffer"
            id="vid"
            loop
            crossOrigin="anonymous"
            webkit-playsinline="true"
            muted={false}
            playsInline
          ></video>
        </a-assets>
        <a-nft
          videohandler
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
          <a-video
            src="#vid"
            width={videoWidth * scale.x}
            height={videoHeight * scale.z}
            rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}
            position={`${position.x} ${position.y} ${position.z}`}
          ></a-video>
        </a-nft>

        <a-entity camera></a-entity>
      </a-scene>
    </div>
  );
}
