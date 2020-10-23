import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import styled from 'styled-components';
import {AppState} from '../../../../state/app-state';
import {firebaseApp} from '../../../firebase/firebase.app';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const Body = styled.div`
  width: 1000px;
  margin: 32px auto;
`;

interface UserYearStats {
  [date: string]: number;

  summary: number;
}

interface UserStats {
  user: string;
  stats: {
    byYear: {
      [year: string]: UserYearStats;
    }
  }
}

type ChapterStats = UserStats[];

function statsFor(year: string, user: UserStats) {
  return Object.entries(user.stats?.byYear[year] ?? [])
    .filter(([key, value]) => key !== 'summary')
    .map(([key, value]) => [key.substring(0, 7), value])
    .reduce(
      (result, pair) => ({
        ...result,
        [pair[0]]: (result[pair[0]] ?? 0) + pair[1]
      }),
      {}
    );
}

const months = [
  '2020-07',
  '2020-08',
  '2020-09',
  '2020-10',
  '2020-11',
  '2020-12'
]

const StatsView = ({team}: ViewProps) => {
  const [stats, setStates] = useState<ChapterStats>(undefined);
  useEffect(() => {
    if (team) {
      firebaseApp.functions('europe-west3').httpsCallable('getChapterStats')({
        team: team, statType: 'sent-feedbacks'
      }).then(result => {
        setStates(result.data);
      });
    }
  }, [team]);
  return <Body>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">User</TableCell>
            {months.map(month => <TableCell align="right" key={month}>{month}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {stats
            ?.map(user => ({user, stats: statsFor('2020', user)}))
            .map(
              userStats => <TableRow key={userStats.user.user}>
                <TableCell align="left">{userStats.user.user}</TableCell>
                {months.map(month => <TableCell align="right" key={month}>
                  {userStats.stats[month] ?? ''}
                </TableCell>)}
              </TableRow>
            )
          }
        </TableBody>
      </Table>
    </TableContainer>
  </Body>
};

interface ViewProps extends ConnectedProps
  <typeof connector> {
}

const connector = connect(
  (state: AppState) => ({
    team: state.team?.current?.id
  }),
  {}
);

export const ChapterStats = connector(StatsView);
