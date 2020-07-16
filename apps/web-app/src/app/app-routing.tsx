import React from 'react';
import {Redirect, Route, Switch} from 'react-router';
import {Inbox} from './features/inbox/components/inbox/inbox';
import {PageNotFound} from './features/page-not-found/page-not-found';

export const AppRouting = () => <Switch>
    <Redirect exact from="/" to="/inbox"/>
    <Route exact path="/inbox" component={Inbox}/>
    {/*<Route exact path="/dashboard" component={Dashboard}/>*/}
    {/*<Route exact path="/chapter" component={Chapter}/>*/}
    {/*<Route exact path="/mine" component={PersonalFeedback}/>*/}
    <Route component={PageNotFound}/>
</Switch>;