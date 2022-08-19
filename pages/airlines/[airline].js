import { useRouter } from "next/router"
import { withAuthUser, AuthAction, useAuthUser } from "next-firebase-auth"
import FullPageLoader from "../../components/FullPageLoader"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import Header from "../../components/Header"
import ReviewCard from "../../components/ReviewCard"
import { getReviewsSubscription, upsertReview } from "../../utils/ReviewService"
import Button from "react-bootstrap/Button"
import ReviewModal from "../../components/ReviewModal"
import Form from "react-bootstrap/Form"

const Airline = () => {
  const AuthUser = useAuthUser()
  const router = useRouter()
  const [airline] = useState(router.query)
  const [reviews, setReviews] = useState()
  const [avgRating, setAvgRating] = useState()
  const [searchText, setSearchText] = useState("")
  const [show, setShow] = useState(false)
  const [userReview, setuserReview] = useState()

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

  //use effect to subscribe/unsubscribe to review's changes in firestore
  useEffect(() => {
    //function passed the onSnapshot subcription to setState of reviews & avg rating
    const handleSetReviewsData = (reviews, avgRating, userReview) => {
      setReviews(reviews)
      setAvgRating(avgRating), setuserReview(userReview)
      // console.error('2',userReview)
    }

    const unsubscribe = getReviewsSubscription(
      airline.id,
      AuthUser.id,
      handleSetReviewsData
    )

    return () => {
      // console.warn("clearing subscription..")
      unsubscribe
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
            <strong>THIS PAGE IS CLIENT-SIDE RENDERING</strong> habitasse platea
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
        onHide={()=>setShow(false)}
        handleSaveChanges={handleNewReviewSaveChanges}
        airline={airline}
        review={userReview ?? null}
      />
    </>
  )
}

export default withAuthUser({
  whenAuthed: AuthAction.RENDER, //The action to take if the user is authenticated
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL, //The action to take if the user is not authenticated but the Firebase client JS SDK has not yet initialized.
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, //||NULL -> The action to take if the user is not authenticated and the Firebase client JS SDK has already initialized.
  LoaderComponent: FullPageLoader,
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
