export class AirplaneShippingStrategy {
  constructor() {
    this.mode = 'AEROPLANE';
    this.ratePerKmPerKg = 1; // Rs per km per kg
  }

  calculateCost(distanceKm, weightKg) {
    if (distanceKm < 0 || weightKg <= 0) {
      throw new Error('Invalid distance or weight for AirplaneShippingStrategy');
    }
    return this.ratePerKmPerKg * distanceKm * weightKg;
  }
}

