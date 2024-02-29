import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUser } from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import { USER_UPDATE_RESET } from '../constants/userConstants'

const UserEditScreen = ({ match, history }) => {
    const userId = match.params.id
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user} = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const { loading: loadingUpdate, error:errorUpdate, success: successUpdate} = userUpdate
   
    useEffect(()=>{
        if(successUpdate){
            dispatch({ type: USER_UPDATE_RESET })
            history.push('/admin/userlist')
        } else{
            if(!user.name || user._id !== userId){
                dispatch(getUserDetails(userId))
             } else{
                 setName(user.name)
                 setEmail(user.email)
                 setIsAdmin(user.isAdmin)
             }
        }
        
    }, [dispatch, userId, user, successUpdate])

    const submitHandler = (e) => {
        e.preventDefault()    
        dispatch(updateUser({_id: userId, name, email, isAdmin}))
    }

    return (
        <>
        <FormContainer>
            <h2 className='my-1'>Edit User</h2>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
           {loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message>:
           (
            <Form onSubmit={submitHandler}>
           <Form.Group className= 'mt-1' controlId='name'>
                   <Form.Label><b>Name</b></Form.Label>
                   <b><Form.Control type='name' placeholder='Enter name' value={name}
                   onChange={(e)=> setName(e.target.value)}></Form.Control></b>
               </Form.Group>

               <Form.Group className= 'mt-3' controlId='email'>
                   <Form.Label><b>Email Address</b></Form.Label>
                   <Form.Control type='email' placeholder='Enter email' value={email}
                   onChange={(e)=> setEmail(e.target.value)}></Form.Control>
               </Form.Group>

               <Form.Group className= 'mt-3' controlId='isAdmin'>
                  <b> <Form.Check type='checkbox' label='Is Admin' checked={isAdmin}
                   onChange={(e)=> setIsAdmin(e.target.checked)}></Form.Check></b>
               </Form.Group>

               <Button className= 'mt-3' type='submit' variant='primary'>
                  Update
               </Button>
           </Form>
           )} 
        </FormContainer>
        </>
        
    )
}

export default UserEditScreen
