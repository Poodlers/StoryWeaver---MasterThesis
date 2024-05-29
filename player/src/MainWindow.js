import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import React from "react";
import { primaryColor, secondaryColor, textColor } from "./themes";
import ExperiencesWindow from "./Experiences/Experiences";
import Profile from "./Profile/Profile";

export default function MainWindow(props) {
  const [activeWindow, setActiveWindow] = React.useState("Experiências");

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: secondaryColor,
      }}
    >
      {activeWindow === "Experiências" ? <ExperiencesWindow /> : <Profile />}

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: primaryColor,
        }}
      >
        <BottomNavigation
          sx={{
            width: "100%",
            p: 0,
            m: 0,
            height: "70px",
            flexDirection: "row",
            backgroundColor: primaryColor,
            color: textColor,
            "& .Mui-selected": {
              color: primaryColor,
              backgroundColor: secondaryColor,
            },
          }}
          showLabels
          value={activeWindow}
          onChange={(event, newValue) => {
            setActiveWindow(newValue);
          }}
        >
          <BottomNavigationAction
            sx={{
              color: textColor,
              width: "100%",
              flexGrow: 1,
              maxWidth: "100%",
              fontWeight: "bold",
            }}
            value={"Experiências"}
            label="Experiências"
            icon={<img src="../assets/play_svg.svg" />}
          />
          <BottomNavigationAction
            sx={{
              color: textColor,
              width: "100%",
              fontWeight: "bold",
              flexGrow: 1,
              maxWidth: "100%",
            }}
            value={"Perfil"}
            label="Perfil"
            icon={<img src="../assets/user_svg.svg" />}
          />
        </BottomNavigation>
      </Box>
    </Box>
  );
}
