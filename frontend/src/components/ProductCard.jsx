import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const finalPrice = product.price - (product.price * (product.discount / 100));

  return (
    <Card className="h-100 shadow-sm product-card border-0">
      <div className="position-relative overflow-hidden" style={{ height: '250px' }}>
        <Card.Img 
          variant="top" 
          src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300x250'} 
          className="w-100 h-100 object-fit-cover product-image" 
        />
        {product.discount > 0 && (
          <Badge bg="danger" className="position-absolute top-0 start-0 m-2 px-2 py-1">
            {product.discount}% OFF
          </Badge>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Text className="text-muted small mb-1">{product.category}</Card.Text>
        <Card.Title className="fs-6 fw-bold mb-2 line-clamp-2">{product.name}</Card.Title>
        <div className="mt-auto">
          <div className="d-flex align-items-baseline mb-3">
            <span className="fs-5 fw-bold text-dark">${finalPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="text-muted text-decoration-line-through ms-2 small">${product.price.toFixed(2)}</span>
            )}
          </div>
          <Link to={`/product/${product._id}`} className="w-100">
            <Button variant="dark" className="w-100 rounded-pill fw-semibold shadow-sm">Shop Now</Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
