import { Schema, type } from '@colyseus/schema';

export interface Member {
    displayAvatarURL: string
    displayName: string
    nickname: string
    userId: string
}

export class Author extends Schema {
    @type('string')
    public displayAvatarURL: string;

    @type('string')
    public displayName: string;

    @type('string')
    public nickname: string;

    @type('string')
    public userId: string;

    // Init
    constructor({ displayAvatarURL, displayName, nickname, userId }: Member) {
        super();
        this.displayAvatarURL = displayAvatarURL;
        this.displayName = displayName;
        this.nickname = nickname;
        this.userId = userId;
    }
}
