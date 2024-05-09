import React, { useState, useEffect } from "react";
import { ApiDataRepository } from "../api/ApiDataRepository";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "../data/constants";
import { AppBar, Box, ButtonBase, Typography } from "@mui/material";
import { primaryColor, tertiaryColor, textColor } from "../themes";

export default function LoginPage() {
  const repo = ApiDataRepository.getInstance();
  const [isLoggedIn, setLoginStatus] = useState(false);

  const getAllUsers = async () => {
    repo
      .getAllUsers()
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const responseGoogle = async (response) => {
    const bodyObject = {
      authId: response.credential,
    };

    if (!response.errors) {
      repo
        .loginUser(bodyObject)
        .then((res) => {
          console.log(res);
          localStorage.setItem("loginToken", res.loginToken);
          localStorage.setItem("userPicture", res.picture);
          localStorage.setItem("userName", res.name);
          localStorage.setItem("userEmail", res.email);
          setLoginStatus(true);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

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

  useEffect(() => {
    async function getStatus() {
      repo
        .checkLoginStatus()
        .then((res) => {
          console.log(res);
          if (!res.error) setLoginStatus(true);
        })
        .catch((e) => {
          console.log(e);
          setLoginStatus(false);
        });
    }
    getStatus();
  }, []);

  return (
    <div>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {isLoggedIn ? (
          <Box minHeight={"100vh"} display="flex" flexDirection="column">
            <AppBar
              position="static"
              sx={{
                height: "70px",
                backgroundColor: primaryColor,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" sx={{ color: textColor }}>
                Bem-vindo, {localStorage.getItem("userName")}
              </Typography>

              <ButtonBase
                onClick={logout}
                sx={{
                  color: textColor,
                  padding: "10px",
                  margin: "10px",
                  borderRadius: "5px",
                  backgroundColor: tertiaryColor,
                }}
              >
                <Typography variant="h5" sx={{ color: textColor }}>
                  Logout
                </Typography>
              </ButtonBase>
            </AppBar>
          </Box>
        ) : (
          <Box
            minHeight={"100vh"}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h5" sx={{ color: primaryColor }}>
              Parece que ainda não está logged in... Use o botão abaixo para
              entrar!
            </Typography>
            <GoogleLogin
              state_cookie_domain="single_host_origin"
              onSuccess={responseGoogle}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </Box>
        )}
      </GoogleOAuthProvider>
    </div>
  );
}
