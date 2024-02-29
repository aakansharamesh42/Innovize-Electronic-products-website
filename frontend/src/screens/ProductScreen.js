import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import Meta from '../components/Meta'

const ProductScreen = ({history, match}) => {
    const [qty, setQty] = useState(1)
    const dispatch = useDispatch()
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const productDetails = useSelector(state=> state.productDetails)
    const { loading, error, product } = productDetails

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const productReviewCreate = useSelector((state) => state.productReviewCreate)
    const {
      success: successProductReview,
      loading: loadingProductReview,
      error: errorProductReview,
    } = productReviewCreate

    useEffect(() => {
        if (successProductReview) {
          alert('Review Submitted!')
          setRating(0)
          setComment('')
          dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }
          dispatch(listProductDetails(match.params.id))
      }, [dispatch, match, successProductReview])

    const addToCartHandler = () => {
         history.push(`/cart/${match.params.id} ? qty = ${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(
          createProductReview(match.params.id, {
            rating,
            comment,
          })
        )
      }

    return (
        <>
        {loading ? <Loader/> : error ? <Message variant = 'danger'>{error}</Message>:(
            <>
            <Meta title={product.name}/>
            <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid/>
            </Col>
            <Col md={3}>
               <ListGroup variant='flush'>
                   <ListGroup.Item>
                       <h3>{product.name}</h3>
                   </ListGroup.Item>
                   <ListGroup.Item>
                       <Rating value={product.rating} text={<strong>{product.numReviews} reviews </strong>}/>
                   </ListGroup.Item>
                   <ListGroup.Item>
                      <strong> Price: ₹{product.price} </strong>
                   </ListGroup.Item>
                   <ListGroup.Item>
                      <strong> Description: {product.description} </strong>
                   </ListGroup.Item>
               </ListGroup>
            </Col>
            <Col md={3}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <Row>
                                <Col>
                                   <strong> Price: </strong>
                                </Col>
                                <Col>
                                    <strong>₹{product.price}</strong>
                                </Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>
                                   <strong> Status: </strong>
                                </Col>
                                <Col>
                                <strong>{product.countInStock>0 ? 'In Stock': 'Out Of Stock'}</strong>
                                </Col>
                            </Row>
                        </ListGroup.Item>

                        {product.countInStock>0 && (
                            <ListGroup.Item>
                            <Row>
                                <Col><strong>Qty</strong></Col>
                                <Col>
                                    <Form.Control className='form-select' as = 'select' value={qty} onChange={(e)=>
                                    setQty(e.target.value)}>
                                       {
                                        [...Array(product.countInStock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                             {x + 1}
                                            </option>
                                        ))
                                       }
                                    </Form.Control>
                                </Col>
                            </Row>
                            </ListGroup.Item>
                        )}
                        <ListGroup.Item>
                        <Button onClick={addToCartHandler} className='w-100' variant='dark' type='button' disabled={product.countInStock===0}>
                        Add To Cart
                        </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col md={6}>
              <h3>Reviews</h3>
              {product.reviews.length === 0 && <Message><b>No Reviews</b></Message>}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <b><Rating value={review.rating} /></b>
                    <p><b>{review.createdAt.substring(0, 10)}</b></p>
                    <p><b>{review.comment}</b></p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h3>Write a Customer Review</h3>
                  {successProductReview && (
                    <Message variant='success'>
                      <b>Review submitted successfully</b>
                    </Message>
                  )}
                  {loadingProductReview && <Loader />}
                  {errorProductReview && (
                    <Message variant='danger'>{errorProductReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId='rating'>
                        <Form.Label><b>Rating</b></Form.Label>
                        <b><Form.Control className='form-select' as = 'select'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control></b>
                      </Form.Group>
                      <b><Form.Group controlId='comment'>
                        <Form.Label className='mt-3'>Comment</Form.Label>
                        <b><Form.Control
                          as='textarea'
                          row='3'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control></b>
                      </Form.Group></b>
                      <Button className='mt-3'
                        disabled={loadingProductReview}
                        type='submit'
                        variant='dark'
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      <b>Please <Link className="links" to='/login'>sign in</Link> to write a review{' '}
                    </b></Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
        )}
        </>
    )
}

export default ProductScreen
