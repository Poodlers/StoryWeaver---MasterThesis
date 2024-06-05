import { Box, Button, ButtonBase, Typography } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import React, { useEffect } from "react";
import { backgroundColor, textColor } from "../../themes";
import { useFrame } from "react-frame-component";

export default function VideoImageTrackingARDisplay(props) {
  const position = props.position || { x: 0, y: 0, z: 0 };
  const scale = props.scale || { x: 1, y: 1, z: 1 };
  const rotation = props.rotation || { x: 0, y: 0, z: 0 };
  const src = props.src;
  const markerSrc = props.markerSrc;

  const { document, window } = useFrame();

  useEffect(() => {
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
            width="500"
            height="500"
            rotation="-90 0 0"
            position="250 0 0"
          ></a-video>
        </a-nft>

        <a-entity camera></a-entity>
      </a-scene>
    </div>
  );
}
