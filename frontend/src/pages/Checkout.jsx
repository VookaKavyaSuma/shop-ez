import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const { cart, checkout, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    addressLine1: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      const order = await checkout(shippingAddress, paymentMethod);
      navigate(`/order-confirmation/${order._id}`);
    } catch (err) {
      alert('Failed to place order. Please try again.');
    }
  };

  if (!cart || cart.products.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2>Your Cart is Empty</h2>
        <p className="text-muted">Looks like you haven't added anything to your cart yet.</p>
        <Button variant="dark" onClick={() => navigate('/')}>Continue Shopping</Button>
      </Container>
    );
  }

  let totalAmount = 0;

  return (
    <Container className="py-5">
      <h1 className="fw-bold mb-4 brand-font">Checkout</h1>
      <Row className="g-5">
        <Col lg={7}>
          <Card className="border-0 shadow-sm mb-4 rounded-4">
            <Card.Body className="p-4 p-md-5">
              <h4 className="fw-bold mb-4 brand-font">Shipping Address</h4>
              <Form onSubmit={handleCheckout} id="checkout-form">
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-muted small text-uppercase">Full Name</Form.Label>
                  <Form.Control type="text" name="fullName" className="premium-input" required onChange={handleInputChange} />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-muted small text-uppercase">Address Line 1</Form.Label>
                  <Form.Control type="text" name="addressLine1" className="premium-input" required onChange={handleInputChange} />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold text-muted small text-uppercase">City</Form.Label>
                      <Form.Control type="text" name="city" className="premium-input" required onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold text-muted small text-uppercase">Postal Code</Form.Label>
                      <Form.Control type="text" name="postalCode" className="premium-input" required onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-5">
                  <Form.Label className="fw-semibold text-muted small text-uppercase">Country</Form.Label>
                  <Form.Control type="text" name="country" className="premium-input" required onChange={handleInputChange} />
                </Form.Group>

                <h4 className="fw-bold mb-4 brand-font mt-2 border-top pt-4">Payment Method</h4>
                <div className="d-flex gap-3">
                  <div 
                    className={`border rounded-4 p-3 flex-fill text-center cursor-pointer transition-all ${paymentMethod === 'Credit Card' ? 'border-dark bg-light' : 'border-light-subtle'}`}
                    onClick={() => setPaymentMethod('Credit Card')}
                    style={{ cursor: 'pointer' }}
                  >
                    <Form.Check 
                      type="radio"
                      label="Credit Card"
                      name="paymentMethod"
                      value="Credit Card"
                      checked={paymentMethod === 'Credit Card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mb-0 fw-semibold"
                    />
                  </div>
                  <div 
                    className={`border rounded-4 p-3 flex-fill text-center cursor-pointer transition-all ${paymentMethod === 'PayPal' ? 'border-dark bg-light' : 'border-light-subtle'}`}
                    onClick={() => setPaymentMethod('PayPal')}
                    style={{ cursor: 'pointer' }}
                  >
                    <Form.Check 
                      type="radio"
                      label="PayPal"
                      name="paymentMethod"
                      value="PayPal"
                      checked={paymentMethod === 'PayPal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mb-0 fw-semibold"
                    />
                  </div>
                </div>

                {paymentMethod === 'Credit Card' && (
                  <div className="mt-4 p-4 border rounded-4 bg-light animate-fade-in-up">
                    <h5 className="fw-bold mb-3 small text-uppercase text-muted">Card Details</h5>
                    <Form.Group className="mb-3">
                      <Form.Control type="text" placeholder="Card Number" className="premium-input" required />
                    </Form.Group>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Control type="text" placeholder="MM/YY" className="premium-input" required />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Control type="text" placeholder="CVV" className="premium-input" required />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="border-0 shadow-sm rounded-4" style={{ backgroundColor: '#fdfdfd' }}>
            <Card.Body className="p-4 p-md-5">
              <h4 className="fw-bold mb-4 brand-font">Order Summary</h4>
              <ListGroup variant="flush" className="mb-4 bg-transparent">
                {cart.products.map((item, idx) => {
                  const finalPrice = item.product.price - (item.product.price * (item.product.discount / 100));
                  totalAmount += finalPrice * item.quantity;
                  return (
                    <ListGroup.Item key={idx} className="bg-transparent px-0 py-3 d-flex justify-content-between align-items-center border-bottom border-secondary-subtle">
                      <div className="d-flex align-items-center">
                        <img src={item.product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100'} onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100'; }} alt="product" style={{ width: '60px', height: '60px', objectFit: 'cover' }} className="rounded-3 me-3 shadow-sm" />
                        <div>
                          <h6 className="my-0 text-truncate fw-semibold" style={{ maxWidth: '150px' }}>{item.product.name}</h6>
                          <small className="text-muted">Qty: {item.quantity}</small>
                        </div>
                      </div>
                      <div className="text-end">
                        <span className="fw-semibold">₹{(finalPrice * item.quantity).toFixed(2)}</span>
                        <br/>
                        <small className="text-danger" style={{ cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => removeFromCart(item.product._id)}>Remove</small>
                      </div>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
              
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted fw-medium">Subtotal</span>
                <span className="fw-semibold">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-4 border-bottom pb-4">
                <span className="text-muted fw-medium">Shipping</span>
                <span className="text-success fw-semibold">Free</span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <span className="fs-4 fw-bold brand-font">Total</span>
                <span className="fs-4 fw-bold text-dark">₹{totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="d-grid mt-4 sticky-bottom-mobile">
                <Button form="checkout-form" type="submit" variant="dark" size="lg" className="rounded-pill py-3 fw-bold shadow-lg text-uppercase tracking-wide">
                  Place Order
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
