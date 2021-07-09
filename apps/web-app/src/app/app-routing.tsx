import React from 'react';
import {Redirect, Route, Switch} from 'react-router';
import {CreateUser} from './features/authentication/components/create-user/create-user';
import {Login} from './features/authentication/components/login/login';
import {ResetPassword} from './features/authentication/components/restore-password/reset-password';
import {ChapterStats} from './features/chapter-stats/components/chatpter-stats/chapter-stats';
import {Inbox} from './features/inbox/components/inbox/inbox';
import {PageNotFound} from './features/page-not-found/page-not-found';
import {Sent} from './features/sent/components/sent/sent';
import {Stats} from './features/stats/components/stats/stats';
import {SurveyWizard} from './features/survey/components/survey-wizard';

export const AppRoutingAuthenticated = () => <Switch>
    <Redirect exact from="/" to="/inbox"/>
    <Route exact path="/inbox" component={Inbox}/>
    <Route exact path="/sent" component={Sent}/>
    <Route exact path="/stats" component={Stats}/>
    <Route exact path="/chapter-stats" component={ChapterStats}/>
    <Route exact path='/survey/:uuid' component={SurveyWizard}/>
    {/*<Route exact path="/dashboard" component={Dashboard}/>*/}
    {/*<Route exact path="/chapter" component={Chapter}/>*/}
    {/*<Route exact path="/mine" component={PersonalFeedback}/>*/}
    <Route component={PageNotFound}/>
</Switch>;

export const AppRoutingUnauthenticated = () => <Switch>
    <Route exact path='/login' component={Login}/>
    <Route exact path='/reset' component={ResetPassword}/>
    <Route exact path='/register' component={CreateUser}/>
    <Route exact path='/survey/:uuid' component={SurveyWizard}/>
    <Redirect to='/login'/>
</Switch>;
