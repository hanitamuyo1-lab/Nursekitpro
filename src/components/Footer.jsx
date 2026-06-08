import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="foot-inner">
        <div>&copy; 2026 <b>Confident RN</b> &middot; Built for nurses, by nurses</div>
        <div>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
