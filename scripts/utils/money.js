// we will share this between the cart and checkout pages

export function formatcurrency(pricecents) {
  return (Math.round(pricecents) / 100).toFixed(2)
};