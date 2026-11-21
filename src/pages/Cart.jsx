import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { money } from '../api.js';
import { useCart } from '../cart.jsx';

export default function Cart() {
  const cart = useCart();
  const navigate = useNavigate();
  const [code, setCode] = useState(cart.promo || '');
  const [promoMsg, setPromoMsg] = useState('');

  if (cart.items.length === 0) {
    return (
      <section className="narrow">
        <h1>Your cart</h1>
        <p className="empty">Your cart is empty. <Link to="/">Find something warm</Link>.</p>
      </section>
    );
  }

  return (
    <section className="narrow">
      <h1>Your cart</h1>
      <ul className="lines">
        {cart.items.map((i) => (
          <li key={i.id} className="line">
            <span className="line-name">{i.name}</span>
            <span className="qty">
              <button type="button" aria-label={`Remove one ${i.name}`} onClick={() => cart.changeQty(i.id, -1)}>−</button>
              <span aria-label="quantity">{i.qty}</span>
              <button type="button" aria-label={`Add one ${i.name}`} onClick={() => cart.changeQty(i.id, 1)}>+</button>
            </span>
            <span className="line-total">{money(i.qty * i.price)}</span>
          </li>
        ))}
      </ul>
      <form
        className="promo"
        onSubmit={(e) => {
          e.preventDefault();
          const c = code.trim().toUpperCase();
          if (c === 'FRIDAY10') {
            cart.applyPromo(c);
            setPromoMsg('FRIDAY10 applied: 10% off.');
          } else {
            cart.applyPromo(null);
            setPromoMsg('That code is not valid.');
          }
        }}
      >
        <label htmlFor="promo">Promo code</label>
        <input id="promo" value={code} onChange={(e) => setCode(e.target.value)} placeholder="FRIDAY10" />
        <button type="submit" className="btn btn-quiet">Apply</button>
        {promoMsg && <p className="promo-msg" role="status">{promoMsg}</p>}
      </form>
      <dl className="totals">
        <div><dt>Subtotal</dt><dd>{money(cart.subtotal)}</dd></div>
        {cart.discount > 0 && <div><dt>Discount</dt><dd>−{money(cart.discount)}</dd></div>}
        <div><dt>Delivery</dt><dd>{cart.shipping === 0 ? 'Free' : money(cart.shipping)}</dd></div>
        <div className="grand"><dt>Total</dt><dd>{money(cart.total)}</dd></div>
      </dl>
      <button type="button" className="btn btn-big" onClick={() => navigate('/checkout')}>Go to checkout</button>
    </section>
  );
}
