import {
  cart,
  removeFromCart,
  updateQuantity,
  updateDeliveryOption
} from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { deliveryOptions, getDeliveryOption, getDeliveryDate } from '../../data/deliveryoptions.js';
import { formatcurrency } from '../utils/money.js';
import { renderPaymentSummary } from './paymentsummary.js';

export function renderOrderSummary() {
  const orderSummary = document.querySelector('.js-order-summary');

  if (cart.length === 0) {
    orderSummary.innerHTML = `
      <div class="empty-cart-message">
        <h2>Your cart is empty</h2>
        <p>Add a few products before checking out.</p>
        <a class="button-primary continue-shopping-button" href="index.html">Continue shopping</a>
      </div>
    `;
    return;
  }

  const cartHTML = cart.map((cartItem) => {
    const product = getProduct(cartItem.productId);

    if (!product) return '';

    const selectedDelivery = getDeliveryOption(cartItem.deliveryOptionId);
    const deliveryDate = getDeliveryDate(selectedDelivery.deliveryDays);

    const optionsHTML = deliveryOptions.map((option) => {
      const optionDate = getDeliveryDate(option.deliveryDays);
      const priceText = option.priceCents === 0
        ? 'Free shipping'
        : `$${formatcurrency(option.priceCents)} shipping`;

      return `
        <label class="delivery-option">
          <input
            type="radio"
            class="delivery-option-input js-delivery-option"
            name="delivery-${product.id}"
            value="${option.id}"
            data-product-id="${product.id}"
            ${cartItem.deliveryOptionId === option.id ? 'checked' : ''}>
          <span>
            <span class="delivery-option-date">${optionDate}</span>
            <span class="delivery-option-price">${priceText}</span>
          </span>
        </label>
      `;
    }).join('');

    return `
      <article class="cart-item-container">
        <div class="delivery-date">Delivery date: ${deliveryDate}</div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${product.image}" alt="${product.name}">

          <div class="cart-item-details">
            <div class="product-name">${product.name}</div>
            <div class="product-price">${product.getPrice()}</div>

            <div class="product-quantity">
              <label for="quantity-${product.id}">Quantity:</label>
              <input
                id="quantity-${product.id}"
                class="quantity-input js-quantity-input"
                type="number"
                min="1"
                max="10"
                value="${cartItem.quantity}"
                data-product-id="${product.id}">
              <button class="text-button js-update-quantity" data-product-id="${product.id}">Update</button>
              <button class="text-button js-delete-item" data-product-id="${product.id}">Remove</button>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${optionsHTML}
          </div>
        </div>
      </article>
    `;
  }).join('');

  orderSummary.innerHTML = cartHTML;

  // Save a changed quantity when the user selects Update.
  orderSummary.querySelectorAll('.js-update-quantity').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const input = orderSummary.querySelector(`.js-quantity-input[data-product-id="${productId}"]`);
      const quantity = Number(input.value);

      if (!updateQuantity(productId, quantity)) {
        input.setCustomValidity('Enter a quantity between 1 and 10.');
        input.reportValidity();
        input.setCustomValidity('');
        return;
      }

      renderOrderSummary();
      renderPaymentSummary();
      updateCheckoutCount();
    });
  });

  // Remove an item from the cart.
  orderSummary.querySelectorAll('.js-delete-item').forEach((button) => {
    button.addEventListener('click', () => {
      removeFromCart(button.dataset.productId);
      renderOrderSummary();
      renderPaymentSummary();
      updateCheckoutCount();
    });
  });

  // Recalculate the order when a delivery option changes.
  orderSummary.querySelectorAll('.js-delivery-option').forEach((radio) => {
    radio.addEventListener('change', () => {
      updateDeliveryOption(radio.dataset.productId, radio.value);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}

function updateCheckoutCount() {
  const itemCount = document.querySelector('.js-checkout-item-count');
  if (itemCount) {
    itemCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  }
}
