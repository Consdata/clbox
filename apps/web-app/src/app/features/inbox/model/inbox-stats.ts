export interface InboxStats {
  channels: {
    [channel: string]: {
        name: string;
        shortName: string;
        count: number;
    };
  };
  labels: {
    [label: string]: number;
  };
  users: {
    [user: string]: {
      email: string;
      name: string;
      count: number;
    }
  }
}
