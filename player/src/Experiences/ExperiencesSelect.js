import { Box, Icon, IconButton, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { backgroundColor, primaryColor, textColor } from "../themes";
import { ApiDataRepository } from "../api/ApiDataRepository";
import { ComponentState } from "../models/ComponentState";
import ProjectListing from "./ProjectListing";

export default function ExperiencesSelect(props) {
  const repo = ApiDataRepository.getInstance();
  const [searchString, setSearchString] = React.useState("");
  const setExperience = props.setExperience;
  const [projects, setProjects] = React.useState([]);
  const [componentState, setComponentState] = React.useState(
    ComponentState.LOADING
  );

  useEffect(() => {
    repo
      .getExportedProjects()
      .then((projects) => {
        console.log(projects);
        setProjects(projects);
        setComponentState(ComponentState.LOADED);
      })
      .catch((error) => {
        setComponentState(ComponentState.ERROR);
      });
  }, []);

  const searchProjects = async () => {
    setComponentState(ComponentState.LOADING);
    if (searchString === "") {
      repo.getExportedProjects().then((projects) => {
        setProjects(projects);
        setComponentState(ComponentState.LOADED);
      });
      return;
    }

    repo
      .searchProjects(searchString)
      .then((projects) => {
        setProjects(projects);
        setComponentState(ComponentState.LOADED);
      })
      .catch((error) => {
        setComponentState(ComponentState.ERROR);
      });
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          pt: 2,
          textAlign: "center",
        }}
      >
        Experiências
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          mt: 2,
          px: 2,
        }}
      >
        <TextField
          id="outlined-basic"
          variant="outlined"
          value={searchString}
          inputProps={{
            style: {
              borderRadius: 0,
              color: "black",
              height: 40,
              padding: 0,
              margin: 0,
              borderColor: "transparent",
              borderWidth: 0,
              backgroundColor: textColor,
              borderRadius: 10,
              textAlign: "start",
              paddingLeft: 15,
            },
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              searchProjects();
            }
          }}
          onChange={(event) => {
            setSearchString(event.target.value);
          }}
          sx={{
            flexGrow: 1,
            py: 0,
            color: textColor,
            mx: "10px",
            borderRadius: 0,
            ".MuiInputBase-root": {
              borderRadius: 2,
              backgroundColor: textColor,
            },
          }}
        />
        <IconButton
          onClick={() => {
            searchProjects();
          }}
        >
          <img src="../assets/search_icon.svg" />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          justifyContent: "center",
          mt: 2,
          px: 3,
        }}
      >
        {componentState === ComponentState.LOADING ? (
          <Typography
            variant="h4"
            sx={{
              color: textColor,
              textAlign: "center",
            }}
          >
            Carregando...
          </Typography>
        ) : componentState === ComponentState.ERROR ? (
          <Typography
            variant="h5"
            sx={{
              color: textColor,
              textAlign: "center",
            }}
          >
            Error loading projects
          </Typography>
        ) : (
          projects.map((project) => {
            return (
              <ProjectListing
                key={project.id}
                project={project}
                setExperience={setExperience}
              ></ProjectListing>
            );
          })
        )}
      </Box>
    </Box>
  );
}
