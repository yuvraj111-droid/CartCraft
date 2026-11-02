import {
  addToCart,
  cart,
  loadFromStorage,
  updateQuantity,
  removeFromCart
} from '../../data/cart.js';

const sampleProduct = {
  id: 'sample-product',
  priceCents: 1000
};

describe('Cart', () => {
  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.returnValue('[]');
    spyOn(localStorage, 'setItem');
    loadFromStorage();
  });

  it('adds a product with the selected quantity', () => {
    addToCart(sampleProduct, 3);

    expect(cart.length).toBe(1);
    expect(cart[0].productId).toBe('sample-product');
    expect(cart[0].quantity).toBe(3);
  });

  it('adds quantity to an existing cart item', () => {
    addToCart(sampleProduct, 2);
    addToCart(sampleProduct, 1);

    expect(cart.length).toBe(1);
    expect(cart[0].quantity).toBe(3);
  });

  it('updates a product quantity', () => {
    addToCart(sampleProduct, 1);

    const updated = updateQuantity('sample-product', 4);

    expect(updated).toBeTrue();
    expect(cart[0].quantity).toBe(4);
  });

  it('does not accept an invalid quantity', () => {
    addToCart(sampleProduct, 1);

    expect(updateQuantity('sample-product', 0)).toBeFalse();
    expect(cart[0].quantity).toBe(1);
  });

  it('removes an item from the cart', () => {
    addToCart(sampleProduct, 1);
    removeFromCart('sample-product');

    expect(cart.length).toBe(0);
  });
});
