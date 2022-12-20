import React, { useState } from "react";
import { Paper, Typography, Divider } from "@material-ui/core";
import Comments from "../comment/comments";
import axios from "axios";

export default function UserPhotoList(props) {
  const [comment, setComment] = useState("");
  const _functionAddComm = (id) => {
    console.log("====================================");
    console.log(comment, id);
    console.log("====================================");
    if (comment.length > 0 && id.length > 0) {
      var data = JSON.stringify({
        comment: comment,
        user_id: "63a0556a6d44add19b49b795",
      });

      var config = {
        method: "post",
        url: `http://localhost:5000/commentsOfPhoto/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          props.setCheck(!props.check);
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  return (
    <div>
      <Paper>
        <Typography>{props.element.date_time}</Typography>
        <img
          style={{ width: "50%", height: "60%" }}
          src={"/../../images/" + props.element.file_name}
        />
        <div style={{ width: "50%", height: "60%" }}>
          {props.c ? (
            props.writedComment.map((commentIndex, index) => (
              <Comments key={index} el={commentIndex} />
            ))
          ) : (
            <p>no comment</p>
          )}
        </div>
        <input
          className="input_comment"
          placeholder="add comment..."
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
        <button
          type="button"
          onClick={() => {
            _functionAddComm(props.element._id);
          }}
        >
          Add
        </button>
        <Divider />
      </Paper>
    </div>
  );
}
