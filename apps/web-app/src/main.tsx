import CssBaseline from '@material-ui/core/CssBaseline';
import {ConnectedRouter} from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {AppWrapper} from './app/app-wrapper';
import {firebaseApp} from './app/features/firebase/firebase.app';
import {FirebaseContext} from './app/features/firebase/firebase.context';
import {browserHistory} from './app/platform/browser-history';
import {store} from './app/store/store';

(async () => {
    const firestore = firebaseApp.firestore();
    const query = firestore.collection('invitation').where(
        `domain."${'consdata.com'}"`,
        "==",
        true
    );
    const result = await query.get();
    console.log(result);
    console.log(result.empty);
    console.log(result.docs);
    window.firestore = firestore;
})();

ReactDOM.render(
    <CssBaseline>
        <FirebaseContext.Provider value={firebaseApp}>
            <Provider store={store}>
                <ConnectedRouter history={browserHistory}>
                    <AppWrapper/>
                </ConnectedRouter>
            </Provider>
        </FirebaseContext.Provider>
    </CssBaseline>,
    document.getElementById('clbox')
);
