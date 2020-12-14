import React from 'react';
import {Redirect, Route, Switch} from 'react-router';
import {ChapterStats} from './features/chapter-stats/components/chatpter-stats/chapter-stats';
import {Inbox} from './features/inbox/components/inbox/inbox';
import {PageNotFound} from './features/page-not-found/page-not-found';
import {Sent} from './features/sent/components/sent/sent';
import {Stats} from './features/stats/components/stats/stats';
import {features} from "./features/features/features";
import {FallbackInbox} from "./features/inbox/components/fallback-inbox/fallback-inbox";

export const AppRouting = () => <Switch>
  <Redirect exact from="/" to="/inbox"/>
  <Route exact path="/inbox" component={features.inboxRefreshed ? Inbox : FallbackInbox}/>
  <Route exact path="/sent" component={Sent}/>
  <Route exact path="/stats" component={Stats}/>
  <Route exact path="/chapter-stats" component={ChapterStats}/>
  {/*<Route exact path="/dashboard" component={Dashboard}/>*/}
  {/*<Route exact path="/chapter" component={Chapter}/>*/}
  {/*<Route exact path="/mine" component={PersonalFeedback}/>*/}
  <Route component={PageNotFound}/>
</Switch>;
