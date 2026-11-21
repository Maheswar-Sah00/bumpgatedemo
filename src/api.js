const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchProducts() {
  const res = await fetch(`${import.meta.env.BASE_URL}products.json`);
  if (!res.ok) throw new Error(`Could not load products (${res.status})`);
  await wait(150);
  return res.json();
}

export async function fetchProduct(id) {
  const all = await fetchProducts();
  const product = all.find((p) => p.id === id);
  if (!product) throw new Error('Product not found');
  return product;
}

export function money(n) {
  return `$${n.toFixed(2)}`;
}
