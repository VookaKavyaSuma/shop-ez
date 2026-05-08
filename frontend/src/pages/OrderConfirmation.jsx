import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, ListGroup } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Error fetching order', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="dark" />
      </div>
    );
  }

  if (!order) {
    return (
      <Container className="py-5 text-center">
        <h2>Order Not Found</h2>
        <p>We couldn't find the order you're looking for.</p>
        <Link to="/"><Button variant="dark">Return Home</Button></Link>
      </Container>
    );
  }

  return (
    <Container className="py-5 text-center">
      <div className="mb-5">
        <div className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle mb-3" style={{ width: '80px', height: '80px' }}>
          <i className="bi bi-check-lg fs-1">✓</i>
        </div>
        <h1 className="fw-bold mb-2">Thank you for your order!</h1>
        <p className="text-muted fs-5">Order #{order._id}</p>
        <p className="lead mt-3">We've received your order and are getting it ready to be shipped.</p>
      </div>

      <Row className="justify-content-center text-start">
        <Col md={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-4 border-bottom pb-2">Order Details</h4>
              <Row className="mb-4">
                <Col sm={6}>
                  <h6 className="text-muted mb-1">Shipping Address</h6>
                  <p className="mb-0 fw-semibold">{order.shippingAddress.fullName}</p>
                  <p className="mb-0">{order.shippingAddress.addressLine1}</p>
                  <p className="mb-0">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p className="mb-0">{order.shippingAddress.country}</p>
                </Col>
                <Col sm={6}>
                  <h6 className="text-muted mb-1 mt-3 mt-sm-0">Payment Method</h6>
                  <p className="fw-semibold">{order.paymentMethod}</p>
                  <h6 className="text-muted mb-1 mt-3">Order Status</h6>
                  <p className="fw-semibold text-primary">{order.status}</p>
                </Col>
              </Row>

              <h5 className="fw-bold mb-3 border-bottom pb-2">Items Ordered</h5>
              <ListGroup variant="flush">
                {order.products.map((item, idx) => (
                  <ListGroup.Item key={idx} className="px-0 py-3 border-bottom border-secondary-subtle d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img src={item.product.images[0] || 'https://via.placeholder.com/50'} alt="product" style={{ width: '60px', height: '60px', objectFit: 'cover' }} className="rounded me-3" />
                      <div>
                        <h6 className="mb-1">{item.product.name}</h6>
                        <span className="text-muted small">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="fw-semibold">${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div className="d-flex justify-content-between align-items-center mt-4">
                <h5 className="fw-bold mb-0">Total Amount</h5>
                <h4 className="fw-bold mb-0">${order.totalAmount.toFixed(2)}</h4>
              </div>
            </Card.Body>
          </Card>
          <div className="text-center mt-4">
            <Link to="/">
              <Button variant="outline-dark" size="lg" className="rounded-pill px-5 py-2 fw-semibold">Continue Shopping</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderConfirmation;
