import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const CartContext = createContext(null);
const KEY = 'hearth-cart';

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const found = state.items.find((i) => i.id === action.product.id);
      const items = found
        ? state.items.map((i) => (i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i))
        : [...state.items, { ...action.product, qty: 1 }];
      return { ...state, items };
    }
    case 'qty':
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: Math.max(0, i.qty + action.delta) } : i))
          .filter((i) => i.qty > 0),
      };
    case 'remove':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'promo':
      return { ...state, promo: action.code };
    case 'clear':
      return { items: [], promo: null };
    default:
      return state;
  }
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { items: [], promo: null };
  } catch {
    return { items: [], promo: null };
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode */ }
  }, [state]);

  const value = useMemo(() => {
    const count = state.items.reduce((n, i) => n + i.qty, 0);
    const subtotal = state.items.reduce((n, i) => n + i.qty * i.price, 0);
    const discount = state.promo === 'FRIDAY10' ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
    const shipping = subtotal - discount >= 75 || subtotal === 0 ? 0 : 6;
    return {
      ...state,
      count,
      subtotal,
      discount,
      shipping,
      total: subtotal - discount + shipping,
      add: (product) => dispatch({ type: 'add', product }),
      changeQty: (id, delta) => dispatch({ type: 'qty', id, delta }),
      remove: (id) => dispatch({ type: 'remove', id }),
      applyPromo: (code) => dispatch({ type: 'promo', code }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
