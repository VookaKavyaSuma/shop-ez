import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Spinner, Card } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, adminRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products'),
          axios.get('http://localhost:5000/api/admin')
        ]);
        setProducts(productsRes.data);
        setAdminData(adminRes.data);
      } catch (err) {
        console.error('Error fetching data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="dark" />
      </div>
    );
  }

  return (
    <div className="home-page pb-5">
      {/* Hero Banner */}
      {adminData && adminData.bannerImage && (
        <div 
          className="hero-banner d-flex align-items-center justify-content-center text-center text-white"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${adminData.bannerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '60vh',
            minHeight: '400px'
          }}
        >
          <div className="px-4">
            <h1 className="display-3 fw-bold mb-3 animate-fade-in-up">Discover Your Style</h1>
            <p className="lead mb-4 animate-fade-in-up delay-1">Explore our exclusive collections and find exactly what you need.</p>
          </div>
        </div>
      )}

      <Container className="mt-5">
        {/* Categories */}
        {adminData && adminData.categories && adminData.categories.length > 0 && (
          <section className="mb-5">
            <h2 className="mb-4 fw-bold">Shop by Category</h2>
            <Row className="g-4">
              {adminData.categories.map((category, idx) => (
                <Col md={4} key={idx}>
                  <Card className="category-card border-0 text-white overflow-hidden shadow-sm" style={{ height: '200px', borderRadius: '15px' }}>
                    <Card.Img src={category.image || 'https://via.placeholder.com/500x300'} alt={category.name} className="h-100 object-fit-cover category-image" />
                    <Card.ImgOverlay className="d-flex flex-column justify-content-end bg-gradient-dark">
                      <Card.Title className="fs-4 fw-bold mb-0">{category.name}</Card.Title>
                    </Card.ImgOverlay>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>
        )}

        {/* Product Catalog */}
        <section>
          <h2 className="mb-4 fw-bold">Featured Products</h2>
          <Row className="g-4">
            {products.map(product => (
              <Col xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard product={product} />
              </Col>
            ))}
            {products.length === 0 && (
              <div className="text-center text-muted py-5">
                <p>No products available yet.</p>
              </div>
            )}
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default Home;
