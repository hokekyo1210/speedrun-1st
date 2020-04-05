export class Game {
  gameId: string;
  gameTitle: string;
  activePlayerNum: number;

  constructor(init?: Partial<Game>) {
    Object.assign(this, init);
  }

}
