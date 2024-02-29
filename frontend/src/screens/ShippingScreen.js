import React, {useState} from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'

const ShippingScreen = ({ history }) => {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [state, setState] = useState(shippingAddress.state)

    const dispatch = useDispatch()
    
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({address, city, postalCode, state}))
        history.push('/payment')
    }
    return <FormContainer>
        <CheckoutSteps step1 step2 />
        <h2 className='mt-3'>Shipping</h2>
        <Form onSubmit={submitHandler}>
        <Form.Group className= 'mt-2' controlId='address'>
                   <Form.Label><b>Address</b></Form.Label>
                   <Form.Control type='text' placeholder='Enter address' value={address} required
                   onChange={(e)=> setAddress(e.target.value)}></Form.Control>
               </Form.Group>
        
               <Form.Group className= 'mt-2' controlId='city'>
                   <Form.Label><b>City</b></Form.Label>
                   <Form.Control type='text' placeholder='Enter city' value={city} required
                   onChange={(e)=> setCity(e.target.value)}></Form.Control>
               </Form.Group>

               <Form.Group className= 'mt-2' controlId='postalCode'>
                   <Form.Label><b>Postal Code</b></Form.Label>
                   <Form.Control type='text' placeholder='Enter postal code' value={postalCode} required
                   onChange={(e)=> setPostalCode(e.target.value)}></Form.Control>
               </Form.Group>

               <Form.Group className= 'mt-2' controlId='state'>
                   <Form.Label><b>State</b></Form.Label>
                   <Form.Control type='text' placeholder='Enter state' value={state} required
                   onChange={(e)=> setState(e.target.value)}></Form.Control>
               </Form.Group>

               <Button className= 'mt-3' type='submit' variant='primary'>Continue</Button>
        </Form>
    </FormContainer>
    
}

export default ShippingScreen
