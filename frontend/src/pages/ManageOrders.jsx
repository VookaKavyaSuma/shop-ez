import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Container, Card, Badge, Spinner, Table, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const ManageOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const res = await axios.get('http://localhost:5000/api/admin/orders', {
          headers: { 'x-auth-token': token }
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching admin orders', err);
        toast.error('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    if (user && user.isAdmin) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [navigate, user]);

  if (!user || !user.isAdmin) {
    return (
      <Container className="py-5 text-center mt-5">
        <h3 className="text-danger fw-bold">Access Denied</h3>
        <p className="lead text-muted">You do not have permission to view this page.</p>
        <Button variant="dark" className="rounded-pill mt-3 px-4" onClick={() => navigate('/')}>Return Home</Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="dark" />
      </div>
    );
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`, { status: newStatus }, {
        headers: { 'x-auth-token': token }
      });
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
      toast.success('Order status updated!');
    } catch (err) {
      console.error('Error updating status', err);
      toast.error('Failed to update status.');
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
      <h2 className="mb-4 fw-bold brand-font">Manage Master Orders</h2>
      <Card className="border-0 shadow-lg" style={{ borderRadius: '15px' }}>
        <Card.Body className="p-4">
          {orders.length === 0 ? (
            <p className="text-center text-muted my-5">No orders found in the system.</p>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td><small className="fw-bold">#{order._id.substring(order._id.length - 8)}</small></td>
                      <td>
                        <div className="fw-bold">{order.user?.name || 'Unknown User'}</div>
                        <small className="text-muted">{order.user?.email}</small>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="fw-bold">₹{order.totalAmount.toFixed(2)}</td>
                      <td>
                        <Badge bg={getStatusBadge(order.status)} className="px-3 py-2 rounded-pill text-dark">
                          {order.status}
                        </Badge>
                      </td>
                      <td>
                        <Form.Select 
                          size="sm" 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="premium-input"
                          style={{ width: '130px' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </Form.Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ManageOrders;
