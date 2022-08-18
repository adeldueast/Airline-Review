import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { Rating } from "react-simple-star-rating"
import Form from "react-bootstrap/Form"
import { useState } from "react"

const ReviewModal = ({ show, setShow, handleSaveChanges, airline }) => {
  const handleClose = () => setShow(false)
  const [rating, setRating] = useState()
  const [comment, setComment] = useState('')
  // Catch Rating value

  const handleRating = (rate) => setRating(rate)

  return (
    <Modal show={show} onHide={handleClose}>
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
          onChange={(e) => setComment(e.target.value)}
          as="textarea"
          placeholder="Leave a comment here"
          style={{ height: "100px" }}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
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
