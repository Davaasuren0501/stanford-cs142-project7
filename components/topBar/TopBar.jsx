import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import "./TopBar.css";
import { Cookies } from "react-cookie";

/**
 * Define TopBar, a React componment of CS142 project #5
 */
const cookies = new Cookies();
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: cookies.get("session"),
    };
  }

  render() {
    console.log("====================================");
    console.log(this.state.token);
    console.log("====================================");
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar className="toolbar">
          <Typography variant="h5" color="inherit">
            {this.state.token === undefined ? "photo share app" : "hi dear"}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
