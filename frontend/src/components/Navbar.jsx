import React, { useContext, useState } from 'react';
import { Navbar, Nav, Container, Badge, Button, Form, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const NavbarComponent = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const cartItemCount = cart ? cart.products.reduce((acc, curr) => acc + curr.quantity, 0) : 0;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 brand-font text-white">ShopEZ</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form className="d-flex mx-auto my-2 my-lg-0 w-50" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Search products..."
              className="me-2 rounded-pill premium-input py-1 px-3"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-light" className="rounded-pill px-3" type="submit">Search</Button>
          </Form>
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/checkout" className="position-relative me-3">
              Cart
              {cartItemCount > 0 && (
                <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                  {cartItemCount}
                </Badge>
              )}
            </Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/orders" className="me-3">Orders</Nav.Link>
                {user.isAdmin && (
                  <NavDropdown title="Admin Panel" id="admin-nav-dropdown" className="me-3" menuVariant="dark">
                    <NavDropdown.Item as={Link} to="/admin/add-product">Add Product</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/products">Manage Products</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/orders">Manage Orders</NavDropdown.Item>
                  </NavDropdown>
                )}
                <Navbar.Text className="me-3 text-light">Hi, {user.name}</Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
