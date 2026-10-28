import React from 'react';

const AlertMessage = ({ variant = 'info', message, dismissible = true, onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`alert alert-${variant} ${
        dismissible ? 'alert-dismissible fade show' : ''
      } d-flex align-items-center shadow-sm rounded-3`}
      role="alert"
    >
      <i
        className={`bi me-2 fs-5 ${
          variant === 'danger'
            ? 'bi-exclamation-triangle-fill text-danger'
            : variant === 'success'
            ? 'bi-check-circle-fill text-success'
            : variant === 'warning'
            ? 'bi-exclamation-circle-fill text-warning'
            : 'bi-info-circle-fill text-primary'
        }`}
      ></i>
      <div className="flex-grow-1">{message}</div>
      {dismissible && (
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={onClose}
        ></button>
      )}
    </div>
  );
};

export default AlertMessage;
