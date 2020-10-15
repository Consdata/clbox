import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import styled from 'styled-components';
import {AppState} from '../../../../state/app-state';

const currentMonth = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 7);

const Header = styled.div`
  font-weight: 500;
  margin-bottom: 8px;
`;

const StatRow = styled.div`
  display: flex;
`;

const StatKey = styled.div`
  flex-basis: 100px;
`;

const StatsView = ({stats}: ViewProps) => {
  return <div>
    <Header>
      {stats?.summary ?? 0} company wide feedbacks in {currentMonth}.
    </Header>
    <div>
      {Object.keys(stats || {})?.filter(date => date !== 'summary').sort((a, b) => b.localeCompare(a)).map(date => <StatRow key={date}>
        <StatKey>{date}</StatKey>
        <div>{stats[date]}</div>
      </StatRow>)}
    </div>
  </div>;
};

interface ViewProps extends ConnectedProps
  <typeof connector> {
}

const connector = connect(
  (state: AppState) => ({
    stats: state.stats?.months?.[currentMonth]
  }),
  {}
);

export const Stats = connector(StatsView);
