import { Link, useLocation, useParams } from 'react-router-dom';
import { money } from '../api.js';

export default function Order() {
  const { id } = useParams();
  const { state } = useLocation();
  let order = state;
  if (!order) {
    try { order = JSON.parse(sessionStorage.getItem(`order-${id}`)); } catch { order = null; }
  }
  if (!order) {
    return (
      <section className="narrow">
        <h1>Order not found</h1>
        <p className="empty"><Link to="/">Back to the shop</Link></p>
      </section>
    );
  }
  return (
    <section className="narrow confirm">
      <div className="tick" aria-hidden="true">✓</div>
      <h1>Order confirmed</h1>
      <p>Thanks, {order.name}! Order <b>{order.id}</b> is on its way.</p>
      <p className="muted">{order.items} item{order.items === 1 ? '' : 's'} · {money(order.total)} · receipt sent to {order.email}</p>
      <Link to="/" className="btn">Keep shopping</Link>
    </section>
  );
}
