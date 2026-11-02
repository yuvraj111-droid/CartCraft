// Demo orders are saved in localStorage. No real payment is collected.
export function getOrders() {
  try {
    return JSON.parse(localStorage.getItem('cartcraft-orders')) || [];
  } catch (error) {
    console.error('Could not read saved orders:', error);
    return [];
  }
}

export function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem('cartcraft-orders', JSON.stringify(orders));
}

export function getOrderById(orderId) {
  return getOrders().find((order) => order.id === orderId);
}
