import React, { useEffect } from 'react'
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {Row, Col, ListGroup, Image, Form, Button, Card} from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'

const CartScreen = ({match, location, history}) => {
    const productId = match.params.id
    const qty = location.search ? Number(location.search.split('=')[1]) : 1
    const dispatch = useDispatch()

    const cart = useSelector((state)=> state.cart)
    const { cartItems } = cart

    
    useEffect(()=>{
        if(productId){
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])

    const removeFromCartHandler = (id) =>{
        dispatch(removeFromCart(id))
    }

    const checkoutHandler = () => {
        history.push('/login?redirect=shipping')
    }
    return (
        <Row>
            <Col md={8}>
                 <h2>Shopping Cart</h2>
                 {cartItems.length === 0 ? <Message><strong>Your cart is empty</strong> <Link to='/'><strong>Go Back</strong></Link></Message>: 
                 (
                     <ListGroup variant = 'flush'>
                     {cartItems.map(item => (
                         <ListGroup.Item key={item.product}>
                           <Row>
                               <Col md={2}>
                                   <Image src={item.image} alt={item.name} fluid rounded />
                               </Col>
                               <Col md={3}>
                                   <Link className= {`links`} to={`/product/${item.product}`}><strong>{item.name}</strong></Link>
                               </Col>
                               <Col md={2}> <strong>₹{item.price}</strong></Col>
                                <Col md={3}>
                                <Form.Control className='form-select' as = 'select' value={item.qty} onChange={(e)=>
                                    dispatch(addToCart(item.product, Number(e.target.value)))}>
                                       {
                                        [...Array(item.countInStock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>

                                        ))
                                       }
                                    </Form.Control>
                                </Col>
                               <Col md={2}>
                                   <Button type='button' variant='light' onClick={()=> removeFromCartHandler(item.product)}>
                                       <i className='fas fa-trash'></i>
                                   </Button>
                                
                               </Col>
                           </Row>
                         </ListGroup.Item>
                     ))}
                     </ListGroup>
                 )}
            </Col>
            <Col md={4}>
              <Card>
                  <ListGroup variant= 'flush'>
                      <ListGroup.Item>
                          <h3>Subtotal ({cartItems.reduce((acc, item)=> acc + item.qty, 0)}) items</h3>
                         <strong> ₹{cartItems.reduce((acc, item)=> acc + item.qty * item.price, 0).toFixed(0)} </strong>
                      </ListGroup.Item>
                      <ListGroup.Item>
                       <Button type='button' variant='dark' className='w-100' disabled={cartItems.length === 0} onClick={checkoutHandler}>
                           Proceed To Checkout
                       </Button>
                      </ListGroup.Item>
                  </ListGroup>
              </Card>
            </Col>
        </Row>
    )
}

export default CartScreen
