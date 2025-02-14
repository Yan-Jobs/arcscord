import { APIChannel } from 'discord-api-types';
import { Client } from '../../Client';
import { PermissionOverwrite } from '../../utils/PermissionOverwrite';
import { Snowflake } from '../../utils/Snowflake';
import { Guild } from '../Guild';
import { Channel } from './Channel';


export class GuildChannel extends Channel {
    public name: string;
    public guild: Guild;
    public nsfw: boolean;
    public position: number;
    public parentId: Snowflake | null;
    public permissionOverwrites: PermissionOverwrite[] = [];

    constructor(client: Client, data: APIChannel) {
        super(client, data);
        this.guild = client.guilds.get(data.guild_id!)!;
        this.name = data.name!;
        this.nsfw = !!data.nsfw;
        this.position = data.position || 0;
        this.parentId = data.parent_id || null;
        if (data.permission_overwrites) {
            for (const permissionOverwrite of data.permission_overwrites) {
                this.permissionOverwrites.push(
                    new PermissionOverwrite(permissionOverwrite)
                );
            }
        }
    }

    update(data: APIChannel): GuildChannel {
        if (data.name !== this.name) this.name = data.name!;
        if (data.nsfw !== this.nsfw) this.nsfw = !!data.nsfw;
        if (data.position && this.position !== data.position)
            this.position = data.position;
        if (data.parent_id && this.parentId !== data.parent_id)
            this.parentId = data.parent_id;
        this.permissionOverwrites = [];
        if (data.permission_overwrites) {
            for (const permissionOverwrite of data.permission_overwrites) {
                this.permissionOverwrites.push(
                    new PermissionOverwrite(permissionOverwrite)
                );
            }
        }
        return this;
    }
}
