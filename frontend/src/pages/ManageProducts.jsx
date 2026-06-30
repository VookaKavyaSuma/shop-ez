import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Container, Card, Table, Button, Spinner, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const ManageProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    category: '',
    imageUrl: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://shop-ez-q1o8.onrender.com/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products', err);
      toast.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

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

  // Handle Edit Click
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount || 0,
      category: product.category,
      imageUrl: product.images && product.images.length > 0 ? product.images[0] : ''
    });
    setShowEditModal(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Update Submit
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        discount: Number(formData.discount),
        category: formData.category,
        images: formData.imageUrl ? [formData.imageUrl] : []
      };

      const res = await axios.put(`https://shop-ez-q1o8.onrender.com/api/admin/products/${editingProduct._id}`, payload, {
        headers: { 'x-auth-token': token }
      });
      
      setProducts(products.map(p => p._id === editingProduct._id ? res.data : p));
      toast.success('Product updated successfully!');
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating product', err);
      toast.error('Failed to update product.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete Click
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to completely delete this product? This action cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://shop-ez-q1o8.onrender.com/api/admin/products/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted.');
    } catch (err) {
      console.error('Error deleting product', err);
      toast.error('Failed to delete product.');
    }
  };

  return (
    <Container className="py-5 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold brand-font m-0">Manage Products</h2>
        <Button variant="dark" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => navigate('/admin/add-product')}>
          + Add New Product
        </Button>
      </div>

      <Card className="border-0 shadow-lg" style={{ borderRadius: '15px' }}>
        <Card.Body className="p-4">
          {products.length === 0 ? (
            <p className="text-center text-muted my-5">No products found in the catalog.</p>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td>
                        <img 
                          src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/50'} 
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </td>
                      <td className="fw-bold">{product.name}</td>
                      <td>{product.category}</td>
                      <td className="fw-bold text-success">₹{product.price.toFixed(2)}</td>
                      <td className="text-end">
                        <Button variant="outline-primary" size="sm" className="me-2 rounded-pill px-3" onClick={() => handleEditClick(product)}>
                          Edit
                        </Button>
                        <Button variant="outline-danger" size="sm" className="rounded-pill px-3" onClick={() => handleDelete(product._id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold brand-font">Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Product Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleFormChange} required className="premium-input py-2" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleFormChange} required className="premium-input" />
            </Form.Group>

            <div className="row">
              <Form.Group className="col-md-6 mb-3">
                <Form.Label className="fw-bold">Price (₹)</Form.Label>
                <Form.Control type="number" step="0.01" name="price" value={formData.price} onChange={handleFormChange} required className="premium-input py-2" />
              </Form.Group>
              <Form.Group className="col-md-6 mb-3">
                <Form.Label className="fw-bold">Discount (%)</Form.Label>
                <Form.Control type="number" name="discount" value={formData.discount} onChange={handleFormChange} className="premium-input py-2" />
              </Form.Group>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Category</Form.Label>
              <Form.Select name="category" value={formData.category} onChange={handleFormChange} required className="premium-input py-2">
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Image URL</Form.Label>
              <Form.Control type="url" name="imageUrl" value={formData.imageUrl} onChange={handleFormChange} required className="premium-input py-2" />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2 rounded-pill px-4" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button variant="dark" type="submit" className="rounded-pill px-4 shadow-sm" disabled={isSaving}>
                {isSaving ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ManageProducts;
