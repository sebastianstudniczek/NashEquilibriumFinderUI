export class Player {
  name: string;
  payouts: number[][];

  constructor(name: string, payouts: number[][]) {
    this.name = name;
    this.payouts = payouts;
  }
}
