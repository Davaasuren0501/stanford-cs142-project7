import React, { useState, useEffect } from "react";
import { Typography, Divider } from "@material-ui/core";
import { HashRouter, Link, Route, useParams } from "react-router-dom";
import "./userDetail.css";
import fetchModel from "../../lib/fetchModelData";
import axios from "axios";

const UserDetail = (props) => {
  // console.log( "ddddddddddddd " + props.match.params.userId );
  // console.log( props.match.params.userId);
  const [user, setUser] = useState([]);
  // const [uploadInput, setUploadInput] = useState("");
  let uploadInput;
  useEffect(
    () => {
      let userId = props.match.params.userId;
      const result = fetchModel(
        `http://localhost:5000/user/${userId}`,
        setUser
      );
      console.log(result);
      console.log("user list");
      console.log(user);
    },
    //yu oorchlogdvol dahiad duudah huvisgchaa ene massv hiij ogno
    [props.match.params.userId]
  );

  const login_user_id = sessionStorage.getItem("LoginUserId");

  const _functionUpload = (e) => {
    e.preventDefault();
    console.log("====================================");
    console.log("_functionUpload ");
    console.log(uploadInput.files);
    console.log(uploadInput.files[0]);
    console.log("====================================");
    if (uploadInput.files.length > 0) {
      // Create a DOM form and add the file to it under the name uploadedphoto
      const domForm = new FormData();
      domForm.append("uploadedphoto", uploadInput.files[0]);
      // axios
      //   .post("http://localhost:5000/photos/new", domForm)
      //   .then((res) => {
      //     var photoURL = "/photo-share.html#/photos/" + res.data.user_id;
      //     window.location.assign(photoURL);
      //   })
      //   .catch((err) => {
      //     console.log(`POST ERR: ${err}`);
      //   });
    }
  };

  return (
    <div>
      <Typography variant="h5">
        {user.first_name} {user.last_name}
      </Typography>
      <div className="upload">
        <div>
          <Typography variant="subtitle1">
            <b>Address: </b>
            {user.location}
          </Typography>
          <Typography variant="body1">
            <b>Occupation: </b>
            {user.occupation}
          </Typography>
          <Typography variant="body1">
            <b>Description: </b>
            {user.description}
          </Typography>
        </div>
        {login_user_id === props.match.params.userId && (
          <div>
            <form onSubmit={_functionUpload}>
              <label>
                <input
                  type="file"
                  accept="image/*"
                  ref={(domFileRef) => {
                    // setUploadInput(domFileRef);
                    uploadInput = domFileRef;
                    console.log(domFileRef);
                    // this.uploadInput = domFileRef;
                  }}
                />
              </label>
              <br />
              <br />
              <input type="submit" value="Upload Photo" />
            </form>
          </div>
        )}
      </div>

      <Divider />
      <HashRouter>
        <Link to={`/photos/${user._id}`}>Photos</Link>
      </HashRouter>
    </div>
  );
};

export default UserDetail;
