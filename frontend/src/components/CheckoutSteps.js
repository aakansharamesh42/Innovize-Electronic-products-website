import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    return (
        <Nav className='justify-content-center mb-4'>
            <Nav.Item>
                {step1? (
                    <LinkContainer to='/login'>
                    <Nav.Link><b>Sign In</b></Nav.Link>
                    </LinkContainer>
                ): <Nav.Link disabled>Sign In</Nav.Link>}
            </Nav.Item>
            <Nav.Item>
                {step2? (
                    <LinkContainer to='/shipping'>
                    <Nav.Link><b>Shipping</b></Nav.Link>
                    </LinkContainer>
                ): <Nav.Link disabled>Shipping</Nav.Link>}
            </Nav.Item>
            <Nav.Item>
                {step3? (
                    <LinkContainer to='/payment'>
                    <Nav.Link><b>Payment</b></Nav.Link>
                    </LinkContainer>
                ): <Nav.Link disabled>Payment</Nav.Link>}
            </Nav.Item>
            <Nav.Item>
                {step4? (
                    <LinkContainer to='/placeholder'>
                    <Nav.Link><b>Order</b></Nav.Link>
                    </LinkContainer>
                ): <Nav.Link disabled>Order</Nav.Link>}
            </Nav.Item>
        </Nav>
    )
}

export default CheckoutSteps
