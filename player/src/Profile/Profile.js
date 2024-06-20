import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  ButtonBase,
  Icon,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LoginPage from "./LoginPage";
import { primaryColor } from "../themes";
import { ApiDataRepository } from "../api/ApiDataRepository";

export default function Profile(props) {
  const repo = ApiDataRepository.getInstance();
  const setActiveWindow = props.setActiveWindow;
  const setExperience = props.setExperience;
  const [isLoggedIn, setLoginStatus] = useState(false);
  const [userStory, setUserStory] = useState([]);
  useEffect(() => {
    async function getStatus() {
      if (localStorage.getItem("loginToken")) {
        setLoginStatus(true);
        repo.getUserInfo().then((res) => {
          setUserStory(res.endings);
        });
      }
    }
    getStatus();
  }, []);

  const logout = async () => {
    try {
      repo.logoutUser().then((res) => {
        console.log(res);
        setLoginStatus(false);
        localStorage.removeItem("loginToken");
        localStorage.removeItem("userPicture");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {!isLoggedIn ? (
        <LoginPage isLoggedIn={isLoggedIn} setLoginStatus={setLoginStatus} />
      ) : (
        <Box minHeight={"100vh"} display="flex" flexDirection="column">
          <Typography
            variant="h4"
            sx={{
              pt: 2,
              textAlign: "center",
            }}
          >
            Perfil
          </Typography>
          <IconButton
            sx={{
              position: "absolute",
              right: "5px",
              top: "5px",
            }}
            onClick={logout}
          >
            <Icon sx={{ color: primaryColor, fontSize: "40px !important" }}>
              logout
            </Icon>
          </IconButton>

          <Typography variant="h6" sx={{ pt: 2, textAlign: "center" }}>
            Bem-vind@, {localStorage.getItem("userName")}
          </Typography>
          <Box
            sx={{
              px: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "start",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                pt: 2,

                textAlign: "start",
                textDecoration: "underline",
              }}
            >
              Histórico
            </Typography>
            <Box
              sx={{
                width: "100%",
              }}
            >
              {userStory.map((story, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "start",
                      pt: 2,
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        onClick={() => {
                          setExperience(story.storyId);
                          setActiveWindow("Experiências");
                        }}
                      >
                        <img
                          src={"../assets/play_svg.svg"}
                          alt={"play"}
                          style={{
                            width: "30px",
                            filter: "brightness(0) saturate(100%)",
                          }}
                        />
                      </IconButton>

                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: "600",
                          textAlign: "center",
                        }}
                      >
                        {story.experienceName}
                      </Typography>

                      <Typography>{story.lastPlayed.split("T")[0]}</Typography>
                    </Box>

                    <Typography
                      sx={{ pt: 2, textAlign: "center", width: "100%" }}
                    >
                      {story.endingsSeen.length < story.allEndings.length
                        ? "Você obteve " +
                          story.endingsSeen.length +
                          " de " +
                          story.allEndings.length +
                          " finais"
                        : "Você obteve todos os finais"}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
