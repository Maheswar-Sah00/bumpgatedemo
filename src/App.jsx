import { Link, NavLink, Route, Routes } from 'react-router-dom';
import clsx from 'clsx';
import { useCart } from './cart.jsx';
import Shop from './pages/Shop.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Order from './pages/Order.jsx';

export default function App() {
  const { count } = useCart();
  return (
    <div className="page">
      <div className="ribbon">Black Friday: up to 30% off · free delivery over $75</div>
      <header className="top">
        <Link to="/" className="brand" aria-label="Hearth & Co. home">
          <span className="brand-mark" aria-hidden="true">H</span>
          Hearth &amp; Co.
        </Link>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => clsx('nav-link', isActive && 'active')}>Shop</NavLink>
          <NavLink to="/cart" className={({ isActive }) => clsx('nav-link', 'cart-link', isActive && 'active')}>
            Cart
            <span className={clsx('badge', count === 0 && 'badge-empty')} aria-label={`${count} items in cart`}>{count}</span>
          </NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<Order />} />
          <Route path="*" element={<p className="empty">Page not found. <Link to="/">Back to the shop</Link></p>} />
        </Routes>
      </main>
      <footer className="foot">Hearth &amp; Co. is a demo shop for Bumpgate. Nothing here is for sale.</footer>
    </div>
  );
}
