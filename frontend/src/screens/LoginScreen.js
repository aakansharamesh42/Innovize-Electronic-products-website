import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login } from '../actions/userActions'
import FormContainer from '../components/FormContainer'

const LoginScreen = ({ location, history }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { loading, error, userInfo} = userLogin
    const redirect = location.search ? location.search.split('=')[1] : '/'

    useEffect(()=>{
        if(userInfo) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email,password))
    }

    return (
        <FormContainer>
            <h2>Sign In</h2>
            {error && <Message variant= 'danger'><b>{error}</b></Message>}
            {loading && <Loader/>}
           <Form onSubmit={submitHandler}>
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

               <Button className= 'mt-3' type='submit' variant='primary'>
                   Sign In
               </Button>
           </Form>

           <Row className= 'py-3'>
               <Col>
                   <strong> New Customer?</strong> <Link className='links' to ={redirect ? `/register?redirect=${redirect}`:'/register'}>
                   <strong> Register </strong>
                   </Link>
               </Col>
           </Row>
        </FormContainer>
    )
}

export default LoginScreen
