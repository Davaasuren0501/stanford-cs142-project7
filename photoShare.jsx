import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Link } from "react-router-dom";
import { Grid, Typography, Paper } from "@material-ui/core";
import { Cookies } from "react-cookie";
import "./styles/main.css";

// import necessary components
import TopBar from "./components/topBar/TopBar";
import UserDetail from "./components/userDetail/userDetail";
import UserList from "./components/userList/userList";
import UserPhotos from "./components/userPhotos/userPhotos";
import Login from "./components/loginRegister/login";
import Register from "./components/loginRegister/register";

//context

const cookies = new Cookies();
class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: cookies.get("session"),
    };
  }

  render() {
    console.log(this.state.token);
    let isLoggedIn;
    if (sessionStorage.getItem("isLoggedIn")) {
      isLoggedIn = true;
    } else {
      isLoggedIn = false;
    }
    return (
      <HashRouter>
        <div>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <TopBar />
            </Grid>
            <div className="cs142-main-topbar-buffer" />
            {/* {this.state.token !== undefined ? ( */}
            {isLoggedIn ? (
              <>
                <Grid item sm={3}>
                  <Paper className="cs142-main-grid-item">
                    <UserList />
                  </Paper>
                </Grid>
                <Grid item sm={9}>
                  <Paper className="cs142-main-grid-item">
                    <Switch>
                      <Route
                        exact
                        path="/"
                        render={() => (
                          <Typography variant="body1">
                            Welcome to your photosharing app! This{" "}
                            <a href="https://mui.com/components/paper/">
                              Paper
                            </a>{" "}
                            component displays the main content of the
                            application. The {"sm={9}"} prop in the{" "}
                            <a href="https://mui.com/components/grid/">Grid</a>{" "}
                            item component makes it responsively display 9/12 of
                            the window. The Switch component enables us to
                            conditionally render different components to this
                            part of the screen. You don&apos;t need to display
                            anything here on the homepage, so you should delete
                            this Route component once you get started.
                          </Typography>
                        )}
                      />
                      <Route
                        path="/users/:userId"
                        render={(props) => <UserDetail {...props} />}
                      />
                      <Route
                        path="/photos/:userId"
                        render={(props) => <UserPhotos {...props} />}
                      />
                      <Route path="/users" component={UserList} />
                    </Switch>
                  </Paper>
                </Grid>
              </>
            ) : (
              <Grid item sm={9}>
                <Paper className="cs142-main-grid-item">
                  <Switch>
                    <Route
                      exact
                      path="/"
                      render={() => (
                        <Typography variant="body1">
                          You are not login
                          <Link to={`/login/`}>-----Login </Link> or
                          <Link to={`/register/`}> -----Register</Link>
                        </Typography>
                      )}
                    />
                    <Route
                      path="/login"
                      render={(props) => <Login {...props} />}
                    />
                    <Route
                      path="/register"
                      render={(props) => <Register {...props} />}
                    />
                  </Switch>
                </Paper>
              </Grid>
            )}
          </Grid>
        </div>
      </HashRouter>
    );
  }
}

ReactDOM.render(<PhotoShare />, document.getElementById("photoshareapp"));
