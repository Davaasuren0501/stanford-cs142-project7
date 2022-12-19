import React from "react";
import { HashRouter, Link, Router } from "react-router-dom";

export default function Register() {
  return (
    <div>
      <h3>
        please register as a new user.
        <br />
      </h3>
      <br />
      <br />
      <label>Login name : </label>
      <input type="text" />
      <br />
      <br />
      <label>Password : </label>
      <input type="password" />
      <br />
      <br />
      <label>Pass again: </label>
      <input type="password" />
      <br />
      <br />
      <button type="button">Register</button>
      <Link to={`/login`}>
        <button type="button">Login</button>
      </Link>
      <span> </span>
    </div>
  );
}
