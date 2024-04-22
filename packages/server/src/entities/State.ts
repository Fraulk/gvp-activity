import { Schema, MapSchema, type, ArraySchema } from '@colyseus/schema';
import { TPlayerOptions, Player } from './Player';
import { IShot, Shot } from './Shot';
import { Guess, IGuess } from './Guess';
import { Author, Member } from './Author';

export interface IState {
    roomName: string;
    channelId: string;
}

export class State extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();

    @type('string')
    public roomName: string;

    @type('string')
    public channelId: string;

    @type(Shot)
    public shot: Shot | null = null;

    @type(Author)
    public author: Author | null = null;

    @type([ Guess ])
    public guesses = new ArraySchema<Guess>();

    // Init
    constructor(attributes: IState) {
        super();
        this.roomName = attributes.roomName;
        this.channelId = attributes.channelId;
    }

    private _getPlayer(sessionId: string): Player | undefined {
        return Array.from(this.players.values()).find((p) => p.sessionId === sessionId);
    }

    createPlayer(sessionId: string, playerOptions: TPlayerOptions) {
        const existingPlayer = Array.from(this.players.values()).find((p) => p.sessionId === sessionId);
        if (existingPlayer == null) {
            this.players.set(playerOptions.userId, new Player({ ...playerOptions, sessionId }));
        }
    }

    removePlayer(sessionId: string) {
        const player = Array.from(this.players.values()).find((p) => p.sessionId === sessionId);
        if (player != null) {
            this.players.delete(player.userId);
        }
    }

    startTalking(sessionId: string) {
        const player = this._getPlayer(sessionId);
        if (player != null) {
            player.talking = true;
        }
    }

    stopTalking(sessionId: string) {
        const player = this._getPlayer(sessionId);
        if (player != null) {
            player.talking = false;
        }
    }

    setCurrentGame(newShot: IShot) {
        this.shot = new Shot(newShot);
    }

    setCurrentAuthor(newAuthor: Member) {
        this.author = new Author(newAuthor);
    }

    newGuess(guess: IGuess) {
        const player = this._getPlayer(guess.player.sessionId);
        if (!player) return;
        const newGuess = new Guess({ player, message: guess.message, hasWon: guess.hasWon ?? false, author: guess.author ?? ""});
        this.guesses.push(newGuess);
    }
}
