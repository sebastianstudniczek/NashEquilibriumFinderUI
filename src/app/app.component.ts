import { Component } from '@angular/core';
import Fraction from 'fraction.js';
import { combineLatest } from 'rxjs';
import { GameTableRow } from './models/game-table-row.interface';
import { Game } from './models/game.model';
import { StrategyProbability } from './models/strategy-probability.interface';
import { EquilibriumService } from './services/equilibrium.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '';
  nashEquilibriumPayouts: number[][] = [];
  correlatedEquilibriumPayouts: number[][] = [];
  firstPlayerNEStrategyProbs: StrategyProbability[] = [];
  secondPlayerNEStrategyProbs: StrategyProbability[] = [];
  firstPlayerCEStrategyProbs: StrategyProbability[] = [];
  secondPlayerCEStrategyProbs: StrategyProbability[] = [];
  // TODO: Create coordinate struct
  cleanStrategyPayouts: any[] = [];
  paretoFront: number[][] = [];
  elapsedMilliseconds = 300;
  rows: GameTableRow[] = [];
  headers: string[] = [];
  constructor(private equilibriumService: EquilibriumService) {}

  onGameSubmitted(event: Game): void {
    combineLatest([
      this.equilibriumService.getNashFromLemkeHowson(event),
      this.equilibriumService.getCorrelatedFromSimplex(event)
    ]).subscribe(([algorithmResult, correlatedEquilibrium]) => {
      this.firstPlayerNEStrategyProbs = algorithmResult.nashEquilibrium
        .firstPlayerStrategyProbabilities.map(
          (prob) => new StrategyProbability('', new Fraction(prob.numerator, prob.denominator))
        );
      this.secondPlayerNEStrategyProbs = algorithmResult.nashEquilibrium
        .secondPlayerStrategyProbabilities.map(
          (prob) => new StrategyProbability('', new Fraction(prob.numerator, prob.denominator))
        );
      const strategyProbs: StrategyProbability[] = correlatedEquilibrium
        .strategyProfilesProbabilities.map(
          (prob) => new StrategyProbability('', new Fraction(prob.numerator, prob.denominator))
        );
      this.firstPlayerCEStrategyProbs = strategyProbs;
      this.secondPlayerCEStrategyProbs = strategyProbs;
      // TODO: Move to separate requests since it has nothing to do with nash equilibrium per se
      const firstPlayerStrategies: string[] = [...new Set(algorithmResult.sortedPayouts.map(
        (payout) => payout.firstPlayerStrategyName
      ))].sort();

      this.headers = [...new Set(algorithmResult.sortedPayouts.map(
        (payout) => payout.secondPlayerStrategyName
      ))].sort();
      this.headers.unshift('.');
      this.rows = [];
      firstPlayerStrategies.forEach((element) => {
        const bondRows = algorithmResult.sortedPayouts
          .filter((x) => x.firstPlayerStrategyName === element)
          .sort((a, b) => {
            if (a.secondPlayerStrategyName < b.secondPlayerStrategyName) {
              return -1;
            }
            if (a.secondPlayerStrategyName > b.secondPlayerStrategyName) {
              return 1;
            }
            return 0;
          }).map((payout) => [
            payout.firstPlayerCleanStrategyPayoff,
            payout.secondPlayerCleanStrategyPayoff
          ]);
        this.rows.push({
          firstPlayerStrategy: element,
          payoffs: bondRows
        });
      });

      this.cleanStrategyPayouts = algorithmResult.sortedPayouts.map(
        (payout) => [
          payout.firstPlayerCleanStrategyPayoff,
          payout.secondPlayerCleanStrategyPayoff,
          payout.firstPlayerStrategyName,
          payout.secondPlayerStrategyName
        ]
      );
      this.nashEquilibriumPayouts = [
        [
          algorithmResult.nashEquilibrium.firstPlayerGamePayoff,
          algorithmResult.nashEquilibrium.secondPlayerGamePayoff
        ]
      ];
      this.correlatedEquilibriumPayouts = [
        [
          correlatedEquilibrium.firstPlayerGamePayoff,
          correlatedEquilibrium.secondPlayerGamePayoff
        ]
      ];
      this.paretoFront = algorithmResult.paretoFront;
      this.title = event.title;
    });
  }
}
