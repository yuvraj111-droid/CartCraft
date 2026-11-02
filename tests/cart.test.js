import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// A small localStorage replacement lets the cart functions run in Node tests.
const savedItems = new Map();

globalThis.localStorage = {
  getItem(key) {
    return savedItems.has(key) ? savedItems.get(key) : null;
  },
  setItem(key, value) {
    savedItems.set(key, String(value));
  },
  removeItem(key) {
    savedItems.delete(key);
  }
};

const cartModule = await import('../data/cart.js');
const {
  addToCart,
  loadFromStorage,
  updateQuantity,
  removeFromCart,
  getCartQuantity
} = cartModule;

const product = { id: 'test-product' };

beforeEach(() => {
  savedItems.set('cart', '[]');
  loadFromStorage();
});

test('adds the selected quantity of a product', () => {
  addToCart(product, 3);

  assert.equal(cartModule.cart.length, 1);
  assert.equal(cartModule.cart[0].quantity, 3);
  assert.equal(getCartQuantity(), 3);
});

test('adds quantity to an existing product instead of creating a duplicate', () => {
  addToCart(product, 2);
  addToCart(product, 1);

  assert.equal(cartModule.cart.length, 1);
  assert.equal(cartModule.cart[0].quantity, 3);
});

test('updates a cart item quantity', () => {
  addToCart(product, 1);

  assert.equal(updateQuantity('test-product', 4), true);
  assert.equal(cartModule.cart[0].quantity, 4);
});

test('rejects quantities outside the allowed range', () => {
  addToCart(product, 1);

  assert.equal(updateQuantity('test-product', 0), false);
  assert.equal(updateQuantity('test-product', 11), false);
  assert.equal(cartModule.cart[0].quantity, 1);
});

test('removes an item from the cart', () => {
  addToCart(product, 1);
  removeFromCart('test-product');

  assert.equal(cartModule.cart.length, 0);
});
