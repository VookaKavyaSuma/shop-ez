import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Button, Spinner, Badge, Form } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error('Please login to leave a review.');
    try {
      const res = await axios.post(`https://shop-ez-q1o8.onrender.com/api/products/${id}/reviews`, reviewData);
      setProduct(res.data);
      setShowReviewForm(false);
      setReviewData({ rating: 5, comment: '' });
      toast.success('Review submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to submit review');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://shop-ez-q1o8.onrender.com/api/products/${id}`);
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
          <div className="product-image-container position-relative rounded-4 overflow-hidden shadow-sm h-100" style={{ minHeight: '400px', maxHeight: '600px' }}>
            <img 
              src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600'} 
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600'; }}
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
          <h1 className="fw-bold mb-3 brand-font">{product.name}</h1>
          <div className="d-flex align-items-end mb-4">
            <span className="display-5 fw-bold text-dark me-3">₹{finalPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="fs-4 text-muted text-decoration-line-through mb-1">₹{product.price.toFixed(2)}</span>
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
          
          {/* Reviews section */}
          <div className="mt-5 pt-4 border-top">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold brand-font mb-0">Customer Reviews</h4>
              {product.reviews && product.reviews.length > 0 && !showReviewForm && (
                <Button variant="outline-dark" size="sm" className="rounded-pill px-3" onClick={() => setShowReviewForm(true)}>Add Review</Button>
              )}
            </div>

            {showReviewForm && (
              <div className="bg-light p-4 rounded-4 mb-4 border border-light-subtle">
                <h5 className="fw-bold mb-3">Write a Review</h5>
                <Form onSubmit={handleReviewSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rating (1-5)</Form.Label>
                    <Form.Select 
                      value={reviewData.rating} 
                      onChange={e => setReviewData({...reviewData, rating: e.target.value})}
                      className="premium-input"
                    >
                      {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      value={reviewData.comment}
                      onChange={e => setReviewData({...reviewData, comment: e.target.value})}
                      className="premium-input"
                      required
                    />
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button variant="dark" type="submit" className="rounded-pill px-4">Submit Review</Button>
                    <Button variant="outline-secondary" className="rounded-pill px-4" onClick={() => setShowReviewForm(false)}>Cancel</Button>
                  </div>
                </Form>
              </div>
            )}

            {product.reviews && product.reviews.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {product.reviews.map((r, i) => (
                  <div key={i} className="p-3 bg-white rounded-3 shadow-sm border border-light-subtle">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-semibold">{r.user?.name || 'User'}</span>
                      <span className="text-warning">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                    </div>
                    <p className="mb-0 text-muted">{r.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              !showReviewForm && (
                <div className="text-center bg-light p-5 rounded-4 border border-light-subtle">
                  <i className="bi bi-star text-muted fs-1 mb-3 d-block">★</i>
                  <h5 className="fw-bold mb-2">No reviews yet</h5>
                  <p className="text-muted mb-4">Have you purchased this product? Share your thoughts with others.</p>
                  <Button variant="outline-dark" className="rounded-pill px-4 py-2" onClick={() => setShowReviewForm(true)}>Write the First Review</Button>
                </div>
              )
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
