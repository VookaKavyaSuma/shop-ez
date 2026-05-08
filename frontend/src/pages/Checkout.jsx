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
      <h1 className="fw-bold mb-4">Checkout</h1>
      <Row className="g-5">
        <Col lg={7}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-3">Shipping Address</h4>
              <Form onSubmit={handleCheckout} id="checkout-form">
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" name="fullName" required onChange={handleInputChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Control type="text" name="addressLine1" required onChange={handleInputChange} />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control type="text" name="city" required onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Postal Code</Form.Label>
                      <Form.Control type="text" name="postalCode" required onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-4">
                  <Form.Label>Country</Form.Label>
                  <Form.Control type="text" name="country" required onChange={handleInputChange} />
                </Form.Group>

                <h4 className="fw-bold mb-3 mt-5">Payment Method</h4>
                <Form.Check 
                  type="radio"
                  label="Credit Card"
                  name="paymentMethod"
                  value="Credit Card"
                  checked={paymentMethod === 'Credit Card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mb-2"
                />
                <Form.Check 
                  type="radio"
                  label="PayPal"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === 'PayPal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="border-0 shadow-sm bg-light">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-4">Order Summary</h4>
              <ListGroup variant="flush" className="mb-3 bg-transparent">
                {cart.products.map((item, idx) => {
                  const finalPrice = item.product.price - (item.product.price * (item.product.discount / 100));
                  totalAmount += finalPrice * item.quantity;
                  return (
                    <ListGroup.Item key={idx} className="bg-transparent px-0 d-flex justify-content-between align-items-center border-bottom border-secondary-subtle">
                      <div className="d-flex align-items-center">
                        <img src={item.product.images[0] || 'https://via.placeholder.com/50'} alt="product" style={{ width: '50px', height: '50px', objectFit: 'cover' }} className="rounded me-3" />
                        <div>
                          <h6 className="my-0 text-truncate" style={{ maxWidth: '150px' }}>{item.product.name}</h6>
                          <small className="text-muted">Qty: {item.quantity}</small>
                        </div>
                      </div>
                      <div className="text-end">
                        <span className="fw-semibold">${(finalPrice * item.quantity).toFixed(2)}</span>
                        <br/>
                        <small className="text-danger" style={{ cursor: 'pointer' }} onClick={() => removeFromCart(item.product._id)}>Remove</small>
                      </div>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
              
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="fw-semibold">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
                <span className="text-muted">Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <span className="fs-5 fw-bold">Total</span>
                <span className="fs-5 fw-bold">${totalAmount.toFixed(2)}</span>
              </div>
              
              <Button form="checkout-form" type="submit" variant="dark" size="lg" className="w-100 rounded-pill py-3 fw-bold shadow">
                Place Order
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
