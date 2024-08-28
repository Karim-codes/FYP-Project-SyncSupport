import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Footer.scss";

const Footer = () => {
  return (
    <div className="main-container">
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <a href="/" className="footer-logo">
            © SyncSupport
            </a>
            <span className="footer-text"> 2024, Inc</span>
          </div>
        </div>
      </footer>
    </div>
  
  );
};

export default Footer;
