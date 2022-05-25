export class SimpleFraction {
  numerator: number;
  denominator: number;

  constructor(numerator: number, denominator?: number) {
    this.numerator = numerator;

    if(typeof denominator !== 'undefined') {
      this.denominator = denominator;
    } else {
      this.denominator = 1;
    }
  }
}
