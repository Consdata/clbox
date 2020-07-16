import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import {firebaseConfig} from './firebase.config';

export const firebaseApp = firebase.initializeApp(firebaseConfig);