import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials or server error.');
    }
  };

  return (
    <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="border-0 shadow p-4" style={{ width: '100%', maxWidth: '450px' }}>
        <Card.Body>
          <h2 className="text-center fw-bold mb-4">Welcome Back</h2>
          {error && <div className="alert alert-danger p-2 text-center">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" required onChange={handleChange} placeholder="name@example.com" />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" required onChange={handleChange} placeholder="••••••••" />
            </Form.Group>
            <Button variant="dark" type="submit" className="w-100 py-2 rounded-pill fw-bold">
              Sign In
            </Button>
          </Form>
          <div className="text-center mt-4">
            <span className="text-muted">Don't have an account? </span>
            <Link to="/register" className="text-dark fw-bold text-decoration-none">Create one</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
