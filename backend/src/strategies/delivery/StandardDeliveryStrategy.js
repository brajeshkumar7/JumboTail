export class StandardDeliveryStrategy {
  constructor() {
    this.speed = 'STANDARD';
    this.baseCharge = 10; // Rs
  }

  /**
   * @param {number} shippingCost - cost from transport mode strategy
   * @param {number} weightKg - package weight in kilograms
   */
  calculateTotal(shippingCost, weightKg) {
    if (shippingCost < 0 || weightKg <= 0) {
      throw new Error('Invalid shipping cost or weight for StandardDeliveryStrategy');
    }
    return this.baseCharge + shippingCost;
  }
}

