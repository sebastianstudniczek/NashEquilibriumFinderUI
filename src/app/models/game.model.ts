import { Player } from './player.model';

export class Game {
  title: string;
  firstPlayer: Player;
  secondPlayer: Player;

  constructor(title: string, firstPlayer: Player, secondPlayer: Player) {
    this.title = title;
    this.firstPlayer = firstPlayer;
    this.secondPlayer = secondPlayer;
  }
}
