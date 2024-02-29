import React, { useEffect } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {Row, Col} from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { Container } from 'react-bootstrap'
import { listProducts } from '../actions/productActions'
import SearchBox from '../components/SearchBox'
import { Route } from 'react-router-dom'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'

const HomeScreen = ({match}) => {
  const keyword = match.params.keyword
  const pageNumber = match.params.pageNumber || 1
  const dispatch = useDispatch()

  const productList = useSelector(state => state.productList)
  const { loading, error, products, page, pages } = productList

   useEffect(()=>{
      dispatch(listProducts(keyword, pageNumber))
   }, [dispatch, keyword, pageNumber])

    return (
        <>
        <Meta/>
      {!keyword && <ProductCarousel />}
         <Container fluid>
        <Row className='mt-2'>
          <Col>
            <hr/>
            <Route render={({history}) => <SearchBox history={history}/>} />
          </Col>
          </Row>
      </Container>
          {loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : (
          <>
          <Row>
            {products.map((product) =>(
                <Col key={product._id} sm={12} md={6} lg={2} xl={3}>
                    <Product product= {product}/>
                </Col>
            ))}
          </Row>
          <b><Paginate pages={pages} page={page} keyword={keyword ? keyword : ''}/></b>
          </>
          )}
        </>
    )
}

export default HomeScreen
