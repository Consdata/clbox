import * as firebase from 'firebase/app';
import 'firebase/auth';

import {firebaseConfig} from './firebase.config';

export const firebaseApp = firebase.initializeApp(firebaseConfig);