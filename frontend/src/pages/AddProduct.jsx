import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    category: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);

  if (!user || !user.isAdmin) {
    return (
      <Container className="py-5 text-center mt-5">
        <h3 className="text-danger fw-bold">Access Denied</h3>
        <p className="lead text-muted">You do not have permission to view this page.</p>
        <Button variant="dark" className="rounded-pill mt-3 px-4" onClick={() => navigate('/')}>Return Home</Button>
      </Container>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        discount: formData.discount ? Number(formData.discount) : 0,
        category: formData.category,
        images: formData.imageUrl ? [formData.imageUrl] : []
      };

      await axios.post('http://localhost:5000/api/admin/products', payload, {
        headers: { 'x-auth-token': token }
      });
      
      toast.success('Product added successfully!');
      setFormData({
        name: '',
        description: '',
        price: '',
        discount: '',
        category: '',
        imageUrl: ''
      });
      navigate('/');
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error('Failed to add product. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 mt-4" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4 fw-bold brand-font text-center">Add New Product</h2>
      <Card className="border-0 shadow-lg" style={{ borderRadius: '15px' }}>
        <Card.Body className="p-5">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="premium-input py-2"
                placeholder="e.g. Wireless Noise-Cancelling Headphones"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="premium-input"
                placeholder="Detailed product description..."
              />
            </Form.Group>

            <div className="row">
              <Form.Group className="col-md-6 mb-4">
                <Form.Label className="fw-bold">Price (₹)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="premium-input py-2"
                  placeholder="e.g. 299.99"
                />
              </Form.Group>

              <Form.Group className="col-md-6 mb-4">
                <Form.Label className="fw-bold">Discount (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="premium-input py-2"
                  placeholder="e.g. 15 (Optional)"
                />
              </Form.Group>
            </div>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Category</Form.Label>
              <Form.Select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                required
                className="premium-input py-2"
              >
                <option value="">Select a Category...</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-5">
              <Form.Label className="fw-bold">Image URL</Form.Label>
              <Form.Control
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                required
                className="premium-input py-2"
                placeholder="https://images.unsplash.com/photo-..."
              />
            </Form.Group>

            <Button 
              variant="dark" 
              type="submit" 
              className="w-100 rounded-pill py-3 fw-bold shadow-sm"
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Create Product'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddProduct;
