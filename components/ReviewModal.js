import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { Rating } from "react-simple-star-rating"
import Form from "react-bootstrap/Form"
import { useEffect, useState } from "react"

const ReviewModal = ({ show, onHide, handleSaveChanges, airline ,review}) => {

  //ex: revew.value =   2(database)   should be 20(rating component)
  const [rating, setRating] = useState( review?.value/5*100 )
  const [comment, setComment] = useState(review?.comment)
  // Catch Rating value
  
  // console.log(review)
  // console.warn(rating)
  // console.warn(comment)
  useEffect(() => {

    setRating(review?.value/5*100 )
    setComment(review?.comment)
 
  }, [review])
  

  const handleRating = (rate) => {
  
    setRating(rate)
    // console.warn(rate)
  }
  const handleComment = (e) => {
    
    setComment(e.target.value)
    // console.warn(comment)
  }

  return (
    <Modal 
    show={show} onHide={onHide}
    centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{airline.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ textAlign: "center" }}>
        <Rating
          style={{ marginBottom: "20px" }}
          onClick={handleRating}
          ratingValue={rating}
          allowHalfIcon
        />
        <Form.Control
          onChange={handleComment}
          as="textarea"
          placeholder="Leave a comment here"
          style={{ height: "100px" }}
          value={comment}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={() => handleSaveChanges(rating,comment)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ReviewModal
