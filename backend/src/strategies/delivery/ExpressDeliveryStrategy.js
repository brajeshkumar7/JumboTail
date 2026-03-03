export class ExpressDeliveryStrategy {
  constructor() {
    this.speed = 'EXPRESS';
    this.baseCharge = 10; // Rs
    this.extraPerKg = 1.2; // Rs per kg
  }

  /**
   * @param {number} shippingCost - cost from transport mode strategy
   * @param {number} weightKg - package weight in kilograms
   */
  calculateTotal(shippingCost, weightKg) {
    if (shippingCost < 0 || weightKg <= 0) {
      throw new Error('Invalid shipping cost or weight for ExpressDeliveryStrategy');
    }
    const extra = this.extraPerKg * weightKg;
    return this.baseCharge + extra + shippingCost;
  }
}

