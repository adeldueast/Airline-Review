import { Rating } from "react-simple-star-rating";
import ReactTimeAgo from 'react-time-ago'
import Image from "next/image";
import Button from "react-bootstrap/Button"

const ReviewCard = ({ review, index, editable,handleRating,authUserId,setShow }) => {


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
          <div  style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3 style={{ margin: "0" }}>{review.userDisplayName}</h3>
            {review.userId == authUserId &&
              <Button 
              ariant="primary" 
              onClick={()=>setShow(true)}
              >
                  Modify review
              </Button>  
            }
          </div>
          <Rating
            /* Available Props */
            onClick={value => handleRating(value, index)}
            size={25}
            ratingValue={(review.value / 5) * 100}
            allowHalfIcon
            readonly={editable}
          />
          {/* <span>{review.createdAt}</span> */}
          <span style={{ marginLeft: "0.6rem", fontSize: "0.8rem" }}>
            <ReactTimeAgo 
            date={new Date(review.createdAt.seconds * 1000)} 
            locale="en-US"
            />
          </span>
        </div>
      </div>
      <p style={{ margin: "0", paddingLeft: "70px" }}>
        {review.comment}
      </p>

      <hr/>
      
      
    </>
  );
};

export default ReviewCard;
