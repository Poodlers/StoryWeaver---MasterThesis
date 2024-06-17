import { Dialog, Grid, Icon, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { primaryColor, secondaryColor, textColor } from "../../themes";
import { ApiDataRepository } from "../../api/ApiDataRepository";

export default function LoadProjectPopup(props) {
  const repo = ApiDataRepository.getInstance();
  const open = props.open;
  const onClose = props.onClose;
  const projects = props.projects;
  const setDisplayAlert = props.setDisplayAlert;
  const setAlertMessage = props.setDisplayMessage;
  const setSeverity = props.setSeverity;

  const setProjects = props.setProjects;
  return (
    <Dialog
      id="load-project-popup"
      open={open}
      onClose={() => onClose(undefined)}
      sx={{
        width: "100%",
        scrollbarWidth: "thin",
        scrollbarColor: `${primaryColor} ${secondaryColor}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: secondaryColor,
          zIndex: 1,
          px: 5,
          m: "0 auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h7"
            component="div"
            sx={{
              py: 1,
              px: 4,
              color: textColor,
              textAlign: "center",
              ml: "auto",
              fontWeight: "bold",
              fontSize: 30,
              backgroundColor: primaryColor,
              borderBottomWidth: 3,
              mt: 2,
              mr: 2,
              borderBottomStyle: "solid",
              borderBottomColor: secondaryColor,
            }}
          >
            CARREGAR PROJETO
          </Typography>

          <Icon
            fontSize="large"
            onClick={() => onClose(undefined)}
            sx={{
              color: "black",
              ml: "auto",
              fontSize: "50px !important",
              cursor: "pointer",
            }}
          >
            close
          </Icon>
        </Box>

        <Box>
          <Box
            sx={{
              py: 10,
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            {projects.map((project) => {
              return (
                <Box
                  key={project.id}
                  sx={{
                    py: 2,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "start",
                    alignContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Typography
                    variant="h7"
                    component="div"
                    onClick={() => {
                      onClose(project.id);
                    }}
                    sx={{
                      py: 1,
                      px: 2,
                      color: "black",
                      textAlign: "center",
                      ml: "auto",
                      fontWeight: "bold",
                      fontSize: 20,
                      "&:hover": {
                        color: textColor + " !important",
                      },
                    }}
                  >
                    {project.title}
                  </Typography>
                  {project.id != localStorage.getItem("storyId") ? (
                    <IconButton
                      onClick={() =>
                        repo
                          .deleteProject(project.id)
                          .then(() => {
                            setProjects(
                              projects.filter((p) => p.id !== project.id)
                            );
                            setSeverity("success");
                            setAlertMessage("Projeto eliminado com sucesso!");
                            setDisplayAlert(true);
                          })
                          .catch((error) => {
                            setSeverity("error");
                            setAlertMessage(
                              "Ocorreu um erro ao eliminar o projeto!"
                            );
                            setDisplayAlert(true);
                          })
                      }
                    >
                      <Icon>delete</Icon>
                    </IconButton>
                  ) : null}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
