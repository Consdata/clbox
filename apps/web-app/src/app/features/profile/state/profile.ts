export interface Profile {
  chapter: string;
  chapterLeader: string;
  email: string;
  expireDate: string;
  leader: boolean;
  leaderOf: string[];
  leaderOfMap: {[chapter: string]: boolean};
  username: string;
  withExpire: boolean;
}
