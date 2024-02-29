import React, {useState} from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'

const PaymentScreen = ({ history }) => {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    if(!shippingAddress) {
        history.push('/shipping')
    }

    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    const dispatch = useDispatch()
    
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history.push('/placeorder')
    }
    return <FormContainer>
        <CheckoutSteps step1 step2 step3 />
        <h2 className='mt-3'>Payment Method</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group>
          <Form.Label as='legend'><b>Select Method</b></Form.Label>
           <Col>
                <b>
                <Form.Check 
                type='radio' 
                label= 'PayPal or Credit Card'
                id='PayPal' name='paymentMethod' 
                value='PayPal'
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}>
                </Form.Check>
                </b>
           </Col>
           </Form.Group>
               <Button className= 'mt-3' type='submit' variant='dark'>Continue</Button>
        </Form>
    </FormContainer>
    
}

export default PaymentScreen
