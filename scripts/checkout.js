import { loadProducts } from '../data/products.js';
import { cart, getCartQuantity } from '../data/cart.js';
import { renderOrderSummary } from './checkout/ordersummary.js';
import { renderPaymentSummary } from './checkout/paymentsummary.js';

async function startCheckout() {
  const orderSummary = document.querySelector('.js-order-summary');

  try {
    await loadProducts();
    const itemCount = document.querySelector('.js-checkout-item-count');
    itemCount.textContent = getCartQuantity();

    renderOrderSummary();
    renderPaymentSummary();
  } catch (error) {
    orderSummary.textContent = 'The store could not load the product information. Please refresh the page.';
    console.error(error);
  }
}

startCheckout();
