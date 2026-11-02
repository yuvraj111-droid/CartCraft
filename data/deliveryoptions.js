export const deliveryOptions = [
  { id: '1', deliveryDays: 7, priceCents: 0 },
  { id: '2', deliveryDays: 3, priceCents: 499 },
  { id: '3', deliveryDays: 1, priceCents: 999 }
];

export function getDeliveryOption(deliveryOptionId) {
  return deliveryOptions.find((option) => option.id === deliveryOptionId)
    || deliveryOptions[0];
}

export function getDeliveryDate(daysFromNow) {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + daysFromNow);

  return deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
}

export function getDeliveryDateISO(daysFromNow) {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + daysFromNow);
  return deliveryDate.toISOString();
}
