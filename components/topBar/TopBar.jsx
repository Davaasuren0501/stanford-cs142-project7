import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import "./TopBar.css";
import fetchModel from "../../lib/fetchModelData";
import axios from "axios";

export default function TopBar() {
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("");
  useEffect(() => {
    var currentURL = window.location.href;
    var _userId;
    if (currentURL.includes("/users/")) {
      _userId = currentURL.substring(
        currentURL.indexOf("/users/") + "/users/".length
      );
      console.log("====================================");
      console.log(_userId);
      console.log("====================================");
      let result = fetchModel(`http://localhost:5000/user/${_userId}`, setUser);
      console.log("====================================");
      console.log(result);
      console.log("====================================");
    }
    console.log("====================================");
    console.log(_userId);
    console.log("====================================");

    setUserId(_userId);
    console.log("====================================");
    console.log(user);
    console.log("====================================");
  }, []);

  const LogOut = () => {
    console.log("====================================");
    console.log("calling");
    console.log("====================================");
    window.location.assign("/photo-share.html#/login");
    window.location.reload();
    sessionStorage.clear();
    setUserId(null);
    setUser(null);
  };
  return (
    <AppBar className="cs142-topbar-appBar" position="absolute">
      <Toolbar className="toolbar">
        <Typography variant="h5" color="inherit">
          {userId === null || userId === undefined
            ? "photo share app"
            : user.login_name}
        </Typography>
        <Typography variant="h5" color="inherit" className="log_out">
          <div onClick={LogOut}>
            {userId === null || userId === undefined ? null : "Log Out"}
          </div>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
