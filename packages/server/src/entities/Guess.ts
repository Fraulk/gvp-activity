import {Schema, type} from '@colyseus/schema';
import { Player } from './Player';

export interface IGuess {
  player: Player,
  message: string
}

export class Guess extends Schema {
  @type(Player)
  public player: Player;

  @type('string')
  public message: string;

  // Init
  constructor({player, message}: IGuess) {
    super();
    this.player = player;
    this.message = message;
  }
}
