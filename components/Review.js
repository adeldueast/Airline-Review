import { useState } from "react";
import { Rating } from "react-simple-star-rating";
import Image from "next/image";

const Review = ({ review, index, editable,handleRating }) => {


  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            width: "60px",
            borderRadius: "50%",
            border: "1px solid rgb(239, 239, 239)",
            overflow: "hidden",
          }}
        >
          <Image
            src={review.userImage}
            width="100%"
            height="100%"
            layout="responsive"
            objectFit="cover"
          />
        </div>
        <div style={{ width: "100%" }}>
          <h3 style={{ margin: "0" }}>{review.userDisplayName}</h3>
          <Rating
            /* Available Props */
            onClick={value => handleRating(value, index)}
            size={25}
            ratingValue={(review.value / 5) * 100}
            allowHalfIcon
            readonly={editable}
          />
          <span style={{ marginLeft: "0.6rem", fontSize: "0.8rem" }}>
            2 weeks ago
          </span>
        </div>
      </div>
      <p style={{ margin: "0", paddingLeft: "70px" }}>
        We used this company on a paris-new york flight, the plane was 1 hour
        late on the way out and was on time on the way back, boeing 767 rather
        comfortable, pillow, blanket and headphones available, many films in
        French to watch during the flight, very friendly staff, …
      </p>

      <hr/>
      
    </>
  );
};

export default Review;
