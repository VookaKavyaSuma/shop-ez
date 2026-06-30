import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Badge, Spinner, Row, Col, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const res = await axios.get('https://shop-ez-q1o8.onrender.com/api/orders', {
          headers: { 'x-auth-token': token }
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="dark" />
      </div>
    );
  }

  const handleDeleteClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    setShowModal(false);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://shop-ez-q1o8.onrender.com/api/orders/${selectedOrderId}`, {
        headers: { 'x-auth-token': token }
      });
      setOrders(orders.filter(order => order._id !== selectedOrderId));
      toast.success('Order deleted successfully');
    } catch (err) {
      console.error('Error deleting order', err);
      toast.error('Failed to delete order. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Processing': return 'info';
      case 'Shipped': return 'primary';
      case 'Delivered': return 'success';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Container className="py-5 mt-4">
      <h2 className="mb-4 fw-bold brand-font">My Orders</h2>
      {orders.length === 0 ? (
        <Card className="border-0 shadow-sm p-5 text-center">
          <p className="lead text-muted">You haven't placed any orders yet.</p>
          <button className="btn btn-dark mt-3" onClick={() => navigate('/')}>Continue Shopping</button>
        </Card>
      ) : (
        <Row className="g-4">
          {orders.map(order => (
            <Col xs={12} key={order._id}>
              <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
                <Card.Header className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-bold me-3">Order #{order._id.substring(order._id.length - 8)}</span>
                    <small className="text-light opacity-75">{new Date(order.createdAt).toLocaleDateString()}</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <Badge bg={getStatusBadge(order.status)} className="px-3 py-2 rounded-pill fs-6 text-dark me-3">
                      {order.status}
                    </Badge>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(order._id)}>
                      <i className="bi bi-trash"></i> Delete
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="d-flex flex-column gap-3">
                    {order.products.map((item, idx) => (
                      <div key={idx} className="d-flex align-items-center pb-3 border-bottom border-light">
                        <img 
                          src={item.product?.images?.[0] || 'https://via.placeholder.com/60'} 
                          alt={item.product?.name || 'Product'} 
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                          className="me-3"
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{item.product?.name || 'Unknown Product'}</h6>
                          <small className="text-muted">Qty: {item.quantity}</small>
                        </div>
                        <div className="fw-bold">
                          ₹{item.priceAtPurchase.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-4 pt-2">
                    <div className="text-muted small">
                      <i className="bi bi-geo-alt-fill me-1"></i>
                      {order.shippingAddress?.city}, {order.shippingAddress?.country}
                    </div>
                    <h5 className="mb-0 fw-bold">Total: ₹{order.totalAmount.toFixed(2)}</h5>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold brand-font text-danger">Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="fs-5">
          Are you sure you want to delete this order? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" className="rounded-pill px-4" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" className="rounded-pill px-4" onClick={confirmDelete}>
            Yes, Delete Order
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Orders;
