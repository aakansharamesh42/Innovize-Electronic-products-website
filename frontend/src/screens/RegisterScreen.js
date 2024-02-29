import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { register } from '../actions/userActions'
import FormContainer from '../components/FormContainer'

const RegisterScreen = ({ location, history }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()

    const userRegister = useSelector(state => state.userRegister)
    const { loading, error, userInfo} = userRegister
    const redirect = location.search ? location.search.split('=')[1] : '/'

    useEffect(()=>{
        if(userInfo) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        if(password !== confirmPassword){
            setMessage('Passwords do not match')
        }else{
            dispatch(register(name, email, password))
        }
        
    }

    return (
        <FormContainer>
            <h2>Sign Up</h2>
            {message && <Message variant= 'danger'><b>{message}</b></Message>}
            {error && <Message variant= 'danger'><b>{error}</b></Message>}
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
                   Register
               </Button>
           </Form>

           <Row className= 'py-3'>
               <Col>
                   <strong>Have an Account?</strong> <Link className='links' to ={redirect ? `/login?redirect=${redirect}`:'/login'}>
                   <strong> Login </strong>
                   </Link>
               </Col>
           </Row>
        </FormContainer>
    )
}

export default RegisterScreen
