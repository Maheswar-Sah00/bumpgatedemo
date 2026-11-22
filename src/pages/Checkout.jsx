import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import clsx from 'clsx';
import { money } from '../api.js';
import { useCart } from '../cart.jsx';

export const checkoutSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name'),
  email: z.string().trim().email('Enter a valid email address'),
  address: z.string().trim().min(5, 'Please enter your street address'),
  postcode: z.string().trim().regex(/^[A-Za-z0-9 -]{3,10}$/, 'Enter a valid postcode'),
});

const FIELDS = [
  { name: 'name', label: 'Full name', autoComplete: 'name' },
  { name: 'email', label: 'Email', autoComplete: 'email', type: 'email' },
  { name: 'address', label: 'Street address', autoComplete: 'street-address' },
  { name: 'postcode', label: 'Postcode', autoComplete: 'postal-code' },
];

export default function Checkout() {
  const cart = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', postcode: '' });
  const [errors, setErrors] = useState({});

  if (cart.items.length === 0) {
    return (
      <section className="narrow">
        <h1>Checkout</h1>
        <p className="empty">Your cart is empty. <Link to="/">Back to the shop</Link>.</p>
      </section>
    );
  }

  function placeOrder(e) {
    e.preventDefault();
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const next = {};
      result.error.errors.forEach((issue) => {
        const field = issue.path[0];
        if (!next[field]) next[field] = issue.message;
      });
      setErrors(next);
      return;
    }
    const id = `HC-${Math.floor(1000 + Math.random() * 9000)}`;
    const order = { id, name: result.data.name, email: result.data.email, total: cart.total, items: cart.count };
    try { sessionStorage.setItem(`order-${id}`, JSON.stringify(order)); } catch { /* ignore */ }
    cart.clear();
    navigate(`/order/${id}`, { state: order });
  }

  return (
    <section className="narrow">
      <h1>Checkout</h1>
      <p className="summary-line">{cart.count} item{cart.count === 1 ? '' : 's'} · total <b>{money(cart.total)}</b></p>
      <form className="checkout" onSubmit={placeOrder} noValidate>
        {Object.keys(errors).length > 0 && (
          <div className="error-box" role="alert">Please fix the {Object.keys(errors).length === 1 ? 'field' : 'fields'} below.</div>
        )}
        {FIELDS.map((f) => (
          <div key={f.name} className={clsx('field', errors[f.name] && 'field-bad')}>
            <label htmlFor={f.name}>{f.label}</label>
            <input
              id={f.name}
              name={f.name}
              type={f.type || 'text'}
              autoComplete={f.autoComplete}
              value={form[f.name]}
              aria-invalid={!!errors[f.name]}
              aria-describedby={errors[f.name] ? `${f.name}-error` : undefined}
              onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
            />
            {errors[f.name] && <p id={`${f.name}-error`} className="field-error">{errors[f.name]}</p>}
          </div>
        ))}
        <button type="submit" className="btn btn-big">Place order · {money(cart.total)}</button>
      </form>
    </section>
  );
}
