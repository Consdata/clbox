export interface ChannelDocument {
  display_name: string;
  managers: string[];
  managerMap: {[key: string]: boolean};
  slackChannel: string;
}
