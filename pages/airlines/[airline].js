import { useRouter } from "next/router"
import { withAuthUser, AuthAction, useAuthUser } from "next-firebase-auth"
import FullPageLoader from "../../components/FullPageLoader"
import Image from "next/image"
import _ from "lodash"
import { useCallback, useEffect, useState } from "react"
import Header from "../../components/Header"
import Review from "./../../components/Review"
import { getReviewsSubscription, upsertReview } from "../../utils/ReviewHelper."


const Airline = () => {
  const AuthUser = useAuthUser()
  const router = useRouter()
  const [airline] = useState(router.query)
  const [reviews, setReviews] = useState()
  const [avgRating, setAvgRating] = useState()
  const [searchText,setSearchText] = useState('')

// Use Memo when returning HTML , other use CallBack source josh 
  const filteredReviews = useCallback(() => (
    reviews?.filter(review => review.userDisplayName.toLowerCase().includes(searchText.toLowerCase()))
  ),[searchText,reviews])


  const handleSetReviewsData = (reviews, avgRating) => {
    setReviews(reviews)
    setAvgRating(avgRating)
  }

  
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

  // Why setting avgRating's state in a different useEffect causes flickering?
  // useEffect(() => {
  //   const avgRating = reviews.reduce((total, next) => total + next.value, 0) / reviews.length;
  //   setAvgRating(avgRating);
  // }, [reviews]);

  const handleRating = async (newRating, index) => {
    newRating = (newRating / 100) * 5
    console.log(newRating)
    const reviewToUpdate = {
      ...reviews[index],
      value: newRating,
    }
    await upsertReview(reviewToUpdate)
  }

  const addReview = async () => {
    const review = {
      airlineId: airline.id,
      userDisplayName: AuthUser.displayName,
      userId: AuthUser.id,
      userImage: AuthUser.photoURL,
      value: 1,
    }
    await upsertReview(review)
  }

  return (
    <>
      <Header user={AuthUser} />
      <h1>{airline.name}</h1>

      <div style={styles.information}>
        <div style={styles.imageWrapper}>
          <Image
            src={airline.image}
            width="100%"
            height="100%"
            layout="responsive"
            objectFit="cover"
          />
        </div>
        <div>
          <p>
            aliquam nulla facilisi cras fermentum odio eu feugiat pretium nibh
            ipsum consequat nisl vel pretium lectus quam id leo in vitae turpis
            massa sed elementum tempus egestas sed
          </p>
          <h2>Average Rating</h2>
          <div style={styles.between}>
            {reviews && reviews.length && (
              <div style={styles.averageReviews}>{avgRating}</div>
            )}
            {
              //If no reviews, user never made a review..
              //If reviews, check if the first review belongs to authUser (id==id)
              reviews && reviews[0].userId != AuthUser.id && (
                <button onClick={addReview}>Give a review</button>
              )
            }
          </div>
        </div>
      </div>

      <hr />

      <h2>Reviews</h2>
      <input value={searchText} placeholder="Search user by username" onChange={e=>setSearchText(e.target.value)}/>
      <ul>
        {filteredReviews()?.map((review, index) => {
          return (
            <li
              key={review.id}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Review

                review={review}
                index={index}
                handleRating={handleRating}
                editable={!(review.userId == AuthUser.id)}
              />
            </li>
          )
        })}
      </ul>
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
    alignItems: "flex-start",
    gap: "1rem",
    marginBottom: "20px",
  },
  imageWrapper: {
    width: "300px",
    borderRadius: "50%",
    border: "1px solid rgb(239, 239, 239)",
    overflow: "hidden",
  },
  averageReviews: {
    backgroundColor: "#2B6AD0",
    padding: "2px 6px",
    borderRadius: "10px",
    color: "white",
    width: "3rem",
    textAlign: "center",
  },
}
