import React,{useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'

const PlaceOrderScreen = ({history}) => {
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)

    //Calculate prices
    const addDecimals = (num) => {
        return (Math.round(num*100)/100).toFixed(0)
    }
    cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0))
    cart.shippingPrice = addDecimals(cart.itemsPrice > 2000 ? 0 : 100)
    cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(0)))
    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(0)

     const orderCreate = useSelector(state => state.orderCreate)
     const { order, success, error} = orderCreate
     
     useEffect(()=>{
         if(success){
             history.push(`/order/${order._id}`)
         }
      // eslint-disable-next-line
     }, [history, success])

    const placeOrderHandler = () =>{
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice

        }))
    }
    return (
        <>
           <CheckoutSteps step1 step2 step3 step4 />  
           <Row>
               <Col md={8}>
                   <ListGroup variant='flush'>
                       <ListGroup.Item>
                           <h4>Shipping</h4>
                           <p>
                               <strong>Address: </strong>
                               <strong>{cart.shippingAddress.address},  {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},  {cart.shippingAddress.state}</strong>
                           </p>
                       </ListGroup.Item>
                       <ListGroup.Item>
                           <h4 className='mt-2'>Payment Method</h4>
                           <strong>Method: </strong>
                           <strong>{cart.paymentMethod}</strong>
                       </ListGroup.Item>

                       <ListGroup.Item>
                           <h4 className='mt-2'>Order Items</h4>
                           {cart.cartItems.length === 0 ? <Message>Your cart is empty</Message>:
                           (
                               <ListGroup variant='flush'>
                                  {cart.cartItems.map((item, index) => (
                                      <ListGroup.Item key={index}>
                                      <Row>
                                          <Col md={2}>
                                              <Image src={item.image} alt={item.name}
                                              fluid rounded />
                                          </Col>
                                          <Col>
                                              <Link className= "links" to={`/product/${item.product}`}>
                                                  <b>{item.name}</b>
                                              </Link>
                                          </Col>
                                          <Col md={4}>
                                              <b>{item.qty} x ₹{item.price} = ₹{item.qty * item.price}</b>
                                          </Col>
                                      </Row>
                                      </ListGroup.Item>
                                  ))}
                               </ListGroup>
                           )}
                       </ListGroup.Item>
                   </ListGroup>
               </Col>
               <Col md={4}>
                   <Card>
                       <ListGroup variant='flush'>
                           <ListGroup.Item>
                               <h4>Order Summary</h4>
                           </ListGroup.Item>
                           <ListGroup.Item>
                               <Row>
                                   <Col><b>Items</b></Col>
                                   <Col><b>₹{cart.itemsPrice}</b></Col>
                               </Row>
                           </ListGroup.Item>
                           <ListGroup.Item>
                               <Row>
                                   <Col><b>Shipping</b></Col>
                                   <Col><b>₹{cart.shippingPrice}</b></Col>
                               </Row>
                           </ListGroup.Item>
                           <ListGroup.Item>
                               <Row>
                                   <Col><b>GST</b></Col>
                                   <Col><b>₹{cart.taxPrice}</b></Col>
                               </Row>
                           </ListGroup.Item>
                           <ListGroup.Item>
                               <Row>
                                   <Col><b>Total</b></Col>
                                   <Col><b>₹{cart.totalPrice}</b></Col>
                               </Row>
                           </ListGroup.Item>
                           <ListGroup.Item>
                           {error && <Message variant='danger'>{error}</Message>}
                           </ListGroup.Item>
                           <ListGroup.Item>
                               <Button type='button' variant="dark" className='w-100' disabled={cart.cartItems === 0} onClick ={placeOrderHandler}>Place Order
                               </Button>
                           </ListGroup.Item>
                       </ListGroup>
                   </Card>
               </Col>
           </Row>
        </>
    )
}

export default PlaceOrderScreen
