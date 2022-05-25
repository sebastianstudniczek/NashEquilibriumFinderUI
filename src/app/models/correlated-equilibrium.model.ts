import { SimpleFraction } from './simple-fraction.model';

export class CorrelatedEquilibrium {
  firstPlayerGamePayoff: number;
  secondPlayerGamePayoff: number;
  strategyProfilesProbabilities: SimpleFraction[];

  constructor(firstPlayerGamePayoff: number, secondPlayerGamePayoff: number, strategyProfilesProbabilities: SimpleFraction[]) {
    this.firstPlayerGamePayoff = firstPlayerGamePayoff;
    this.secondPlayerGamePayoff = secondPlayerGamePayoff;
    this.strategyProfilesProbabilities = strategyProfilesProbabilities;
  }
}
