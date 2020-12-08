import {ChannelDocument} from "./channel-document";
import {directory} from "./users/directory";

export const channels: ChannelDocument[] = Object.values(directory.channels).map(
  channel => ({
    display_name: channel.display_name,
    managers: channel.managers,
    managerMap: channel.managers.reduce((map, manager) => ({
      ...map,
      [manager]: true
    }), {}),
    slackChannel: channel.slackChannel
  })
)
