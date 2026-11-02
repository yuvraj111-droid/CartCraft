# CartCraft — E-commerce Shopping Platform

CartCraft is a browser-based e-commerce application built using HTML, CSS and JavaScript. It allows users to browse products, search the catalogue, manage their shopping cart, complete a demo checkout and track their orders.

## Features

- Browse products from a local JSON catalogue.
- Search products by name or keyword.
- Sort products by price or name.
- Select product quantities before adding them to the cart.
- Save cart items using browser localStorage.
- Update quantities and remove products from the cart.
- Select delivery options at checkout.
- Calculate item totals, shipping costs and estimated tax.
- Place demo orders and view order history.
- Track orders using their saved details.
- Run basic Jasmine tests for cart and currency functions.

## Technologies

- HTML5
- CSS3
- JavaScript (ES Modules)
- Fetch API
- localStorage
- Jasmine

## Project Structure

```text
CartCraft/
├── index.html
├── checkout.html
├── orders.html
├── tracking.html
├── backend/
│   └── products.json
├── data/
│   ├── cart.js
│   ├── deliveryoptions.js
│   ├── orders.js
│   └── products.js
├── scripts/
│   ├── store.js
│   ├── checkout.js
│   ├── orders.js
│   ├── tracking.js
│   ├── checkout/
│   └── utils/
├── styles/
├── images/
├── test-jasmine/
├── package.json
└── README.md
```

## Run Locally

CartCraft uses JavaScript ES Modules and the Fetch API, so it needs to run through a local web server.

1. Clone or download this repository.
2. Open the project folder in VS Code.
3. Install the Live Server extension if needed.
4. Right-click `index.html` and select **Open with Live Server**.
5. Browse products, add items to your cart and proceed to checkout.

The product catalogue is loaded from `backend/products.json`. No separate backend installation is required.

## Demo Checkout and Data Storage

CartCraft uses browser `localStorage` to save shopping cart items and demo orders.

- Checkout simulates the order placement process.
- No real payments are processed.
- No payment information is collected.
- Order tracking displays the saved demo order status.
- Cart items and orders are stored locally in the current browser.

Clearing browser site data will remove locally stored cart items and orders. The data is not shared between devices or users.

## Tests

Run the cart tests using Node.js:

```bash
npm test
```

You can also open `test-jasmine/tests.html` through Live Server to run the Jasmine tests in your browser.

## Project Overview

CartCraft demonstrates front-end development concepts including DOM manipulation, JavaScript modules, asynchronous operations, browser storage, event handling and basic software testing.

