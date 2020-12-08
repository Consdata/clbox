export interface UserDocument {
  username: string;
  display_name: string;
  chapter: string;
  chapterLeader: string;
  email: string;
  leader: boolean;
  leaderOf: string[];
  leaderOfMap: {
    [chapter: string]: boolean
  };
  expireDate: string;
  withExpire: boolean;
  channelManager: string[];
  channelManagerMap: {
    [channel: string]: boolean
  };
}
