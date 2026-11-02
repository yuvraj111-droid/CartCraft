import { addToCart, getCartQuantity } from '../data/cart.js';
import { loadProducts, products } from '../data/products.js';

const productGrid = document.querySelector('.js-product-grid');
const searchForm = document.querySelector('.js-search-form');
const searchInput = document.querySelector('.js-search-input');
const searchMessage = document.querySelector('.js-search-message');
const sortSelect = document.querySelector('.js-sort-select');

let currentSearch = '';

function updateCartCount() {
  const cartCount = document.querySelector('.js-cart-quantity');
  if (cartCount) {
    cartCount.textContent = getCartQuantity();
  }
}

function getVisibleProducts() {
  const query = currentSearch.trim().toLowerCase();

  let visibleProducts = products.filter((product) => {
    const searchableText = [product.name, ...product.keywords]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(query);
  });

  const sortOrder = sortSelect ? sortSelect.value : 'recommended';

  if (sortOrder === 'price-low') {
    visibleProducts = [...visibleProducts].sort((a, b) => a.priceCents - b.priceCents);
  } else if (sortOrder === 'price-high') {
    visibleProducts = [...visibleProducts].sort((a, b) => b.priceCents - a.priceCents);
  } else if (sortOrder === 'name') {
    visibleProducts = [...visibleProducts].sort((a, b) => a.name.localeCompare(b.name));
  }

  return visibleProducts;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();

  if (searchMessage) {
    searchMessage.textContent = currentSearch
      ? `${visibleProducts.length} product(s) found for "${currentSearch}".`
      : `Showing ${visibleProducts.length} products.`;
  }

  if (visibleProducts.length === 0) {
    productGrid.innerHTML = `
      <div class="empty-products-message">
        <h2>No products found</h2>
        <p>Try another product name or keyword.</p>
      </div>
    `;
    updateCartCount();
    return;
  }

  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-container">
      <div class="product-image-container">
        <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
      </div>

      <div class="product-name limit-text-to-2-lines">${product.name}</div>

      <div class="product-rating-container">
        <img class="product-rating-stars" src="${product.getStarurl()}" alt="${product.rating.stars} out of 5 stars">
        <span class="product-rating-count">${product.rating.count}</span>
      </div>

      <div class="product-price">${product.getPrice()}</div>

      <div class="product-quantity-container">
        <label class="visually-hidden" for="quantity-${product.id}">Quantity for ${product.name}</label>
        <select id="quantity-${product.id}" class="js-quantity-selector" data-product-id="${product.id}">
          ${Array.from({ length: 10 }, (_, index) => `
            <option value="${index + 1}">${index + 1}</option>
          `).join('')}
        </select>
      </div>

      ${product.extraInfoHTML()}
      <div class="product-spacer"></div>
      <p class="added-to-cart js-added-message" aria-live="polite"></p>

      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
        Add to Cart
      </button>
    </article>
  `).join('');

  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const product = products.find((item) => item.id === productId);
      const quantitySelect = document.querySelector(
        `.js-quantity-selector[data-product-id="${productId}"]`
      );
      const quantity = Number(quantitySelect.value);

      if (product && addToCart(product, quantity)) {
        updateCartCount();
        const message = button.parentElement.querySelector('.js-added-message');
        message.textContent = `${quantity} item(s) added to your cart.`;
      }
    });
  });

  updateCartCount();
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  currentSearch = searchInput.value;
  renderProducts();
});

sortSelect.addEventListener('change', renderProducts);

async function startStore() {
  try {
    await loadProducts();
    renderProducts();
  } catch (error) {
    productGrid.innerHTML = '<p class="empty-products-message">Products could not be loaded. Please refresh the page.</p>';
    searchMessage.textContent = 'Unable to load products.';
    console.error(error);
  }
}

startStore();
