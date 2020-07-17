import {SlackUserProfile} from './slack-user-profile';

export interface SlackUser {
    color: string,
    deleted: boolean,
    id: string,
    is_admin: boolean,
    is_app_user: boolean,
    is_bot: boolean,
    is_owner: boolean,
    is_primary_owner: boolean,
    is_restricted: boolean,
    is_ultra_restricted: boolean,
    name: string,
    profile: SlackUserProfile
}