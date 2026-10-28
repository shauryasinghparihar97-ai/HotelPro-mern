import React from 'react';

const StarRating = ({ rating = 5, totalStars = 5, showScore = true }) => {
  const stars = [];
  const rounded = Math.round(rating * 2) / 2;

  for (let i = 1; i <= totalStars; i++) {
    if (i <= rounded) {
      stars.push(
        <i
          key={i}
          className="bi bi-star-fill text-warning me-1"
          style={{ fontSize: '0.9rem' }}
        ></i>
      );
    } else if (i - 0.5 === rounded) {
      stars.push(
        <i
          key={i}
          className="bi bi-star-half text-warning me-1"
          style={{ fontSize: '0.9rem' }}
        ></i>
      );
    } else {
      stars.push(
        <i
          key={i}
          className="bi bi-star text-warning me-1"
          style={{ fontSize: '0.9rem' }}
        ></i>
      );
    }
  }

  return (
    <div className="d-inline-flex align-items-center">
      <div className="d-flex">{stars}</div>
      {showScore && (
        <span className="ms-1 fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
