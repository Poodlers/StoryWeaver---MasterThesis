import { Box, Icon, Typography } from "@mui/material";
import { Handle, Position } from "reactflow";
import {
  leftNodeHandleStyle,
  rightNodeHandleStyle,
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";

export default function PathNode(props) {
  const pathName = props.data?.name ?? "";
  const start = props.data?.start ?? "";
  const maps = localStorage.getItem("maps")
    ? JSON.parse(localStorage.getItem("maps"))
    : [];
  const mapStart = maps.find((map) => map.name == start.map);
  const mapEnd = maps.find((map) => map.name == end.map);
  const placeStart = mapStart
    ? mapStart.anchors.find((place) => place.name == start.place)
    : null;

  const end = props.data?.destination ?? "";
  const placeEnd = mapEnd
    ? mapEnd.anchors.find((place) => place.name == end.place)
    : null;
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={leftNodeHandleStyle}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={rightNodeHandleStyle}
      />
      <Box
        sx={{
          backgroundColor: primaryColor,
          borderColor: tertiaryColor,
          justifyContent: "start",
          borderWidth: 2,
          borderStyle: "solid",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            px: 2,
            fontSize: 15,
            color: textColor,
            fontWeight: 400,
            textAlign: "center",
          }}
        >
          Path - Caminho
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: secondaryColor,
          borderColor: tertiaryColor,
          borderWidth: 2,
          borderStyle: "solid",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: primaryColor,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              px: 3,
              fontSize: 15,
              color: textColor,
              fontWeight: 400,
              textAlign: "center",
            }}
          >
            Nome
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: secondaryColor,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              px: 3,
              py: 1,
              fontSize: 12,
              color: textColor,
              fontWeight: 200,
            }}
          >
            {pathName}
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: primaryColor,
          }}
        >
          <Typography
            variant="h6"
            sx={{ px: 3, fontSize: 15, color: textColor, fontWeight: 400 }}
          >
            Início
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: secondaryColor,
          }}
        >
          <>
            {start.trigger_mode === "GPS Coords" ? (
              <Box
                sx={{
                  color: "black",
                  display: "flex",
                  py: 2,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon sx={{ fontSize: 20, color: textColor, mr: 1 }}>
                  {placeStart ? placeStart.icon : "place"}
                </Icon>
                <Typography
                  variant="h6"
                  sx={{
                    px: 1,
                    fontSize: 15,
                    color: textColor,
                    fontWeight: 400,
                    textAlign: "center",
                  }}
                >
                  {start.place}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  color: "black",
                  display: "flex",
                  py: 2,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon sx={{ fontSize: 20, color: textColor, mr: 1 }}>
                  qr_code
                </Icon>
                <Typography
                  variant="h7"
                  sx={{
                    px: 1,
                    fontSize: 15,
                    color: textColor,
                    fontWeight: 400,
                    textAlign: "center",
                  }}
                >
                  {start.qr_code}
                </Typography>
              </Box>
            )}
          </>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: primaryColor,
          }}
        >
          <Typography
            variant="h6"
            sx={{ px: 3, fontSize: 15, color: textColor, fontWeight: 400 }}
          >
            Destino
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: secondaryColor,
          }}
        >
          {end.trigger_mode === "GPS Coords" ? (
            <Box
              sx={{
                color: "black",
                display: "flex",
                py: 2,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon sx={{ fontSize: 20, color: textColor, mr: 1 }}>
                {placeEnd ? placeEnd.icon : "place"}
              </Icon>
              <Typography
                variant="h6"
                sx={{
                  px: 1,
                  fontSize: 15,
                  color: textColor,
                  fontWeight: 400,
                  textAlign: "center",
                }}
              >
                {end.place}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                color: textColor,
                display: "flex",
                py: 2,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon sx={{ fontSize: 20, color: textColor, mr: 1 }}>
                qr_code
              </Icon>
              <Typography
                variant="h7"
                sx={{
                  px: 1,
                  fontSize: 15,
                  color: textColor,
                  fontWeight: 400,
                  textAlign: "center",
                }}
              >
                {end.qr_code}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
