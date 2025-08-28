import { decode, encode } from 'base-64';
import './timerConfig';
global.addEventListener = (x) => x;
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
 
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export { firebase };
