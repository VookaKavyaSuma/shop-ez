import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError('Registration failed. User might already exist.');
    }
  };

  return (
    <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="border-0 shadow p-4" style={{ width: '100%', maxWidth: '450px' }}>
        <Card.Body>
          <h2 className="text-center fw-bold mb-4">Create Account</h2>
          {error && <div className="alert alert-danger p-2 text-center">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" name="name" required onChange={handleChange} placeholder="John Doe" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" required onChange={handleChange} placeholder="name@example.com" />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" required onChange={handleChange} placeholder="••••••••" minLength="6" />
            </Form.Group>
            <Button variant="dark" type="submit" className="w-100 py-2 rounded-pill fw-bold">
              Sign Up
            </Button>
          </Form>
          <div className="text-center mt-4">
            <span className="text-muted">Already have an account? </span>
            <Link to="/login" className="text-dark fw-bold text-decoration-none">Sign In</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
