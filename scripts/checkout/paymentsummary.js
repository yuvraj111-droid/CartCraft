import { cart, clearCart } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { getDeliveryOption, getDeliveryDateISO } from '../../data/deliveryoptions.js';
import { formatcurrency } from '../utils/money.js';
import { saveOrder } from '../../data/orders.js';

const TAX_RATE = 0.10;

function getOrderTotals() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let itemCount = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    const delivery = getDeliveryOption(cartItem.deliveryOptionId);

    if (!product) return;

    productPriceCents += product.priceCents * cartItem.quantity;
    shippingPriceCents += delivery.priceCents;
    itemCount += cartItem.quantity;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = Math.round(totalBeforeTaxCents * TAX_RATE);
  const totalCents = totalBeforeTaxCents + taxCents;

  return {
    itemCount,
    productPriceCents,
    shippingPriceCents,
    totalBeforeTaxCents,
    taxCents,
    totalCents
  };
}

export function renderPaymentSummary() {
  const paymentSummary = document.querySelector('.js-payment-summary');

  if (cart.length === 0) {
    paymentSummary.innerHTML = `
      <div class="payment-summary-title">Order Summary</div>
      <p>Your order total will appear here after you add products.</p>
    `;
    return;
  }

  const totals = getOrderTotals();

  paymentSummary.innerHTML = `
    <div class="payment-summary-title">Order Summary</div>
    <div class="payment-summary-row">
      <div>Items (${totals.itemCount}):</div>
      <div class="payment-summary-money">$${formatcurrency(totals.productPriceCents)}</div>
    </div>
    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatcurrency(totals.shippingPriceCents)}</div>
    </div>
    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatcurrency(totals.totalBeforeTaxCents)}</div>
    </div>
    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatcurrency(totals.taxCents)}</div>
    </div>
    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatcurrency(totals.totalCents)}</div>
    </div>
    <button class="place-order-button button-primary js-place-order">
      Place demo order
    </button>
    <p class="demo-checkout-note">Demo checkout only. No payment will be taken.</p>
  `;

  paymentSummary.querySelector('.js-place-order').addEventListener('click', () => {
    const orderItems = cart.map((cartItem) => {
      const product = getProduct(cartItem.productId);
      const delivery = getDeliveryOption(cartItem.deliveryOptionId);

      return {
        productId: product.id,
        productName: product.name,
        image: product.image,
        priceCents: product.priceCents,
        quantity: cartItem.quantity,
        deliveryOptionId: delivery.id,
        deliveryDays: delivery.deliveryDays,
        deliveryDate: getDeliveryDateISO(delivery.deliveryDays),
        status: 'Processing'
      };
    });

    const order = {
      id: `CC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      placedAt: new Date().toISOString(),
      status: 'Processing',
      items: orderItems,
      totals
    };

    try {
      saveOrder(order);
      clearCart();
      window.location.href = 'orders.html';
    } catch (error) {
      console.error('Could not save the order:', error);
      alert('Your order could not be saved. Please try again.');
    }
  });
}
