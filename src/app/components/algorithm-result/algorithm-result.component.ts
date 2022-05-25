import { Component, Input } from '@angular/core';
import { StrategyProbability } from 'src/app/models/strategy-probability.interface';

@Component({
  selector: 'app-algorithm-result',
  templateUrl: './algorithm-result.component.html',
  styleUrls: ['./algorithm-result.component.css']
})
export class AlgorithmResultComponent {
  @Input() algorithmName = '';
  @Input() firstPlayerStrategyProbs: StrategyProbability[] = [];
  @Input() secondPlayerStrategyProbs: StrategyProbability[] = [];
  @Input() calculationTime = 0;
}
