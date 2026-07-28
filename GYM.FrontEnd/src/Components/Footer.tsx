import { Link } from "react-router-dom";
import "../css/Footer.css";
export function Footer() {
  return (
    <footer className="footer-centered" role="contentinfo">
      <div className="footer-centered__container fw-bold fs-3 d-flex align-items-center gq-brand">
        Gym<span className="gq-text-neon">Quest</span>
        <span className="ms-2 fs-5">⚔️</span>
      </div>

      <nav className="footer-centered__nav" aria-label="Main Footer Navigation">
        <ul>
          <li>
            <Link to="/" className="link-footer">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="link-footer">
              About
            </Link>
          </li>
        </ul>
      </nav>
      <p className="footer-centered__copyright">
        &copy; 2024 Creative Co. All Rights Reserved.
      </p>
    </footer>
  );
}
