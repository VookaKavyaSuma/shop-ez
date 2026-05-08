import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Button, Spinner, Badge } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Error fetching product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="dark" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center mt-5"><h3>Product not found</h3></div>;
  }

  const finalPrice = product.price - (product.price * (product.discount / 100));

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
  };

  const handleShopNow = () => {
    addToCart(product._id, quantity);
    navigate('/checkout');
  };

  return (
    <Container className="py-5">
      <Row className="g-5">
        <Col md={6}>
          <div className="product-image-container position-relative rounded-4 overflow-hidden shadow-sm h-100" style={{ minHeight: '400px' }}>
            <img 
              src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/600x600'} 
              alt={product.name} 
              className="w-100 h-100 object-fit-cover"
            />
            {product.discount > 0 && (
              <Badge bg="danger" className="position-absolute top-0 start-0 m-3 px-3 py-2 fs-6 rounded-pill">
                {product.discount}% OFF
              </Badge>
            )}
          </div>
        </Col>
        <Col md={6} className="d-flex flex-column justify-content-center">
          <Badge bg="light" text="dark" className="align-self-start mb-2 px-3 py-2 border">{product.category}</Badge>
          <h1 className="fw-bold mb-3">{product.name}</h1>
          <div className="d-flex align-items-end mb-4">
            <span className="display-5 fw-bold text-dark me-3">${finalPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="fs-4 text-muted text-decoration-line-through mb-1">${product.price.toFixed(2)}</span>
            )}
          </div>
          <p className="lead text-muted mb-4">{product.description}</p>
          
          <div className="d-flex align-items-center mb-4">
            <span className="me-3 fw-semibold">Quantity:</span>
            <div className="btn-group" role="group">
              <button type="button" className="btn btn-outline-dark" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <button type="button" className="btn btn-outline-dark" disabled>{quantity}</button>
              <button type="button" className="btn btn-outline-dark" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <div className="d-flex gap-3 mt-4">
            <Button variant="outline-dark" size="lg" className="w-50 rounded-pill fw-semibold py-3" onClick={handleAddToCart}>
              Add to Cart
            </Button>
            <Button variant="dark" size="lg" className="w-50 rounded-pill fw-semibold py-3" onClick={handleShopNow}>
              Shop Now
            </Button>
          </div>
          
          {/* Reviews section placeholder */}
          <div className="mt-5 pt-4 border-top">
            <h4 className="fw-bold mb-3">Customer Reviews</h4>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((r, i) => <div key={i}><p>{r.comment}</p></div>)
            ) : (
              <p className="text-muted">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
