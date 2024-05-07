import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import React from "react";
import LoginPage from "./LoginPage";

export default function Profile(props) {
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <LoginPage />
    </Box>
  );
}
