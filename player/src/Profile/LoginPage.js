import React, { useState, useEffect } from "react";
import { ApiDataRepository } from "../api/ApiDataRepository";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "../data/constants";
import { AppBar, Box, ButtonBase, Typography } from "@mui/material";
import { primaryColor, tertiaryColor, textColor } from "../themes";

export default function LoginPage(props) {
  const repo = ApiDataRepository.getInstance();
  const isLoggedIn = props.isLoggedIn;
  const setLoginStatus = props.setLoginStatus;

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
        {isLoggedIn ? null : (
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
