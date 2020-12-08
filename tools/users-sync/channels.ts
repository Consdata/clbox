import {ChannelDocument} from "./channel-document";
import {directory} from "./users/directory";

export const channels: ChannelDocument[] = Object.values(directory.channels).map(
  channel => {
    const managers = channel.managers.map(manager => directory.users[manager].email);
    return {
      display_name: channel.display_name,
      managers: managers,
      managerMap: managers.reduce((map, manager) => ({
        ...map,
        [manager]: true
      }), {}),
      slackChannel: channel.slackChannel
    };
  }
)
