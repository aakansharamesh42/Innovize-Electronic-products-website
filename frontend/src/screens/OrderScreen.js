import React,{useState, useEffect} from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card, ListGroupItem } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET} from '../constants/orderConstants'

const OrderScreen = ({ match, history }) => {
    const orderId = match.params.id
    const [sdkReady, setSdkReady] = useState(false)
    const dispatch = useDispatch()

     const orderPay = useSelector(state => state.orderPay)
     const { loading: loadingPay, success:successPay} = orderPay

     const orderDeliver = useSelector(state => state.orderDeliver)
     const { loading: loadingDeliver, success:successDeliver} = orderDeliver
      
     const orderDetails = useSelector(state => state.orderDetails)
     const { order, loading, error} = orderDetails

     const userLogin = useSelector(state => state.userLogin)
     const { userInfo } = userLogin

     if(!loading){
        const addDecimals = (num) => {
            return (Math.round(num*100)/100).toFixed(0)
        }
        order.itemsPrice = addDecimals(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0))
     }
    
     useEffect(() => {
        if (!userInfo) {
            history.push('/login')
          }      
         const addPayPalScript = async () => {
             const { data: clientId } = await axios.get('/api/config/paypal')
             const script = document.createElement('script')
             script.type = 'text/javascript'
             script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
             script.async = true
             script.onload = () => {
                 setSdkReady(true)
             }
             document.body.appendChild(script)
         }

        if(!order || successPay || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(getOrderDetails(orderId))
        } else if(!order.isPaid){
             if(!window.paypal){
                 addPayPalScript()
             } else{
                 setSdkReady(true)
             }
        }
    }, [dispatch, orderId, successPay, order, successDeliver]) 

    const successPaymentHandler = (paymentResult) => {
       console.log(paymentResult)
       dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }
    
    return loading ? <Loader/> : error ? <Message variant='danger'>{error}
    </Message>: <>
        <h2>Order {order._id}</h2>
        <Row>
               <Col md={8}>
                   <ListGroup variant='flush'>
                       <ListGroup.Item>
                           <h4 className='mb-2'>Shipping</h4>
                           <p><strong>Name: </strong><strong>{order.user.name}</strong></p>
                           <p>
                               <strong>Address: </strong>
                               <strong>{order.shippingAddress.address},  {order.shippingAddress.city}, {order.shippingAddress.postalCode},  {order.shippingAddress.state}</strong>
                           </p>
                           {order.isDelivered ? <Message variant='success'><strong>Delivered on {order.deliveredAt}</strong></Message>:
                           <Message variant='danger'><strong>Not Delivered</strong></Message>}
                       </ListGroup.Item>
                       <ListGroup.Item>
                           <h4 className='mt-2'>Payment Method</h4>
                           <p>
                           <strong>Method: </strong>
                           <strong>{order.paymentMethod}</strong>
                           </p>
                           {order.isPaid ? <Message variant='success'><strong>Paid on {order.paidAt}</strong></Message>:
                           <Message variant='danger'><strong>Not Paid</strong></Message>}
                       </ListGroup.Item>

                       <ListGroup.Item>
                           <h4 className='mt-2'>Order Items</h4>
                           {order.orderItems.length === 0 ? <Message>Order is empty</Message>:
                           (
                               <ListGroup variant='flush'>
                                  {order.orderItems.map((item, index) => (
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
                                   <Col><b>₹{order.itemsPrice}</b></Col>
                               </Row>
                           </ListGroup.Item>
                           <ListGroup.Item>
                               <Row>
                                   <Col><b>Shipping</b></Col>
                                   <Col><b>₹{order.shippingPrice}</b></Col>
                               </Row>
                           </ListGroup.Item>
                           <ListGroup.Item>
                               <Row>
                                   <Col><b>GST</b></Col>
                                   <Col><b>₹{order.taxPrice}</b></Col>
                               </Row>
                           </ListGroup.Item>
                           <ListGroup.Item>
                               <Row>
                                   <Col><b>Total</b></Col>
                                   <Col><b>₹{order.totalPrice}</b></Col>
                               </Row>
                           </ListGroup.Item>
                           {!order.isPaid && (
                               <ListGroup.Item>
                               {loadingPay && <Loader />}
                               {!sdkReady ? <Loader /> : (
                                   <PayPalButton amount= {order.totalPrice} onSuccess={successPaymentHandler}/>
                               )}
                               </ListGroup.Item>
                           )}
                           {loadingDeliver && <Loader/>}
                           {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                               <ListGroupItem>
                               <Button type='button' className='w-100'  onClick={deliverHandler}>
                                  Mark As Delivered
                               </Button>
                               </ListGroupItem>
                           )}
                       </ListGroup>
                   </Card>
               </Col>
           </Row>

    </>
}

export default OrderScreen
