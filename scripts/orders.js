import { getOrders } from '../data/orders.js';
import { loadProducts, getProduct } from '../data/products.js';
import { addToCart } from '../data/cart.js';
import { formatcurrency } from './utils/money.js';

const ordersGrid = document.querySelector('.js-orders-grid');

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

function renderOrders() {
  const orders = getOrders();

  if (orders.length === 0) {
    ordersGrid.innerHTML = `
      <div class="empty-orders-message">
        <h2>You haven't placed an order yet</h2>
        <p>Your demo orders will appear here after checkout.</p>
        <a class="button-primary continue-shopping-button" href="index.html">Browse products</a>
      </div>
    `;
    return;
  }

  ordersGrid.innerHTML = orders.map((order) => {
    const itemsHTML = order.items.map((item) => `
      <div class="order-product-row">
        <div class="product-image-container">
          <img src="${item.image}" alt="${item.productName}">
        </div>
        <div class="product-details">
          <div class="product-name">${item.productName}</div>
          <div class="product-delivery-date">Estimated delivery: ${formatDate(item.deliveryDate)}</div>
          <div class="product-quantity">Quantity: ${item.quantity}</div>
          <button class="buy-again-button button-primary js-buy-again" data-product-id="${item.productId}" data-quantity="${item.quantity}">
            Buy it again
          </button>
        </div>
        <div class="product-actions">
          <a class="track-package-button button-secondary" href="tracking.html?orderId=${encodeURIComponent(order.id)}&productId=${encodeURIComponent(item.productId)}">Track package</a>
        </div>
      </div>
    `).join('');

    return `
      <section class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order placed:</div>
              <div>${formatDate(order.placedAt)}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatcurrency(order.totals.totalCents)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        <div class="order-details-grid">
          ${itemsHTML}
        </div>
      </section>
    `;
  }).join('');

  ordersGrid.querySelectorAll('.js-buy-again').forEach((button) => {
    button.addEventListener('click', () => {
      const product = getProduct(button.dataset.productId);
      const quantity = Number(button.dataset.quantity);

      if (product && addToCart(product, quantity)) {
        window.location.href = 'checkout.html';
      }
    });
  });
}

async function startOrdersPage() {
  try {
    await loadProducts();
    renderOrders();
  } catch (error) {
    ordersGrid.textContent = 'Could not load order information. Please refresh the page.';
    console.error(error);
  }
}

startOrdersPage();
