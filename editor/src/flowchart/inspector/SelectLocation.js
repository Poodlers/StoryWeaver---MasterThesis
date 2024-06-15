import {
  Icon,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useRef, useState } from "react";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";
import FileSelectField from "./FileSelect";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";
import { ApiDataRepository } from "../../api/ApiDataRepository";

function SelectLocationField(props) {
  const repo = ApiDataRepository.getInstance();
  const label = props.data.label;
  const conditional = props.conditional == undefined ? true : props.conditional;
  const style = props.style;
  const value = props.value;
  const options = props.data.options;

  const maps = JSON.parse(localStorage.getItem("maps")) || [];
  const handleFieldChange = props.onChange;
  const [selectedMap, setSelectedMap] = React.useState(
    maps.find((map) => map.name == value.map)
  );

  React.useEffect(() => {
    if (value.trigger_mode == "QR-Code") {
      repo
        .checkIfFileExists(value.qr_code + ".iset")
        .then((response) => {
          handleFieldChange(props.data.name, {
            trigger_mode: value.trigger_mode,
            map: value.map,
            place: value.place,
            qr_code: value.qr_code,
            tolerance: value.tolerance,
            image: value.image,
            marker_generation: {
              ...value.marker_generation,
              qr_code: "Complete",
            },
          });
        })
        .catch((error) => {});
    } else if (value.trigger_mode == "Image Tracking") {
      repo
        .checkIfFileExists(value.image.filename.split(".")[0] + ".iset")
        .then((response) => {
          handleFieldChange(props.data.name, {
            trigger_mode: value.trigger_mode,
            map: value.map,
            place: value.place,
            qr_code: value.qr_code,
            tolerance: value.tolerance,
            image: value.image,
            marker_generation: {
              ...value.marker_generation,
              image: "Complete",
            },
          });
        })
        .catch((error) => {});
    }
  }, [value.qr_code, value.image, value.trigger_mode]);

  const qrCodeRef = useRef(null);

  const handleQrCodeGenerator = () => {
    if (!value.qr_code) {
      return;
    }
    downloadQRCode();
    generateMarkerFilesQRCode();
  };
  const downloadQRCode = () => {
    htmlToImage
      .toPng(qrCodeRef.current)
      .then(function (dataUrl) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = value.qr_code + ".png";
        link.click();
      })
      .catch(function (error) {
        console.error("Error generating QR code:", error);
      });
  };

  const generateMarkerFilesQRCode = async () => {
    htmlToImage
      .toBlob(qrCodeRef.current)
      .then(function (blob) {
        const file = new File([blob], value.qr_code + ".png", {
          type: "image/png",
        });
        repo
          .uploadFile(file)
          .then((response) => {
            handleFieldChange(props.data.name, {
              trigger_mode: value.trigger_mode,
              map: value.map,
              place: value.place,
              qr_code: value.qr_code,
              tolerance: value.tolerance,
              image: value.image,
              marker_generation: {
                ...value.marker_generation,
                qr_code: "Started",
              },
            });
            repo
              .requestGenerateMarkerFiles(file.name)
              .then((response) => {
                console.log(response);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.error("Error generating QR code:", error);
      });
  };

  const handleImageTrackFieldChange = (
    name,
    newImageValue,
    newMarkerGeneration
  ) => {
    handleFieldChange(props.data.name, {
      trigger_mode: value.trigger_mode,
      map: value.map,
      place: value.place,
      qr_code: value.qr_code,
      tolerance: value.tolerance,
      image: newImageValue,
      marker_generation: {
        ...value.marker_generation,
        image: newMarkerGeneration,
      },
    });
  };

  return (
    <Box
      sx={{
        display: conditional ? "flex" : "none",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h7"
          component="div"
          sx={{
            flexGrow: 1,
            py: 1,
            px: 2,
            color: textColor,
            m: 0,
            textAlign: "start",
          }}
        >
          {label}
        </Typography>
        <Select
          sx={{
            color: "black",
            backgroundColor: "white",
            padding: 0,
            margin: 0,
            mr: "10px",
            outline: "none",
            height: 40,
            width: "35%",
          }}
          value={value.trigger_mode}
          onChange={(event) => {
            handleFieldChange(props.data.name, {
              trigger_mode: event.target.value,
              map: value.map,
              place: value.place,
              qr_code: value.qr_code,
              tolerance: value.tolerance,
              image: value.image,
              marker_generation: value.marker_generation,
            });
          }}
        >
          {options.map((option, index) => {
            return (
              <MenuItem sx={{ color: "black" }} key={index} value={option}>
                {option}
              </MenuItem>
            );
          })}
        </Select>
      </Box>

      <Box sx={{ backgroundColor: primaryColor, width: "100%", mt: 2 }}>
        <Typography
          variant="h7"
          component="div"
          sx={{ py: 1, px: 2, color: textColor, m: 0 }}
        >
          {label}
        </Typography>
      </Box>

      {value.trigger_mode === "GPS Coords" ? (
        maps.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              m: 0,
              mt: 2,
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ px: 2, color: textColor, m: 0 }}
            >
              GPS Coords
            </Typography>
            <Typography
              variant="h7"
              component="div"
              sx={{ px: 2, color: textColor, m: 0, fontSize: 16, py: 1 }}
            >
              O conteúdo AR será exibido quando o utilizador estiver a uma
              distância de {value.tolerance} metro(s) do local selecionado!
            </Typography>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h7"
                component="div"
                sx={{
                  py: 1,
                  px: 2,
                  color: textColor,
                  m: 0,
                  textAlign: "start",
                }}
              >
                Mapa:
              </Typography>
              <Select
                sx={{
                  color: "black",
                  backgroundColor: "white",
                  width: "50%",
                  height: 40,
                  padding: 0,
                  margin: 0,
                  mr: "10px",
                }}
                value={value.map}
                onChange={(event) => {
                  handleFieldChange(props.data.name, {
                    trigger_mode: value.trigger_mode,
                    map: event.target.value,
                    place: value.place,
                    tolerance: value.tolerance,
                    qr_code: value.qr_code,
                    image: value.image,
                    marker_generation: value.marker_generation,
                  });
                  setSelectedMap(
                    maps.find((map) => map.name == event.target.value)
                  );
                }}
              >
                {maps.map((map, index) => {
                  return (
                    <MenuItem
                      sx={{ color: "black" }}
                      key={index}
                      value={map.name}
                    >
                      {map.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </Box>

            <Box
              sx={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 2,
              }}
            >
              <Typography
                variant="h7"
                component="div"
                sx={{ py: 1, px: 2, color: textColor, m: 0 }}
              >
                Place:
              </Typography>
              <Select
                sx={{
                  color: "black",
                  backgroundColor: "white",
                  width: "50%",
                  height: 40,
                  padding: 0,
                  margin: 0,
                  mr: "10px",
                }}
                value={value.place}
                SelectDisplayProps={{
                  style: {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "left",
                  },
                }}
                onChange={(event) => {
                  handleFieldChange(props.data.name, {
                    trigger_mode: value.trigger_mode,
                    map: value.map,
                    place: event.target.value,
                    qr_code: value.qr_code,
                    tolerance: value.tolerance,
                    image: value.image,
                    marker_generation: value.marker_generation,
                  });
                }}
              >
                {selectedMap == undefined
                  ? null
                  : selectedMap.anchors
                      .filter((anchor) => anchor.anchorType != "anchor")
                      .map((place, index) => {
                        return (
                          <MenuItem
                            sx={{
                              color: "black",
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "left",
                            }}
                            key={index}
                            value={place.name}
                          >
                            <Icon sx={{ fontSize: 20, color: "black", mr: 1 }}>
                              {place.icon}
                            </Icon>
                            {place.name}
                          </MenuItem>
                        );
                      })}
              </Select>
            </Box>

            <Box
              sx={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 2,
              }}
            >
              <Typography
                variant="h7"
                component="div"
                sx={{
                  py: 1,
                  px: 2,
                  color: textColor,
                  m: 0,

                  textAlign: "start",
                }}
              >
                Tolerância de distância (metros):
              </Typography>

              <TextField
                inputProps={{
                  style: {
                    color: "black",
                    height: 40,
                    padding: 0,
                    margin: 0,
                    backgroundColor: "#ffffff",
                    borderRadius: 10,
                  },
                }}
                sx={{
                  py: 0,
                  px: 1,
                  color: textColor,
                  flexGrow: 1,
                  borderRadius: 0,
                  ".MuiInputBase-root": {
                    borderRadius: 2,
                    backgroundColor: "#ffffff",
                  },
                }}
                id="outlined-basic"
                variant="outlined"
                value={value.tolerance}
                onChange={(event) => {
                  handleFieldChange(props.data.name, {
                    trigger_mode: value.trigger_mode,
                    map: value.map,
                    place: value.place,
                    qr_code: value.qr_code,
                    image: value.image,
                    tolerance: event.target.value,
                    marker_generation: value.marker_generation,
                  });
                }}
              />
            </Box>
          </Box>
        ) : (
          <Typography
            variant="h7"
            component="div"
            sx={{
              py: 1,
              px: 2,
              color: "black",
              m: 0,
              fontSize: 18,
              fontWeight: "bold",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon>warning</Icon>Nenhum mapa disponível - Adicione um mapa na aba
            'Mapa'!
          </Typography>
        )
      ) : value.trigger_mode === "QR-Code" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ px: 2, color: textColor, m: 0 }}
          >
            QR-Code:
          </Typography>
          <Typography
            variant="h7"
            component="div"
            sx={{ px: 2, color: textColor, m: 0, fontSize: 16 }}
          >
            Imprima o código QR abaixo e coloque no local onde quer que o
            conteúdo apareça!
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <Typography
              variant="h7"
              component="div"
              sx={{ py: 1, px: 1, color: textColor, m: 0 }}
            >
              Código:
            </Typography>

            <TextField
              inputProps={{
                style: {
                  color: "black",
                  height: 40,
                  padding: 0,
                  margin: 0,
                  backgroundColor: "#ffffff",
                  borderRadius: 10,
                },
              }}
              sx={{
                flexGrow: 1,
                py: 0,
                px: 2,
                color: textColor,
                mx: "10px",
                borderRadius: 0,
                ".MuiInputBase-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                },
              }}
              id="outlined-basic"
              variant="outlined"
              value={value.qr_code}
              onChange={(event) => {
                handleFieldChange(props.data.name, {
                  trigger_mode: value.trigger_mode,
                  map: value.map,
                  place: value.place,
                  qr_code: event.target.value,
                  tolerance: value.tolerance,
                  image: value.image,
                  marker_generation: {
                    ...value.marker_generation,
                    qr_code: "Not Started",
                  },
                });
              }}
            />
            <Box
              sx={{
                cursor: "pointer",
              }}
              onClick={() => {
                handleQrCodeGenerator();
              }}
            >
              <Icon fontSize="large" sx={{ fontSize: "100px", color: "black" }}>
                print
              </Icon>
            </Box>
          </Box>

          <QRCode
            ref={qrCodeRef}
            style={{ marginTop: "10px" }}
            value={value.qr_code}
            size={100}
          />

          <Typography
            variant="h7"
            component="div"
            sx={{
              px: 2,
              color: "black",
              m: 0,
              mt: 2,
              width: "100%",
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            {value.marker_generation == "Not Started" ? (
              <Icon sx={{ px: 2 }}>info</Icon>
            ) : value.marker_generation == "Started" ? (
              <Icon sx={{ px: 2 }}>check_circle</Icon>
            ) : (
              <Icon sx={{ px: 2 }}>warning</Icon>
            )}
            {value.marker_generation.qr_code == "Not Started"
              ? "Para iniciar a geração dos marcadores, clique no ícone de impressão!"
              : value.marker_generation.qr_code == "Started"
              ? "Nenhum marcador gerado pelo servidor ainda. O processo pode demorar alguns minutos."
              : "Marcadores prontos! O conteúdo AR será exibido quando o QR Code for detetado pela câmara!"}
          </Typography>
        </Box>
      ) : (
        <>
          <Typography
            variant="h6"
            component="div"
            sx={{ px: 2, color: textColor, m: 0, py: 2 }}
          >
            Image Tracking:
          </Typography>
          <Typography
            variant="h7"
            component="div"
            sx={{ px: 2, color: textColor, m: 0, fontSize: 16 }}
          >
            Quando a imagem selecionada for detetada pela câmara, o conteúdo AR
            será exibido!
          </Typography>
          <FileSelectField
            generateMarkerFiles={true}
            data={{ label: "Imagem:", name: "image" }}
            style={{ mt: 2 }}
            value={value.image}
            onChange={handleImageTrackFieldChange}
          />
          <Typography
            variant="h7"
            component="div"
            sx={{
              px: 2,
              color: "black",
              m: 0,
              mt: 2,
              width: "100%",
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            {value.marker_generation == "Not Started" ? (
              <Icon sx={{ px: 2 }}>info</Icon>
            ) : value.marker_generation == "Started" ? (
              <Icon sx={{ px: 2 }}>check_circle</Icon>
            ) : (
              <Icon sx={{ px: 2 }}>warning</Icon>
            )}
            {value.marker_generation.image == "Not Started"
              ? "Para iniciar a geração dos marcadores, insira uma imagem!"
              : value.marker_generation.image == "Started"
              ? "Nenhum marcador gerado pelo servidor ainda. O processo pode demorar alguns minutos."
              : "Marcadores prontos! O conteúdo AR será exibido quando a Imagem for detetada pela câmara!"}
          </Typography>
        </>
      )}
    </Box>
  );
}

export default SelectLocationField;
