import { Box, Typography } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import React, { useEffect } from "react";

export default function VideoImageTrackingARDisplay(props) {
  const position = props.position || { x: 0, y: 0, z: 0 };
  const scale = props.scale || { x: 1, y: 1, z: 1 };
  const rotation = props.rotation || { x: 0, y: 0, z: 0 };
  const src = props.src;
  const markerSrc = props.markerSrc;

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

    return () => {
      delete window.AFRAME.components["videohandler"];
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
        <Typography
          variant="h4"
          sx={{
            position: "absolute",
            top: "0",
            left: "0",
            zIndex: "1",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            padding: "5px",
          }}
        >
          {"Video AR Display"}
        </Typography>

        <a-assets>
          <video
            src={
              "http://localhost:8080/files/61df0221-5231-4104-94fd-1e43264d2f84/dc44034b-5880-4c07-ad9b-0d35ad7066c5content_warning_ca994a61.mp4"
            }
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
            "https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/trex-image/trex"
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
            rotation="90 0 180"
            position="100 150 -100"
          ></a-video>
        </a-nft>

        <a-entity camera></a-entity>
      </a-scene>
    </div>
  );
}
