import {Box, CircularProgress, MenuItem, Select} from '@material-ui/core';
import React, {useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import styled from 'styled-components';
import {AppState} from '../../../../state/app-state';
import {FeedbackCard} from '../../../feedback/components/feedback-item/feedback-card';

const Item = styled.div`
    margin-bottom: 16px;
    width: 100%;
`;

const View = styled(Box)`
    width: 600px;
    margin: 32px auto;
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const UserFilter = styled(Select)`
    margin-bottom: 16px;
`;

const SentView = ({messages, users}: ViewProps) => {
  const [filter, setFilter] = useState('all');
  return <View>
    {users?.length > 0 && <UserFilter value={filter} onChange={change => setFilter(change.target.value as string)}>
      {users.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
    </UserFilter>}
    {!messages && <CircularProgress size={50}/>}
    {messages && messages.filter(message => filter === 'all' || filter === message.for).map(message =>
      <Item key={message.id}>
        <FeedbackCard feedback={message} existingLabels={[]} />
      </Item>
    )}
  </View>;
};

type ViewProps = ConnectedProps<typeof connector>

const connector = connect(
  (state: AppState) => ({
    messages: state.sent.messages ? Object.values(state.sent.messages.byId).sort((a, b) => b.date.localeCompare(a.date)) : undefined,
    users: [{name: 'All', id: 'all'}, ...Object.values(state.sent.messages?.byId ?? {}).map(message => ({
      name: message.forName,
      id: message.for
    }))].filter(
      (element, index, self) => self.findIndex(e => e.id === element.id) === index
    )
  }),
  {}
);

export const Sent = connector(SentView);
