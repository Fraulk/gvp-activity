import { Schema, type } from '@colyseus/schema';

export interface IShot {
    ID: number;
    author: string;
    colorName: string;
    date: string;
    epochTime: number;
    gameName: string;
    height: number;
    message_id: string;
    score: number;
    shotUrl: string;
    spoiler: boolean;
    thumbnailUrl: string;
    width: number;
}

export class Shot extends Schema {
    @type('number')
    public ID: number;

    @type('string')
    public author: string;

    @type('string')
    public colorName: string;

    @type('string')
    public date: string;

    @type('number')
    public epochTime: number;

    @type('string')
    public gameName: string;

    @type('number')
    public height: number;

    @type('string')
    public message_id: string;

    @type('number')
    public score: number;

    @type('string')
    public shotUrl: string;

    @type('boolean')
    public spoiler: boolean;

    @type('string')
    public thumbnailUrl: string;

    @type('number')
    public width: number;

    // Init
    constructor(props: IShot) {
        super();
        this.ID = props.ID;
        this.author = props.author;
        this.colorName = props.colorName;
        this.date = props.date;
        this.epochTime = props.epochTime;
        this.gameName = props.gameName;
        this.height = props.height;
        this.message_id = props.message_id.toString();
        this.score = props.score;
        this.shotUrl = props.shotUrl;
        this.spoiler = props.spoiler;
        this.thumbnailUrl = props.thumbnailUrl;
        this.width = props.width;
    }
}
