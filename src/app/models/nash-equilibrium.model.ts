import { SimpleFraction } from './simple-fraction.model';

export interface NashEquilibrium {
  firstPlayerStrategyProbabilities: SimpleFraction[];
  secondPlayerStrategyProbabilities: SimpleFraction[];
  firstPlayerGamePayoff: number;
  secondPlayerGamePayoff: number;
}
