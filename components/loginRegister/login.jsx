import React, { useState } from "react";
import { HashRouter, Link, Router } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [loginInfo, setLoginInfo] = useState({
    name: null,
    pass: null,
  });

  const _login = () => {
    console.log(loginInfo);
  };

  return (
    <div>
      <h3>
        Please log in with your username and password.
        <br />
      </h3>
      If you do not have an account, please register as a new user.
      <br />
      <br />
      <label>Username: </label>
      <input
        type="text"
        onChange={(e) => {
          setLoginInfo({ ...loginInfo, name: e.target.value });
        }}
      />
      <br />
      <br />
      <label>Password: </label>
      <input
        type="password"
        onChange={(e) => {
          setLoginInfo({ ...loginInfo, pass: e.target.value });
        }}
      />
      <br />
      <br />
      <button type="button" onClick={_login}>
        Login
      </button>
      <span> </span>
      <Link to={`/admin/register`}>
        <button type="button">Register</button>
      </Link>
    </div>
  );
}
