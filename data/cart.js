// Cart items are saved in the browser so they remain after a page refresh.
export let cart = [];

export function loadFromStorage() {
  try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
  } catch (error) {
    console.error('Could not read the saved cart:', error);
    cart = [];
  }

  return cart;
}

loadFromStorage();

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function addToCart(product, quantity = 1) {
  const amount = Number(quantity);

  if (!Number.isInteger(amount) || amount < 1 || amount > 10) {
    return false;
  }

  const matchingItem = cart.find((item) => item.productId === product.id);

  if (matchingItem) {
    matchingItem.quantity = Math.min(10, matchingItem.quantity + amount);
  } else {
    cart.push({
      productId: product.id,
      quantity: amount,
      deliveryOptionId: '1'
    });
  }

  saveToStorage();
  return true;
}

export function updateQuantity(productId, quantity) {
  const amount = Number(quantity);

  if (!Number.isInteger(amount) || amount < 1 || amount > 10) {
    return false;
  }

  const matchingItem = cart.find((item) => item.productId === productId);

  if (!matchingItem) {
    return false;
  }

  matchingItem.quantity = amount;
  saveToStorage();
  return true;
}

export function removeFromCart(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  const matchingItem = cart.find((item) => item.productId === productId);

  if (!matchingItem) {
    return false;
  }

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
  return true;
}

export function clearCart() {
  cart = [];
  saveToStorage();
}
