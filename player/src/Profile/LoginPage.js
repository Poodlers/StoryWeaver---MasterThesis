import React, { useState, useEffect } from "react";
import { ApiDataRepository } from "../api/ApiDataRepository";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "../data/constants";
import { ButtonBase } from "@mui/material";

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
    <div className="App">
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <GoogleLogin
          state_cookie_domain="single_host_origin"
          onSuccess={responseGoogle}
          onError={() => {
            console.log("Login Failed");
          }}
        />
        <ButtonBase onClick={getAllUsers}>Get All Users</ButtonBase>
        {isLoggedIn && <button onClick={logout}>Logout</button>}
      </GoogleOAuthProvider>
    </div>
  );
}
