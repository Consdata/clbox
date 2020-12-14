import {InboxState} from './inbox-state';

export const inboxStateInitial: InboxState = {
    messages: undefined,
    stats: {
      channels: {},
      labels: {},
      users: {}
    }
}
