import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { fetchProducts, money } from '../api.js';
import { useCart } from '../cart.jsx';

const CATEGORIES = ['All', 'Kitchen', 'Living', 'Wear'];

export function ProductArt({ product, large = false }) {
  return (
    <div className={clsx('art', large && 'art-large')} style={{ '--tone': product.tone }} aria-hidden="true">
      <span>{product.mark}</span>
    </div>
  );
}

export default function Shop() {
  const { data: products, isLoading, isError, error } = useQuery(['products'], fetchProducts);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [added, setAdded] = useState(null);
  const { add } = useCart();

  if (isLoading) return <p className="empty">Loading the sale…</p>;
  if (isError) return <p className="empty error">Something went wrong: {String(error?.message || error)}</p>;

  const q = query.trim().toLowerCase();
  const visible = products.filter(
    (p) => (category === 'All' || p.category === category) && (!q || p.name.toLowerCase().includes(q)),
  );

  return (
    <section>
      <div className="hero">
        <h1>The Black Friday sale</h1>
        <p>Warm things for cold evenings. Use code <b>FRIDAY10</b> for another 10% off.</p>
      </div>
      <div className="filters">
        <label className="search">
          <span className="sr-only">Search products</span>
          <input
            type="search"
            placeholder="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="chips" role="group" aria-label="Category">
          {CATEGORIES.map((c) => (
            <button key={c} type="button" className={clsx('chip', category === c && 'chip-on')} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
      {visible.length === 0 ? (
        <p className="empty">No products match “{query}”.</p>
      ) : (
        <ul className="grid">
          {visible.map((p) => (
            <li key={p.id} className="card">
              <Link to={`/product/${p.id}`} className="card-link">
                <ProductArt product={p} />
                <h2>{p.name}</h2>
              </Link>
              <p className="price">
                <span className="now">{money(p.price)}</span> <s>{money(p.was)}</s>
              </p>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  add(p);
                  setAdded(p.id);
                }}
              >
                {added === p.id ? 'Added ✓' : 'Add to cart'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
