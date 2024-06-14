import { Box, IconButton, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { backgroundColor, textColor } from "../themes";
import { ApiDataRepository } from "../api/ApiDataRepository";
import { ComponentState } from "../models/ComponentState";
import ExperiencesSelect from "./ExperiencesSelect";
import ExperiencePlay from "./ExperiencePlay";

export default function ExperiencesWindow(props) {
  const experienceId = props.activeExperience;
  const setExperienceId = props.setExperience;

  return (
    <Box>
      {experienceId == undefined ? (
        <ExperiencesSelect setExperience={setExperienceId} />
      ) : (
        <ExperiencePlay
          projectId={experienceId}
          setExperience={setExperienceId}
        />
      )}
    </Box>
  );
}
