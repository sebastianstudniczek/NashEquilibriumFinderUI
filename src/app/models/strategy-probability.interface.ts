import Fraction from 'fraction.js';

export class StrategyProbability {
  constructor(
    public strategyName: string,
    public probability: Fraction
  ) {
  }
}
