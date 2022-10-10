import React from 'react';

const Modal = ({ open, onClose }) => {
  if (!open) {
    return null;
  }
  return (
    <div className="overlay">
      <div className="modalContainer">
        <div className="modalRight">
          <p onClick={onClose} className="closeBtn">
            X
          </p>
          <div className="content">
            <h3>Student:</h3>
            <span>
              <ul>
                <li>Sign in with provided credentials</li>
                <li>Select the course you currently have a class for</li>
                <li>
                  Select the class you need to attend; usually, a green Attend
                  button alongside the time the class was created will be
                  displayed
                </li>
                <li>
                  Enter the OTC provided to you by your lecturer, and click on
                  Check-In
                </li>
                <li>
                  You will be redirected to the Home page once your check-in is
                  validated
                </li>
                <li>Sign-Out</li>
              </ul>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
