import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProduct, money } from '../api.js';
import { useCart } from '../cart.jsx';
import { ProductArt } from './Shop.jsx';

export default function Product() {
  const { id } = useParams();
  const { data: p, isPending, isError } = useQuery({ queryKey: ['product', id], queryFn: () => fetchProduct(id) });
  const { add } = useCart();

  if (isPending) return <p className="empty">Loading…</p>;
  if (isError) return <p className="empty error">We could not find that product. <Link to="/">Back to the shop</Link></p>;

  return (
    <section className="product">
      <ProductArt product={p} large />
      <div>
        <p className="crumb"><Link to="/">Shop</Link> / {p.category}</p>
        <h1>{p.name}</h1>
        <p className="price big">
          <span className="now">{money(p.price)}</span> <s>{money(p.was)}</s>
        </p>
        <p className="blurb">{p.blurb}</p>
        <button type="button" className="btn btn-big" onClick={() => add(p)}>Add to cart</button>
      </div>
    </section>
  );
}
