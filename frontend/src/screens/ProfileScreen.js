import React, {useState, useEffect} from 'react'
import { Table, Form, Button, Row, Col } from 'react-bootstrap'
import { LinkContainer} from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUserProfile} from '../actions/userActions'
import { listMyOrders } from '../actions/orderActions'

const ProfileScreen = ({location, history }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()

    const userDetails = useSelector((state) => state.userDetails)
    const { loading, error, user} = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
    const { success } = userUpdateProfile

    const orderListMy = useSelector((state) => state.orderListMy)
    const { loading: loadingOrders, error:errorOrders, orders} = orderListMy


    useEffect(()=>{
        if(!userInfo) {
            history.push('/login')
        }else{
            if(!user.name){
              dispatch(getUserDetails('profile'))
              dispatch(listMyOrders())
            }else{
               setName(user.name)
               setEmail(user.email)
            }
        }
    }, [dispatch, history, userInfo, user, success])

    const submitHandler = (e) => {
        e.preventDefault()
        if(password !== confirmPassword){
            setMessage('Passwords do not match')
        }else{
            dispatch(updateUserProfile({ id: user._id, name, email, password }))
        }
        
    }

    return <Row>
        <Col md={3}>
        <h2>User Profile</h2>
            {message && <Message variant= 'danger'><b>{message}</b></Message>}
            {error && <Message variant= 'danger'><b>{error}</b></Message>}
            {success && <Message variant= 'success'><b>Profile Updated</b></Message>}
            {loading && <Loader/>}
           <Form onSubmit={submitHandler}>
           <Form.Group className= 'mt-1' controlId='name'>
                   <Form.Label><b>Name</b></Form.Label>
                   <Form.Control type='name' placeholder='Enter name' value={name}
                   onChange={(e)=> setName(e.target.value)}></Form.Control>
               </Form.Group>

               <Form.Group className= 'mt-3' controlId='email'>
                   <Form.Label><b>Email Address</b></Form.Label>
                   <Form.Control type='email' placeholder='Enter email' value={email}
                   onChange={(e)=> setEmail(e.target.value)}></Form.Control>
               </Form.Group>

               <Form.Group className= 'mt-3' controlId='password'>
                   <Form.Label><b>Password</b></Form.Label>
                   <Form.Control type='password' placeholder='Enter password' value={password}
                   onChange={(e)=> setPassword(e.target.value)}></Form.Control>
               </Form.Group>

               <Form.Group className= 'mt-3' controlId='confirmPassword'>
                   <Form.Label><b>Confirm Password</b></Form.Label>
                   <Form.Control type='password' placeholder='Enter Confirm password' value={confirmPassword}
                   onChange={(e)=> setConfirmPassword(e.target.value)}></Form.Control>
               </Form.Group>

               <Button className= 'mt-3' type='submit' variant='primary'>
                   Update
               </Button>
           </Form>
        </Col>
        <Col md={9}>
            <h2>My Orders</h2>
            {loadingOrders ? <Loader /> : errorOrders ? <Message variant='danger'>{errorOrders}
            </Message>: (
                <Table striped border hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>PAID</th>
                        <th>DELIVERED</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                        <td><b>{order._id}</b></td>
                        <td><b>{order.createdAt.substring(0,10)}</b></td>
                        <td><b>₹{order.totalPrice}</b></td>
                        <td><b>{order.isPaid ? order.paidAt.substring(0,10): (
                            <i className='fas fa-times' style={{color: 'red'}}></i>
                        )}</b></td>
                        <td><b>{order.isDelivered ? order.deliveredAt.substring(0,10): (
                            <i className='fas fa-times' style={{color: 'red'}}></i>
                        )}</b></td>
                        <td>
                            <LinkContainer to={`/order/${order._id}`}>
                                <Button className='btn-md' variant='light'>Details</Button>
                            </LinkContainer>
                        </td>
                        </tr>
                    ))}
                </tbody>
                </Table>
            )}
        </Col>
    </Row>
}

export default ProfileScreen

