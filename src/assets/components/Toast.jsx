import React from 'react';

export default function Toast({ toastMsg, toastVisible }) {
  return (
    <div
      className={`toast ${toastVisible ? "show" : ""}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {toastMsg}
    </div>
  );
}