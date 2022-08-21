import {
  withAuthUser,
  AuthAction,
  useAuthUser,
  withAuthUserSSR,
  getFirebaseAdmin,
} from "next-firebase-auth"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import Header from "../../components/Header"
import ReviewCard from "../../components/ReviewCard"
import {
  arrayMove,
  getReviewsSubscription,
  upsertReview,
} from "../../services/ReviewService"
import Button from "react-bootstrap/Button"
import ReviewModal from "../../components/ReviewModal"
import Form from "react-bootstrap/Form"

const Airline = ({
  airlineProp,
  reviewsProp,
  avgRatingProp,
  userReviewProp,
}) => {
  const AuthUser = useAuthUser()
  const [airline] = useState(airlineProp)
  const [reviews, setReviews] = useState(reviewsProp)
  const [avgRating, setAvgRating] = useState(avgRatingProp)
  const [searchText, setSearchText] = useState("")
  const [show, setShow] = useState(false)
  const [userReview, setuserReview] = useState(userReviewProp)

  //handle to UPDATE existing review of user (triggered in create review modal )
  const handleNewReviewSaveChanges = async (new_review_rating, comment) => {
    // console.warn('XOXOXOXO',new_review_rating, comment);
    const review = {
      airlineId: airline.id,
      userDisplayName: AuthUser.displayName,
      userId: AuthUser.id,
      userImage: AuthUser.photoURL,
      value: (new_review_rating / 100) * 5,
      comment: comment ?? "",
    }
    // console.log(review)

    await upsertReview(review)
    setShow(false)
  }
  //handle to UPDATE existing review of user (triggered in <li>Review</li>) (on stars hover click)
  const handleRating = async (newRating, index) => {
    newRating = (newRating / 100) * 5
    const reviewToUpdate = {
      ...reviews[index],
      value: newRating,
    }
    await upsertReview(reviewToUpdate)
  }

  // This is similar to a useEffect, but we still have filteredReviews in scope to use in the component down below
  const filteredReviews = useCallback(
    () =>
      reviews?.filter((review) =>
        review.userDisplayName.toLowerCase().includes(searchText.toLowerCase())
      ),
    [searchText, reviews]
  )

  //function passed the onSnapshot subcription to setState of reviews & avg rating
  const handleSetReviewsData = (reviews, avgRating, userReview) => {
    setReviews(reviews)
    setAvgRating(avgRating),
    setuserReview(userReview)

    // console.error('2',userReview)
  }
  //use effect to subscribe/unsubscribe to review's changes in firestore
  useEffect(() => {
    const unsubscribe = getReviewsSubscription(
      airline.id,
      AuthUser.id,
      handleSetReviewsData
    )

    return () => {
      console.warn("clearing subscription..")
      unsubscribe()
    }
  }, [])

  return (
    <>
      <Header user={AuthUser} />
      <h1 style={{ marginTop: "20px" }}>{airline.name}</h1>
      <div style={styles.information}>
        <div style={styles.imageWrapper}>
          <Image
            src={airline.image}
            width="100%"
            height="100%"
            layout="responsive"
            objectFit="contain"
            priority
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <p>
            <strong>THIS PAGE IS SERVER-SIDE RENDERING</strong> habitasse platea
            dictumst vestibulum rhoncus est pellentesque elit ullamcorper
            dignissim cras tincidunt lobortis feugiat vivamus at augue eget arcu
            dictum varius duis at consectetur lorem donec massa sapien faucibus
            et molestie ac feugiat sed lectus vestibulum mattis ullamcorper
            velit sed ullamcorper morbi tincidunt ornare massa eget egestas
            purus viverra accumsan
          </p>
          <h2>Average Rating</h2>

          <div style={styles.between}>
            <div style={styles.averageReviews}>
              {isNaN(avgRating) ? " " : avgRating}
            </div>
            {
              //If no reviews, user never made a review..
              //If reviews, check if the first review belongs to authUser (id==id)
              reviews && reviews[0]?.userId != AuthUser.id && (
                <Button variant="primary" onClick={() => setShow(true)}>
                  Give a review
                </Button>
              )
            }
          </div>
        </div>
      </div>

      <hr />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          marginBottom: "15px",
        }}
      >
        <h2 style={{ marginlscls: "0" }}>Reviews</h2>
        <Form.Control
          value={searchText}
          placeholder="Search user by username"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: "240px" }}
        />
      </div>

      <ul>
        {filteredReviews()?.map((review, index) => {
          return (
            <li
              key={review.id}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <ReviewCard
                authUserId={AuthUser.id}
                review={review}
                index={index}
                handleRating={handleRating}
                editable={!(review.userId == AuthUser.id)}
                setShow={setShow}
              />
            </li>
          )
        })}
      </ul>

      <ReviewModal
        show={show}
        onHide={() => setShow(false)}
        handleSaveChanges={handleNewReviewSaveChanges}
        airline={airline}
        review={userReview ?? null}
      />
    </>
  )
}

// Note that this is a higher-order function.
export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ params, AuthUser }) => {
  const airlineId = params.airline
  // fetch all airlines in firestore and map it to airline array then send it to client in props
  const db = getFirebaseAdmin().firestore()

  const airlineRef = db.collection("airlines").doc(`${airlineId}`)

  const airlineDocument = await airlineRef.get()
  if (!airlineDocument.exists) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    }
  }

  const reviewsRef = db.collection("reviews")

  const reviewsSnapshot = await reviewsRef
    .where("airlineId", "==", airlineDocument.id)
    .get()

  let userReviewIndex = undefined
  const reviews = reviewsSnapshot.docs.map((doc, i) => {
    const id = doc.id
    const data = doc.data()
    //while mapping, check any review belongs to current user (userId)
    if (data.userId == AuthUser.id) {
      userReviewIndex = i
    }

    const review = {
      id,
      ...data,
    }
    return review
  })

  if (userReviewIndex && userReviewIndex != 0) arrayMove(reviews, userReviewIndex, 0)
  const avgRating = (
    reviews.reduce((total, next) => total + next.value, 0) / reviews.length
  ).toFixed(1)
  const userReview = userReviewIndex === undefined ? null : reviews[0]
  // console.log(reviews)
  return {
    props: {
      airlineProp: {
        id: airlineDocument.id,
        ...airlineDocument.data(),
      },
      reviewsProp: JSON.parse(JSON.stringify(reviews)),
      avgRatingProp: avgRating,
      userReviewProp: JSON.parse(JSON.stringify(userReview))
     
    },
  }
})

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, //The action to take if the user is authenticated
})(Airline)

const styles = {
  between: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  information: {
    display: "flex",
    justifyContent: "center",
    // alignItems: "flex-start",
    gap: "1rem",
    marginBottom: "20px",
  },
  imageWrapper: {
    width: "600px",
    height: "auto",
    // borderRadius: "50%",
    // overflow: "hidden",
    position: "relative",
  },
  averageReviews: {
    backgroundColor: "#2B6AD0",

    borderRadius: "10px",
    color: "white",
    width: "3rem",
    textAlign: "center",
  },
}
