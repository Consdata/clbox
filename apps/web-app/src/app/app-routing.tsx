import React from 'react';
import {Redirect, Route, Switch} from 'react-router';
import {Chapter} from './features/chapter/chapter';
import {Dashboard} from './features/dashboard/dashboard';
import {PageNotFound} from './features/page-not-found/page-not-found';
import {PersonalFeedback} from './features/personal-feedback/personal-feedback';

export const AppRouting = () => <Switch>
    <Redirect exact from="/" to="/dashboard"/>
    <Route exact path="/dashboard" component={Dashboard}/>
    <Route exact path="/chapter" component={Chapter}/>
    <Route exact path="/mine" component={PersonalFeedback}/>
    <Route component={PageNotFound}/>
</Switch>;