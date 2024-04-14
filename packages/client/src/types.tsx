import type {AsyncReturnType} from 'type-fest';
import {discordSdk} from './discordSdk';
import {Client, Room} from 'colyseus.js';
import {State} from '../../server/src/entities/State';

export type TAuthenticateResponse = AsyncReturnType<typeof discordSdk.commands.authenticate>;
export interface IColyseus {
  room: Room<State>;
  client: Client;
}
export type TAuthenticatedContext = TAuthenticateResponse & {guildMember: IGuildsMembersRead | null, guildId: string} & IColyseus;

export interface IGuildsMembersRead {
  roles: string[];
  nick: string | null;
  avatar: string | null;
  premium_since: string | null;
  joined_at: string;
  is_pending: boolean;
  pending: boolean;
  communication_disabled_until: string | null;
  user: {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
    public_flags: number;
  };
  mute: boolean;
  deaf: boolean;
}

export interface Shot {
  ID: number;
  author: string;
  colorName: string;
  date: string | Date;
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