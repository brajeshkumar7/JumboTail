export class MiniVanShippingStrategy {
  constructor() {
    this.mode = 'MINI_VAN';
    this.ratePerKmPerKg = 3; // Rs per km per kg
  }

  calculateCost(distanceKm, weightKg) {
    if (distanceKm < 0 || weightKg <= 0) {
      throw new Error('Invalid distance or weight for MiniVanShippingStrategy');
    }
    return this.ratePerKmPerKg * distanceKm * weightKg;
  }
}

