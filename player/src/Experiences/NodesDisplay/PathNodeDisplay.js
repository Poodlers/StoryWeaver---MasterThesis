import {
  Box,
  ButtonBase,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import {
  backgroundColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import PlayerTextFinalDisplay from "./util/PlayerTextFinalDisplay";
import { ComponentState } from "../../models/ComponentState";
import { ARTriggerMode } from "../../models/ARTriggerModes";

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2 - lat1);
  var dLon = degreesToRadians(lon2 - lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export default function PathNodeDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const pathNode = props.node;
  const name = pathNode.data.name;

  const destination = pathNode.data.destination;

  const tolerance = destination.tolerance;

  const [isOnDestination, setIsOnDestination] = React.useState(false);

  const possibleNextNodes = props.possibleNextNodes;

  const backgroundFileInfo = pathNode.data.background;

  const [backgroundURL, setBackgroundURL] = React.useState("");

  const [distance, setDistance] = React.useState(0);

  const [componentState, setComponentState] = React.useState(
    ComponentState.LOADING
  );

  const intervalID = React.useRef([]);
  const setNextNode = props.setNextNode;

  useEffect(() => {
    if (destination.trigger_mode != ARTriggerMode.GPSCoords) return;
    repo
      .getMapPlaceCoords(destination.map, destination.place)
      .then((coords) => {
        intervalID.current.push(
          setInterval(() => {
            navigator.geolocation.getCurrentPosition((position) => {
              const currentCoords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              const distance = distanceInKmBetweenEarthCoordinates(
                currentCoords.lat,
                currentCoords.lng,
                coords.lat,
                coords.lng
              );
              setDistance(distance * 1000);
              console.log("Distance (m): " + distance * 1000);
              if (distance * 1000 < tolerance) {
                setIsOnDestination(true);
              }
            });
          }, 3000)
        );

        setComponentState(ComponentState.LOADED);
      })
      .catch((error) => {
        setComponentState(ComponentState.ERROR);
      });
  }, []);
  const [backgroundColor, setBackgroundColor] = React.useState("#000000");

  useEffect(() => {
    if (backgroundFileInfo.inputType == "color") {
      setBackgroundColor(backgroundFileInfo.color);
      setBackgroundURL("");
      return;
    }
    if (backgroundFileInfo.filename == "") {
      setBackgroundURL("");
      return;
    }
    if (backgroundFileInfo.inputType == "url") {
      setBackgroundURL(backgroundFileInfo.filename);
      setComponentState(ComponentState.LOADED);
    } else {
      repo
        .getFilePath(backgroundFileInfo.filename)
        .then((url) => {
          setBackgroundURL(url);
          setComponentState(ComponentState.LOADED);
        })
        .catch(() => {
          setBackgroundURL("");
          setComponentState(ComponentState.ERROR);
        });
    }
  }, [backgroundFileInfo]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background:
          backgroundURL == ""
            ? backgroundColor
            : `${backgroundColor} url(${backgroundURL}) no-repeat center center  fixed`,
        backgroundSize: "cover",
      }}
    >
      {componentState === ComponentState.LOADING ? (
        <Typography
          variant="h4"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          Loading...
        </Typography>
      ) : componentState === ComponentState.ERROR ? (
        <Typography
          variant="h4"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          Error loading
        </Typography>
      ) : (
        <>
          <PlayerTextFinalDisplay
            text={name}
            messageType={"Caminho"}
          ></PlayerTextFinalDisplay>
          {isOnDestination ? (
            <PlayerTextFinalDisplay
              text={"Você chegou ao destino! Pressione o botão para continuar."}
              messageType={"Caminho"}
            ></PlayerTextFinalDisplay>
          ) : (
            <PlayerTextFinalDisplay
              text={"Está a " + distance.toFixed(2) + " metros do destino."}
              messageType={"Caminho"}
            ></PlayerTextFinalDisplay>
          )}
          <ButtonBase
            sx={{
              backgroundColor: backgroundColor,
              color: textColor,
              position: "absolute",
              bottom: "10vh",
              right: 10,
            }}
            onClick={() => {
              intervalID.current.forEach((id) => {
                clearInterval(id);
              });

              setNextNode(possibleNextNodes[0]);
            }}
          >
            <Typography variant="h4">Avançar</Typography>
          </ButtonBase>
        </>
      )}
    </Box>
  );
}
