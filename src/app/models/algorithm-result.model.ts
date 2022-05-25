import { NashEquilibrium } from './nash-equilibrium.model';
import { PayoutCoordinate } from './payout-coordinate.model';

export interface AlgorithmResult {
  nashEquilibrium: NashEquilibrium;
  elapsedMilliseconds: number;
  sortedPayouts: PayoutCoordinate[];
  paretoFront: number[][];
}
