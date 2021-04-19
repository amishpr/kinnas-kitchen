const CART_KEY = "cart";
const TOKEN_KEY = "jwt";


/* Cart Functions */
export const calculatePrice = items => {
  return `$${items
    .reduce((acc, item) => acc + item.quantity * item.price, 0)
    .toFixed(2)}`;
};

export const getCart = (cartKey = CART_KEY) => {
    if (localStorage && localStorage.getItem(cartKey)) {
      return JSON.parse(localStorage.getItem(cartKey));
    }
    return [];
  };

export const setCart = (value, cartKey = CART_KEY) => {
  if (localStorage) {
    localStorage.setItem(cartKey, JSON.stringify(value));
  }
};

export const clearCart = (cartKey = CART_KEY) => {
    if (localStorage) {
      localStorage.removeItem(cartKey);
    }
  };

/* User Authorization */
export const getToken = (tokenKey = TOKEN_KEY) => {
    if (localStorage && localStorage.getItem(tokenKey)) {
      return JSON.parse(localStorage.getItem(tokenKey));
    }
    return null;
  };

export const setToken = (value, tokenKey = TOKEN_KEY) => {
  if (localStorage) {
    localStorage.setItem(tokenKey, JSON.stringify(value));
  }
};

export const clearToken = (tokenKey = TOKEN_KEY) => {
    if (localStorage) {
      localStorage.removeItem(tokenKey);
    }
  };
