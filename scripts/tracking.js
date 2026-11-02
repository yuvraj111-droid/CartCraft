import { getOrderById } from '../data/orders.js';

const trackingContainer = document.querySelector('.js-order-tracking');
const params = new URLSearchParams(window.location.search);
const orderId = params.get('orderId');
const productId = params.get('productId');

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
}

function renderTrackingPage() {
  const order = getOrderById(orderId);

  if (!order) {
    trackingContainer.innerHTML = `
      <a class="back-to-orders-link link-primary" href="orders.html">← Back to your orders</a>
      <div class="empty-orders-message">
        <h2>Order not found</h2>
        <p>Open tracking from one of your saved orders.</p>
      </div>
    `;
    return;
  }

  const item = order.items.find((orderItem) => orderItem.productId === productId);

  if (!item) {
    trackingContainer.textContent = 'This product could not be found in the selected order.';
    return;
  }

  const statusSteps = ['Processing', 'Shipped', 'Delivered'];
  const statusIndex = Math.max(0, statusSteps.indexOf(item.status || order.status));
  const progressWidth = [20, 60, 100][statusIndex];

  trackingContainer.innerHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">← Back to your orders</a>
    <div class="tracking-order-id">Order ID: ${order.id}</div>
    <div class="delivery-date">Estimated arrival: ${formatDate(item.deliveryDate)}</div>
    <div class="product-info">${item.productName}</div>
    <div class="product-info">Quantity: ${item.quantity}</div>
    <img class="product-image" src="${item.image}" alt="${item.productName}">

    <div class="tracking-status-heading">Current status: <strong>${item.status || order.status}</strong></div>
    <div class="progress-labels-container">
      ${statusSteps.map((step, index) => `
        <div class="progress-label ${index === statusIndex ? 'current-status' : ''}">${step}</div>
      `).join('')}
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${progressWidth}%"></div>
    </div>
    <p class="tracking-demo-note">This is a demonstration order. Tracking status is stored in this browser and is not connected to a courier service.</p>
  `;
}

renderTrackingPage();
