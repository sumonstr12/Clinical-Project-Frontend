import React from 'react';

export default function Stars({ rating }) {
  return (
    <span className="doc-rating">
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
      <span style={{ color: "var(--text-muted)", marginLeft: 4 }}>{rating}</span>
    </span>
  );
}