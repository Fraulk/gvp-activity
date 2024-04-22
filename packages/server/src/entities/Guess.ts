import {Schema, type} from '@colyseus/schema';
import { Player } from './Player';

export interface IGuess {
  player: Player,
  message: string,
  hasWon: boolean,
  author: string,
}

export class Guess extends Schema {
  @type(Player)
  public player: Player;

  @type('string')
  public message: string;

  @type('boolean')
  public hasWon: boolean;

  @type('string')
  public author: string;

  // Init
  constructor({player, message, hasWon, author}: IGuess) {
    super();
    this.player = player;
    this.message = message;
    this.hasWon = hasWon;
    this.author = author;
  }
}
