import {UserDocument} from "./user-document";
import {directory} from "./users/directory";
import {Chapter} from "./users/chapter";

const chapters = Object.keys(directory.chapters).reduce(
  (result, chapter) => ({
    ...result,
    [Chapter[chapter]]: {
      name: chapter,
      key: Chapter[chapter],
      info: directory.chapters[chapter],
      leader: Object.values(directory.users).find(user => user.leaderOf.includes(Chapter[chapter]))
    }
  }),
  {}
);

export const users: UserDocument[] = Object.values(directory.users).map(
  userInfo => {
    const channelManager = Object.values(directory.channels)
      .filter(channel => channel.managers.includes(userInfo.username))
      .map(channel => channel.slackChannel);
    return {
      username: userInfo.username,
      display_name: userInfo.display_name,
      email: userInfo.email,
      chapter: userInfo.chapter,
      chapterLeader: userInfo.chapterLeader ? directory.users[userInfo.chapterLeader].email : chapters[userInfo.chapter].leader.email,
      leader: userInfo.leaderOf.length > 0,
      leaderOf: userInfo.leaderOf,
      leaderOfMap: userInfo.leaderOf.reduce((result, chapter) => ({
          ...result,
          [chapter]: true
        }),
        {}
      ),
      expireDate: userInfo.expireDate ?? '',
      withExpire: !!userInfo.expireDate,
      channelManager: channelManager,
      channelManagerMap: channelManager.reduce((map, channel) => ({[channel]: true}), {})
    };
  }
);
