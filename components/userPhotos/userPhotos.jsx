import React, { useState, useEffect } from "react";
import "./userPhotos.css";
import fetchModel from "../../lib/fetchModelData";
import UserPhotoList from "../userPhotosList/userPhotoList";

/*
 * Define UserPhotos, a React componment of CS142 project #5
 */

export default function UserPhotos(props) {
  console.log(props.match.params.userId);
  const [photos, setPhotos] = useState([]);
  const [check, setCheck] = useState(false);
  let writedComment;
  let c;
  useEffect(
    () => {
      let userId = props.match.params.userId;
      const result = fetchModel(
        `http://localhost:5000/photosOfUser/${userId}`,
        setPhotos
      );
      console.log(result);
      console.log("photos list");
      console.log(photos);
    },
    //yu oorchlogdvol dahiad duudah huvisgchaa ene massv hiij ogno
    [check]
  );
  console.log("========================================");
  console.log(photos);

  return (
    <div>
      {photos.length > 0 &&
        photos.map(
          (element, index) => (
            (writedComment = element.comments),
            (c = writedComment != undefined),
            (
              // console.log("comment_id",writedComment),
              <UserPhotoList
                key={index}
                element={element}
                c={c}
                writedComment={writedComment}
                check={check}
                setCheck={setCheck}
              />
            )
          )
        )}
    </div>
  );
}
