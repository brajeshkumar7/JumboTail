export class TruckShippingStrategy {
  constructor() {
    this.mode = 'TRUCK';
    this.ratePerKmPerKg = 2; // Rs per km per kg
  }

  calculateCost(distanceKm, weightKg) {
    if (distanceKm < 0 || weightKg <= 0) {
      throw new Error('Invalid distance or weight for TruckShippingStrategy');
    }
    return this.ratePerKmPerKg * distanceKm * weightKg;
  }
}

