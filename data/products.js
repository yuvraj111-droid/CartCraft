import { formatcurrency } from '../scripts/utils/money.js';

export let products = [];

class Product {
  constructor(details) {
    this.id = details.id;
    this.image = details.image;
    this.name = details.name;
    this.rating = details.rating;
    this.priceCents = details.priceCents;
    this.keywords = details.keywords || [];
  }

  getStarurl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatcurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return '';
  }
}

class Clothing extends Product {
  constructor(details) {
    super(details);
    this.sizeChartLink = details.sizeChartLink;
  }

  extraInfoHTML() {
    if (!this.sizeChartLink) return '';
    return `<a href="${this.sizeChartLink}" target="_blank" rel="noopener noreferrer">Size chart</a>`;
  }
}

export async function loadProducts() {
  // The product list is stored in the project, so the demo does not need an external API.
  const productsUrl = new URL('../backend/products.json', import.meta.url);
  const response = await fetch(productsUrl);

  if (!response.ok) {
    throw new Error('Could not load the product list.');
  }

  const productData = await response.json();

  products = productData.map((details) => {
    return details.type === 'clothing'
      ? new Clothing(details)
      : new Product(details);
  });

  return products;
}

export function getProduct(productId) {
  return products.find((product) => product.id === productId);
}
